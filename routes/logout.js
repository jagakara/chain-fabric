var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log("ログアウト");
  console.log("user_id : " + req.session.user_id);
  req.session.user_id = null;
  res.redirect('/login');
});

module.exports = router;
