const { join, parse } = require('node:path');
const { readdir, stat } = require('node:fs/promises');

const folderPath = join(__dirname, 'secret-folder');

const displayInfo = async (file) => {
  const filePath = join(folderPath, file.name);
  const stats = await stat(filePath);

  const { name, ext } = parse(file.name);
  console.log(`${name} - ${ext.slice(1)} - ${stats.size}B`);
};

(async () => {
  try {
    const files = await readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        await displayInfo(file);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
