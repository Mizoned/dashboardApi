const AuthService = require('../services/AuthServece');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/ApiError');
const path = require('path');
const removeFile = require('../utils/removeFile');

class AuthController {

	async signIn(request, response, next) {
		try {
			const { email, password } = request.body;
			const userData = await AuthService.signIn(email, password);

			response.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, path: '/', sameSite: "lax" });
			return response.json(userData);
		} catch (e) {
			next(e);
		}
	}

	async signUp(request, response, next) {
		try {
			const errors = validationResult(request);

			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest(errors.array()));
			}

			const { email, password } = request.body;
			const  userData = await AuthService.signUp(email, password);
			response.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, path: '/', sameSite: "lax" });
			return response.json(userData);
		} catch (e) {
			next(e);
		}
	}

	async logout(request, response, next) {
		try {
			const { refreshToken } = request.cookies;
			const token = await AuthService.logout(refreshToken);

			response.clearCookie('refreshToken');
			return response.json(token);
		} catch (e) {
			next(e);
		}
	}

	async refresh(request, response, next) {
		try {
			const { refreshToken } = request.cookies;

			const userData = await AuthService.refresh(refreshToken);
			response.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, path: '/', sameSite: "lax" });
			return response.json(userData);
		} catch (e) {
			next(e);
		}
	}

	async activate(request, response, next) {
		try {
			const activationLink = request.params.link;
			await AuthService.activate(activationLink);
			return response.redirect(process.env.CLIENT_URL);
		} catch (e) {
			next(e);
		}
	}

	async sendRegistrationCode(request, response, next) {
		try {
			const errors = validationResult(request);

			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest(errors.array()));
			}

			const { email } = request.body;
			const codeData = await AuthService.sendRegistrationCode(email);

			return response.json(codeData);
		} catch (e) {
			next(e);
		}
	}

	async verifyRegistrationCode(request, response, next) {
		try {
			const errors = validationResult(request);

			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest(errors.array()));
			}

			const { email, code } = request.body;
			const codeData = await AuthService.verifyRegistrationCode(email, code);

			return response.json(codeData);
		} catch (e) {
			next(e);
		}
	}
}

module.exports = new AuthController();