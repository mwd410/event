'use strict';

module.exports = function( grunt ) {

    /**
     * Load required grunt modules.
     */
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );

    var buildConfig = require( 'build.config' );

    var taskConfig = grunt.util._.extend( buildConfig, {

        /**
         * We read in our `package.json` file so we can access the package name and
         * version. It's already there, so we don't repeat ourselves here.
         */
        pkg : grunt.file.readJSON( 'package.json' ),

        /**
         * jshint provides automated style checking of all code.
         *
         * These are suggestive and do not *necessarily* mean the code
         * is bad, but that it in someway violates our style standards
         */
        jshint : {
            src       : [ '<%= appFiles.js %>' ],
            jsunit    : [ '<%= appFiles.jsunit %>' ],
            gruntfile : [ 'Gruntfile.js' ],
            options   : {
                bitwise   : true,
                camelcase : true,
                curly     : true,
                eqeqeq    : true,
                forin     : true,
                immed     : true,
                newcap    : true,
                noarg     : true,
                noempty   : true,
                nonew     : true,
                undef     : true,
                strict    : true,
                browser   : true,
                node      : true,
                globals   : {
                    describe   : false,
                    it         : false,
                    expect     : false,
                    before     : false,
                    beforeEach : false,
                    after      : false,
                    afterEach  : false
                }
            }
        },

        /**
         * delta (originally watch) is a task which watches for file changes
         * and performs grunt tasks whenever they occur.
         */
        delta  : {
            gruntfile : {
                files : [ 'Gruntfile.js' ],
                tasks : [ 'jshint:gruntfile' ]
            },
            jssource  : {
                files : [ '<%= appFiles.js %>' ],
                tasks : [ 'jshint:src' ]
            }
        }
    } );

    grunt.initConfig( taskConfig );

    // This not only shuts up jshint about not adhering to camelCase,
    // But also allows us to change our testing framework more easily
    //grunt.renameTask('jasmine_node', 'test');

    // When we start watching, it should do everything and then watch
    grunt.renameTask( 'watch', 'delta' );
    grunt.registerTask( 'watch', ['jshint', 'delta'] );
};