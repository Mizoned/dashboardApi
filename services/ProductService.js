const { ProductModel, ProductStatusModel } = require('../models/models');
const { PRODUCT_STATUSES } = require("../config/constants");
const ApiError = require("../exceptions/ApiError");
const { Op } = require('sequelize');

class ProductService {
    async getOne(productId) {
        const productData = await ProductModel.findOne({
                where: { id: productId },
                include: [
                    {
                        model: ProductStatusModel,
                        attributes: ['id', 'name'],
                        where: { id: PRODUCT_STATUSES.released }
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
                    where: { id: PRODUCT_STATUSES.released }
                }
            ],
            attributes: ['id', 'name', 'description', 'price', 'createdAt', 'updatedAt'],
            where
        });

        return { products };
    }
}

module.exports = new ProductService();
