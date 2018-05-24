module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sftp-deploy');


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
            }
        },

        'sftp-deploy': {
            build: {
                auth: {
                    host: 'sftp.sd5.gpaas.net',
                    port: 22,
                    authKey: 'privateKeyCustom'
                },
                cache: 'sftpCache.json',
                src: 'source',
                dest: '/lamp0/web/vhosts/jeulibre.saventurier.science/htdocs/commandozombi',
                exclusions: ['source/tmp'],
                serverSep: '/',
                localSep: '/',
                concurrency: 4,
                progress: true
            }
        }


    });

    // Définition des tâches Grunt
    grunt.registerTask("default", [
        'connect',
        'open'      
    ]);
};
