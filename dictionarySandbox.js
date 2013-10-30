// trying to make a hybrid hash / trie dictionary
var fs = require('fs');

var lengthToDict = {}; // mapping of length to each dict

var write = function(str) {
	process.stdout.write(str);
}

var writeln = function(str) {
	process.stdout.write(str+'\n');
}

var loadFile = function(path, callback) {
	writeln('Reading '+path);
	var readStream = fs.createReadStream(path);
	var words = [];
	var prefix = '';

	readStream.on('data', function(data) {
		var lines = data.toString().split('\n');

		// dumdedum
		lines[0] = prefix + lines[0];
		prefix = lines[lines.length-1];
		lines = lines.slice(0, lines.length-1);
		words = words.concat(lines);

	});

	readStream.on('end', function() {
		writeln('finished reading '+path+' for a total of '+words.length+' words');
		callback(null, words);
	});

};

var loadFolder = function(folder, callback) {
	var words = [];

	writeln('Reading folder '+folder);
	fs.readdir(folder, function(err, files) {
		if (err) {
			throw { name: "FolderReadError", message: err.message };
		} else {
			var filecount = files.length + 1;

			var dec = function() {
				filecount-=1;
				if (filecount === 0) {
					writeln('Finished reading folder '+folder);
					callback(null, words);
				}
			};

			files.forEach(function(file) {
				loadFile(folder+'/'+file, function(err, filewords) {
					words = words.concat(filewords);
					dec();
				});
			});

			dec();
		};

	});

};

var distance = function(source, target) {
	var result = 0, i;

	if (source.length !== target.length) {
		return 9999999;
	}

	for (i=0; i<source.length; i++) {
		(source[i] === target[i]) || (result+=1);
	}

	return result;
}

var getDictFor = function(word) {

	var wordLength = word.length;
	if (!(wordLength in lengthToDict)) {
		lengthToDict[wordLength] = {};
	}

	return lengthToDict[wordLength];

}

var letters = "abcdefghijklmnopqrstuvwxyz";

var addToDict = function(word) {

	var dict = getDictFor(word);

	if (word in dict) {
		// wasting time
		return;
	}

	var wordEntry = { "word": word, "nearby": []};
	dict[word] = wordEntry;

	// test all 1-distance permutations of a word
	var letterIndex;
	for (letterIndex=0; letterIndex < word.length; letterIndex++) {
		var actualLetter = word[letterIndex];
		var permuteIndex;
		for (permuteIndex=0; permuteIndex<letters.length;permuteIndex++) {
			var permuteLetter = letters[permuteIndex];
			if (permuteLetter !== actualLetter) {
				var testWord = word.slice(0,letterIndex)+permuteLetter+word.slice(letterIndex+1);
				if (testWord in dict) {
					// double sided adding. note that we are adding pointers
					dict[testWord]["nearby"].push(wordEntry);
					wordEntry["nearby"].push(dict[testWord]);
				};
			};
		};
	};
}

loadFolder('data/dict', function(err, words) {
	// load each word into the dictionary
	var total = words.length;
	console.log('there are '+total+' words');
	var lastUpdate = "";

	words.forEach(function(word, idx) {
		// write('.');
		var percentage = Math.floor(idx/total*100);
		if (percentage % 5 ===0 && lastUpdate !== percentage.toString()) {
			write(Math.floor(idx/total*100)+"%");
			lastUpdate = percentage.toString();
		}

		addToDict(word);
	});

	// show every word
	for (wordLength in lengthToDict) {
		writeln('words of length '+wordLength);
		var dict = lengthToDict[wordLength];
		for (word in dict) {
			write(word+" : nearby are ");
			dict[word].nearby.forEach(function(wordEntry) {
				write(wordEntry.word+' ');
			});
			writeln('');
		};
	};

});


