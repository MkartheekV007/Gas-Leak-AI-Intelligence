const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') {
        if (dirFile.endsWith('.jsx')) filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace bg-white/X with responsive dark:bg-white/X bg-black/X
  content = content.replace(/hover:bg-white\/5/g, 'hover:bg-black/5 dark:hover:bg-white/5');
  content = content.replace(/(?<!hover:)bg-white\/5/g, 'bg-black/5 dark:bg-white/5');
  
  content = content.replace(/hover:bg-white\/10/g, 'hover:bg-black/10 dark:hover:bg-white/10');
  content = content.replace(/(?<!hover:)bg-white\/10/g, 'bg-black/10 dark:bg-white/10');

  content = content.replace(/even:bg-white\/\\[0\.02\\]/g, 'even:bg-black/[0.02] dark:even:bg-white/[0.02]');
  
  content = content.replace(/border-white\/5/g, 'border-black/5 dark:border-white/5');
  content = content.replace(/border-white\/10/g, 'border-black/10 dark:border-white/10');
  content = content.replace(/border-white\/20/g, 'border-black/20 dark:border-white/20');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', file);
  }
});
