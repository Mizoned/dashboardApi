const ProductsService = require('../service/ProductsService');
const {validationResult} = require("express-validator");
const ApiError = require("../exceptions/ApiError");

class ProductsController {
    async createDraft(request, response, next) {
        try {
            const errors = validationResult(request);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest(errors.array()));
            }

            const { name, description, price } = request.body;
            const statusDraftedId = 1;
            const newProduct = await ProductsService.create(request.user.id, name, description, price, statusDraftedId);

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
            const statusReleasedId = 2;
            const newProduct = await ProductsService.create(request.user.id, name, description, price, statusReleasedId);

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
            const statusScheduledId = 3;
            const newProduct = await ProductsService.create(request.user.id, name, description, price, statusScheduledId);

            //TODO нужно создать таблицу с запланированными работами и туда помещать id и дату,
            // чтобы потом с помощью нее запускать скрипт

            return response.json(newProduct);
        } catch (e) {
            next(e);
        }
    }

    async remove(request, response, next) {
        try {
            const errors = validationResult(request);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest(errors.array()));
            }

            const productId = request.params.id;
            const removedProduct = await ProductsService.remove(request.user.id, productId);

            return response.json(removedProduct);
        } catch (e) {
            next(e);
        }
    }

    async getOne(request, response, next) {
        try {
            const errors = validationResult(request);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest(errors.array()));
            }

            const productId = request.params.id;
            const productData = await ProductsService.getOne(productId);

            return response.json(productData);
        } catch (e) {
            next(e);
        }
    }

    async getAll(request, response, next) {
        try {
            const errors = validationResult(request);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest(errors.array()));
            }

            let { limit, page } = request.query;

            page = page || 1;
            limit = limit || 10;

            let offset = page * limit - limit;

            const productData = await ProductsService.getAll(limit, offset);

            return response.json(productData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ProductsController();