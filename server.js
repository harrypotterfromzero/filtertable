const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3002;
const path = require('path');
// const __dirname = path.resolve();
//imports
const contactRoutes = require('./routes/contacts');

//set templating engine

app.use(express.static(__dirname+'/public'));
app.set("view engine", "ejs");


//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use('/contacts',contactRoutes);



//run
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
