const express = require('express');
const router = express.Router();
const passport = require('passport');

// 로그인 검사
const isAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.redirect('/');
}

/* GET home page. */
router.get('/',isAuthentication, (req, res) => {
  res.status(200).send('login success ' + req.user.username);
});

router.post('/login', passport.authenticate('login'),
  (req, res) => {
  res.status(200).send(req.user.username);
})

router.post('/signup', passport.authenticate('signup'),
 (req, res) => {
  res.status(200).send(req.user.username);
})

router.get('/logout', (req, res) => {
  req.logout();
  res.status(200).send('logout success');
})
module.exports = router;
