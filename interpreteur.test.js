var fs = require('fs');

require.extensions['.lsp'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
var test = require("./test");
var read = require("./read.js");
var retour = require('./test.lsp');
const { exit } = require('process');
// test = read.readJo(retour);
// console.log(JSON.stringify(test));
// read.readJo("a");
// while (true){

// }
console.log(test.assertEqualsReadSimple({type:'test'},{type:'test2'}))
while (true){
}
// exit();
liste_test = [
    {
        input:'a',
        expected:[{
            type:'var',
            name:'a',
        }]
    },
    {
        input:'1',
        expected:[{
            type:'num',
            value:2,
        }]
    }
]
for (var i = 0; i < liste_test.length; i++){
    test.assertEqualsRead(read.readJo(liste_test[i]['input']),liste_test[i]['expected']);
}
while(true) {
}