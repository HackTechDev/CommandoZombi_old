module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-contrib-watch');

    // Configuration de Grunt
    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 9000,
                    base: 'source',
                    keepalive: true           
                }
            }
        },

        open: {
            server: {
                path: 'http://localhost:9000'
            }
        },      

    	watch: {
      	  scripts: {
        	files: '**/*.js',
        	//tasks: ['concat:dist']
      	  }
    	}

    });

    // Définition des tâches Grunt
    grunt.registerTask("default", [
        'connect',
        'open'      
    ]);
};
