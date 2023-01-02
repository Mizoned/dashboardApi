const UserService = require('../service/UserService');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/ApiError');

class UserController {

    async signIn(request, response, next) {
        try {
            const { email, password } = request.body;
            const userData = await UserService.signIn(email, password);

            response.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, path: 'api/user/refresh' });
            return response.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async signUp(request, response, next) {
        try {
            const errors = validationResult(request);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }

            const { email, password } = request.body;
            const  userData = await UserService.signUp(email, password);
            response.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, path: 'api/user/refresh' });
            return response.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(request, response, next) {
        try {
            const { refreshToken } = request.cookies;
            const  token = await UserService.logout(refreshToken);

            response.clearCookie('refreshToken');
            return response.json(token);
        } catch (e) {
            next(e);
        }
    }

    async refresh(request, response, next) {
        try {
            const { refreshToken } = request.cookies;

            const  userData = await UserService.refresh(refreshToken);
            response.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, path: 'api/user/refresh' });
            return response.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async activate(request, response, next) {
        try {
            const activationLink = request.params.link;
            await UserService.activate(activationLink);
            return response.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();