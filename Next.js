/*
Next - new programming language, written of JS.
Fast and reliable
(C)2021, li0ard
*/
const fs = require("fs");
var readlineSync = require('readline-sync');
var debug = false

function parseExpression(program) {
	program = skipSpace(program);
	var match, expr;
	if (match = /^"([^"]*)"/.exec(program))
		expr = {type: "value", value: match[1]};
	else if (match = /^\d+\b/.exec(program))
		expr = {type: "value", value: Number(match[0])};
	else if (match = /^[^\s(),"]+/.exec(program))
		expr = {type: "word", name: match[0]};
	else
		throw new SyntaxError("Unexpected syntax: " + program);

	return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(string) {
	var skip = string.match(/(?:\s*(?:#.*\n)?)*/);
	return string.slice(skip[0].length);
}

function parseApply(expr, program) {
	program = skipSpace(program);
	if (program[0] != "(")
		return {expr: expr, rest: program};

	program = skipSpace(program.slice(1));
	expr = {type: "apply", operator: expr, args: []};
	while (program[0] != ")") {
		var arg = parseExpression(program);
		expr.args.push(arg.expr);
		program = skipSpace(arg.rest);
		if (program[0] == ",")
			program = skipSpace(program.slice(1));
		else if (program[0] != ")")
			throw new SyntaxError("Expected ',' or ')'");
	}
	return parseApply(expr, program.slice(1));
}
function parse(program) {
	var result = parseExpression(program);
	if (skipSpace(result.rest).length > 0)
		throw new SyntaxError("Unexpected text after program");
	return result.expr;
}

function evaluate(expr, env) {
	switch(expr.type) {
		case "value":
			return expr.value;

		case "word":
			if (expr.name in env)
				return env[expr.name];
			else
				throw new ReferenceError("Undefined variable: " +
																 expr.name);
		case "apply":
			if (expr.operator.type == "word" &&
					expr.operator.name in specialForms)
				return specialForms[expr.operator.name](expr.args,
																								env);
			var op = evaluate(expr.operator, env);
			if (typeof op != "function")
				throw new TypeError("The app is not a function.");
			return op.apply(null, expr.args.map(function(arg) {
				return evaluate(arg, env);
			}));
	}
}

var specialForms = Object.create(null);

specialForms["if"] = function(args, env) {
	if (args.length != 3)
		throw new SyntaxError("Incorrect number of arguments for 'if'");

	if (evaluate(args[0], env) !== false)
		return evaluate(args[1], env);
	else
		return evaluate(args[2], env);
};

specialForms["while"] = function(args, env) {
	if (args.length != 2)
		throw new SyntaxError("Incorrect number of arguments for 'while'");

	while (evaluate(args[0], env) !== false)
		evaluate(args[1], env);
	return false;
};

specialForms["do"] = function(args, env) {
	var value = false;
	args.forEach(function(arg) {
		value = evaluate(arg, env);
	});
	return value;
};

specialForms["define"] = function(args, env) {
	if (args.length != 2 || args[0].type != "word")
		throw new SyntaxError("Bad use of 'define'");
	var value = evaluate(args[1], env);
	env[args[0].name] = value;
	return value;
};

var topEnv = Object.create(null);

topEnv["true"] = true;
topEnv["false"] = false;
topEnv["null"] = null;
topEnv["undefined"] = undefined;
topEnv["Math.PI"] = 3.141592653589793;
topEnv["Math.E"] = 2.718281828459045;
topEnv["Math.LN10"] = 2.302585092994046;
topEnv["Math.LN2"] = 0.6931471805599453;
topEnv["Math.LOG10E"] = 0.4342944819032518;
topEnv["Math.LOG2E"] = 1.4426950408889634;
topEnv["Math.SQRT1_2"] = 0.7071067811865476;
topEnv["Math.SQRT2"] = 1.4142135623730951;

["+", "-", "*", "/", "==", "<", ">", "%", "<=", ">="].forEach(function(op) {
	topEnv[op] = new Function("a, b", "return a " + op + " b;");
});

topEnv["println"] = function(value) {
	console.log(value);
	return value;
};
topEnv["print"] = function(value) {
	process.stdout.write(String(value));
	return value;
};
topEnv["input"] = function(message) {
	return readlineSync.question(message);
}

topEnv["array"] = function() {
	return Array.prototype.slice.call(arguments, 0);
};

topEnv["length"] = function(array) {
	return array.length;
};

topEnv["element"] = function(array, i) {
	return array[i];
}

specialForms["set"] = function(args, env) {
	if (args.length != 2 || args[0].type != "word")
		throw new SyntaxError("Bad use of 'set'");

	var value = evaluate(args[1], env);

	if (Object.prototype.hasOwnProperty.call(env, args[0].name))
		env[args[0].name] = value;
	else if (Object.prototype.hasOwnProperty.call(Object.getPrototypeOf(env), args[0].name))
		Object.getPrototypeOf(env)[args[0].name] = value;
	else
		throw new ReferenceError("Variable " + args[0].name + " not defined");

	return value;
};

topEnv["eval"] = function(code) { //Eval JS Code
	return eval(code)
};

["abs", "acos", "asin", "atan", "ceil", "cos", "floor", "log10", "round", "sin", "sqrt", "tan"].forEach(function(op) {
	topEnv[op] = new Function("a", "return Math." + op + "(a);");
});

topEnv["clip"] = function(x, min, max) {
	return Math.min(Math.max(x, min), max);
}
topEnv["isFinite"] = function(num) {
	return isFinite(num)
}
topEnv["isNaN"] = function(num) {
	return isNaN(num)
}
topEnv["min"] = function(x, y) {
	return Math.min(x, y);
}
topEnv["max"] = function(x, y) {
	return Math.max(x, y);
}
topEnv["pow"] = function(x, y) {
	return Math.pow(x, y);
}
topEnv["square"] = function(num) {
	return Math.pow(num, 2)
}
topEnv["rad2deg"] = function(rads) {
	return rads * (180/Math.PI)
}
topEnv["deg2rad"] = function(degs) {
	return degs * Math.PI / 180
}
topEnv["num2str"] = function(num) {
	return num.toString()
}

function run() {
	var env = Object.create(topEnv);
	var program = Array.prototype.slice
		.call(arguments, 0).join("\n");
	if(debug) {
		console.log(JSON.stringify(parse(program)))
	}
	return evaluate(parse(program), env);
}

specialForms["fun"] = function(args, env) {
	if (!args.length)
		throw new SyntaxError("Function need a body");
	function name(expr) {
		if (expr.type != "word")
			throw new SyntaxError("Argument names must be of type 'word'");
		return expr.name;
	}
	var argNames = args.slice(0, args.length - 1).map(name);
	var body = args[args.length - 1];

	return function() {
		if (arguments.length != argNames.length)
			throw new TypeError("Incorrect number of arguments");
		var localEnv = Object.create(env);
		for (var i = 0; i < arguments.length; i++)
			localEnv[argNames[i]] = arguments[i];
		return evaluate(body, localEnv);
	};
};

var path = require("path");
let inputProgramm = process.argv[2];

if(path.extname(inputProgramm) == ".next") {
	run(fs.readFileSync(inputProgramm, "utf8"));
} else {
	throw new TypeError("Unknown input file type")
}