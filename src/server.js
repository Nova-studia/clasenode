const express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const engine = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const {publicDecrypt} = require('crypto');
let YOUR_DOMAIN = '';
// initializations
const app = express();
require('./database');
require('./passport/local-auth');

// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// app.use(express.static('public/css'));
app.set('public', path.join(__dirname, '/public'));
app.use(express.static('public'));

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(session({
  secret: 'mysecretsession',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.signinMessage = req.flash('signinMessage');
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.user = req.user;
  console.log(app.locals);
  next();
});

// routes
app.use('/', require('./routes/index'));

// Starting the server
app.listen(app.get('port'), () => {
  console.log('server on port', app.get('port'));
});

YOUR_DOMAIN = 'http://studia.com.mx'
app.post('/create-checkout-session/:monto', async (req, res) => {
  console.log("Hola")
    const {monto} = req.params
    const NUEVO_MONTO = monto;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'mxn',
                    product_data: {
                        name: 'Stubborn Attachments',
                        images: ['https://i.imgur.com/EHyR2nP.png'],
                    },
                    unit_amount: (~~NUEVO_MONTO * 100),
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/success`,
        cancel_url: `${YOUR_DOMAIN}/donaciones`,
    });
    res.json({id: session.id});
});

