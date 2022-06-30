// const { default: test } = require('node:test');
const { exit } = require('process');

function fmap(f, ast) {
	switch(ast.type) {
		case "apply":
			return {type: "apply", fun: f(ast.fun), args: ast.args.map(f)};
		default:
			return ast;
	}
}

function read( code ) {

	function clearSpace(code) {
		for(var i = 0; i < code.length; i++)
			if ( code[i] != " " && code[i] != "\t" && code[i] != "\n" )
				break;
		return code.substring(i);
	}

	var readers = {

		parens: function ( code ) {

			if ( code[0] !== '(' )
				return false;
			code = code.substring(1);
			var result, nodes = [];
			while ( result = _read(code) ) {
				nodes.push(result[1]);
				code = result[0];
			}
			if ( code[0] !== ')' )
				return false;
			return [code.substring(1), {type: "apply", fun: nodes[0], args: nodes.slice(1)}];

		},

		number: function (code) {

			var ok = false;
			var num = 0;
			while( code.length && /[0-9]/.test(code[0]) ) {
				ok = true;
				num = num * 10 + parseInt(code[0]);
				code = code.substring(1);
			}

			return ok ? [code, {type: "num", val: num}] : false;

		},

		variable: function (code) {
			var name = "";
			while( code.length && !/[\s\(\)"]/.test(code[0]) ) {
				name += code[0];
				code = code.substring(1);
			}

			return name.length ? [code, {type: "var", name}] : false;

		},

		string: function (code) {
			var str = "";
			if ( code[0] != '"' )
				return false;
			code = code.substring(1);
			top:
			while(code.length) {
				switch(code[0]) {
					case '"': break top;
					case '\\': if (code.length < 2) return false; str += code[1]; code = code.substring(1); break;
					default: str += code[0]; break;
				}
				code = code.substring(1);
			}
			if ( code[0] != '"' )
				return false;
			return [
				code.substring(1),
				{type: "string", val: str}
			];
		},

	};

	function _read( code ) {
		var result = false;
		code = clearSpace(code);
		for(var r in readers)
			if ( result = readers[r](code) )
				break;
		return result ? [clearSpace(result[0]), result[1]] : false;
	}

	var result = _read(code);
	if (result && result[0].length == 0)
		return result[1];
	return "parse error";

}

function print(ast) {
	switch(ast.type) {
		case "num":
			return `${ast.val}`;
		case "string":
			return `"${ast.val.replace('"', '\\"')}"`;
		case "apply":
			return `(${print(ast.fun)} ${ast.args.map(print).join(' ')})`
		case "var":
			return ast.name;
	}
}


// Ajout Jonathan NEVEU

function isset(element){
    // Fonction permettant de vérifier si l'element est definit ou non.
    if(typeof(element) == "undefined"){
        return false;
    }else{
        return true;
    }
}

element_types={
    string: "str",
    number: "num",
    apply: "apply",
    variable: "var",
    internal: "internal",
}
element_attributes= {
    value:"val",
    type:"type",
    function:"fun",
    arguments: "args",
    name:"name",
}

function what_type(element){
    if(element == null){
        return "Null";
    }
    return (element).constructor.name;
}

function isinternal(function_name){
    if(function_name.length == 1){
        return new RegExp("[+\-\/\*\.\?]").test(function_name);
    }else{
        return false;
    }
}
function evalLisp(lispcontent,context){
    let retour_evalLisp = false;
    if(isset(lispcontent[element_attributes.type])){
        switch(lispcontent[element_attributes.type]){
            case element_types.string:
            case element_types.number:
                if (isset(lispcontent[element_attributes.value])){
                    return lispcontent[element_attributes.value];
                }else{
                    console.error("Error: no value specified, in %s.",JSON.stringify(lispcontent));
                    return 'undefined';
                }
                break;
            case element_types.variable:
                if(isset(lispcontent[element_attributes.name])){
                    variable_name = lispcontent[element_attributes.name]
                    if (isset(lispcontent[element_attributes.value])){
                        return evalLisp(lispcontent[[element_attributes.value]],context);
                    }else{
                        console.warn("Warning: the value is set to null, due to no value specified, in %s.",)
                        return null;
                    }
                }else{
                    console.error("Error: no name specified for variable, in %s", JSON.stringify(lispcontent));
                }
                break;
            // case element_types.internal:
            case element_types.apply:
                if(isset(lispcontent[element_attributes.function][element_attributes.name])){
                    let local_fonction = lispcontent[element_attributes.function];
                    let local_args = [];
                    if (isset(lispcontent[element_attributes.arguments])){
                        for (let i = 0; i < lispcontent[element_attributes.arguments].length; i++) {
                            let temp_i = evalLisp(lispcontent[element_attributes.arguments][i],context);
                            // console.log(temp_i);
                            if(temp_i != 'undefined'){
                                local_args.push(temp_i);
                            }else{
                                console.error("Error: arguments [%s] give a undefined, in %s",i,JSON.stringify(lispcontent));
                                return false;
                            }
                        }
                    }else{
                        console.warn("Warning: no args specified for function '%s', in %s",local_fonction[element_attributes.name] ,JSON.stringify(lispcontent))
                    }
                    let resultat = null;
                    if(isinternal(local_fonction[element_attributes.name])){
                        if(local_fonction[element_attributes.name] == "+"){
                            resultat = 0;
                            for(let i=0;i<local_args.length;i++){
                                if(what_type(resultat) != what_type(local_args[i])){
                                    return "undefined";
                                }else{
                                    resultat += local_args[i]
                                }
                            }
                        }else if(local_fonction[element_attributes.name] == "-"){
                            resultat = 0;
                            for(let i=0;i<local_args.length;i++){
                                if(what_type(resultat) != what_type(local_args[i])){
                                    return "undefined";
                                }else{
                                    resultat -= local_args[i]
                                }
                            }
                        }else if (local_fonction[element_attributes.name] == "/"){
                            resultat = 0;
                            for(let i=0;i<local_args.length;i++){
                                if(what_type(resultat) != what_type(local_args[i])){
                                    return "undefined";
                                }else if(local_args[i] == 0){
                                    console.error("Error: Cannot devise by 0.");
                                    return "undefined";
                                }else if(i == 0){
                                    resultat = local_args[i];
                                }else{
                                    resultat /= local_args[i]
                                }
                            }
                        }else if(local_fonction[element_attributes.name] == "*"){
                            resultat = 0;
                            for(let i=0;i<local_args.length;i++){
                                if(what_type(resultat) != what_type(local_args[i])){
                                    return "undefined";
                                }else if(i == 0){
                                    resultat = local_args[i];
                                }else{
                                    resultat *= local_args[i]
                                }
                            }
                        }else if(local_fonction[element_attributes.name] == "."){
                            resultat = "";
                            for(let i=0;i<local_args.length;i++){
                                if(what_type(resultat) != what_type(local_args[i])){
                                    return "undefined";
                                }else{
                                    resultat += local_args[i]
                                }
                            }
                        }else if(local_fonction[element_attributes.name] == "?"){
                            if(local_args.length > 3 || local_args.length <= 0){
                                console.error("Error: condition must have at least 2 arguments or maximum 3 arguments.")
                            }else{
                                let statement = local_args[0];
                                let correct = local_args[1];
                                let incorrect = local_args[2];
                                if(what_type(statement) == "Boolean"){
                                    if(statement){
                                        return correct;
                                    }else{
                                        return incorrect;
                                    }
                                }else{
                                    console.error("Error: first arguments of the condition must be boolean.");
                                    return "undefined";
                                }
                            }
                        }else{
                            console.error("Error: name not recognized.");
                            return "undefined"
                        }
                        // return true;
                        // console.info(JSON.stringify(local_args));
                        // return true;
                    }else{
                        return "undefined";
                    }
                    return resultat;
                }else{
                    console.error("Error: no function specified in a apply, in %s", JSON.stringify(lispcontent));
                    return false;
                }
                break;
            default:
                console.error("Error: '%s' type not supported.", lispcontent.type);
                return false;
        }
        // return true;
    }else{
        return false;
    }
}

test = read("variable (test)");
let context = {}
console.log(JSON.stringify(test));
// console.log(evalLisp(test,context));
test_eval = evalLisp(test, context);
console.log(test_eval);
exit();

// jo = {"type":"apply","fun":{"type":"var","name":"a"},"args":[{"type":"var","name":"b"},{"type":"var","name":"c"}]};
// console.log(JSON.stringify(jo) == JSON.stringify(test));