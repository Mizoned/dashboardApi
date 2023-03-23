const fs = require('fs');
/**
 * Удаляет файл по указаному пути
 * @param pathToFile - полный путь до файла
 * @returns {boolean} - true при успешном удалении файла, иначе false
 */
const removeFile = (pathToFile) => {
    let result = true;

    fs.unlink(pathToFile, (error) => {
        if (error) {
            result = false;
        }
    });

    return result;
}


module.exports = removeFile;