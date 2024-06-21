var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var sqlite3 = require('sqlite3');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const{name}= require('pug');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var db = require('knex')({
    client:'sqlite3',
    connection:{
        filename: 'datos.sqlite'
    },
    useNullAsDefault:true
});

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.get('/api/datos', function(req, res){
    db.select('datos.id','datos.nombre','datos.raza', 'datos.clase',  'datos.nivel', 'datos.bonus_por_raza')
        .from('personajes as datos')
        .then(function(data){
            result = {}
            result.datos = data;
            res.json(result);
        }).catch(function (error) {
        console.log(error);
    })
});

app.get('/api/datos/:id', function(req, res){
    let id= parseInt(req.params.id);

    db.select('datos.id','datos.nombre','datos.raza', 'datos.clase',  'datos.nivel', 'datos.bonus_por_raza')

        .from('personajes as datos')
        .where('datos.id',id)
        .then(function(data){
            res.json(data);
        }).catch(function (error) {
        console.log(error);
    })
});

app.delete('/api/datos/:id', function(req, res){
    let id= parseInt(req.params.id);

    db.delete()

        .from('personajes')
        .where('id',id)
        .then(function(data){
            res.json(data);
        }).catch(function (error) {
        console.log(error);
    });
});

app.post('/api/datos/', function(req, res){
    let data_form = req.body;

    db.insert(data_form)
        .into('personajes')
        .then(function(data){
            res.json(result);
        }).catch(function (error) {
        console.log(error);
    });
});

app.post('/api/datos/:id', function (req, res){
    let id = req.params.id;
    let characterData = req.body;

    db('personajes')
        .update(characterData)
        .where('id', id)
        .then(function (data){
            res.json(result)
        })
        .catch(function (error) {
            console.log(error)
        })
});

app.put('/api/datos/:id', function(req, res){
    let id = parseInt(req.params.id);
    let data_form = req.body;
    db('personajes')
        .where('id', id)
        .update(data_form)
        .then(function(data){
            res.json(data);
        }).catch(function (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
