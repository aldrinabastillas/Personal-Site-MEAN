/* Modules */
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer'); 
var upload = multer(); // for parsing multipart/form-data

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

router.use(cookieParser());
router.use(bodyParser.json()); // for parsing application/json

//define root paths
router.use('/', express.static(__dirname));
router.use('/vendor', express.static(__dirname + '/node_modules/'));
router.use('/home', express.static(__dirname + '/modules/home/client'));
router.use('/spotify', express.static(__dirname + '/modules/spotify/client/'));
router.use('/recap', express.static(__dirname + '/modules/recap/client/'));

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
    else {
        res.status(500).json('Could not find selected list');
    }
});

//called from /module/recap/client/module/setlistSearch.html
router.get('/getSetlists/:artist', (req, res) => {
    var artist = req.params.artist;
    if (artist) {
        setlist.getSetlists(artist).then(function (result) {
            res.json(result);
        }).catch(function (reason) {
            res.status(500).json(reason);
        });
    }
});

//called from /module/recap/client/module/setlistSearch.html
router.get('/getSetlistSongs/:setlistId', (req, res) => {
    var setlistId = req.params.setlistId;
    if (setlistId) {
        setlist.getSetlistSongs(setlistId).then(function (result) {
            res.json(result);
        }).catch(function (reason) {
            res.status(500).json(reason);
        });
    }
    else {
        res.status(500).json('Could not find selected setlist');
    } 
});

//called from /module/recap/client/module/setlistSearch.html
router.get('/spotifyLogin', (req, res) => {
    login.spotifyLogin(res);
});

router.get('/saveCode', (req, res) => {
    var code = req.query.code;
    if (code) {
        res.cookie('code', code);
        res.status(200).json('Code saved');
    }
    else {
        var error = req.query.error;
        res.status(500).json(error);
    }
});

router.post('/savePlaylist', (req, res) => {
    var code = req.cookies.code
    var playlist = req.body;
    if (code && playlist) {
        login.savePlaylist(code, playlist).then(function (result) {
            res.json(result);
        }).catch(function (reason) {
            res.static(500).json(reason);
        });
    }
    else {
        res.status(500).json('Could not save playlist');
    }
    
});

/* Export */
module.exports = router;
