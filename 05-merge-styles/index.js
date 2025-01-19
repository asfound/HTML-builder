const { join, extname } = require('node:path');
const fsPromises = require('node:fs/promises');
const os = require('node:os');

const stylesPath = join(__dirname, 'styles');
const bundlePath = join(__dirname, 'project-dist', 'bundle.css');

async function getFiles(dir) {
  const files = await fsPromises.readdir(dir, { withFileTypes: true });
  const cssFiles = files
    .filter((file) => file.isFile() && extname(file.name) === '.css')
    .map((file) => join(dir, file.name));
  return cssFiles;
}

async function readFiles(files) {
  return Promise.all(files.map((file) => fsPromises.readFile(file, 'utf-8')));
}

async function writeStylesBundle(path, content) {
  await fsPromises.writeFile(path, content.join(os.EOL));
}

async function mergeStyles() {
  try {
    const stylesFiles = await getFiles(stylesPath);
    const styles = await readFiles(stylesFiles);

    await writeStylesBundle(bundlePath, styles);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

mergeStyles();
