var dict = require('./lib/worddict');

dict.makeDictionary('data/dict', function(err, dictionary) {
	console.log('Dictionary loaded');
	console.log('pineapple exists? '+dictionary.findWord('pineapple'));
	var nearby = dictionary.nearbyWords('pine');
	console.log('words close to pine: '+nearby);
});
