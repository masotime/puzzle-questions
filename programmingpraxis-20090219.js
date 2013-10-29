// http://programmingpraxis.com/2009/02/19/sieve-of-eratosthenes/

/*
The Sieve of Eratosthenes starts by making a list of all the numbers up to a desired maximum; we’ll illustrate the method by calculating the prime numbers through thirty:

2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30

Now take the first number on the list, 2, and cross off every second number:

2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30

(Although it may not be obvious, the number 4 is crossed off the list; in some fonts, the cross-bar of the 4 coincides with the strike-through bar.) Next, take the next number on the list that isn’t crossed off, 3, and cross off every third number; some of them have already been crossed off:

2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30

Repeat that last step for the next un-crossed number on the list, 5:

2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30

And so on, each time crossing off all multiples of the next un-crossed number on the list. The list of prime numbers are all those that haven’t been crossed off:

2 3 5 7 11 13 17 19 23 29

This method is called a sieve because it sweeps through a range of numbers, with each prime number, as it is discovered, blocking all its multiples from falling through as prime numbers. The sieve admits several optimizations. First, only odd numbers are considered, since the initial sifting crosses off all the even numbers except 2, which is handled separately. Second, crossing off starts at the square of the number being sifted, since all smaller primes have already been crossed off by previous steps of the sieve; for instance, sifting by 3 starts at 9, since 6 was already crossed off when sifting by 2. Third, sifting stops at the square root of the maximum number in the sieve, since any non-primes larger than the square root must have already been crossed off at previous levels of the sieve; thus, in the above example there is no need to sieve on the prime number 7, or any larger prime number, since the square of 7 is greater than 30, which is the largest number in the list.

Write a function that takes a single argument n and returns a list of prime numbers less than or equal to n using the optimized sieving algorithm described above. Apply the function to the argument 15485863 and count the number of primes returned.

*/

console.log('Enter the limit, followed by Ctrl-D');
process.stdin.resume();
process.stdin.setEncoding("ascii");
var input = "";
process.stdin.on("data", function (chunk) {
    input += chunk;
});

// seems to need a lot of memory. I can't find a way of doing this without keeping
// track of lots of numbers

process.stdin.on("end", function () {
	var lines = input.split('\n');
	var start = 2;
	var limit = parseInt(lines[0]);
	var stop = Math.sqrt(limit);
	var isPrime = [];
	var idx;
	var counter;
	var intToRemove;

	// initialize the sieve (lots and lots of memory)
	isPrime[2] = true;
	for (idx = start+1; idx <= limit; idx+=1) {
		isPrime[idx] = (idx % 2 != 0);
	}

	// For a given prime P, and a multiple P * N, and a limit K, cross out multiples where
	// P <= N <= SQRT(K)
	var P, N, K = limit;
	for (counter = start+1; counter <= stop; counter+=2) { // only test odd numbers
		if (isPrime[counter]) {
			P = counter;
		} else {
			continue;
		}

		N = P;
		while (P * N <= K) {
			isPrime[P*N] = false;
			N=N+1;
		}
	}

	// finally print out the numbers
	var primeCount = 0;
	for (idx = start; idx <= limit; idx++) {
		if (isPrime[idx]) {
			// process.stdout.write(idx+" ");
			primeCount+=1;
		}
	}

	console.log("");
	console.log("Total number of primes: "+primeCount);
});

