module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        force: true,
        reporter: require('jshint-stylish'),
        globals: {
          jQuery: true
        }
      },
      all: ['js/app.js']
    },

    watch: {
      options: {
        livereload: true
      },
      reload: {
        files: ['index.html', 'css/styles.css', 'js/*.js'],
        tasks: [],
        options: {
          spawn: false
        }
      }
    }
  })
  require('load-grunt-tasks')(grunt)
}