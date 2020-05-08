# Documentation for Next

## Special Forms

### do

Program reference point

Usage:
```
do(programm)
```

Example:

```
do(print("Hello Next"))

```

### define

Variable declaration

Arguments:

name: Type - word

value: Type - string, number, function, function result

Usage:
```
define(name, value)

```
Example:
```
do(define(test, "Hello Next"),
   print(test)
)
```

### if

Condition statement

Usage:
```
if(condition, if true, if false)
```

Example:
```
do(define(x, 10),
   if(>(x, 5),
      print("True"),
      print("False")))
```

### while

Cyclical program execution

Usage:
```
while(condition, programm)
```

Example:
```
do(define(total, 0),
	define(count, 1),
	while(<(count, 11),
		do(define(total, +(total, count)),
			define(count, +(count, 1)))),
	print(total))
```

### fun

Create function

Usage:
```
fun(args, programm)
```

Example:
```
do(define(sum, fun(num, +(num, 1))),
	print(sum(10)))
```

### set 

Overwrite variable value

Usage:
```
set(name, value)
```

Example:
```
do(define(test, "Hello"),
	print(test),
	set(test, "Hello Next"),
	print(test))
```

## Environment

### +, -, *, / == <, >

Base operators

Usage:
```
operator(args)
```

Example:
```
+(2,2)
```

### array

Usage:
```
array(values)
```

Example:
```
do(define(array, array(1, 2, 3)))
```

### length

Get length of array

Usage:
```
length(array)
```

Example:
```
do(define(array, array(1, 2, 3)),
print(length(array)))
```

### element

Get element from array

Usage:
```
element(array, index)
```

### print

Print value

Usage:
```
print(value)
```

### eval

Evaluate JavaScript Code

Usage:
```
eval(JSCode)
```

### fs.readFile

Usage:
```
fs.readFile(file, encoding)
```

### fs.writeFile

Usage:
```
fs.writeFile(file, value)
```

### fs.appendFile

Usage:
```
fs.appendFile(file, value)
```

### fs.deleteFile

Usage:
```
fs.deleteFile(file)
```