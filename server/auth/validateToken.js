const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const authHeader = req.headers["authorization"];
    console.log(authHeader);
    let adminID = "61646d696e31323334353637";
    let token;
    if(authHeader) {
        token = authHeader.split(" ")[1];
    } else {
        token = null;
    }
    if(token == null) return res.status(401).json({'Error':'Authorization error'});
    console.log("Token found");
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if(!user) return res.status(403).json({'Error':'Authorization error'});
        if(err && user._id != adminID) return res.status(403).json({'Error':'Authorization error'});
        req.user = user;
        next();
    });


    
};
