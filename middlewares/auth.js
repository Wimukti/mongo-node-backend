const {verify} = require("jsonwebtoken");

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            token = token.slice(7);
            verify(token, "secret", (error, decoded) => {
                if (error) {
                    res.status(error.code).send({message: error.message});
                } else {
                    req.user = decoded.result;
                    delete req.user.password
                    next();
                }
            });
        } else {
            res.status(403).send({message: "Access denied ! No token"});
        }
    },
    getToken: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            token = token.slice(7);
            verify(token, "secret", (error, decoded) => {
                if (error) {
                    res.status(error.code).send({message: error.message});
                } else {
                    req.user = decoded.result;
                    delete req.user.password
                }
            });
        }
        next();
    }
};
