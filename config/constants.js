const PRODUCT_STATUSES = {
	drafted: 1,
	released: 2,
	scheduled: 3
}
const FILE_UPLOADS = {
	avatar: {
		destinationPath: process.env.STATIC_FILES_DESTINATION_PATH + process.env.AVATAR_DESTINATION_PATH,
		allowedTypes: 'jpeg|jpg|png',
		errorMessage: 'Разрешены только изображения (jpeg, jpg, png)',
		param: 'avatar'
	},
	product: {
		files: {
			destinationPath: process.env.STATIC_FILES_DESTINATION_PATH + process.env.PRODUCT_FILES_DESTINATION_PATH,
			allowedTypes: 'jpeg|jpg|png|psd|fig|ai',
			errorMessage: 'Разрешены только файлы (jpeg, jpg, png, psd, fig, ai)',
			param: 'content'
		},
		images: {
			destinationPath: process.env.STATIC_FILES_DESTINATION_PATH + process.env.PRODUCT_IMAGES_DESTINATION_PATH,
			allowedTypes: 'jpeg|jpg|png',
			errorMessage: 'Разрешены только изображения (jpeg, jpg, png)',
			param: 'pictures'
		}
	}
}

module.exports = { PRODUCT_STATUSES, FILE_UPLOADS };