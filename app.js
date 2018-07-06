/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  user = require('./routes/user'),
  http = require('http'),
  path = require('path'),
  EmployeeProvider = require('./employeeprovider').EmployeeProvider;

var app = express();

app.configure(() => {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'pug');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', () => {
  app.use(express.errorHandler());
});

var employeeProvider = new EmployeeProvider('localhost', 27017);

// Routes

// index
app.get('/', (req, res) => {
  employeeProvider.findAll((error, emps) => {
    res.render('index', {
      title: 'Employees',
      employees:emps
    });
  });
});

// new employee
app.get('/employee/new', (req, res) => {
  res.render('employee_new', {
    title: 'New Employee'
  });
});

// save new employee
app.post('/employee/new', (req, res) => {
  employeeProvider.save({
    title: req.param('title'),
    name: req.param('name')
  }, (error, docs) => {
    res.redirect('/')
  });
});

// update an employee
app.get('/employee/:id/edit', (req, res) => {
  employeeProvider.findById(req.param('_id'), (error, employee) => {
    res.render('employee_edit', {
      title: employee.title,
      employee: employee
    });
  });
});

// save updated employee
app.post('/employee/:id/edit', (req, res) => {
  employeeProvider.update(req.param('_id'), {
    title: req.param('title'),
    name: req.param('name')
  }, (error, docs) => {
    res.redirect('/')
  });
});

// delete an employee
app.post('/employee/:id/delete', (req, res) => {
  employeeProvider.delete(req.param('_id'), (error, docs) => {
    res.redirect('/')
  });
});

app.listen(process.env.PORT || 3000);
