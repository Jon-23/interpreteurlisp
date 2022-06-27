var fs = require('fs');

require.extensions['.lsp'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var fichier = require("./test.lsp");

function parse(fichier){
    return fichier
}

console.log(parse(fichier));