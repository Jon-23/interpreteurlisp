var fs = require('fs');

require.extensions['.lsp'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var fichier = require("./test.lsp");
var test = require("./test");
var read = require("./read.js");

// console.log(valeur_test_function);
// test.assertEqualsRead([{type:'test'}],[])
// test.assertEqualsRead([{type:'num',value:14}],[{type:'num',value:14}])


// t.assertEquals(f.read("14"), {type:"num", val:14});
// t.assertEquals(f.read("a"), {type:"var", name:"a"});