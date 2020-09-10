//express
var express = require('express');

//svg2vecotrdrawable
var svg2vectordrawable = require('svg2vectordrawable');

//bodyparser
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;

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
app.listen(port, function () {
    console.log('Converter running on :'+port);
});

app.post('/upload', function (req, res) {
    const svg = req.body.svg;
    if (svg) {
        svg2vectordrawable(svg.toString()).then(xmlCode => {
            res.set('Content-Type', 'text/xml');
            res.send(xmlCode);
        }).catch(error =>{
            res.status(500).send('Error! 😱 ' + error);
        });
    }
});




