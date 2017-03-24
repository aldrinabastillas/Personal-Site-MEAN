(function () {
    'use strict';

    // Modules
    var gulp = require('gulp');
    var concat = require('gulp-concat');
    var uglify = require('gulp-uglify');

    //Tasks
    var tasks = ['homeScripts', 'moduleScripts', 'recapScripts', 'spotifyScripts', 'vendorScripts'];
    gulp.task('homeScripts', homeScripts);
    gulp.task('moduleScripts', moduleScripts);
    gulp.task('recapScripts', recapScripts);
    gulp.task('spotifyScripts', spotifyScripts);
    gulp.task('vendorScripts', vendorScripts);
    gulp.task('default', tasks);


    function moduleScripts() {
        return gulp.src([
            './public/app.js',
            './modules/recap/client/modules/recapModule.js',
            './modules/spotify/client/modules/spotifyModule.js'])
            .pipe(concat('moduleBundle.js'))
            //.pipe(uglify())
            .pipe(gulp.dest('./bundles/'));
    };


    function homeScripts() {
        return gulp.src([
            './modules/home/client/directives/home-directives.js'])
            .pipe(concat('homeBundle.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./bundles/'));
    };

    function recapScripts() {
        return gulp.src(['./modules/recap/client/modules/recapModule.js',
            './modules/recap/client/services/sixpackService.js',
            './modules/recap/client/services/setlistService.js',
            './modules/recap/client/controllers/loggedInController.js',
            './modules/recap/client/controllers/searchController.js',
            './modules/recap/client/directives/songList.js',
            './modules/recap/client/directives/steps.js',
            './modules/recap/client/directives/showSelect.js',
            './modules/recap/client/directives/playlistSearch.js'])
            .pipe(concat('recapBundle.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./bundles/'));
    };

    function spotifyScripts() {
        return gulp.src(['./modules/spotify/client/modules/spotifyModule.js',
            './modules/spotify/client/directives/spotify-directives.js',
            './modules/spotify/client/controllers/predictionController.js',
            './modules/spotify/client/controllers/tableController.js',
            './modules/spotify/client/tableSort.js'])
            .pipe(concat('spotifyBundle.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./bundles/'));
    };

    function vendorScripts() {
        return gulp.src(['./node_modules/jquery/dist/jquery.min.js',
            './node_modules/angular/angular.min.js',
            './node_modules/angular-route/angular-route.min.js',
            './node_modules/angular-cookies/angular-cookies.min.js',
            './node_modules/angular-resource/angular-resource.min.js',
            './node_modules/semantic-ui/dist/semantic.min.js',
            './node_modules/bootstrap/dist/js/bootstrap.min.js',
            './node_modules/sixpack-client/sixpack.js'])
            .pipe(concat('vendorBundle.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./bundles/'));
    };

})();