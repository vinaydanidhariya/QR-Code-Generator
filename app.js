var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const qr = require("qrcode");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.post("/scan", (req, res) => {
  console.log(req.body);
  const data = req.body;
  const formattedString = Object.entries(data)
    .map(([key, value]) => `${key}:${value}`)
    .join(",\n");

  console.log(formattedString);

  if (formattedString.length === 0) res.send("Empty Data!");
  qr.toDataURL(formattedString, (err, src) => {
    if (err) res.send("Error occured");
    res.render("scan", { title: 'QR Code Generator', src });
  });
});


app.post("/dynamic", (req, res) => {
  console.log(req.body);
  const json = req.body;
  JSON.stringify(json)
  try {
    var result = '';
    if (Array.isArray(json.fieldName)) {
      for (var i = 0; i < json.fieldName.length; i++) {
        result += json.fieldName[i] + ':' + json.fieldValue[i];
        if (i !== json.fieldName.length - 1) {
          result += ', ';
        }
      }
    } else {
      result += json.fieldName + ':' + json.fieldValue;
    }

    if (result.length === 0) res.send("Empty Data!");
    qr.toDataURL(result, (err, src) => {
      if (err) res.send("Error occured");
      res.render("scan", { title: 'QR Code Generator', src });
    });

  } catch (error) {
    console.log(error);
  }

});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
