/* Modules */
var express = require('express');
var path = require('path');
var predictions = require('./modules/spotify/server/predictionModule');

/* Routes */
var router = express.Router();
function Path(file) {
    return path.join(__dirname + file);
}

router.use('/', express.static(__dirname));
router.use('/vendor', express.static(__dirname + '/node_modules/'));
router.use('/directives', express.static(__dirname + '/modules/home/client/directives/'));
router.use('/spotifyScripts', express.static(__dirname + '/modules/spotify/client/'));

router.get('/resume', (req, res) => {
    var fileName = 'Aldrin F Abastillas - Resume 2017.docx';
    var filePath = Path('/modules/home/client/content/documents/' + fileName);
    res.download(filePath, fileName);
});

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

/* Export */
module.exports = router;
