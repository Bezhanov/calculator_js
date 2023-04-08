const express = require('express');
const { Liquid } = require('liquidjs');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.static('public'));

app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

const port = 3000;

var engine = new Liquid();

app.engine('liquid', engine.express()); // register liquid engine
app.set('views', './views'); // specify the views directory
app.set('view engine', 'liquid'); // set liquid to default

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/history', (req, res) => {
  let historyText = fs.readFileSync(path.resolve(__dirname, 'history.txt'));
  res.render('history', {
    historyText,
  });
});

app.post('/', (req, res) => {
  let firstNumber = parseInt(req.body.op1);
  let secondNumber = parseInt(req.body.op2);
  let result;
  switch (req.body.operation) {
    case '+':
      result = firstNumber + secondNumber;
      break;
    case '-':
      result = firstNumber - secondNumber;
      break;
    case '/':
      result = firstNumber / secondNumber;
      break;
    case '*':
      result = firstNumber * secondNumber;
      break;
  }

  let calculationString =
    req.body.op1 + req.body.operation + req.body.op2 + '=' + result + '\n';
  fs.appendFile(
    path.resolve(__dirname, 'history.txt'),
    calculationString,
    (err) => {
      if (err) {
        throw err;
      }
    }
  );

  res.render('index', {
    result,
    op1: req.body.op1,
    op2: req.body.op2,
    operation: req.body.operation,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
