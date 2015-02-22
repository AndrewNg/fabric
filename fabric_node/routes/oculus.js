var express = require('express');
var router = express.Router();

/* GET oculus listing. */
router.get('/oculus', function(req, res) {
  res.render('oculus', {title: 'Fabric'});
});

module.exports = router;
