var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'QR Code Generator' });
});
/* GET home page. */
router.get('/custom', function (req, res, next) {
  res.render('custom', { title: 'QR Code Generator' });
});

module.exports = router;
