function _eval(expr, ctx) {
	switch(expr.type) {
		case "num":
			return expr;
		case "string":
			return expr;
		case "var":
			return ctx[expr.name];
		case "apply": {
			const f = _eval(expr.fun, ctx);
			return apply(f, expr.args, ctx);
		}
	}
	
	function apply(expr, args, ctx){
		switch (expr.type) {
			case "intern":
				const mapEval = args.map(arg => _eval(arg, ctx));
				return expr(...mapEval);
			case "lambda":
				return args.map(arg => _eval(arg, ctx));
			case "special":
				return expr(args, ctx);
		}
	}
	
}

module.exports._eval = _eval;