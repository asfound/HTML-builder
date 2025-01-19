const { join } = require('node:path');
const fsPromises = require('node:fs/promises');

const folderPath = join(__dirname, 'files');
const copyPath = join(__dirname, 'files-copy');

const copyFile = async (file) => {
  const filePath = join(folderPath, file.name);
  const copyFilePath = join(copyPath, file.name);
  try {
    await fsPromises.copyFile(filePath, copyFilePath);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

async function copyDir() {
  try {
    await fsPromises.rm(copyPath, { recursive: true, force: true });
    await fsPromises.mkdir(copyPath, { recursive: true });
    const files = await fsPromises.readdir(folderPath, { withFileTypes: true });
    const promises = files.map(copyFile);

    await Promise.all(promises);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

copyDir();
