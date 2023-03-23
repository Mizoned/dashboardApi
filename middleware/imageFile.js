const multer = require('multer');
const path = require('path');
const ApiError = require('../exceptions/ApiError');
const uuid = require("uuid");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../static/profile'));
    },
    filename: function (req, file, cb) {
        const uniqueId = uuid.v4();
        const imageExtension = path.extname(file.originalname);
        const newFileName = `${uniqueId}${imageExtension}`;
        cb(null, newFileName);
    }
});

const imageFilter = function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }

    const error = ApiError.BadRequest('Ошибка загрузки файла', [
        {
            msg: 'Разрешены только изображения (jpeg, jpg, png, gif)',
            param: 'picture'
        }
    ]);
    return cb(error, false);
};

const upload = multer({ storage, fileFilter: imageFilter });

module.exports = upload;