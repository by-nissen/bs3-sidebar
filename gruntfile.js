// Configurations
var pkgjson = require('./package.json');
var config = {
  pkg      : pkgjson,
  directory: {
    vendor: './src/vendor',
    src   : './src',
    dist  : './dist'
  }
};
var module;

// Grunt
module.exports = function (grunt) {
  'use strict';

  // Configurations
  var gruntConfig = grunt.file.readJSON('./src/grunt/config.json', { encoding: 'utf8' });

  // Setup
  grunt.initConfig({
    config: config,
    pkg   : config.pkg,

    clean: {
      css: '<%= config.directory.dist %>/css',
      js : '<%= config.directory.dist %>/js'
    },

    less: {
      app: {
        options: {
          strictMath       : true,
          sourceMap        : true,
          outputSourceFiles: true,
          sourceMapURL     : '<%= config.directory.dist %>/css/stylesheet.css.map',
          sourceMapFilename: '<%= config.directory.dist %>/css/stylesheet.css.map'
        },
        src    : '<%= config.directory.src %>/less/stylesheet.less',
        dest   : '<%= config.directory.dist %>/css/stylesheet.css'
      }
    },

    csslint: {
      options: {
        csslintrc: '<%= config.directory.src %>/less/.csslintrc'
      },
      app    : [
        '<%= config.directory.dist %>/css/stylesheet.css'
      ]
    },

    cssmin: {
      options: {
        compatibility      : 'ie8',
        keepSpecialComments: false,
        advanced           : false
      },
      app    : {
        src : '<%= config.directory.dist %>/css/stylesheet.css',
        dest: '<%= config.directory.dist %>/css/stylesheet.min.css'
      }
    },

    autoprefixer: {
      options: {
        browsers: gruntConfig.autoprefixer.browsers
      },
      app    : {
        options: {
          map: true
        },
        src    : '<%= config.directory.dist %>/css/stylesheet.css'
      }
    },

    modernizr: {
      app: {
        devFile      : 'remote',
        parseFiles   : true,
        files        : {
          src: [gruntConfig.concat.jsApp, gruntConfig.concat.jsIe9Lt, '<%= config.directory.dist %>/css/stylesheet.css']
        },
        outputFile   : '<%= config.directory.dist %>/js/modernizr.js',
        extra        : {
          shiv      : false,
          printshiv : false,
          load      : true,
          mq        : true,
          cssclasses: true
        },
        extensibility: {
          addtest     : false,
          prefixed    : false,
          teststyles  : false,
          testprops   : false,
          testallprops: false,
          hasevents   : false,
          prefixes    : false,
          domprefixes : false
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '<%= config.directory.src %>/js/.jshintrc'
      },
      app    : {
        src: ['<%= config.directory.src %>/js/*.js']
      }
    },

    jscs: {
      options: {
        config: '<%= config.directory.src %>/js/.jscsrc'
      },
      app    : {
        src: '<%= jshint.app.src %>'
      }
    },

    concat: {
      options: {
        sourceMap   : true,
        stripBanners: true
      },
      app    : {
        src : gruntConfig.concat.jsApp,
        dest: '<%= config.directory.dist %>/js/app.js'
      },
      ie9Lt  : {
        src : gruntConfig.concat.jsIe9Lt,
        dest: '<%= config.directory.dist %>/js/ie9-lt.js'
      }
    },

    uglify: {
      options  : {
        compress        : {
          warnings: false
        },
        mangle          : true,
        preserveComments: 'some'
      },
      app      : {
        src : '<%= config.directory.dist %>/js/app.js',
        dest: '<%= config.directory.dist %>/js/app.min.js'
      },
      ie9Lt    : {
        src : '<%= config.directory.dist %>/js/ie9-lt.js',
        dest: '<%= config.directory.dist %>/js/ie9-lt.min.js'
      },
      modernizr: {
        src : '<%= config.directory.dist %>/js/modernizr.js',
        dest: '<%= config.directory.dist %>/js/modernizr.min.js'
      }
    },

    copy: {
      src : {
        files: [
          {
            expand: true,
            cwd   : '<%= config.directory.vendor %>/bootstrap/less/',
            src   : '**/*',
            dest  : '<%= config.directory.src %>/less/vendor/bootstrap/'
          },
          {
            expand: true,
            cwd   : '<%= config.directory.vendor %>/fontawesome/less/',
            src   : '**/*',
            dest  : '<%= config.directory.src %>/less/vendor/fontawesome/'
          },
          {
            expand: true,
            cwd   : '<%= config.directory.vendor %>/bs3-designer/less/',
            src   : '**/*',
            dest  : '<%= config.directory.src %>/less/vendor/bs3-designer/'
          }
        ]
      },
      dist: {
        files: [
          {
            expand : true,
            flatten: true,
            cwd    : '<%= config.directory.vendor %>/fontawesome/',
            src    : '**/fonts/*',
            dest   : '<%= config.directory.dist %>/fonts/'
          }
        ]
      }
    },

    watch: {
      less: {
        files: ['<%= config.directory.src %>/less/**/*.less'],
        tasks: ['clean:css', 'less', 'autoprefixer', 'cssmin', 'modernizr']
      },
      js  : {
        files: '<%= config.directory.src %>/js/**/*.js',
        tasks: ['clean:js', 'concat', 'uglify', 'modernizr']
      }
    }
  });

  // Load
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-modernizr');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Register
  grunt.registerTask('default', ['watch']);

  grunt.registerTask('build', ['clean', 'concat', 'less', 'autoprefixer', 'modernizr', 'uglify', 'cssmin']);
  grunt.registerTask('build-css', ['clean:css', 'less', 'autoprefixer', 'modernizr', 'cssmin']);
  grunt.registerTask('build-js', ['clean:js', 'concat', 'modernizr', 'uglify']);

  grunt.registerTask('test', ['clean', 'concat', 'jscs', 'jshint', 'less', 'autoprefixer', 'csslint', 'modernizr', 'uglify', 'cssmin']);
  grunt.registerTask('test-css', ['clean:css', 'less', 'autoprefixer', 'csslint', 'modernizr', 'cssmin']);
  grunt.registerTask('test-js', ['clean:js', 'concat', 'jscs', 'jshint', 'modernizr', 'uglify']);

  grunt.registerTask('copy-files', ['copy']);
};
