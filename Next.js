/*
Next - new programming language.
Next written of JS
(C)2020 NickProgramm & 3peekawOwD
*/
#!/usr/bin/env node
const fs = require("fs");
const readline = require('readline');

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

topEnv["true"] = true; // → true
topEnv["false"] = false; // → false

["+", "-", "*", "/", "==", "<", ">"].forEach(function(op) {
  topEnv[op] = new Function("a, b", "return a " + op + " b;");
});

topEnv["print"] = function(value) {
  console.log(value);
  return value;
};
/*topEnv["input"] = function(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question(message, (answer) => {
    return answer;
    rl.close();
  });
};*/
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

/*topEnv["import"] = function(module) { //[BETA] Import module
  return require(module);
}*/
topEnv["eval"] = function(code) { //Eval JS Code
  return eval(code)
}

//File system, start
topEnv["fs.readFile"] = function(file, encoding) {
  var fileContent = fs.readFileSync(file, encoding);
  return fileContent;
}

topEnv["fs.writeFile"] = function(file, text) {
  fs.writeFileSync(file, text);
}

topEnv["fs.appendFile"] = function(file, text) {
  fs.appendFileSync(file, text);
}

topEnv["fs.deleteFile"] = function(file) {
  fs.unlinkSync(file);
}
//File system, end

function run() {
  var env = Object.create(topEnv);
  var program = Array.prototype.slice
    .call(arguments, 0).join("\n");
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

/*run("do(define(total, 0),",
    "   define(count, 1),",
    "   while(<(count, 11),",
    "         do(define(total, +(total, count)),",
    "            define(count, +(count, 1)))),",
    "   print(total))");*/
/*run("do(define(file, \"pppoe.txt\"),",
    "   define(encoding, \"utf8\"),",
    "   define(fileContent, readFile(file, encoding)),",
    "   print(fileContent))");*/
var path = require("path");
let inputProgramm = process.argv[2];
//Version
if(inputProgramm == "-v" || inputProgramm == "--version") {
  console.log("Next. Version 1.0.3")
}
//Log mode
else if(inputProgramm == "-l" || inputProgramm == "--log") {
  if(path.extname(process.argv[3]) == ".next") {
    console.log("Parser:");
    console.log(parse(fs.readFileSync(process.argv[3], "utf8")))
    console.log("Programm:")
    run(fs.readFileSync(process.argv[3], "utf8"));
  } else {
    throw new TypeError("Unknown input file type")
  }
}
//Standart mode
else {
if(path.extname(inputProgramm) == ".next") {

  run(fs.readFileSync(inputProgramm, "utf8"));
} else {
  throw new TypeError("Unknown input file type")
}
}
//console.log(parse("# hello\nx"));
//console.log(parse("a # one\n    # two\n()"));
