var express = require('express');
var router = express.Router();

/* GET oculus listing. */
router.get('/oculus', function(req, res) {
  res.send('respond with a resource');
});

module.exports = router;
