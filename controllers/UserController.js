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
					return next(ApiError.BadRequest([
                        {
                            msg: 'Error deleting old profile picture!',
                            params: 'picture'
                        }
                    ]));
                }
            }

            return response.json(updatedProfilePicturePath);
        } catch (e) {
            next(e);
        }
    }

    async deleteAvatar(request, response, next) {
        try {
			let updateProfilePicturePath = {
				path: ''
			};

			let defaultPath = `${process.env.AVATAR_DESTINATION_PATH}/no-image.png`
            const userData = await UserService.getUserById(request.user.id);
            const oldImagePath = path.join(__dirname, '..', '/static/', userData.originalImagePath);

			if (defaultPath !== userData.originalImagePath) {
				let isFileRemoved = removeFile(oldImagePath);
				if (!isFileRemoved) {
					return next(ApiError.BadRequest([
						{
							msg: 'Error deleting profile picture',
							params: 'picture'
						}
					]));
				} else {
					if (defaultPath !== userData.originalImagePath) {
						updateProfilePicturePath = await UserService.updateProfilePicture(request.user.id, defaultPath);
					}
				}
			}

			if (!updateProfilePicturePath.path) {
				return next(ApiError.BadRequest([
					{
						msg: 'Error deleting profile picture',
						params: 'picture'
					}
				]));
			}

            return response.json(updateProfilePicturePath);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();