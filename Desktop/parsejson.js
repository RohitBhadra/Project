let search = require('./search.json');
let create = require('./create.json');
let update = require('./update.json');
//let sJson = require('./sample.json');

let fs = require("fs");

let resStr = '';

console.log("\n=======================================================SEARCH==============================\n");
parseJson(search,0);
writeToFile('search.csv',resStr);
console.log("\n");

resStr = '';

console.log("\n=======================================================CREATE==============================\n");
parseJson(create,0);
writeToFile('create.csv',resStr);
console.log("\n");

resStr = '';
console.log("\n=======================================================UPDATE==============================\n");
parseJson(update,0);
writeToFile('update.csv',resStr);
console.log("\n");

function writeToFile(fName,content) {
	fs.writeFile(fName, content, function(err) {
		if(err) return console.log(err);
    console.log(fName+ " saved!");
	}); 
}

function parseJson(jsonObj,tabLen) {
	var keys = Object.keys(jsonObj);
	for(var i=0;i<keys.length;i++){
		var key = keys[i];
		var val = jsonObj[key];

		if (key == parseInt(key, 10)) continue;

		let tabs = '';
		let sep = '';
		for(var j=0; j<tabLen; j++) {
			tabs+= "\t";
			sep+= ',';
		}
		console.log(tabs+''+key);
		resStr += (typeof val)+','+sep+key+"\n";

		if(val && typeof val === 'object') {
			let next = val;
			let nextLen = tabLen;
			if(isArray(val) && val[0]) {
				next = val[0];
			}
			nextLen = tabLen+1;
			parseJson(next,nextLen);
		}
	}
}

function isArray(obj){
	return !!obj && obj.constructor === Array;
}

