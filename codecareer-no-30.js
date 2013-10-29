// http://codercareer.blogspot.com/2012/01/no-30-median-in-stream.html

/*
* Question: How to get the median from a stream of numbers at any time? 
* The median is middle value of numbers. If the count of numbers is even, 
* the median is defined as the average value of the two numbers in middle.
*/

var stream = require('stream');

// var readStream = fs.createReadStream('data/integers.txt');

var streamMaker = function(min, max, interval, cycles) {

	// defensive coding
	min = min || 0;
	max = max || min+10;
	interval = interval || 1000; // 1 sec default
	cycles = cycles || 10; // max 10 repetitions

	// here we go with the pseudostream
	var theStream = stream.PassThrough();
	var cycleCount = 0;
	var nextRandom = function() {
		return (Math.floor(min + Math.random() * (max-min))).toString();
	}

	var writer = function() {
		if (cycleCount < cycles) {
			theStream.write(nextRandom());
			cycleCount += 1;
			loop();
		} else {
			theStream.end();
		}
	}

	var loop = function() {
		setTimeout(writer, interval);
	};

	// start the "stream"
	loop();

	return theStream;
}

var randomStream = streamMaker(0,100,1,10);

randomStream.on('data', function(data) {
	console.log('read chunk ['+data+']');
});

randomStream.on('end', function() {
	console.log('- STREAM ENDED -');
});