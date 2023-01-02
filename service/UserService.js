const { UserModel } = require('../models/models');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const MailService = require('./MailService');
const TokenService = require('./TokenService');
const UserDto = require('../dtos/UserDto');
const ApiError = require('../exceptions/ApiError');
class UserService {

    async signUp(email, password) {
        const candidate = await UserModel.findOne({
            where: { email }
        });

        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с таким email уже существует`);
        }

        const hashPassword = await bcrypt.hash(password, 7);
        const activationLink = uuid.v4();
        const user = await UserModel.create({ email, password: hashPassword, activationLink });
        const userDto = new UserDto(user);
        const tokens = TokenService.generateTokens({ ...userDto });
        await TokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

        await MailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`);

        return { ...tokens, user: userDto }
    }

    async activate(activationLink) {
        const  user = await UserModel.findOne({ where: { activationLink } });

        if (!user) {
            throw ApiError.BadRequest('Некорректная ссылка активации')
        }

        user.update({ isActivated: true });
    }

    async signIn(email, password) {
        const user = await UserModel.findOne({ where: { email } });

        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не зарегистрирован');
        }

        const isPassEquals = await bcrypt.compare(password, user.password);

        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }

        const userDto = new UserDto(user);

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
        const userDto = new UserDto(user);

        const tokens = TokenService.generateTokens({ ...userDto });
        await TokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }
}

module.exports = new UserService();