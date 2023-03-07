const sequelize = require('../config/DBConfig');
const { DataTypes } = require('sequelize');

const UserModel = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: 'USER' },
    isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
    activationLink: { type: DataTypes.STRING, allowNull: false },
    displayName: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    notifyAboutProductUpdates: { type: DataTypes.BOOLEAN, defaultValue: false },
    notifyAboutMarketNewsletter: { type: DataTypes.BOOLEAN, defaultValue: false },
    notifyAboutComments: { type: DataTypes.BOOLEAN, defaultValue: false },
    notifyAboutPurchases: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const RatingModel = sequelize.define('rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rate: { type: DataTypes.INTEGER, allowNull: false }
});

const TokenModel = sequelize.define('token', {
    refreshToken: { type: DataTypes.TEXT, allowNull: false }
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