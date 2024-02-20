const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const usersRouter = require('./routes/users');
const mainRouter = require('./routes/main');

const port = 5000

console.log(path.join(__dirname, 'views'))

// middlewares
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views/'))

app.use(morgan('combined'))
app.use(express.urlencoded({ extended: true }));    
app.use(express.json());
app.use(cookieParser());

app.use('/', mainRouter)
app.use('/users', usersRouter)

app.use(express.static(path.join(__dirname, 'public')))

const servidor = () => {
    app.listen(port, () => console.log("Servidor iniciado en el puerto", port))
}

servidor()