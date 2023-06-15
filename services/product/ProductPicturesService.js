const { ProductPictureModel } = require('../../models/models');

class ProductPicturesService {
	async bulkCreate(pictures) {
		return await ProductPictureModel.bulkCreate(pictures);
	}
}

module.exports = new ProductPicturesService();