const UserProductsService = require('../../services/users/UserProductsService');
const { validationResult } = require("express-validator");
const { PRODUCT_STATUSES } = require("../../config/constants");
const ApiError = require("../../exceptions/ApiError");

class UserProductsController {
	async createDraft(request, response, next) {
		try {
			const errors = validationResult(request);

			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest(errors.array()));
			}

			const { name, description, price } = request.body;
			const newProduct = await UserProductsService.create(request.user.id, name, description, price, PRODUCT_STATUSES.drafted);

			return response.json(newProduct);
		} catch (e) {
			next(e);
		}
	}

	async createReleased(request, response, next) {
		try {
			const errors = validationResult(request);

			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest(errors.array()));
			}

			const { name, description, price } = request.body;
			const newProduct = await UserProductsService.create(request.user.id, name, description, price, PRODUCT_STATUSES.released);

			return response.json(newProduct);
		} catch (e) {
			next(e);
		}
	}

	async createScheduled(request, response, next) {
		try {
			const errors = validationResult(request);

			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest(errors.array()));
			}

			const { name, description, price, date } = request.body;
			const newProduct = await UserProductsService.create(request.user.id, name, description, price, PRODUCT_STATUSES.scheduled);

			//TODO нужно создать таблицу с запланированными работами и туда помещать id и дату,
			// чтобы потом с помощью нее запускать скрипт

			return response.json(newProduct);
		} catch (e) {
			next(e);
		}
	}

	async remove(request, response, next) {
		try {
			const removedProduct = await UserProductsService.remove(request.user.id, request.params.productId);

			return response.json(removedProduct);
		} catch (e) {
			console.log(e)
			next(e);
		}
	}

	async getOne(request, response, next) {
		try {
			const errors = validationResult(request);

			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest(errors.array()));
			}

			const productId = request.params.productId;
			const productData = await UserProductsService.getOne(productId);

			return response.json(productData);
		} catch (e) {
			next(e);
		}
	}

	getAllDraftProducts = async (request, response, next) => {
		try {
			const errors = validationResult(request);

			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest(errors.array()));
			}

			let { limit, page } = request.query;

			const productsData = await this.getAllProductsByStatus(request.params.userId, PRODUCT_STATUSES.drafted, limit, page);
			return response.json(productsData);
		} catch (e) {
			next(e);
		}
	}

	getAllScheduledProducts = async (request, response, next) => {
		try {
			const errors = validationResult(request);

			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest(errors.array()));
			}

			let { limit, page } = request.query;

			const productsData = await this.getAllProductsByStatus(request.params.userId, PRODUCT_STATUSES.scheduled, limit, page);
			return response.json(productsData);
		} catch (e) {
			next(e);
		}
	}

	getAllReleasedProducts = async (request, response, next) => {
		try {
			const errors = validationResult(request);

			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest(errors.array()));
			}

			let { limit, page } = request.query;

			const productsData = await this.getAllProductsByStatus(request.params.userId, PRODUCT_STATUSES.released, limit, page);
			return response.json(productsData);
		} catch (e) {
			next(e);
		}
	}

	async getAllProductsByStatus(userId, statusId, limit, page) {
		page = page || 1;
		limit = limit || 10;

		let offset = page * limit - limit;

		return await UserProductsService.getAllByStatus(userId, statusId, limit, offset);
	}
}

module.exports = new UserProductsController();