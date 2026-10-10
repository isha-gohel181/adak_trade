const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/DELL/Desktop/projects/adaktrade/adaktrade/adaktrade/web/src';

const colorMap = {
  '#1900fb': '#047857',
  '#5465FF': '#10b981',
  '#2441d1': '#065f46',
  '#294be8': '#059669',
  '#1d37b5': '#064e3b',
  '#19309c': '#022c22',
  '#2b4ce6': '#10b981',
  '#2535c4': '#064e3b',
  '#1100aa': '#064e3b'
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.css') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(dir);
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  for (const [oldColor, newColor] of Object.entries(colorMap)) {
    const regex = new RegExp(oldColor, 'gi');
    newContent = newContent.replace(regex, newColor);
  }
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
  }
});

console.log("Updated " + changedFiles + " files with new color theme.");
