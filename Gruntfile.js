module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*!\n' +
        ' * <%= pkg.title || pkg.name %> v<%= pkg.version %>\n' +
        ' * <%= pkg.author.url %>\n' +
        ' *\n' +
        ' * <%= pkg.licenses[0].description %>\n' +
        ' * <%= pkg.licenses[0].url %>\n' +
        ' *\n' +
        ' * <%= template.today("mmmm yyyy") %>\n' +
        ' */'
    },
    jshint: {
      all: ['Gruntfile.js', 'jquery.queueslider.js'],
      options: {
        globals: {
          exports: true,
          module: false,
          jQuery: true
        }
      }
    },
    uglify: {
      options: {
          banner: '<%= banner %>'
      },
      dist: {
        src: 'jquery.queueslider.js',
        dest: 'jquery.queueslider.min.js'
      }
    },
    watch: {
      options: {
        livereload: true
      },
      js: {
        files: ['Gruntfile.js', 'jquery.queueslider.js'],
        tasks: 'jshint'
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['jshint', 'uglify']);
};
