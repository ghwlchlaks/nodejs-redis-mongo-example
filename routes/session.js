const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.send('session respond with a resource');
});

router.get('/set/:value', (req, res) => {
  req.session.redisSession = req.params.value;
  res.send('session written in redis successfully');
})

router.get('/get/:value', (req, res) => {
  if(req.session.redisSession) {
    res.send('session value is : ' + req.session.redisSession);
  } else {
    res.send('no session value');
  }
})
module.exports = router;
