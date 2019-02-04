var replace = require('replace-in-file');
var moment = require('moment');

var time = moment();
var time_format = time.format('YYYY-MM-DD HH:mm:ss Z');

var buildTimestamp = time_format;

var commitHash = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString().trim()

var env = 'dev';

if(process.argv.length >=3){
  env = process.argv[2];
}

var replace_options = {
  files: './src/environments/environment.' + env + '.ts',
  from: /buildTimestamp: '(.*)'/g,
  to: "buildTimestamp: '" + buildTimestamp + "'",
  allowEmptyPaths: false,
};

function updateConfig( key, value) {
  var r = /: '(.*)'/;
  var key_regex = RegExp(key + r.source, 'g');
  replace_options.from = key_regex;
  replace_options.to = key + ": '" + value + "'";

  console.log('Setting ' + key + ' for ' + env + ': ' + value);

  var updated = replace.sync(replace_options);

  if (updated == 0) {
    console.log(key + ' not updated!');
  } else {
    console.log('Done setting ' + key + ':' + value);
  }
}

try {
  updateConfig('buildTimestamp', buildTimestamp);
  updateConfig('commitHash', commitHash);
} catch (error) {
  console.error('Error occurred:', error);
  throw error
}
