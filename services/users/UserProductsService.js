const { ProductModel, ProductStatusModel, ProductPictureModel } = require('../../models/models');
const ProductDto = require('../../dtos/ProductDto');
const FileDto = require('../../dtos/FileDto');
const ApiError = require('../../exceptions/ApiError');

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
		let productsData = await ProductModel.findAndCountAll({
			limit,
			offset,
			include: [
				{
					model: ProductStatusModel,
					where: { id: statusId },
					attributes: []
				},
				{
					model: ProductPictureModel,
					as: 'pictures',
					attributes: ['path'],
					separate: true
				}
			],
			where: { userId },
			attributes: ['id', 'name', 'description', 'price', 'createdAt', 'updatedAt']
		});

		const products = ProductDto.createArrayModels(productsData.rows);
		products?.forEach((p) => p.pictures = FileDto.createArrayModels(p.pictures));

		return { count: productsData.count, products };
	}

	async create(userId, name, description, price, productStatusId) {
		const product = await ProductModel.create({ userId, name, description, price, productStatusId });

		return ProductDto.fromModel(product);
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