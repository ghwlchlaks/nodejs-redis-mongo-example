const express = require('express');
const router = express.Router();
const passport = require('passport');

// 로그인 검사
const isAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.redirect('/');
}

/* GET home page. */
router.get('/',isAuthentication, (req, res, next) => {
  res.send('mongo respond with a resource');
});

router.get('/get', (req, res) => {
  res.send('mongo get');
})

router.post('/login', passport.authenticate('login', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/mongo/get');
})

router.post('/signup', passport.authenticate('signup', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/mongo/get');
})

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})
module.exports = router;
