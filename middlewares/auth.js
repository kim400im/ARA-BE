require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET

const checkLogin = (req, res, next)=>{
    const token =req.cookies.token;

    if(!token){
        res.redirect("/login");
    } try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch(error){
        res.redirect("/login")
    }
}

module.exports = checkLogin;