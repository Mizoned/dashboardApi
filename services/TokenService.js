const jwt = require('jsonwebtoken');
const { TokenModel } = require('../models/models');
class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET_KEY,
            { expiresIn: '24h' }
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET_KEY,
            { expiresIn: '30d' }
        );

        return { accessToken, refreshToken };
    }

    async saveRefreshToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({ where: { userId } });

        if (tokenData) {
            tokenData.update({ refreshToken });
        }

        const token = await TokenModel.create({ userId, refreshToken });

        return token;
    }

    async removeRefreshToken(refreshToken) {
        const tokenData = await TokenModel.destroy({ where: { refreshToken } });
        return tokenData;
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async findRefreshToken(refreshToken) {
        const tokenData = await TokenModel.findOne({ where: { refreshToken } });
        return tokenData;
    }
}

module.exports = new TokenService();