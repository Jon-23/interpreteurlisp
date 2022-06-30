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

test = read("( a b c)");
console.log(JSON.stringify(test));
jo = {"type":"apply","fun":{"type":"var","name":"a"},"args":[{"type":"var","name":"b"},{"type":"var","name":"c"}]};
console.log(JSON.stringify(jo) == JSON.stringify(test));