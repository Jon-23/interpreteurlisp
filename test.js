/* Read :
- 1 => {type:'num',value:1}
- "texte" => {type:'string',value:'texte'}
- var => {type:'var',name:'var'}
- (function arg1 arg2) => {type:'apply',function:{type:'var',name:'function'},args:[{type:'var',name:'arg1'},{type:'var',name:'arg2'}]}}
- (+ 1 2) => {type:'apply',function:{type:'internal',value:'+'},args:[{type:'num',value:1},{type:'num',value:2}]}}
*/

function assertEqualsRead(actual, expected,gotparent=false,name="",debug=true){
    if(gotparent === false){
        if(debug){
            console.info("%c\n\n--------------------------------",'color: grey');
        }
        
        if (name != "" && debug){
            console.info("%c Test : %s ",'color: grey',name);
        }
        if(debug){
            console.info("%c\n\n--------------------------------",'color: grey');
        }
        return_value = [];
    }
    elements_types = {
        num:'num',
        apply:'apply',
        var: 'var',
        internal:'internal',
        
    };
    internal_values = {
        '+':'plus',
    }
    elements_attributes = {
        type:'type',
        name:'name',
        value:'value',
        args:'args',
        function:'function',
    };
    for(var i = 0; i < actual.length; i++){
        if (typeof(actual[i]) == 'undefined'){
            if(debug){
                console.error("Error object N°'%s' undefined. No type found in %s.",i,JSON.stringify(actual));
            }
            // continue;
            return false;
        }
        if (typeof(actual[i]['type']) == 'undefined'){
            if(debug){
                console.error("Error object '%s'. No type found.",JSON.stringify(actual[i]))
            }
            if(gotparent === false){
                console.info("%c--------------------------------",'color: grey');
            }
            return false;
        }
        switch(actual[i]['type']){
            case elements_types['num']:
                if (typeof(actual[i][elements_attributes['value']]) == 'undefined'){
                    if(debug){
                        console.error("Error object N°%s",i,JSON.stringify(actual[i]),". No value found.",);
                    }
                    if(gotparent === false && debug){
                        console.info("%c--------------------------------",'color: grey');
                   }
                    return false;
                }else if(gotparent===false){
                    return_value.push(actual[i]);
                }
                break;
            case elements_types['internal']:
                if (typeof(actual[i][elements_attributes['value']]) == 'undefined'){
                    if(debug){
                        console.error("Error object N°%s",i,JSON.stringify(actual[i]),". No value found.");
                    }
                    if(gotparent === false && debug){
                        console.info("%c--------------------------------",'color: grey');
                    }
                    return false;
                }else if(actual[i][elements_attributes['value']] in internal_values == false){
                    if(debug){
                        console.error("Error object N°%s",i,JSON.stringify(actual[i]),". The value'"+actual[i][elements_attributes['value']]+"' isn't an internal value");
                    }
                    if(gotparent === false && debug){
                        console.info("%c--------------------------------",'color: grey');
                    }
                    return false;
                }else if(gotparent==false){
                    return_value.push(actual[i]); 
                }
                break;
            case elements_types['string']:
                if (typeof(actual[i][elements_attributes['value']]) == 'undefined'){
                    console.error("Error object N°%s",i,JSON.stringify(actual[i]),". No value found.");
                    if(gotparent === false && debug){
                        console.info("%c--------------------------------",'color: grey');
                    }
                    return false;
                }else if(parent==false){
                    return_value.push(actual[i]); 
                }
                break;
            case elements_types['var']:
                if (typeof(actual[i][elements_attributes['name']]) == 'undefined'){
                    console.error("Error object N°%s",i,JSON.stringify(actual[i]),". No name found.");
                    if(gotparent === false && debug){
                        console.info("%c--------------------------------",'color: grey');
                    }
                    return false;
                }
                break;
            case elements_types['apply']:
                if (typeof(actual[i][elements_attributes['args']]) == 'undefined'){
                    if(debug){
                        console.error("Error object N°%s",i,JSON.stringify(actual[i]),". No args found.");
                    }
                    if(gotparent === false && debug){
                        console.info("%c--------------------------------",'color: grey');
                   }
                    return false;
                }else if(Array.isArray(actual[i][elements_attributes['args']]) == false){
                    if(debug){
                        console.error("Error object N°%s",i,JSON.stringify(actual[i]),". Args isn't an array.");
                    }
                    console.info("%c--------------------------------",'color: grey');
                    return false;
                }else if (typeof(actual[i][elements_attributes['function']].constructor) == 'undefined'){
                    if(debug){
                        console.error("Error object N°%s",i,JSON.stringify(actual[i]),". No function found");
                    }
                    if(gotparent === false && debug){
                         console.info("%c--------------------------------",'color: grey');
                    }
                    return false;

                }else if(actual[i][elements_attributes['function']].constructor != Object){
                    if(debug){
                        console.error("Error object N°%s",i,JSON.stringify(actual[i]),". Function isn't a dictionary");
                    }
                    if(gotparent === false && debug){
                         console.info("%c--------------------------------",'color: grey');
                    }
                    return false;
                }
                if(assertEqualsRead(actual[i][elements_attributes['args']],'',true) ==false){
                    if(debug){
                        console.error("Which is a child of N°%s : %s",i,JSON.stringify(actual[i]));
                    }
                    if(gotparent === false && debug){
                        console.info("%c--------------------------------",'color: grey');
                    }
                    return false;
                }  
                if(assertEqualsRead([actual[i][elements_attributes['function']]],'',true) ==false){
                    if(debug){
                        console.error("Which is a child of N°%s : %s",i,JSON.stringify(actual[i]));
                    }
                    if(gotparent === false && debug){
                        console.info("%c--------------------------------",'color: grey');
                    }
                    return false;
                }
                if(gotparent===false){
                    return_value.push(actual[i]); 
                }
                break;

            default:
                if(debug){
                    console.error("Type '%s' not supported, in object N°%s",actual[i]['type'],i,JSON.stringify(actual[i]));
                }
                if(gotparent === false && debug){
                    console.info("%c--------------------------------",'color: grey');
                }
                return false;
        }
    }
    if(gotparent ===false){
        is_equals = true;
        // if(actual.length != expected.length){
        //     is_equals = false;
        // }
        original_expected = JSON.stringify(expected);
        // console.log(JSON.stringify(expected))
        elements_not_equals = [];
        for(i=0;i<actual.length;i++){
            found = false;
            for(j=0;j<expected.length;j++){
                if(JSON.stringify(expected[j]) == JSON.stringify(actual[i])){
                    
                    found = true;
                    expected.splice(j, 1);
                    break;
                }
            }
            if(found){
                continue;
            }else{
                is_equals = false;
                elements_not_equals.push(JSON.stringify(actual[i]));
            }
        }
        if(is_equals){
            if(debug){
                console.info("%cExpected %s and correctely get %s",'color : green',original_expected,JSON.stringify(return_value));
            }
        }else{
            if(elements_not_equals.length > 0 && debug){
                if(elements_not_equals.length == 1){
                    console.error("Element [%s] is not expected", elements_not_equals.toString());
                }else{
                    console.error("Elements [%s] are not expected",elements_not_equals.toString());
                }
            }
            if(expected.length >0 && debug){
                if(expected.length == 1){
                    console.error("Element %s is missing ",JSON.stringify(expected));
                    test = 1;
                }else{
                    console.error("Elements %s are missing ",JSON.stringify(expected));
                }
            }
            if(debug){
                console.info("%c--------------------------------",'color: grey');
            }
            return false;
        }
        // console.log("C'est bon");
        if(debug){
            console.info("%c--------------------------------",'color: grey');
        }
    }
    
    return true;
}
function assertEqualsEval(actual, expected) {
    return_value = "";
    for (var i = 0; i < actual.length; i++) {
        switch (actual[i]['type']){
            case 'string': 
                return_value +=  actual[i]['val'];
                break;
                
            case 'num':
                return_value += actual[i]['val'].toString();
                break;
            default:
                console.error("Unexpected type '" + actual[i]['type'] + "'"); 
                return false;
                break;
        } 
    }
    if (return_value === expected){
        console.info("Expected '" + return_value + "' found '" + expected+ "'");
        return true;
    }else{
        console.error("Unexpected return value '" + return_value + "' when expected '" + expected + "'");
        return false;
    }
}

