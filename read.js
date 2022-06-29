// Author : Jonathan NEVEU & Khasinjy PRAXELE
// Last Updated : 2022-06-29 09:58

const { cp, stat } = require("fs");


function read(exp){
    const isNumber = new RegExp("^[0-9]*$").test(exp);
    return isNumber
        ? { type: "num", val: Number(exp) }
        : { type: "var", name: exp };

}

function isNumber(val){
    return new RegExp("[0-9]+").test(val);
}
function isString(char){
    return new RegExp("[aA-zZ]").test(char);
}
function isInternal(val){
    if(val == '+' || val == '-' || val == '/' || val == '*'){
        return true;
    }else{
        return false;
    }
}
function addWithType(exp, type){
    // console.log(type);
    if(type.toLowerCase() == 'null'){
        return false;
    }else if(type.toLowerCase() == "string"){
        return {
            type:'str',
            value:exp,
        }
    }else if(type.toLowerCase() == "integer"){
        return{
            type:'num',
            value:parseInt(exp),
        }
    }else if(type.toLowerCase() == "variable"){
        return{
            type:'var',
            name:exp,
        }
    }else if(type.toLowerCase() == "internal"){
        return{
            type:'internal',
            value:exp,
        }
    }else{
        return false;
    }
}

function readLine(elements,array=[],line_n){
    if(elements == ''){
        console.log("Invalid syntax");
    }
    in_string = false;
    open_with = false;

    temp_value = "";
    temp_element = {};

    type_element = 'null';
    lines_return = [];
    arbre=[
        {
            name:'workspace',
            type:'workspace',
            args:[]
        }
    ];
    if(array.length > 0){
        arbre = array;
    }
    commentaire = ";;"
    is_escaped = false;
    variable_mode = false;
    in_a_variable = null;
    statistics = {
        parentheses :{
            n_open:0,
            n_close:0,
        }
    }

    for(i=0;i<elements.length;i++){
        new_type_element = type_element;
        if(in_string){
            //Todo : Prends en compte selon une chaine de caractères
            if(elements[i] == open_with && is_escaped == false){
                in_string = false;
                new_type_element = 'null';
            }else if(elements[i] == '\\'){
                is_escaped != is_escaped;
            }else if(is_escaped){
                is_escaped = false;
            }
        }else{
            //Todo : Verifie les types
            if(elements[i] == "'" || elements[i] == '"'){
                in_string = true;
                open_with = elements[i];
                new_type_element = "string";
                // continue;
            }else if(elements[i] == ';'){
                new_type_element = "commentaire";
            }else if(isNumber(elements[i]) && variable_mode == false){
                new_type_element = 'integer';
            }else if(isString(elements[i]) || (isNumber(elements[i]) && variable_mode == true)){
                new_type_element = 'variable';
                variable_mode = true;
                if(in_a_variable == null){
                    in_a_variable = true;
                }
            }else if(isInternal(elements[i])){
                new_type_element = 'internal';
            }else if(elements[i] == '('){
                new_type_element = 'open_parenthesis';
                statistics['parentheses']['n_open'] += 1;
            }else if(elements[i] == ')'){
                new_type_element = 'close_parenthesis';
                statistics['parentheses']['n_close'] += 1;
                if(statistics['parentheses']['n_open'] < statistics['parentheses']['n_close']){
                    console.error("Error: Unexpected closing parenthesis at column %s.",(i+1));
                    return false;
                }
            }else{
                new_type_element = 'null';
            }
        }
        if(temp_value == commentaire){
            // console.log("Commentaire!");
            break;
        }
        if(type_element != new_type_element || new_type_element == 'close_parenthesis'){
            // Si la valeur n'est pas la même j'ajoute un object de type_element du temp_value précedent et reinitialise le temp_value
            // Si il s'agit d'une ouverture de parentheses alors je rajoute un parent
            // Si il s'agit d'une fermeture de parentheses alors je retire un parent 
            // Si il s'agit d'un string je passe in_string en true
            if(in_a_variable == null && variable_mode == false){
                in_a_variable = false;
            }
            variable_mode = false;
            if(new_type_element == 'open_parenthesis'){
                // arbre.push({
                    type:'apply',
                });
            }else if(new_type_element == 'close_parenthesis'){
                // console.log(temp_value);
                temp_arbre_element = arbre[arbre.length-1];
                arbre.pop(arbre.length-1);
                if(arbre[arbre.length-1]['type'] == 'var'){
                    
                    arbre[arbre.length-1]['value'] = temp_arbre_element;
                    temp_value = "";
                    if(temp_add !== false){
                        temp_arbre_element['args'].push(temp_add);
                    }
                    type_element = new_type_element;
                    continue;
                }else{
                    temp_add = addWithType(temp_value, type_element);
                    if(temp_add){
                        temp_arbre_element['args'].push(temp_add);
                    }
                    arbre[arbre.length-1]['args'].push(temp_arbre_element);
                }
                type_element = new_type_element;                
            }else{
                temp_add = addWithType(temp_value, type_element);
                if((new_type_element == 'commentaire' || type_element == 'commentaire') && temp_value != elements[i]){
                    temp_value = elements[i];
                }
                type_element = new_type_element;
                if(type_element == 'null' ){
                    temp_value = "";
                }else if(type_element != 'string'){
                    temp_value += elements[i];
                }
                
                if(temp_add === false){
                    
                }else{
                    // console.log(temp_add);
                    if (in_a_variable && arbre.length < 2){
                        // console.log("ici");
                        arbre.push(temp_add);
                        continue;
                    }
                    // console.log("test")
                    if(arbre[arbre.length - 1]['type'] == 'var'){
                        if(typeof(arbre[arbre.length - 1]['value']) == 'undefined'){
                            arbre[arbre.length - 1]['value'] = temp_add;
                        }else{
                            console.error("Error: variable arleady defined");
                            return false;
                            // console.log(JSON.stringify(arbre[arbre.length - 1]))
                        }
                    }else if(arbre[arbre.length - 1]['type'] == 'workspace'){
                        arbre[arbre.length-1]['args'].push(temp_add);
                    }else{
                        if(typeof(arbre[arbre.length-1]['fun']) == 'undefined'){
                            arbre[arbre.length-1]['fun'] = temp_add;
                            arbre[arbre.length-1]['args'] = [];
                        }else{
                            
                            arbre[arbre.length-1]['args'].push(temp_add);
                        }
                    }
                }
            }
            

        }else{
            // Sinon j'ajoute le charactere actuel au temp_value

            temp_value += elements[i];
        }
    }
    if(in_string){
        console.error("Error: String element must has a end. The string which isn't closing start at column %s with %s.",(elements.length - temp_value.length),open_with);
        return false;
    }
    if(statistics['parentheses']['n_open'] != statistics['parentheses']['n_close']){
        console.error("Error: the number of open and close parentheses must be the same. But got %s open and %s close.", statistics['parentheses']['n_open'], statistics['parentheses']['n_close']);
        return false;
    }
    if(in_a_variable){
        
        temp_arbre_element = arbre[arbre.length-1];
        arbre.pop(arbre.length-1);
        if(arbre.length != 1){
            console.error("Error: Arbre should be have a length of 1 but got " + arbre.length+".");
            return false;
        }else{
            arbre[0]['args'].push(temp_arbre_element);
        }
    }
    
    return arbre;
}


