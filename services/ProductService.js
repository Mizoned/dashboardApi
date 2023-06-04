const { UserModel, ProductModel, ProductStatusModel } = require('../models/models');
const ApiError = require("../exceptions/ApiError");

class ProductService {
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

    async getAll(limit, offset) { //TODO Нужно получать все продукты в статусе Released
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

module.exports = new ProductService();
