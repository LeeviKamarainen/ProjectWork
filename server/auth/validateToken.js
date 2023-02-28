const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const authHeader = req.headers["authorization"];
    console.log(authHeader);
    let token;
    if(authHeader) {
        token = authHeader.split(" ")[1];
    } else {
        token = null;
    }
    if(token == null) return res.status(401).json({'Error':'Authorization error'});
    console.log("Token found");
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if(err) return res.status(403).json({'Error':'Authorization error'});
        req.user = user;
        next();
    });


    
};
