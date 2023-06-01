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
    notifyAboutPurchases: { type: DataTypes.BOOLEAN, defaultValue: false },
    imagePath: { type: DataTypes.TEXT, defaultValue: '/profile/no-image.png' }
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

const ProductModel = sequelize.define('product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
});

const ProductStatusModel = sequelize.define('productStatus', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING }
});

const PurchaseModel = sequelize.define('purchase', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProductModel,
            key: 'id',
        }
    },
    buyerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UserModel,
            key: 'id',
        }
    }
});

UserModel.hasOne(TokenModel);
TokenModel.belongsTo(UserModel);

UserModel.hasMany(RatingModel);
RatingModel.belongsTo(UserModel);

UserModel.hasMany(ProductModel);
ProductModel.belongsTo(UserModel);

ProductStatusModel.hasMany(ProductModel);
ProductModel.belongsTo(ProductStatusModel);

UserModel.hasMany(PurchaseModel, { foreignKey: 'buyerId' });
PurchaseModel.belongsTo(UserModel, { foreignKey: 'buyerId' });

ProductModel.hasMany(PurchaseModel, { foreignKey: 'productId' });
PurchaseModel.belongsTo(ProductModel, { foreignKey: 'productId' });

module.exports = {
    UserModel,
    RatingModel,
    TokenModel,
    RegistrationCodeModel,
    ProductModel,
    ProductStatusModel,
    PurchaseModel
}