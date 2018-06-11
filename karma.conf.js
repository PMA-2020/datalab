var webpackConfig = require('./webpack.config');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon', 'fixture'],
    files: [
      'test/javascripts/*.js',
      'test/fixtures/**/*',
    ],
    exclude: [
    ],
    preprocessors: {
      'test/javascripts/**/*.js': ['webpack'],
      'test/fixtures/**/*.html' : ['html2js'],
      'test/fixtures/**/*.json' : ['json_fixtures']
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [],
    singleRun: false,
    concurrency: Infinity,
    jsonFixturesPreprocessor: {
      variableName: '__json__'
    },
  })
}