function readLineOriginal(exp,array=[]){
    if(exp == ''){
        console.error("Invalid syntax");
        return [];
    }
    elements = exp;
    in_string = false;
    open_with = ""
    temp = ""
    is_escaped = false;
    type_element = 'null';
    lines_return = array;
    temp_return = []
    parents = []
    for(var i = 0; i < elements.length; i++) {
        new_type_element = type_element;
        if(in_string){
            // console.log(temp)
            if(elements[i] == open_with && is_escaped == false){
                in_string = false;
                // new_type_element = 'null';
                temp_add = addWithType(temp, type_element);
                lines_return.push(temp_add);
                type_element = 'null';
                open_with = "";
                // console.log("fin");
            }else if(elements[i] == '\\'){
                // in_string = true;
                is_escaped != is_escaped;
                temp += elements[i];  
            }else{
                // in_string =true;
                temp += elements[i];  
            }
                      
        }else{
            // console.log(temp);
            if(elements[i] == "'" || elements[i] == '"'){
                in_string = true;
                open_with = elements[i];
                new_type_element = "string";
            }else if(isNumber(elements[i])){
                new_type_element = 'integer';
                // console.log(temp)
                // console.log(elements[i]); //
            }else if(isString(elements[i])){
                new_type_element = 'variable';
            }else if(isInternal(elements[i])){
                new_type_element = 'internal';
            }else{
                new_type_element = 'null';
            }
            // console.log(new_type_element);
            // if(i == 0){
            //     type_element = new_type_element;
            // }
            
            if(new_type_element == type_element){
                temp += elements[i];
            }else{
                temp_add = addWithType(temp, type_element);
                type_element = new_type_element;
                if(type_element != 'null' && type_element != "string"){
                    temp = elements[i];
                }else{
                    temp = "";
                }
                
                if(temp_add === false){
                    //Todo: nothing
                }else{
                    lines_return.push(temp_add);
                }
            }                
        }
    }
    // console.log("end")
    
    return lines_return;
}

function readJo(exp,sans_workspace=true,simplify=false){
    if(exp == ""){
        console.error("Invalid syntax");
        return [];
    }else{
        exp += " ";
    }
    lines = exp.split("\n");
    lines_return = []
    for(var line_key = 0; line_key < lines.length; line_key++) {
        
        // console.log(elements);
        lines_return = readLine(lines[line_key],lines_return);
        if (lines_return === false){
            console.error("Error: Cannot read line " + (line_key+1)+".");
            return false;
        }
        // console.log(JSON.stringify(lines_return));
        // console.log("--------------------------------");
    }
    // lines_return = [].concat.apply([], lines_return);
    if(lines_return.length > 0) {
        if(sans_workspace){
            lines_return = lines_return[0]['args'];
            if (lines_return.length == 1 && simplify){
                lines_return = lines_return[0];
            }
        }
    }
    // console.log(JSON.stringify(lines_return));   
    // console.log(lines_return)
    return lines_return;
}

module.exports.read = read;
module.exports.readJo = readJo;