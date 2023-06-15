const { UserModel, ProductModel, ProductStatusModel, PurchaseModel } = require('../models/models');
const ApiError = require("../exceptions/ApiError");

class PurchaseService {
	async get(userId) {
		try {
			const sales = await PurchaseModel.findAll({

				include: [
					ProductModel,
					{
						model: UserModel,
						where: { id: userId }
					}
				],
			});

			return { sales };
		} catch (e) {
			throw e;
		}

	}

	async add(buyerId, productId) {
		try {
			const sales = await PurchaseModel.create({ productId, buyerId });

			return { sales };
		} catch (e) {
			throw e;
		}
	}
}

module.exports = new PurchaseService();