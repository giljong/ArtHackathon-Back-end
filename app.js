const createError = require('http-errors');
const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const helmet = require('helmet');
const bodyParser = require('body-parser');;

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '122345564fasdfafa54fsadaf',
  resave: false, 
  saveUninitialized: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(helmet());
/*
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('404.ejs');
});
*/
app.listen(3000, "0.0.0.0", () => {
  console.log("connect");
});



module.exports = app;
