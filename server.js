'use strict';

const express = require('express');
const hbs     = require('hbs');
const fs      = require('fs');

const port    = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

//  app.use registers middleware
//  middleware is executed in the order presented.
app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if ( err ) {
            console.log('Unable to append to server.log')
        }
    })
    next();
});

//  absence of the next() statement will halt the app
//  commented out because we are not in maintenance mode
// app.use((req, res, next) => {
//     res.render('maintenance')
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//  set up handler for http get requests
app.get('/', (req, res) => {
  res.render('home', {
      pageTitle: 'Home Page',
      welcomeMessage: 'Welcome to Doug\'s Page'
  });
});


app.get('/about', (req, res) => {
  res.render('about', {
      pageTitle: 'About Page'
  });
});


// /bad - send back json with errorMessage
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});


app.listen(port, () => {
    console.log(`All the magic happens on port ${port}`);
});
