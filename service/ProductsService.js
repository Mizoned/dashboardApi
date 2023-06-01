const { UserModel, ProductModel, ProductStatusModel } = require('../models/models');
const ApiError = require("../exceptions/ApiError");

class ProductsService {
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

    async getAll(limit, offset) {
        let products = await ProductModel.findAndCountAll({
            limit,
            offset,
            include: [
                {
                    model: ProductStatusModel,
                    attributes: ['id', 'name']
                }
            ],
            attributes: ['id', 'name', 'description', 'price', 'createdAt', 'updatedAt']
        });

        return { products };
    }
}

module.exports = new ProductsService();
