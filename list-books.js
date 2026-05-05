const fs = require('fs');
const dirs = fs.readdirSync('data/books');
dirs.forEach(d => {
  const mp = 'data/books/' + d + '/metadata.json';
  if (fs.existsSync(mp)) {
    const m = JSON.parse(fs.readFileSync(mp));
    console.log(d + '|' + m.originalFileName + '|' + m.totalPages + '|' + (m.createdAt || 'N/A'));
  }
});
