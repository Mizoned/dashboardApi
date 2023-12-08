const { UserModel } = require('../models/models');
const bcrypt = require('bcrypt');
const UserDto = require('../dtos/UserDto');
const ApiError = require('../exceptions/ApiError');

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
                        msg: 'Password mismatch',
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
                        msg: 'The old password was entered incorrectly',
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
                        msg: 'The new password must not match the old one.',
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