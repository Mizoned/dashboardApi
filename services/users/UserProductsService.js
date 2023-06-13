const { UserModel, RegistrationCodeModel, TokenModel, ProductModel, ProductStatusModel} = require('../../models/models');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const MailService = require('../MailService');
const TokenService = require('../TokenService');
const UserDto = require('../../dtos/UserDto');
const RegCodeDto = require('../../dtos/RegCodeDto');
const ApiError = require('../../exceptions/ApiError');
const generateCode = require('../../utils/generateCode');

class UserProductsService {
	async getOne(productId) {
		const productData = await ProductModel.findOne({
				where: { id: productId },
				include: [
					{
						model: ProductStatusModel,
						attributes: ['id', 'name']
					}
				],
				attributes: ['id', 'name', 'description', 'price', 'createdAt', 'updatedAt']
			}
		);

		if (!productData) {
			throw ApiError.NotFound()
		}

		return { productData };
	}

	async getAllByStatus(userId, statusId, limit, offset) {
		let products = await ProductModel.findAndCountAll({
			limit,
			offset,
			include: [
				{
					model: ProductStatusModel,
					where: { id: statusId },
					attributes: ['id', 'name']
				}
			],
			where: { userId },
			attributes: ['id', 'name', 'description', 'price', 'createdAt', 'updatedAt']
		});

		return { products };
	}

	async create(userId, name, description, price, productStatusId) {
		const product = await ProductModel.create({ userId, name, description, price, productStatusId });
		return { product };
	}

	async remove(userId, productId) {
		const productData = await ProductModel.findByPk(productId);

		if (!productData) {
			throw ApiError.NotFound()
		}

		if (userId !== productData.userId) {
			throw ApiError.Forbidden();
		}

		const deletedProductData = await ProductModel.destroy({ where: { id: productId }});

		return { deletedProductData };
	}
}

module.exports = new UserProductsService();