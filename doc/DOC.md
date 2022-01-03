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
do(
	print("Hello Next")
)

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
do(
	define(test, "Hello Next"),
	println(test)
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
do(
	define(x, 10),
	if(>(x, 5),
		println("True"),
		println("False")
	)
)
```

### while

Cyclical program execution

Usage:
```
while(condition, programm)
```

Example:
```
do(
	define(total, 0),
	define(count, 1),
	while(<(count, 11),
		do(define(total, +(total, count)),
			define(count, +(count, 1)))),
	println(total)
)
```

### fun

Create function

Usage:
```
fun(args, programm)
```

Example:
```
do(
	define(sum, fun(num, +(num, 1))),
	print(sum(10))
)
```

### set 

Overwrite variable value

Usage:
```
set(name, value)
```

Example:
```
do(
	define(test, "Hello"),
	println(test),
	set(test, "Hello Next"),
	println(test)
)
```

## Environment

### array

Usage:
```
array(values)
```

Example:
```
do(
	define(array, array(1, 2, 3))
)
```

### length

Get length of array

Usage:
```
length(array)
```

Example:
```
do(
	define(array, array(1, 2, 3)),
	println(length(array))
)
```

### element

Get element from array

Usage:
```
element(array, index)
```

Example:
```
do(
	define(array, array(1, 2, 3)),
	println(element(array, 0))
)
```

### print

Print value (without \n)

Usage:
```
print(value)
```

### println

Print value (with \n)

Usage:
```
println(value)
```

### eval

Evaluate JavaScript Code

Usage:
```
eval(JSCode)
```

### fs.readFile

Read file

Usage:
```
fs.readFile(file, encoding)
```

### fs.writeFile

Re-write file

Usage:
```
fs.writeFile(file, value)
```

### fs.appendFile

Write file (without re-write)

Usage:
```
fs.appendFile(file, value)
```

### fs.deleteFile

Delete File

Usage:
```
fs.deleteFile(file)
```

## Math

### Constants
```
Math.PI # = 3.141592653589793
Math.E # = 2.718281828459045
Math.LN10 # = 2.302585092994046
Math.LN2 # = 0.6931471805599453
Math.LOG10E # = 0.4342944819032518
Math.LOG2E # = 1.4426950408889634
Math.SQRT1_2 # = 0.7071067811865476
Math.SQRT2 # = 1.4142135623730951
```

### Base operators
List: `+, -, *, / == <, >, %, <=, >=`

Usage:
```
operator(args)
```

Example:
```
+(2,2)
```

### Functions

### abs

Returns the absolute value of a numbe

Usage:
```
abs(num)
```

### acos

Returns the arccosine (in radians) of a number

Usage:
```
acos(num)
```

### asin

Returns the arcsine (in radians) of a number

Usage:
```
asin(num)
```

### atan

Returns the arctangent (in radians) of a number

Usage:
```
atan(num)
```

### ceil

Function always rounds a number up to the next largest integer.

Usage:
```
ceil(num)
```

### cos

Returns the cosinus (in radians) of a number

Usage:
```
cos(num)
```

### isFinite

Function determines whether the passed value is a finite number.

Usage:
```
isFinite(num)
```

### isNaN

Function determines whether a value is NaN or not

Usage:
```
isNaN(num)
```

### log10

Function returns the base 10 logarithm of a number

Usage:
```
log10(num)
```

### min

Returns the lowest-valued number passed into it, or NaN

Usage:
```
min(x, y)
```

### max

Returns the largest-valued number passed into it, or NaN

Usage:
```
max(x,y)
```

### pow

Function returns the base to the exponent power, as in base^exponent

Usage:
```
pow(base, exponent)
```

### round

Returns the value of a number rounded to the nearest integer.

Usage:
```
round(num)
```

### sin

Returns the sine of a number.

Usage:
```
sin(num)
```

### square

Return the square of a number

Usage:
```
square(num) or pow(num, 2)
```

### sqrt

Returns the square root of a number

Usage:
```
sqrt(num)
```

### tan

Returns the tangent of a number.

Usage:
```
tan(num)
```