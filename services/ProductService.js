const { ProductModel, ProductStatusModel, ProductPictureModel, UserModel} = require('../models/models');
const { PRODUCT_STATUSES } = require("../config/constants");
const ApiError = require("../exceptions/ApiError");
const { Op } = require('sequelize');
const ProductDto = require("../dtos/ProductDto");
const UserDto = require("../dtos/UserDto");
const FileDto = require("../dtos/FileDto");

class ProductService {
    async getOne(productId) {
        const productData = await ProductModel.findOne({
                where: { id: productId },
                include: [
                    {
                        model: ProductPictureModel,
                        as: 'pictures',
                        attributes: ['path']
                    },
                    {
                        model: UserModel,
                        attributes: ['id', 'displayName', 'email', 'imagePath']
                    }
                ],
                attributes: ['id', 'name', 'description', 'price', 'createdAt', 'updatedAt']
            }
        );

        if (!productData) {
            throw ApiError.NotFound()
        }

        const products = ProductDto.fromModel(productData);
        products.user = UserDto.fromModel(productData.user);
        products.pictures = FileDto.createArrayModels(products.pictures);

        return products;
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
