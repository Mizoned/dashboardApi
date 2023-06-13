const PurchaseService = require('../services/PurchaseService');
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/ApiError");

class PurchaseController {
	async get(request, response, next) {
		try {
			const newProduct = await PurchaseService.get(request.user.id);
			return response.json(newProduct);
		} catch (e) {
			next(e);
		}
	}

	async add(request, response, next) {
		try {
			const { productId } = request.body;
			const newProduct = await PurchaseService.add(request.user.id, productId);

			return response.json(newProduct);
		} catch (e) {
			next(e);
		}
	}
}


module.exports = new PurchaseController();