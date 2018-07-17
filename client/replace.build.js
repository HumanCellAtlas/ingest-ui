var replace = require('replace-in-file');
var moment = require('moment');

var time = moment();
var time_format = time.format('YYYY-MM-DD HH:mm:ss Z');

var buildTimestamp = time_format;

var env = 'dev';

if(process.argv.length >=3){
  env = process.argv[2];
}

const options = {
  files: './src/environments/environment.' + env + '.ts',
  from: /buildTimestamp: '(.*)'/g,
  to: "buildTimestamp: '" + buildTimestamp + "'",
  allowEmptyPaths: false,
};

try {
  console.log('Setting build timestamp for ' + env + ': ' + time_format);

  var changedFiles = replace.sync(options);

  if (changedFiles == 0) {
    throw "Please make sure that file '" + options.files + "' has \"buildTimestamp: ''\"";
  }
  console.log('Build timestamp set: ' + buildTimestamp);
}
catch (error) {
  console.error('Error occurred:', error);
  throw error
}
