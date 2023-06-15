const multer = require('multer');
const path = require('path');
const ApiError = require('../exceptions/ApiError');
const uuid = require("uuid");

module.exports = function fileUploadMiddleware(options) {
    let rule = {};

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '..', rule.destinationPath));
        },
        filename: function (req, file, cb) {
            const uniqueId = uuid.v4();
            const imageExtension = path.extname(file.originalname);
            const newFileName = `${uniqueId}${imageExtension}`;
            cb(null, newFileName);
        }
    });

    const fileFilter = function (req, file, cb) {
        if (Array.isArray(options)) {
            rule = options.find(o => o.param === file.fieldname);
        } else if (typeof options === 'object') {
            rule = options;
        }

        const regExp = new RegExp(rule.allowedTypes);
        const extname = regExp.test(path.extname(file.originalname).toLowerCase());
        const mimetype = regExp.test(path.extname(file.originalname));

        if (extname && mimetype) {
            return cb(null, true);
        }

        const error = ApiError.BadRequest([
            {
                msg: rule.errorMessage,
                param: rule.param
            }
        ]);
        return cb(error, false);
    };

    return multer({ storage, fileFilter });
}