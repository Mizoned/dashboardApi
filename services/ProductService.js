const { UserModel, ProductModel, ProductStatusModel } = require('../models/models');
const ApiError = require("../exceptions/ApiError");
const { Op } = require('sequelize');

class ProductService {
    async getOne(productId) {
        const releasedProductStatusId = 3; //TODO Везде где есть такие переменные вынести в файл констант

        const productData = await ProductModel.findOne({
                where: { id: productId },
                include: [
                    {
                        model: ProductStatusModel,
                        attributes: ['id', 'name'],
                        where: { id: releasedProductStatusId }
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

    async getAll(limit, offset, search) {
        const releasedProductStatusId = 2;

        let where = {
            name: {
                [Op.iLike]: `%${search}%`
            }
        }

        if (!search) {
            where = {};
        }

        let products = await ProductModel.findAndCountAll({
            limit,
            offset,
            include: [
                {
                    model: ProductStatusModel,
                    attributes: ['id', 'name'],
                    where: { id: releasedProductStatusId }
                }
            ],
            attributes: ['id', 'name', 'description', 'price', 'createdAt', 'updatedAt'],
            where
        });

        return { products };
    }
}

module.exports = new ProductService();
