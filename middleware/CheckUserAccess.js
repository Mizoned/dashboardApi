const ApiError = require('../exceptions/ApiError');

module.exports = function (request, response, next) {
	try {
		const userId = request.params.userId;
		const authUserId = request.user.id;

		if (userId !== authUserId) {
			ApiError.Forbidden();
		}

		next();
	} catch (e) {
		return next(ApiError.Forbidden());
	}
}