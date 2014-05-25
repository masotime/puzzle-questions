// facebook template

process.stdin.resume();
process.stdin.setEncoding("ascii");
var input = "";

process.stdin.on("data", function (chunk) {
    input += chunk;
});

process.stdin.on("end", function () {
	// try to analyze the lines
	var lines = input.split('\n');
	var count = lines[0];
	var sequence = lines[1].split(' ');

	sequence.forEach(function(elem, idx) {
		sequence[idx] = parseInt(elem);
	})

	// i have to assume that the first term is always correct
	var last = sequence[count-1];
	var first = sequence[0];
	var increment = (last - first) / count;
	// console.log('the increment is '+increment);

	// simple analysis
	var ptr = 0;
	while (sequence[ptr] + increment === sequence[ptr+1] && ptr < count-1) {
		// console.log('expected '+(sequence[ptr] + increment)+', actual '+sequence[ptr+1]);
		ptr+=1;
	}

	// at this point, there might be a gap. or the last element is missing
	if (sequence[ptr] + increment*2 !== sequence[ptr+1]) {
		// new difference
		increment = sequence[ptr+1]-sequence[ptr];
		console.log(last+increment);
	} else {
		console.log(sequence[ptr] + increment);	
	}
	

});
