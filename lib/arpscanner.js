/*
 * arpscanner
 * https://github.com/goliatone/arpscanner
 *
 * Copyright (c) 2015 goliatone
 * Licensed under the MIT license.
 */

'use strict';

const extend = require('gextend');
const spawn = require('child_process').spawn;
const suspawn = require('suspawn');
const os = require('os');

const isMac = function() {
    return os.platform() === 'darwin';
};

var DEFAULTS = {
    command: 'arp-scan',
    args: ['-l'],
    interface: 'wlan0',
    parser: parse,
    sudo: false
};

if (isMac()) {
    DEFAULTS.command = 'arp';
    DEFAULTS.args = ['-a', '-l'];
    DEFAULTS.interface = 'en0';
}

function parse(out) {
    return function lineParser(line) {
        var chunks = line.split('\t');
        out.push({
            ip: chunks[0],
            mac: (chunks[1] || '').toUpperCase(),
            vendor: chunks[2],
            timestamp: Date.now()
        });
    }
}

function parseMac(out) {
    return function lineParser(line) {
        var chunks = line.split(/\s+/);
        out.push({
            ip: chunks[0],
            mac: (chunks[1] || '').toUpperCase(),
            timestamp: Date.now()
        });
    }
}


function scanner(cb, options) {

    options = extend({}, DEFAULTS, options);

    let out = [],
        buffer = '',
        errbuf = '',
        arp = {};

    const parser = isMac() ? parseMac(out) : parse(out);

    if (options.interface !== 'none') {
        let int = isMac() ? '-i' : '-interface';
        options.args = options.args.concat([int, options.interface]);
    }

    if (options.verbose) {
        const cmd = options.command + ' ' + options.args.join(' ');
        console.log(`${options.sudo ? 'sudo ' : ''}${cmd}`);
    }

    if (options.sudo) {
        arp = suspawn(options.command, options.args);
    } else {
        arp = spawn(options.command, options.args);
    }

    arp.stdout.on('data', function onData(data) { buffer += data; });
    arp.stderr.on('data', function onError(data) { errbuf += data; });

    arp.on('close', function onClose(code) {
        if (code != 0) return cb(code, null);

        buffer = buffer.split('\n');
        if (isMac()) {
            buffer.shift();
            buffer.pop();
        } else {
            buffer = buffer.slice(2, -4);
        }


        buffer.forEach(parser);

        cb(null, out);
    });

    arp.on('error', function(err) {
        cb(err, null);
    });

    arp.on('exit', function(code, signal) {

    });
}

module.exports = scanner;
module.exports.promisify = function() { return require('./arpscanner-promise') };
module.exports.isMac = isMac;

module.exports.checkArpScan = function checkArpScan() {
    const spawn = require('child_process').spawn;
    const test = spawn(DEFAULTS.command, DEFAULTS.args);

    test.on('error', function(err) {
        console.log(err);
    });
    test.on('data', function(data) {
        console.log(data);
    });
};
// exports.DEFAULTS = DEFAULTS;