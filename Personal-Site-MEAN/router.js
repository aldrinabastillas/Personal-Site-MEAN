/* Modules */
var express = require('express');
var path = require('path');
var predictions = require('./modules/spotify/server/predictionModule');
var table = require('./modules/spotify/server/tableModule');

/* Routes */
var router = express.Router();
function Path(file) {
    return path.join(__dirname + file);
}

//define root paths
router.use('/', express.static(__dirname));
router.use('/vendor', express.static(__dirname + '/node_modules/'));
router.use('/home', express.static(__dirname + '/modules/home/client'));
router.use('/spotify', express.static(__dirname + '/modules/spotify/client/'));

//download resume link on /module/home/client/templates/contact.html
router.get('/resume', (req, res) => {
    var fileName = 'Aldrin F Abastillas - Resume 2017.docx';
    var filePath = Path('/modules/home/client/content/documents/' + fileName);
    res.download(filePath, fileName);
});

//called from /module/spotify/client/module/predictionColumn.html
router.get('/getPrediction:songId', (req, res) => {
    var songId = req.params.songId;
    if (songId) {
        predictions.getPrediction(songId).then(function (result) {
            res.json(result);
        }).catch(function (reason) {
            res.status(500).json(reason);
        });
    }
    else {
        res.status(500).json('Could not find selected song');
    }
});

//called from /module/spotify/client/module/tableColumn.html
router.get('/getYearList:year', (req, res) => {
    var year = req.params.year;
    if (year) {
        table.getYearList(year).then(function (result) {
            res.json(result);
        }).catch(function (reason) {
            res.status(500).json(reason);
        });
    }
});

/* Export */
module.exports = router;
