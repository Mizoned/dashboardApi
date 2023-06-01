const { UserModel, RegistrationCodeModel, TokenModel } = require('../models/models');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const MailService = require('./MailService');
const TokenService = require('./TokenService');
const UserDto = require('../dtos/UserDto');
const RegCodeDto = require('../dtos/RegCodeDto');
const ApiError = require('../exceptions/ApiError');
const generateCode = require('../utils/generateCode');

class UserService {
    async updateProfileData({ email, displayName, location, notifyAboutProductUpdates, notifyAboutMarketNewsletter, notifyAboutComments, notifyAboutPurchases, imagePath }, userId) {
        const user = await UserModel.findByPk(userId);

        await user.update({ email, displayName, location, notifyAboutProductUpdates, notifyAboutMarketNewsletter, notifyAboutComments, notifyAboutPurchases, imagePath })
        const userDto = UserDto.fromModel(user);

        return { user: userDto }
    }

    async updateProfilePassword({ oldPassword, newPassword, confirmNewPassword }, userId) {
        if (newPassword !== confirmNewPassword) {
            throw ApiError.BadRequest([
                    {
                        value: confirmNewPassword,
                        msg: 'Пароли не совадают',
                        param: 'confirmNewPassword'
                    }
                ]
            );
        }

        const user = await UserModel.findByPk(userId);

        const isPassEquals = await bcrypt.compare(oldPassword, user.password);

        if (!isPassEquals) {
            throw ApiError.BadRequest([
                    {
                        value: oldPassword,
                        msg: 'Старый пароль введен неверно',
                        param: 'oldPassword'
                    }
                ]
            );
        }

        const isNewPassEquals = await bcrypt.compare(newPassword, user.password);

        if (isNewPassEquals) {
            throw ApiError.BadRequest([
                    {
                        value: newPassword,
                        msg: 'Новый пароль не должен совпадать со старым',
                        param: 'newPassword'
                    }
                ]
            );
        }

        const hashNewPassword = await bcrypt.hash(newPassword, 7);
        await user.update({ password: hashNewPassword });
        const userDto = UserDto.fromModel(user);

        return { user: userDto }
    }

    async updateProfilePicture(userId, imagePath) {
        const user = await UserModel.findByPk(userId);

        await user.update({ imagePath })
        const userDto = UserDto.fromModel(user);

        return { path: userDto.imagePath }
    }

    async getUserById(userId) {
        const user = await UserModel.findByPk(userId);

        return UserDto.fromModel(user);
    }
}

module.exports = new UserService();