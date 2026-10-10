const fs = require('fs');
const path = require('path');
const directory = 'c:/Users/DELL/Desktop/projects/adaktrade/adaktrade/adaktrade/admin/src';
const configDir = 'c:/Users/DELL/Desktop/projects/adaktrade/adaktrade/adaktrade/admin';

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

function replaceColorsInFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace hex colors with `#1900fb` and variations
    content = content.replace(/#017DC3/ig, '#1900fb');
    content = content.replace(/#006AA7/ig, '#1100aa');
    content = content.replace(/#141261/ig, '#1900fb');
    content = content.replace(/#1d1b84/ig, '#1900fb');
    
    // Also change "IASDCS" references if any in text, just to be safe, though not strictly colors
    // content = content.replace(/IASDCS/ig, 'ADAK TRADE');
    
    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log('Updated', file);
    }
}

walk(directory, function(err, results) {
  if (err) throw err;
  results.filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.css') || f.endsWith('.jsx') || f.endsWith('.js')).forEach(file => {
    replaceColorsInFile(file);
  });
  
  // Also process tailwind.config.js
  const tailwindPath = path.join(configDir, 'tailwind.config.js');
  if (fs.existsSync(tailwindPath)) {
      replaceColorsInFile(tailwindPath);
  }
});
