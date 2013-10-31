// http://codekata.pragprog.com/2007/01/kata_six_anagra.html

/*

A while back we had a thread on the Ruby mailing list about finding anagrams, and I’d like to resurrect it here. The challenge is fairly simple: given a file containing one word per line, print out all the combinations of words that are anagrams; each line in the output contains all the words from the input that are anagrams of each other. For example, your program might include in its output:

  kinship pinkish
  enlist inlets listen silent
  boaster boaters borates
  fresher refresh
  sinks skins
  knits stink
  rots sort
If you run this on the word list here you should find 2,530 sets of anagrams (a total of 5,680 words). Running on a larger dictionary (about 234k words) on my OSX box produces 15,048 sets of anagrams (including all-time favorites such as actaeonidae/donatiaceae, crepitant/pittancer, and (for those readers in Florida) electoral/recollate).

For added programming pleasure, find the longest words that are anagrams, and find the set of anagrams containing the most words (so "parsley players replays sparely" would not win, having only four words in the set).

*/

var rawdict = require('./lib/rawdict');

var anagramHash = {};

var hash = function(word) {
	return word.split('').sort().join('');
}

rawdict.getRawWords('data/dict', function(err, words) {

	// construct the has using the words
	words.forEach(function(word) {

		var key = hash(word);
		if (key in anagramHash) {
			anagramHash[key].push(word);
		} else {
			anagramHash[key] = [word];
		}

	});

	for (key in anagramHash) {
		if (anagramHash[key].length > 9) {
			console.log(anagramHash[key]);
		}
	}

});
