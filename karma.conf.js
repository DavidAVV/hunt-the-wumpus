module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    files: [
      'src/**/*.ts'
    ],

    exclude: [
    ],

    plugins: [
      'karma-chrome-launcher',
      'karma-typescript',
      'karma-jasmine'
    ],

    preprocessors: {
      'src/**/*.ts': ['karma-typescript']
    },

    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json'
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome'],

    singleRun: false,

    concurrency: Infinity
  })
}
