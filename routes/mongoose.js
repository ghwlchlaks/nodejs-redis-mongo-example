const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.send('mongo respond with a resource');
});


router.get('/get', (req, res) => {
  res.send('mongo get');
})
module.exports = router;
