(function () {
    'use strict';

    // Modules
    var express = require('express');
    var path = require('path');
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var upload = multer(); // for parsing multipart/form-data
    var NodeCache = require("node-cache");
    var cache = new NodeCache();


    // Route Modules
    var recapRoutes = require('./modules/recap/router');
    var spotifyRoutes = require('./modules/spotify/router');


    // Router
    var router = express.Router();
    router.use(bodyParser.json()); // for parsing json body of POST requests


    // Define paths
    router.use('/', express.static(__dirname));
    router.use('/vendor', express.static(__dirname + '/node_modules/'));
    router.use('/home', express.static(__dirname + '/modules/home/client'));
    router.use('/shared', express.static(__dirname + '/modules/shared/client'));
    router.use('/spotify', spotifyRoutes);
    router.use('/recap', recapRoutes);
    router.get('/resume', resume);


    // Export
    module.exports = router;


    // Function Implementations

    /**
     * Helper function to concatenate files to current path
     * @param {string} file - file path relative to current path
     */
    function concatPath(file) {
        return path.join(__dirname + file);
    };


    /**
     * Download resume link on /module/home/client/templates/contact.html
     */
    function resume(req, res) {
        var fileName = 'Aldrin F Abastillas - Resume 2017.docx';
        var filePath = concatPath('/modules/home/client/content/documents/' + fileName);
        res.download(filePath, fileName);
    };

})();

