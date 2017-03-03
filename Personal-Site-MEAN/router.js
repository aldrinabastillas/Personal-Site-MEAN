'use strict';
/**
 * Modules
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer'); 
var upload = multer(); // for parsing multipart/form-data
var NodeCache = require("node-cache");
var cache = new NodeCache();

/**
 * My Modules
 */
var predictions = require('./modules/spotify/server/predictionModule');
var table = require('./modules/spotify/server/tableModule');
var recapRoutes = require('./modules/recap/router');

/**
 * Routes
 */
var router = express.Router();
function Path(file) {
    return path.join(__dirname + file);
}

router.use(bodyParser.json()); // for parsing json body of POST requests

//define root paths
router.use('/', express.static(__dirname));
router.use('/vendor', express.static(__dirname + '/node_modules/'));
router.use('/home', express.static(__dirname + '/modules/home/client'));
router.use('/shared', express.static(__dirname + '/modules/shared/client'));
router.use('/spotify', express.static(__dirname + '/modules/spotify/client/'));
router.use('/recap', recapRoutes);

/**
 * Download resume link on /module/home/client/templates/contact.html
 */
router.get('/resume', (req, res) => {
    var fileName = 'Aldrin F Abastillas - Resume 2017.docx';
    var filePath = Path('/modules/home/client/content/documents/' + fileName);
    res.download(filePath, fileName);
});

/**
 * Called from /module/spotify/client/module/predictionColumn.html
 */
router.get('/getPrediction:songId', (req, res) => {
    var songId = req.params.songId;
    if (songId) {
        predictions.getPrediction(songId).then(function (prediction) {
            res.json(prediction);
        }).catch(function (reason) {
            res.status(500).json(reason);
        });
    }
    else {
        res.status(500).json('songId was not provided');
    }
});

/**
 * Called from /module/spotify/client/module/tableColumn.html
 */
router.get('/getYearList:year', (req, res) => {
    var year = req.params.year;
    if (year) {
        table.getYearList(year).then(function (list) {
            res.json(list);
        }).catch(function (reason) {
            res.status(500).json(reason);
        });
    }
    else {
        res.status(500).json('year was not provided');
    }
});

/**
 * Export
 */
module.exports = router;
