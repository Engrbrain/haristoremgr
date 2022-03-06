function errorHandler(err, req, res, next) {

    if (err.name == 'UnauthorizedError') {
        //Trigger this error when a user is not Authorized to access an API
        return res.status(401).json({message: "The user is not authorized"});
    }

    if (err.name == 'ValidationError') {
        //Trigger this error when a server experience a validation error
        return res.status(401).json({message: err});
    }


    return res.status(500).send(err);

}

module.exports = errorHandler;