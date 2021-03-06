// If we list all the natural numbers below 10 that are multiples of 3 or 5, we get 3, 5, 6 and 9. 
// The sum of these multiples is 23.

// Find the sum of all the multiples of 3 or 5 below 1000.

var sum = 0;
var i;
var limit = 1000;

for (i=1;i*3<limit;i++) {
	sum+=i*3;
}

for (i=1;i*5<limit;i++) {
	sum+=i*5;
}

for (i=1;i*15<limit;i++) {
	sum-=i*5*3;
}

console.log(sum);