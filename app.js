require('dotenv').config();
const express = require('express');
const sequelize = require('./config/DBConfig');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorMiddleware = require('./middleware/ErrorMiddleware');
const path = require('path');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use(cookieParser());
app.use('/api', router);

// Обязательно в конце поседний Middleware
app.use(errorMiddleware);

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
