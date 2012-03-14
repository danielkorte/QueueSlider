/*global config:true, task:true*/
config.init({
  pkg: '<json:package.json>',
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
  min: {
    'jquery.queueslider.min.js': ['<banner>', '<file_strip_banner:jquery.queueslider.js>']
  },
  lint: {
    files: ['grunt.js', 'jquery.queueslider.js']
  },
  watch: {
    files: '<config:lint.files>',
    tasks: 'lint qunit'
  },
  jshint: {
    options: {
      curly: true,
      eqeqeq: true,
      immed: true,
      latedef: true,
      newcap: true,
      noarg: true,
      sub: true,
      undef: true,
      eqnull: true,
      browser: true
    },
    globals: {
      jQuery: true
    }
  },
  uglify: {}
});

// Default task.
task.registerTask('default', 'lint min');
