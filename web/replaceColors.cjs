const fs = require('fs');
const path = require('path');
const directory = 'c:/Users/DELL/Desktop/projects/adaktrade/adaktrade/adaktrade/web/src';

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
}

walk(directory, function(err, results) {
  if (err) throw err;
  results.filter(f => f.endsWith('.jsx') || f.endsWith('.css')).forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace hex colors with `#1900fb` and variations
    content = content.replace(/#017DC3/ig, '#1900fb');
    content = content.replace(/#006AA7/ig, '#1100aa');
    content = content.replace(/#141261/ig, '#1900fb');
    content = content.replace(/#1d1b84/ig, '#1900fb');
    
    // Replace rounded-full with rounded-md in classNames that seem to belong to buttons or pads
    content = content.replace(/className=(["'])(.*?)\1/g, function(match, quote, classes) {
      if (classes.includes('px-') || classes.includes('py-') || classes.includes('btn')) {
        return 'className=' + quote + classes.replace(/rounded-full/g, 'rounded-md') + quote;
      }
      return match;
    });

    // Also replace rounded-full inside backticks (template literals for classes)
    content = content.replace(/className=\{`([^`]+)`\}/g, function(match, classes) {
      if (classes.includes('px-') || classes.includes('py-') || classes.includes('btn')) {
        return 'className={`' + classes.replace(/rounded-full/g, 'rounded-md') + '`}';
      }
      return match;
    });
    
    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log('Updated', file);
    }
  });
});
