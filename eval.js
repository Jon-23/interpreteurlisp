/*
(+ 1 3) => 1+3
(x? sioui sinon) => if(x) sioui:sinon
(f x y) => f(x,y)
lambda (a b) => function(a, b) { return a+b}
(list 1, 2, 3) => list(1, 2, 3)
*/

const { exit } = require("process");

// exemple_one_plus_4 = [{"type":"apply","fun":{"type":"internal","value":"+"},"args":[{"type":"num","value":1},{"type":"num","value":3}]}]; // (+ 1 3)
// exemple_two_plus_5 = [{"type":"apply","fun":{"type":"internal","value":"+"},"args":[{"type":"apply","fun":{"type":"internal","value":"+"},"args":[{"type":"num","value":1},{"type":"num","value":3}]},{"type":"num","value":1}]}]
// exemple_four_plus_11 = [{"type":"apply","fun":{"type":"internal","value":"+"},"args":[{"type":"apply","fun":{"type":"internal","value":"+"},"args":[{"type":"num","value":1},{"type":"num","value":1},{"type":"num","value":1}]},{"type":"apply","fun":{"type":"internal","value":"+"},"args":[{"type":"num","value":1},{"type":"num","value":1},{"type":"num","value":1},{"type":"num","value":1}]},{"type":"apply","fun":{"type":"internal","value":"+"},"args":[{"type":"num","value":1},{"type":"num","value":1},{"type":"num","value":1},{"type":"num","value":1}]}]}];
// exemple_one_minus_1 = [{"type":"apply","fun":{"type":"internal","value":"-"},"args":[{"type":"num","value":2},{"type":"num","value":1}]}]
// exemple_one_multi_two_plus_9 = [{"type":"apply","fun":{"type":"internal","value":"*"},"args":[{"type":"apply","fun":{"type":"internal","value":"+"},"args":[{"type":"num","value":1},{"type":"num","value":2}]},{"type":"apply","fun":{"type":"internal","value":"+"},"args":[{"type":"num","value":1},{"type":"num","value":2}]}]}];
// exemple_inconu = [{"type":"apply","fun":{"type":"internal","value":"*"},"args":[{"type":"apply","fun":{"type":"internal","value":"+"},"args":[{"type":"apply","fun":{"type":"internal","value":"/"},"args":[{"type":"apply","fun":{"type":"internal","value":"*"},"args":[{"type":"num","value":5},{"type":"num","value":2}]},{"type":"num","value":2}]},{"type":"num","value":2}]},{"type":"apply","fun":{"type":"internal","value":"+"},"args":[{"type":"num","value":1},{"type":"num","value":2}]}]}];
exemple = exemple_inconu;

function evalelement(element){
    if((element).constructor.name == "Object"){
        if(typeof(element.type) != "undefined"){
            switch(element.type){
                case "num":
                case "string":
                case "boolean":
                    if(typeof(element.value) != "undefined"){
                        return element.value
                    }
                    break;
                case "var":
                    if(typeof(element.value.type) != "undefined"){
                        if(typeof(element.value.value) != "undefined"){
                            return element.value.value;
                        }else{
                            return null; // n'est pas une erreur
                        }
                    }
                    break;
                case "apply":
                        
                        let fonction_local = element.fun;
                        
                        if(fonction_local.type == "internal"){
                            switch(fonction_local.value){
                                case '-':
                                case '*':
                                case '/':
                                case '+':
                                    // additionne les args
                                    args_requis = 2;
                                    if(element.args.length >= args_requis){
                                        // console.debug("--------------------------------------------------------");
                                        // console.debug("Length of args: " + element.args.length);
                                        let resultat_local = "";
                                        // nouveau_local = 0;
                                        for(let i=0; i<element.args.length; i++){
                                            let retour_i = evalelement(element.args[i]);
                                            if(retour_i == null){
                                                console.error("Error: retour_i n°%s == null ",i);
                                                return null;
                                            }else if((retour_i).constructor.name == "Number"){
                                                // resultat_local += "%s%s",fonction_local.value,retour_i;
                                                if(i != 0){
                                                    resultat_local += fonction_local.value;
                                                }
                                                resultat_local += retour_i;
                                            }else{
                                                return null; // on n'additionne que les nombres
                                            }
                                        }
                                        return  eval(resultat_local);
                                    }else{
                                        return null; // pas asser d'arguments
                                    }
                                default:
                                    console.error("Error: '%s' internal type not supported",fonction_local.value);
                                    return null; // n'est pas un type interne maitrisé
                            }
                        }else{
                            console.error("Error: function not implemented");
                            return null;
                        }            
                default:
                    console.error("Error: '%s' type not recognized ",element.type);
                    return null;
            }
        }
    }
    return null;
}

function evalLsp(elements){
    
    if((elements).constructor.name == "Array"){
        new_array = [];
        for(var i=0;i<elements.length;i++){
            result = evalelement(elements[i]);
            if(result == null){
                console.error("Error: result is null at index " + i);
                return null;
                // continue;
            }else{
                new_array.push(result);
            }
            
        }
        return new_array;
    }else{
        console.error("Error: element is not an array");
        return null;
    }
}

console.log(evalLsp(exemple));
exit();