const jwt = require('jsonwebtoken');
const dbConfig = require("../config/db.config.js");


const verifyToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader?.includes('Bearer') ? authHeader.split(' ')[1] : authHeader;

    if (token) {
        jwt.verify(token, dbConfig.secretKey, async (err, decoded) => {
            if (err) {
                return res.status(404).send({ message: "TokenExpiredError " });
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        return res.status(404).send({ message: "Not token" });
    }
};

const accessUser = async (req, res, next) => {
    const user = req.user;
    if (user.role === 'admin') {
        next();

    } else {
        return res.status(404).send({ message: "not access" });
    }
};

module.exports = {
    verifyToken,
    accessUser
};