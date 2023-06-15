const UserService = require('../services/UserService');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/ApiError');
const path = require('path');
const removeFile = require('../utils/removeFile');

class UserController {
    async updateUser(request, response, next) {
        try {
            const errors = validationResult(request);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest(errors.array()));
            }

            const { email, displayName, location, notifyAboutProductUpdates, notifyAboutMarketNewsletter, notifyAboutComments, notifyAboutPurchases } = request.body;
            const updatedProfileData = await UserService.updateProfileData(
                {
                    email,
                    displayName,
                    location,
                    notifyAboutProductUpdates,
                    notifyAboutMarketNewsletter,
                    notifyAboutComments,
                    notifyAboutPurchases
                },
                request.user.id
            );

            return response.json(updatedProfileData);
        } catch (e) {
            next(e);
        }
    }

    async updatePassword(request, response, next) {
        try {
            const errors = validationResult(request);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest(errors.array()));
            }

            const { oldPassword, newPassword, confirmNewPassword } = request.body;

            const updatedProfileData = await UserService.updateProfilePassword({ oldPassword, newPassword, confirmNewPassword }, request.user.id);

            return response.json(updatedProfileData);
        } catch (e) {
            next(e);
        }
    }

    async updateAvatar(request, response, next) {
        try {
            const imagePath = `${process.env.AVATAR_DESTINATION_PATH}/${request.file.filename}`;
            const userData = await UserService.getUserById(request.user.id);
            const oldImagePath = path.join(__dirname, '..', '/static/', userData.originalImagePath);

            const updatedProfilePicturePath = await UserService.updateProfilePicture(request.user.id, imagePath);

            let isDefaultImage = userData.originalImagePath.includes('no-image');

            if (!isDefaultImage) {
                let isFileRemoved = removeFile(oldImagePath);

                if (!isFileRemoved) {
                    ApiError.BadRequest([
                        {
                            msg: 'Ошибка удаления старой картинки профиля!',
                            params: 'picture'
                        }
                    ]);
                }
            }

            return response.json(updatedProfilePicturePath);
        } catch (e) {
            next(e);
        }
    }

    async deleteAvatar(request, response, next) {
        try {
            const userData = await UserService.getUserById(request.user.id);
            const oldImagePath = path.join(__dirname, '..', '/static/', userData.originalImagePath);

            let isFileRemoved = removeFile(oldImagePath);
            if (!isFileRemoved) {
                ApiError.BadRequest([
                    {
                        msg: 'Ошибка удаления картинки профиля!',
                        params: 'picture'
                    }
                ]);
            }

            const updateProfilePicturePath = await UserService.updateProfilePicture(request.user.id, '/profile/no-image.png');

            return response.json(updateProfilePicturePath);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();