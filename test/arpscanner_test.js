'use strict';

var arpscanner = require('../lib/arpscanner.js');
var arpscanner_promise = require("../lib/arpscanner-promise.js");

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['awesome'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'no args': function(test) {
    test.expect(1);
    // tests here
    test.equal(arpscanner.awesome(), 'awesome', 'should be awesome.');
    test.done();
  },
  "promise": function (test) {
    test.expect(1);
    arpscanner_promise()
        .then(out => {
            test.ok(Array.isArray(out), "output should be array");
            test.done();
        })
        .catch(err => {
            test.ok(false, err);
            test.done();
        });
  }
};
