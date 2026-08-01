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
  let modified = false;

  // Find all <img> tags
  const imgRegex = /<img\s+([^>]+)>/g;
  
  content = content.replace(imgRegex, (match, attrs) => {
    let newAttrs = attrs;
    
    if (!newAttrs.includes('referrerPolicy')) {
      newAttrs += ' referrerPolicy="no-referrer"';
    }
    if (!newAttrs.includes('decoding')) {
      newAttrs += ' decoding="async"';
    }
    if (!newAttrs.includes('loading') && !file.includes('Hero.tsx')) {
      newAttrs += ' loading="lazy"';
    }
    
    // Check if unsplash URL and missing auto=format&fit=crop&q=80
    // Actually, it's safer to just add the attributes.
    
    return `<img ${newAttrs}>`;
  });

  if (content !== fs.readFileSync(file, 'utf8')) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
