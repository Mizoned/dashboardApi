module.exports = class ProductDto {
	static fromModel(model) {
		const dto = new ProductDto();
		dto.id = model.id;
		dto.name = model.name;
		dto.description = model.description;
		dto.price = model.price;
		dto.createdAt = model.createdAt;
		dto.updatedAt = model.updatedAt;
		dto.productStatusId = model.productStatusId;
		dto.pictures = model?.pictures ?? [];

		return dto;
	}

	static createArrayModels(models) {
		if (!Array.isArray(models) || !models.length) {
			return [];
		}
		return models.map((m) => this.fromModel(m));
	}
}