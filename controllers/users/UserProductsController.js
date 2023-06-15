const UserProductsService = require('../../services/users/UserProductsService');
const ProductPicturesService = require('../../services/product/ProductPicturesService');
const ProductFilesService = require('../../services/product/ProductFilesService');
const { validationResult } = require("express-validator");
const { PRODUCT_STATUSES } = require("../../config/constants");
const FileDto = require('../../dtos/FileDto');
const ApiError = require("../../exceptions/ApiError");

class UserProductsController {
	createDraft = async (request, response, next) => {
		try {
			const product = await this.createProduct(request, next, PRODUCT_STATUSES.drafted);
			return response.json(product);
		} catch (e) {
			next(e);
		}
	}

	createReleased = async (request, response, next) => {
		try {
			const product = await this.createProduct(request, next, PRODUCT_STATUSES.released);
			return response.json(product);
		} catch (e) {
			next(e);
		}
	}

	createScheduled = async (request, response, next) => {
		try {
			const product = await this.createProduct(request, next, PRODUCT_STATUSES.scheduled);
			return response.json(product);
			//TODO нужно создать таблицу с запланированными работами и туда помещать id и дату,
			// чтобы потом с помощью нее запускать скрипт
		} catch (e) {
			next(e);
		}
	}

	async createProduct(request, next, status) {
		const errors = validationResult(request);

		if (!errors.isEmpty()) {
			return next(ApiError.BadRequest(errors.array()));
		}

		const { name, description, price } = request.body;
		const product = await UserProductsService.create(request.user.id, name, description, price, status);

		const preparedPicturesData = this.prepareFileData(request.files.pictures, process.env.PRODUCT_IMAGES_DESTINATION_PATH, product.id);
		const preparedFilesData = this.prepareFileData(request.files.content, process.env.PRODUCT_FILES_DESTINATION_PATH, product.id);

		product.pictures = FileDto.createArrayModels(await ProductPicturesService.bulkCreate(preparedPicturesData));

		//TODO тут проблема когда нет файлов скорее всего в миделварке нужно делать оибку на заполнение
		await ProductFilesService.bulkCreate(preparedFilesData);

		return product;
	}

	prepareFileData(files, destinationPath, productId) {
		return files?.map((file) => ({
			path: `${destinationPath}/${file.filename}`,
			productId: productId
		}));
	}

	async remove(request, response, next) {
		try {
			const removedProduct = await UserProductsService.remove(request.user.id, request.params.productId);

			//TODO дописать удаление загруженных файлов продукта
			return response.json(removedProduct);
		} catch (e) {
			next(e);
		}
	}

	async getOne(request, response, next) {
		try {
			const errors = validationResult(request);

			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest(errors.array()));
			}

			const productId = request.params.productId;
			const productData = await UserProductsService.getOne(productId);

			return response.json(productData);
		} catch (e) {
			next(e);
		}
	}

	getAllDraftProducts = async (request, response, next) => {
		try {
			const errors = validationResult(request);

			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest(errors.array()));
			}

			const productsData = await this.getAllProductsByStatus(request, next, request.params.userId, PRODUCT_STATUSES.drafted);
			return response.json(productsData);
		} catch (e) {
			console.log(e)
			next(e);
		}
	}

	getAllScheduledProducts = async (request, response, next) => {
		try {
			const errors = validationResult(request);

			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest(errors.array()));
			}

			const productsData = await this.getAllProductsByStatus(request, next, request.params.userId, PRODUCT_STATUSES.scheduled);
			return response.json(productsData);
		} catch (e) {
			next(e);
		}
	}

	getAllReleasedProducts = async (request, response, next) => {
		try {
			const errors = validationResult(request);

			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest(errors.array()));
			}

			const productsData = await this.getAllProductsByStatus(request, next, request.params.userId, PRODUCT_STATUSES.released);
			return response.json(productsData);
		} catch (e) {
			next(e);
		}
	}

	async getAllProductsByStatus(request, next, userId, statusId) {
		let { limit, page } = request.query;
		page = page || 1;
		limit = limit || 10;

		let offset = page * limit - limit;

		return await UserProductsService.getAllByStatus(userId, statusId, limit, offset);
	}
}

module.exports = new UserProductsController();