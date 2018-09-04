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
                    port: 3017,
                    base: 'source',
                    keepalive: true           
                }
            }
        },

        open: {
            server: {
                path: 'http://localhost:3017'
            }
        },      

        watch: {
                files: ['source/css.**/*.css',
                		'source/**/*.html',
                		'source/js/**/*.js',
                		'!**/node_modules/**'],
                options: {
                    livereload: 3018,
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
                dest: '/lamp0/web/vhosts/jeulibre.labak.xyz/htdocs/commandozombi',
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
        'open',
        'watch'
    ]);
};
