const ApiError = require("../exceptions/ApiError");
const multer = require("multer");

module.exports = function (error, request, response, next) {
	if (error instanceof multer.MulterError) {
		if (error.code === 'LIMIT_UNEXPECTED_FILE') {
			const apiError = ApiError.BadRequest([
				{
					msg: 'Превышено количество загружаемых файлов',
					param: error.field
				}
			]);
			return next(apiError);
		}
	}
	return next(error);
};