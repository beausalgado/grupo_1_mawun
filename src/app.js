require('dotenv').config()
//***** Requeridos *****//
const express = require('express');
const path = require('path');
const methodOverride =  require('method-override'); // Para poder usar los métodos PUT y DELETE

const expressSession = require('express-session') // Para poder usar los Session
const createError = require('http-errors');

//***** Jquery and Jsdom *****//

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
const $ = require('jquery')(window);


//***** Express *****//
const app = express();

//****Sengrid API ****//


//***** Template Engine *****//
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views')); // Define la ubicación de la carpeta de las Vistas


//***** Middlewares *****//
app.use(express.static(path.join(__dirname, '../public'))); // Necesario para los archivos estáticos en el folder /public
app.use(express.urlencoded({ extended: false })); //Capturar informacion que se envia desde un formulario via post en lo que vendria siendo req.body
app.use(express.json());
app.use(methodOverride('_method')); // Pasar poder pisar el method="POST" en el formulario por PUT y DELETE


app.get('/contacto', (req, res) => {
    res.render('contact');
});

const nodemailer = require('nodemailer');
app.post('/sendemail', (req, res) => {
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    post: 465,
    secure: true,
    auth: {
        user: 'mawuncompany@gmail.com',
        pass: 'mawun123456'
    }
});

let mailOptions = {
    from: 'mawuncompany@gmail.com',
    to: 'mawuncompany@gmail.com',
    subject: req.body.asunto,
    text: req.body.consulta
};

transporter.sendMail(mailOptions, (error, info) => {
    if(error) {
        res.status(500).send(error.message);
    } else {
        console.log('Email enviado.');
            res.render("utils/sent");
        }
    });
});

//***** Session *****//
app.use(expressSession({  
  secret: "secreta",
  saveUninitialized: false,
  resave: false
}));

//***** Cookies *****//
var cookieParser = require('cookie-parser');
app.use(cookieParser());

//***** APIs *****//

const apiOrdersRouter = require('./routes/apis/orders')
app.use('/api/orders', apiOrdersRouter)


//***** Route System  *****//
const mainRouter = require('./routes/main'); // Rutas main
const usersRouter = require('./routes/users'); // Rutas /usuarios
const productsRouter = require('./routes/products'); // Rutas /products
const adminRouter = require ('./routes/admin'); // Rutas Admin Back Office

app.use(function(req, res, next) { // middleware para usar los datos de user en todas las vistas
  res.locals.usuarioLogeado = req.session.usuarioLogeado;
  next();
});


const adminRedirect = require('./Middlewares/adminRedirect'); // El middleware asegurar de que estés logeado en las rutas admin
const { closeSync } = require('fs');
app.use ('/', mainRouter);
app.use ('/usuarios', usersRouter);
app.use ('/productos', productsRouter);
app.use ('/admin', adminRedirect, adminRouter); // Primer chequea si hay una cookie, luego si no te redirecciona al login.

// ************ catch 404 and forward to error handler ************
app.use((req, res, next) => next(createError(404)));

// ************ error handler ************
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.path = req.path;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//***** Exports app *****//
module.exports = app; // Para poder usar nodemon bin/www 