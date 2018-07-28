let fs = require('fs');
let UglifyJS = require('uglify-es');

module.exports = function(filePath) {
  let code = fs.readFileSync(filePath, 'utf-8');
  let result = UglifyJS.minify(code);
  if (result.error) return '';
  return result.code;
};
