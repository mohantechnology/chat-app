
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const token = req.cookies.sid || req.cookies.lid || req.headers["x-access-token"];
    // console.log( token)
    if (!token) {
        return res.status(400).json({ message: "Please Login" })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
    } catch (err) {

        return res.status(401).json({ message: "Authorization Failed. Please Loging Again" })
    }
    return next();

};



