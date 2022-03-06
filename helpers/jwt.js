// INSTALL EXPRESS-JWT USING npm i express-jwt
const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.JWTSECRET
    return expressJwt({
        secret,
        algorithms: ['HS256']
    }).unless ({
        path: [
            { //Google Regex Tester to Test your regular expressions
            url: /\/api\/v1\/products(.*)/,
            methods: ['GET', 'OPTIONS']
            },
            { //Google Regex Tester to Test your regular expressions
                url: /\/api\/v1\/categories(.*)/,
                methods: ['GET', 'OPTIONS']
                },
            `${api}/users/login`,
            `${api}/users/register`
        ]
    })
}

module.exports = authJwt;