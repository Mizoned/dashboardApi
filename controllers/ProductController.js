const ProductService = require('../services/ProductService');
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/ApiError");

class ProductController {
    async getOne(request, response, next) {
        try {
            const errors = validationResult(request);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest(errors.array()));
            }

            const productId = request.params.id;
            const productData = await ProductService.getOne(productId);

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

            let { limit, page, search } = request.query;

            page = page || 1;
            limit = limit || 10;

            let offset = page * limit - limit;

            const productData = await ProductService.getAll(limit, offset, search);

            return response.json(productData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ProductController();