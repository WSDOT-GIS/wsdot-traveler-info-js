module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt)

  grunt.initConfig({
    // Delete transpiled output files.
    babel: {
      dist: {
        files: {
          "CommonUtils.js": "es2015/CommonUtils.js",
          "FerriesClient.js": "es2015/FerriesClient.js",
          "geoJsonUtils.js": "es2015/geoJsonUtils.js",
          "TravelerInfoClient.js": "es2015/TravelerInfoClient.js",

          "spec/FerriesSpec.js": "es2015/spec/FerriesSpec.js",
          "spec/geoJsonUtilsSpec.js": "es2015/spec/geoJsonUtilsSpec.js",
          "spec/TravelerInfoSpec.js": "es2015/spec/TravelerInfoSpec.js",


          "spec/support/Alerts.js": "es2015/spec/support/Alerts.js",
          "spec/support/BorderCrossings.js": "es2015/spec/support/BorderCrossings.js",
          "spec/support/Cameras.js": "es2015/spec/support/Cameras.js",
          "spec/support/FlowDatas.js": "es2015/spec/support/FlowDatas.js",
          "spec/support/PassConditions.js": "es2015/spec/support/PassConditions.js",
          "spec/support/WeatherInfo.js": "es2015/spec/support/WeatherInfo.js",
          "spec/support/TollingRates.js": "es2015/spec/support/TollingRates.js"
        }
      }
    },
    clean: {
      tsOutput: ["spec/**/*.{js,d.ts}", "{CommonUtils,FerriesClient,geoJsonUtils,TravelerInfoClient}.{js,d.ts}"],
      tsJSOutput: ["spec/**/*.js", "{CommonUtils,FerriesClient,geoJsonUtils,TravelerInfoClient}.js"],
      es2015: "es2015"
    },
    copy: {
      moveES5: {
        files: [
          {
            expand: true,
            src: ["*.js", "spec/**/*.js", "!karma.conf.js", "!test-main.js", "!Gruntfile.js", "!add-fetch-for-node.js"],
            dest: "es2015"
          }
        ]
      }
    },
    concat: {
      commonUtils: {
        src: ['add-fetch-for-node.js', 'CommonUtils.js'],
        dest: 'CommonUtils.js'
      }
    },
    ts: {
      default: {
        tsconfig: true
      }
    }
  })

  grunt.registerTask('default', ['clean', 'ts', 'copy:moveES5', 'clean:tsJSOutput', 'babel', 'concat'])
}