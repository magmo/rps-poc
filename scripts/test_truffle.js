'use strict';

//TODO: Add more functionality
var ganache = require("ganache-cli");
const { execFile, exec } = require('child_process');

process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';


var ganache = require("ganache-cli");
var server = ganache.server({port:5732});
server.listen(process.env.DEV_GANACHE_PORT, function(err, blockchain) {
    if (err){
        return console.log(err);
    }

});

exec('truffle.cmd test --network ganache',(err, stdout, stderr) => {
    // Errors seem to be piped to stdout so we just output that always
    console.log(stdout);
  });

server.close();