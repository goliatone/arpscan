scanner = require("./arpscanner");

module.exports = function (options) {
    return new Promise((resolve, reject) => {
        scanner((err, out) => err ? reject(err) : resolve(out), options);
    });
};
