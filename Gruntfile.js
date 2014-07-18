module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffeelint: {
      files: ["src/*.coffee", "test/*.coffee"],
      options: {
        max_line_length: {
          level: "ignore"
        }
      }
    },
    coffee: {
      glob_to_multiple: {
        expand: true,
        flatten: true,
        cwd: 'src/',
        src: ['*.coffee'],
        dest: 'dist/',
        ext: '.js'
      }
    },
    clean: ["dist"],
    mochaTest: {
      options: {
        reporter: 'spec',
        require: [
          'coffee-script/register',
          function(){ expect=require('chai').expect; },
          function(){ fs=require('fs'); },
          function(){ path=require('path'); }
        ]
      },
      src: ['test/unit/**/*-spec.coffee']
    },
    watch: {
      files: ['src/**/*.coffee', 'test/**/*-spec.coffee'],
      tasks: ['test']
    },
  });

  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['mochaTest']);

  grunt.registerTask('build', ['coffeelint', 'clean', 'coffee']);
  grunt.registerTask('default', ['test', 'build']);
};
