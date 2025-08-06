const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_key;

module.exports= async function auth (req, res, next)
{
const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).send("Access denied. No token provided.");

const token = authHeader.split(" ")[1];

try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
} catch (err) {
    return res.status(401).send("Invalid or expired token.");
}
}