module.exports.assertEqualsEval = assertEqualsEval;
module.exports.assertEqualsRead = assertEqualsRead;
// console.log("Test");
// assertEqualsRead([{type:'test'}],[]);
// assertEqualsRead([{type:'num'}],[]);
// assertEqualsRead([{type:'num',value:1}],[{type:'num',value:1}]);
// assertEqualsRead([{type:'num',value:1},{type:'num',value:3}],[{type:'num',value:2}]);
// assertEqualsRead([{type:'test',value:1}],[]);
// assertEqualsRead([{type:'num',value:1}],[]);
// assertEqualsRead([{type:'num',value:1}],[{type:'num',value:2}]);
// assertEqualsRead([{type:'apply',function:{type:'var',name:'function'},args:[{type:'var',name:'arg1'},{type:'var',name:'arg2'}]}],[{type:'apply',function:{type:'var',name:'function'},args:[{type:'var',name:'arg1'},{type:'var',name:'arg2'}]}])
// assertEqualsRead([{type:'apply',function:{type:'internal',value:'+'},args:[{type:'var',name:'arg1'},{type:'var',name:'arg2'}]}],[{type:'apply',function:{type:'var',name:'function'},args:[{type:'var',name:'arg1'},{type:'var',name:'arg2'}]}]);
// assertEqualsRead([{type:'apply',function:{type:'var',name:'function'},args:[{type:'var',name:'arg1'},{type:'var',name:'arg2'}]}],[{type:'apply',function:{type:'var',name:'function'},args:[{type:'var',name:'arg1'},{type:'var',name:'arg2'}]}])

// assertEqualsRead([{type:'apply',function:{type:'var2',name:'function'},args:[{type:'var',name:'arg1'},{type:'var',name:'arg2'}]}],[{type:'apply',function:{type:'var',name:'function'},args:[{type:'var',name:'arg1'},{type:'var',name:'arg2'}]}])

// console.log(test);
// exit()