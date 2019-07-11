const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const helmet = require('helmet');
const bodyParser = require('body-parser');;

const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '122345564fasdfafa54fsadaf',
  resave: false, 
  saveUninitialized: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views','./views');


app.use('/login',loginRouter);
app.use('/register',registerRouter);

app.use((req, res, next) =>{
  next(createError(404));
});

app.use((err, req, res, next) =>{
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send('<script>alert("잘못된 경로입니다.");window.location.href="/"</scrtpt>');
});



app.listen(3000, () => {
  console.log("connect");
});

module.exports = app;