// http://codercareer.blogspot.com/2011/10/no-15-fibonacci-sequences.html

/*
* Problem: Please implement a function which returns the nth number in Fibonacci
* sequences with an input n. Fibonacci sequence is defined as:
*/

var FibProgram = (function() {

	var memory = [0,1,1];

	var get = function(i) {
		if (memory[i] === undefined) {
			memory[i] = get(i-1)+get(i-2);
		}
		return memory[i];
	};

	return {
		"get" : get
	};

}());

for (var i=0; i<1000; i+=1) {
	console.log(i+": "+FibProgram.get(i));
}