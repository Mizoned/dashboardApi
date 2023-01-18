const sequelize = require('../config/DBConfig');
const { DataTypes } = require('sequelize');

const UserModel = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    surname: { type: DataTypes.STRING },
    patronymic: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: 'USER' },
    isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
    activationLink: { type: DataTypes.STRING, allowNull: false }
});

const RatingModel = sequelize.define('rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rate: { type: DataTypes.INTEGER, allowNull: false }
});

const TokenModel = sequelize.define('token', {
    refreshToken: { type: DataTypes.STRING, allowNull: false }
});

const RegistrationCodeModel = sequelize.define('registrationCode', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    otp: { type: DataTypes.STRING, allowNull: false },
    expiresIn: { type: DataTypes.DATE, allowNull: false },
    isConfirmed: { type: DataTypes.BOOLEAN, defaultValue: false }
});

UserModel.hasOne(TokenModel);
TokenModel.belongsTo(UserModel);

UserModel.hasMany(RatingModel);
RatingModel.belongsTo(UserModel);

module.exports = {
    UserModel,
    RatingModel,
    TokenModel,
    RegistrationCodeModel
}