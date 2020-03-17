const jwt = require('jsonwebtoken');

function isAuthenticated(req,res,next){
    const token = req.header('token');
    if(!token) return res.status(401).send("Login first");

    try {
        const payload = jwt.verify(token, process.env.JWT_KEY);
        req.payload = payload;
        console.log('Payload', payload)
    } catch (error) {
        return res.status(400).send('Invalid token');
    }
    
    next();
}

function isAdmin(req,res,next){
    if(!req.payload.isAdmin) return res.status(401).send('Not Admin');
    next();
}

module.exports.isAuthenticated = isAuthenticated;
module.exports.isAdmin = isAdmin;