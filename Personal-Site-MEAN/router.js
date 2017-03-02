'use strict';
/* Modules */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer'); 
var upload = multer(); // for parsing multipart/form-data
var NodeCache = require("node-cache");
var cache = new NodeCache();

/* My Modules */
var predictions = require('./modules/spotify/server/predictionModule');
var table = require('./modules/spotify/server/tableModule');
var setlist = require('./modules/recap/server/setlistModule'); 
var login = require('./modules/recap/server/spotifyLoginModule'); 

/* Routes */
var router = express.Router();
function Path(file) {
    return path.join(__dirname + file);
}

router.use(bodyParser.json()); // for parsing json body of POST requests

//define root paths
router.use('/', express.static(__dirname));
router.use('/vendor', express.static(__dirname + '/node_modules/'));
router.use('/home', express.static(__dirname + '/modules/home/client'));
router.use('/spotify', express.static(__dirname + '/modules/spotify/client/'));
router.use('/recap', express.static(__dirname + '/modules/recap/client/'));

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
 * Called from /module/recap/client/module/setlistSearch.html
 */
router.get('/getSetlists/:artist', (req, res) => {
    var artist = req.params.artist;
    if (artist) {
        setlist.getSetlists(artist).then(function (setlists) {
            res.json(setlists);
        }).catch(function (reason) {
            res.status(500).json(reason);
        });
    }
    else {
        res.status(500).json('artist was not provided');
    }
});

/**
 * Called from /module/recap/client/templates/setlistSearch.html
 */
router.post('/getSetlistSongs', (req, res) => {
    var sets = req.body;
    if (sets) {
        setlist.getSetlistSongs(sets).then(function (songs) {
            res.json(songs);
        }).catch(function (reason) {
            res.status(500).json(reason);
        });
    }
    else {
        res.status(500).json('Sets was not provided');
    } 
});

/**
 * Called from /module/recap/client/templates/spotifyLogin.html
 * Redirects to the Spotify authentication page
 */
router.get('/spotifyLogin', (req, res) => {
    login.spotifyLogin(res);
});

/**
 * Called by authentication redirect
 * Redirects to a HTML page that just closes itself
 */
router.get('/loginCompleted', (req, res) => {
    var code = req.query.code;
    if (code){
        res.cookie('code', code);
        cache.set('code', code);
        res.sendFile(Path('/modules/recap/client/templates/loginCompleted.html'));
    }
    else {
        var error = req.query.error;
        res.status(500).json(error);
    } 
});

/**
 * Saves a list of songs to Spotify
 * Gets songs from the POST body and the code from the cache
 */
router.post('/savePlaylist', (req, res) => {
    var playlist = req.body;
    var code = cache.get('code');
    if (playlist) {
        login.savePlaylist(req, res, code, playlist).then(function (playlistUri) {
            res.json(playlistUri);
            //res.redirect(playlistUri);
        }).catch(function (reason) {
            res.status(500).json(reason);
        });
    }
    else {
        res.status(500).json('Could not save playlist');
    }
    
});

/* Export */
module.exports = router;
