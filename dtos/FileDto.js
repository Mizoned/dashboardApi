module.exports = class FileDto {
	static fromModel(model) {
		const dto = new FileDto();
		dto.path = process.env.API_URL + model.path;

		return dto;
	}

	static createArrayModels(models) {
		if (!Array.isArray(models) || !models.length) {
			return [];
		}
		return models.map((m) => this.fromModel(m));
	}
}