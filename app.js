require('dotenv').config();
const express = require('express');
const sequelize = require('./config/DBConfig');
const cors = require('cors');
const router = require('./routes/index');
const ErrorMiddleware = require('./middleware/ErrorMiddleware');
const MulterMiddleware = require('./middleware/MulterMiddleware');
const path = require('path');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(express.json());
app.use(process.env.AVATAR_DESTINATION_PATH, express.static(path.resolve(__dirname, 'static', 'profile')));
app.use(process.env.PRODUCT_IMAGES_DESTINATION_PATH, express.static(path.resolve(__dirname, 'static', 'products', 'pictures')));
app.use(cookieParser());
app.use('/api', router);

// Обязательно в конце последний Middleware
app.use(MulterMiddleware);
app.use(ErrorMiddleware);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    } catch (e) {
        console.error(e)
    }
}

start();
