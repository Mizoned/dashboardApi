const { ProductFileModel } = require('../../models/models');

class ProductFilesService {
	async bulkCreate(files) {
		return await ProductFileModel.bulkCreate(files);
	}
}

module.exports = new ProductFilesService();