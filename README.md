Utility functions

utility functions that help you by having to write less.
A lot of these are inspired by p5.js but luckily here you don't have to use them in the setup or draw functions

`map(val, start1, stop1, start2, stop2)`  
works the same as in p5.js, maps a value from 1 range to another

`min(a, b)`  
returns smallest of the two

`max(a, b)`  
returns largest of the two

`clamp(val, min, max)`  
returns the clamped value

`inRange(min, max, val)`  
returns true if val is inbetween min and max or on top of them

`rangeContain(a1, a2, b1, b2)`  
returns true if the line a1,a2 totally encapsulates line b1, b2 or is right on top of it

`create2DArray(vector, fill)`  
returns a 2D array filled with some value. vector specifies the size of the 2d array

`getMousePos(canvas, evt)`  
returns the mouse position in vector form relative to the canvas. Also needs the mousedown or mouseup event.

`createCanvasGetContext(x, y, canvasOut)`  
similar to the p5.js version
creates a canvas with the specified size and appends it to the body element.
Also returns the 2Dcontext. canvasOut is optional but the canvas element will be assigned to it.

`random(min, max)`  
same as in p5.js

`randomSpread(center, spread)`  
creates randome values centered at center and with the specified spread

`loop(callback)`
creates a rendering loop using the method requestAnimationFrame so it's faster than setinterVal.
the callback also gets the delta time since last frame passed as a parameter.

`mod(number, modulus)`  
replacements for javascripts % modulo operator.
javascripts % only works with positive values so use this if you also need something that works with negative numbers

`iter(number)`  
iter(ate) is a generator function and is supposed to be used in for...of loops.
so instead of writing `for(var i = 0; i < 10; i++)` you can write `for(var i of iter(10))`.
sadly doesnt save that much typing but atleast it looks a little neater
