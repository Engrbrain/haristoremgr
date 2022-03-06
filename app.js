//Constants to Import
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
require('dotenv/config');
const morgan = require('morgan');
const mongoose = require('mongoose');
const productsRoutes = require('./routers/products');
const categoriesRoutes = require('./routers/categories');
const usersRoutes = require('./routers/users');
const ordersRoutes = require('./routers/orders');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
//End of Constants to Import

//Environment Variables
const api = process.env.API_URL;
const conn = process.env.CONNECTION_STRING;
//End of Environment Variables


//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt);
app.use(errorHandler);
//End of middleware

//Routers
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//End Routers

//connect to database
mongoose.connect(conn, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        dbName: 'haristore'
    }).then(()=> {
    console.log('Database Connection is ready...');
}).catch((err)=> {
    console.log(err);
})
// End of Connect to Database



// Setup Node Server
app.listen(3000, () => {
    //console.log(api);
     console.log('Server is running http://localhost:3000');
});
// End of Setup Node Server