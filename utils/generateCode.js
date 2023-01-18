const generateCode = () => {
    return String(Math.random())?.split('.')[1]?.substring(0, 4) ?? generateCode();
}

module.exports = generateCode;