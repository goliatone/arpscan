/*
 * arpscanner
 * https://github.com/goliatone/arpscanner
 *
 * Copyright (c) 2015 goliatone
 * Licensed under the MIT license.
 */

'use strict';
var fs = require('fs');
var path = require('path');
var extend = require('gextend');

var DEFAULTS = {
    command: 'sudo',
    args:['arp-scan','-l'],
    parser: parse,
    spawn: require('child_process').spawn
};


function parse(out){
    return function lineParser(line){
        var chunks = line.split('\t');
        out.push({
            ip:     chunks[0],
            mac:    (chunks[1] || '').toUpperCase(),
            vendor: chunks[2],
            timestamp: Date.now()
        });
    };
}


function scanner(cb, options){

    options = extend({}, DEFAULTS, options);

    var out = [],
        buffer = '',
        errbuf = '';

    var parser = options.parser(out);

    var arp = options.spawn(options.command, options.args);
    arp.stdout.on('data', function onData(data) { buffer += data; });
    arp.stderr.on('data', function onError(data){ errbuf += data; });

    arp.on('close', function onClose(code){
        if(code !== 0) return cb(code + ': ' + errbuf, null);

        buffer = buffer.split('\n');
        buffer = buffer.slice(2, -4);

        buffer.forEach(parser);


        onComplete(out, cb);
    });
}

function onComplete(data, cb){
    var out = JSON.stringify(data);
    fs.writeFile(path.resolve('/Users/eburgos/.arpscanner.dat'), out, function(err, dat){
        // console.log('done', err);
    });
    cb(null, data);
}

module.exports = scanner;
// exports.DEFAULTS = DEFAULTS;
