const router = require('express').Router();
const passport = require('passport');


router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
})); 

router.get('/signin', (req, res, next) => {
  res.render('signin');
});


router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
}));

router.get('/profile',isAuthenticated, (req, res, next) => {
  res.render('profile');
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/')
}

//Added programs

router.get('/about', (req, res, next) => {
  res.render('about');
});

router.get('/donaciones', (req, res, next) => {
  res.render('donaciones');
});

router.get('/depositos', (req, res, next) => {
  res.render('depositos');
});

router.get('/cancel', (req, res, next) => {
  res.render('cancel');
});

router.get('/success', (req, res, next) => {
  res.render('success');
});

router.get('/becas', (req, res, next) => {
  res.render('becas');
});

router.get('/cluster', (req, res, next) => {
  res.render('cluster');
});

router.get('/graph', (req, res, next) => {
  res.render('graph');
});
module.exports = router;
