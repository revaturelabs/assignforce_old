// Karma configuration
// Generated on Fri Jul 14 2017 11:28:01 GMT-0400 (Eastern Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser

    files: [
        './node_modules/angular/angular.js',
        './node_modules/angular-animate/angular-animate.js',
        './node_modules/angular-aria/angular-aria.js',
        './node_modules/angular-route/angular-route.js',
        './node_modules/angular-mocks/angular-mocks.js',
        './node_modules/angular-sanitize/angular-sanitize.js',
        './node_modules/angular-material-icons/angular-material-icons.js',
        './node_modules/angular-material/angular-material.js',
        './node_modules/angular-material/angular-material-mocks.js',
        './node_modules/angular-resource/angular-resource.js',
        './node_modules/angular-bootstrap/ui-bootstrap.js',
        './node_modules/angular-md-table/dist/angular-md-table.min.js',
        './node_modules/angular-material-data-table/dist/md-data-table.js',
        './node_modules/ngcsv/ngcsv.js',
        './src/main/resources/public/js/assignforce.js',
        './src/main/resources/public/js/services/*Service.js',
        './src/test/resources/specs/*.spec.js'
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
<<<<<<< HEAD
    // dots and junit are for CI
    reporters: ['spec'],
=======
    reporters: ['spec'],

>>>>>>> parent of a8c62f45... attempting to setup fullstack CI

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
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
