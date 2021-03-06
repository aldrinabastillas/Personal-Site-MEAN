// Karma configuration
module.exports = function (config) {
    config.set({
        
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',
        
        
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],
        
        
        // list of files / patterns to load in the browser
        // vendor code, app code, then tests
        files: [
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/angular/angular.js',
            './node_modules/angular-ui-router/release/angular-ui-router.js',
            './node_modules/angular-mocks/angular-mocks.js',  
            './modules/recap/client/modules/recapModule.js', 
            './modules/recap/client/directives/recap-directives.js', 
            './modules/recap/client/services/setlistService.js', 
            './modules/recap/client/controllers/searchController.js',  
            './public/app.js',    
            './modules/recap/tests/client/searchController.test.js',
            './modules/recap/tests/client/setlistService.test.js'
        ],
        
        
        // list of files to exclude
        exclude: [
        ],
        
        
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },
        
        
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],
        
        
        // web server port
        port: 9876,
        
        
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        
        
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        
        
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,
        
        
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],
        
        
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,
        
        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
