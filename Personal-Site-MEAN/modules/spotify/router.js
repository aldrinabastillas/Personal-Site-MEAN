(function () {
    'use strict';

    // Modules
    var express = require('express');
    var path = require('path');
    var request = require('request');
    var predictions = require('./server/predictionModule');
    var table = require('./server/tableModule');


    // Routes
    var router = express.Router();
    router.use('/', express.static(__dirname + '/client/'));
    router.get('/getPrediction/:songId', getPrediction);
    router.get('/getYearList/:year', getYearList);


    // Export
    module.exports = router;


    // Function Implementations


    /**
     * Called from predictionController.getPrediction()
     */
    function getPrediction(req, res) {
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
    };


    /**
     * Called from tableController.getYearList()
     */
    function getYearList(req, res) {
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
    };


    /**
     * Helper function for joining current root path and the specified file
     * @param {string} file - rest of path relative to current directory
     */
    function pathConcat(file) {
        return path.join(__dirname + file);
    };

})();