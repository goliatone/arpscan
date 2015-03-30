/*
 * arpscanner
 * https://github.com/goliatone/arpscanner
 *
 * Copyright (c) 2015 goliatone
 * Licensed under the MIT license.
 */

'use strict';

var spawn = require('child_process').spawn;


function scanner(cb){

    var out = [];
    var buffer = '';
    var errbuf = '';
    var arp = spawn('arp-scan', ['-l']);

    arp.stdout.on('data', function onData(data) { buffer += data; });
    arp.stderr.on('data', function onError(data){ errbuf += data; });

    arp.on('close', function onClose(code){
        if(code != 0) return cb(code, null);

        buffer = buffer.split('\n');
        buffer = buffer.slice(2, -4);

        buffer.forEach(function parse(line){
            var chunks = line.split('\t');
            out.push({
                ip: chunks[0],
                mac: chunks[1],
                host: chunks[2],
                timestamp: Date.now()
            });
        });

        cb(null, out);
    });
}

module.exports = scanner;
