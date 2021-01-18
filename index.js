// Stock market portfolio app
const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;


// use body parser middleware
app.use(bodyParser.urlencoded({extended: false}));



// add API key pk_2b85786f40f944dc8adfbf75cc7f253d
// create call api function
function call_api(finishedAPI, ticker) {
    request('https://cloud.iexapis.com/stable/stock/' + ticker + '/quote?token=pk_2b85786f40f944dc8adfbf75cc7f253d', { json: true }, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        if (res.statusCode === 200) {
            finishedAPI(body);
        };
        console.log(body)
    });
};

// create dividend api function
function call_div(divAPI, symbol) {
    request('https://cloud.iexapis.com/stable/stock/' + symbol + '/dividends/6m?token=pk_2b85786f40f944dc8adfbf75cc7f253d', { json: true }, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        if (res.statusCode === 200) {
            divAPI(body);
        };
        console.log(body)
    });
}

// set Handlebars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// set handlebar GET routes
app.get('/', function (req, res) {
    call_api(function(doneAPI){
        res.render('home', {
            stock: doneAPI
        });
    }, "tsla");
});
// set handlebar POST routes
app.post('/', function (req, res) {
    call_api(function(doneAPI) {
        res.render('home', {
            stock: doneAPI
        });
    }, req.body.stock_ticker);
});
// create about page route
app.get('/about.html', function (req, res) {
    res.render('about');
});
// create analysis page GET route
app.get('/analysis.html', function (req, res) {
    call_div(function(doneAPI){
        res.render('analysis', {
            company: doneAPI
        });
    }, "agnc");
});

// create analysis POST route
app.post('/analysis.html', function (req, res) {
    call_div(function(doneAPI){
        res.render('analysis', {
            company: doneAPI
        });
    }, req.body.stock_ticker);
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log('server listening' + PORT))

