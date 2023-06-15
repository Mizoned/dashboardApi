const { ProductModel, ProductStatusModel, ProductPictureModel } = require('../models/models');
const { PRODUCT_STATUSES } = require("../config/constants");
const ApiError = require("../exceptions/ApiError");
const { Op } = require('sequelize');
const ProductDto = require("../dtos/ProductDto");
const FileDto = require("../dtos/FileDto");

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

        let productsData = await ProductModel.findAndCountAll({
            limit,
            offset,
            include: [
                {
                    model: ProductStatusModel,
                    attributes: ['id', 'name'],
                    where: { id: PRODUCT_STATUSES.released }
                },
                {
                    model: ProductPictureModel,
                    as: 'pictures',
                    attributes: ['path'],
                    separate: true
                }
            ],
            attributes: ['id', 'name', 'description', 'price', 'createdAt', 'updatedAt'],
            where
        });

        const products = ProductDto.createArrayModels(productsData.rows);
        products?.forEach((p) => p.pictures = FileDto.createArrayModels(p.pictures));

        return { count: productsData.count, products };
    }
}

module.exports = new ProductService();
