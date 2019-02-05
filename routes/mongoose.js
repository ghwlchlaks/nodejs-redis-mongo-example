const express = require('express');
const router = express.Router();
const passport = require('passport');

const Users = require('../models/users');

// 로그인 검사
const isAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.redirect('/');
}

/* GET home page. */
router.get('/',isAuthentication, (req, res) => {
  res.status(200).send('login success ' + req.user.username);
});

router.put('/login', passport.authenticate('login'),
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

router.put('/update', isAuthentication, async (req, res) => {
  try {
    const newData = req.body;
    const originData = req.user;
    const user = await Users.findOne({username: originData.username})
    if (!user) throw new Error('username not found');
    user.password = user.generateHash(newData.password);
    user.updateDate = Date.now();
    const saveUser = await user.save()
    req.login(saveUser, (err) => {
      if (err) throw new Error(err);
      throw new Error('req login failed');
    });
    return res.send({status: true, msg: '갱신 성공'});
  } catch(err) {
    return res.status(500).send({status: false, msg: 'error'});
  }
  // Users.findOne({username: originData.username}, (findError, user) => {
  //   if (findError) throw findError;
  //   if (!user) res.send({status: true, msg: '해당 아이디가 존재 하지 않습니다.'})
  //   user.password = user.generateHash(newData.password);
  //   user.updateDate = Date.now();
  //   user.save((err, saveUser) => {
  //     if(err) throw err;
  //     req.login(saveUser, (err) => {
  //       if (err) throw err;
  //     })
  //     res.send({status: true, msg: '갱신 성공'});
  //   })
  // })
})
module.exports = router;
