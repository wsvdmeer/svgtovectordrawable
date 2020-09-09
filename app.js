//express
var express = require('express');

//svg2vecotrdrawable
var svg2vectordrawable = require('svg2vectordrawable');

//bodyparser
var bodyParser = require('body-parser')

//setup public
var app = express();
app.use(express.static('public'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.get('/', function (req, res) {
    res.sendFile('public/index.html');

});
app.listen(3000, function () {
    console.log('Converter running on port 3000');
});

app.post('/upload', function (req, res) {
   
    const svg = req.body.svg;
    console.log('svg : '+svg);
    if (svg) {
        svg2vectordrawable(svg.toString()).then(xmlCode => {
            res.set('Content-Type', 'text/xml');
            res.send(xmlCode);
        });
    }
});




