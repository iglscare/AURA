import fs from 'fs';
import path from 'path';

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else {
      if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
        filelist.push(filepath);
      }
    }
  });
  return filelist;
};

const files = walkSync('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Fix the broken tags
  // They look like: <img ... / referrerPolicy="no-referrer" decoding="async">
  // Or: <img ... / referrerPolicy="no-referrer" decoding="async" loading="lazy">
  
  const badImgRegex = /<img([\s\S]*?)\/\s*referrerPolicy="no-referrer"([^>]*)>/g;
  
  content = content.replace(badImgRegex, (match, beforeSlash, afterSlash) => {
    // Reconstruct properly
    let newAttrs = beforeSlash + ' referrerPolicy="no-referrer"' + afterSlash;
    // ensure it ends with />
    if (!newAttrs.trim().endsWith('/')) {
      newAttrs += ' /';
    }
    return `<img${newAttrs}>`;
  });

  if (content !== fs.readFileSync(file, 'utf8')) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed ${file}`);
  }
});
