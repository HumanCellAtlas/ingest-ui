var replace = require('replace-in-file');
var package = require("./package.json");
var buildVersion = package.version;

var env = 'dev';

if(process.argv.length >=3){
  env = process.argv[2];
}

const options = {
  files: './src/environments/environment.' + env + '.ts',
  from: /version: '(.*)'/g,
  to: "version: '" + buildVersion + "'",
  allowEmptyPaths: false,
};

try {
  var changedFiles = replace.sync(options);
  if (changedFiles == 0) {
    throw "Please make sure that file '" + options.files + "' has \"version: ''\"";
  }
  console.log('Build version set: ' + buildVersion);
}
catch (error) {
  console.error('Error occurred:', error);
  throw error
}
