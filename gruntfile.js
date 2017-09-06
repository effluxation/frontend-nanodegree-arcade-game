module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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