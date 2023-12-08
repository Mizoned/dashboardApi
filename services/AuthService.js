const { UserModel, RegistrationCodeModel } = require('../models/models');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const MailService = require('./MailService');
const TokenService = require('./TokenService');
const UserDto = require('../dtos/UserDto');
const RegCodeDto = require('../dtos/RegCodeDto');
const ApiError = require('../exceptions/ApiError');
const generateCode = require('../utils/generateCode');

class AuthService {

	async signUp(email, password) {
		const candidate = await UserModel.findOne({
			where: { email }
		});

		if (candidate) {
			throw ApiError.BadRequest([
					{
						value: email,
						msg: 'User with this email already exists',
						param: 'email'
					}
				]
			);
		}

		const codeData = await RegistrationCodeModel.findOne({
			where: { email }
		});

		if (!codeData || !codeData.isConfirmed) {
			throw ApiError.BadRequest([
					{
						value: email,
						msg: 'Account not verified!',
						param: 'email'
					}
				]
			);
		}

		const hashPassword = await bcrypt.hash(password, 7);
		const activationLink = uuid.v4();
		const user = await UserModel.create({ email, password: hashPassword, activationLink, isActivated: true });
		await RegistrationCodeModel.destroy({ where: { email } });
		const userDto = UserDto.fromModel(user);
		const tokens = TokenService.generateTokens({ ...userDto });
		await TokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

		// await MailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`);

		return { ...tokens, user: userDto }
	}

	async activate(activationLink) {
		const  user = await UserModel.findOne({ where: { activationLink } });

		if (!user) {
			throw ApiError.BadRequest([
				{
					value: activationLink,
					mas: 'Некорректная ссылка активации',
					param: 'activation-link'
				}
			]);
		}

		user.update({ isActivated: true });
	}

	async signIn(email, password) {
		const user = await UserModel.findOne({ where: { email } });

		if (!user) {
			throw ApiError.BadRequest([
					{
						value: email,
						msg: 'User with this email is not registered',
						param: 'email'
					}
				]
			);
		}

		const isPassEquals = await bcrypt.compare(password, user.password);

		if (!isPassEquals) {
			throw ApiError.BadRequest([
					{
						value: password,
						msg: 'Password entered incorrectly',
						param: 'password'
					}
				]
			);
		}

		const userDto = UserDto.fromModel(user);

		const tokens = TokenService.generateTokens({ ...userDto });
		await TokenService.saveRefreshToken(userDto.id, tokens.refreshToken);
		return { ...tokens, user: userDto }
	}

	async logout(refreshToken) {
		const token = await TokenService.removeRefreshToken(refreshToken);
		return token;
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError();
		}

		const tokenFromDB = await TokenService.findRefreshToken(refreshToken);
		if (!tokenFromDB) {
			throw ApiError.UnauthorizedError();
		}

		await TokenService.removeRefreshToken(refreshToken);

		const userData = TokenService.validateRefreshToken(refreshToken);
		if (!userData) {
			throw ApiError.UnauthorizedError();
		}

		const user = await UserModel.findOne({ where: { id: userData.id } });
		const userDto = UserDto.fromModel(user);

		const tokens = TokenService.generateTokens({ ...userDto });
		await TokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

		return { ...tokens, user: userDto }
	}

	async sendRegistrationCode(email) {
		const candidate = await UserModel.findOne({
			where: { email }
		});

		if (candidate) {
			throw ApiError.BadRequest([
					{
						value: email,
						msg: 'User with this email already exists',
						param: 'email'
					}
				]
			);
		}

		const candidateCode = await RegistrationCodeModel.findOne({
			where: { email }
		});

		const currentDate = new Date();

		if (candidateCode && candidateCode.expiresIn > currentDate) {
			const secondsRemaining = Math.floor((candidateCode.expiresIn - currentDate) / 1000);

			throw ApiError.BadRequest([
				{
					value: email,
					msg: `Resend code in: ${secondsRemaining} second(s)`,
					param: 'email',
					secondsLeft: secondsRemaining
				}
			]);
		}

		const code = generateCode();

		const date = new Date();
		date.setMinutes(date.getMinutes() + 1);

		const codeData = await RegistrationCodeModel.upsert({ email, otp: code, expiresIn: date, isConfirmed: false });

		const codeDto = RegCodeDto.fromArray(codeData);

		//TODO тут потенциальная ошибка, если email не будет найден
		await MailService.sendRegistrationCode(email, code);
		return { codeDto }
	}

	async verifyRegistrationCode(email, code) {
		const codeData = await RegistrationCodeModel.findOne({
			where: { email, otp: code }
		});

		if (!codeData) {
			throw ApiError.BadRequest([
					{
						value: code,
						msg: 'Code entered incorrectly!',
						param: 'code',
						isExpired: false
					}
				]
			);
		}

		if (codeData.expiresIn < new Date()) {
			throw ApiError.BadRequest([
					{
						value: code,
						msg: 'The code has expired. Please re-request the code!',
						param: 'code',
						isExpired: true
					}
				]
			);
		}

		codeData.update({ isConfirmed: true });

		const codeDto = RegCodeDto.fromModel(codeData);
		return { codeDto }
	}
}

module.exports = new AuthService();