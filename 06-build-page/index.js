const { join, extname } = require('node:path');
const os = require('node:os');
const fsPromises = require('node:fs/promises');

const projectDir = join(__dirname, 'project-dist');
const stylesDirPath = join(__dirname, 'styles');
const assetsDirPath = join(__dirname, 'assets');
const projectAssetsDir = join(projectDir, 'assets');
const bundlePath = join(projectDir, 'style.css');
const templatePath = join(__dirname, 'template.html');
const htmlPath = join(projectDir, 'index.html');
const componentsDirPath = join(__dirname, 'components');
const tagsRegex = /{{(.*?)}}/g;

async function checkDir(dir) {
  await fsPromises.mkdir(dir, { recursive: true });
}

async function processTemplate() {
  try {
    let templateContent = await fsPromises.readFile(templatePath, 'utf-8');
    const tagsInTemplate = templateContent.match(tagsRegex);

    for (const tag of tagsInTemplate) {
      const componentFileName = `${tag.slice(2, -2)}.html`;
      const componentPath = join(componentsDirPath, componentFileName);
      try {
        const componentContent = await fsPromises.readFile(
          componentPath,
          'utf-8',
        );
        templateContent = templateContent.replace(tag, componentContent);
      } catch (error) {
        console.error('Error:', error.message);
      }
    }

    await fsPromises.writeFile(htmlPath, templateContent);
  } catch (error) {
    console.error('processTemplate Error:', error.message);
  }
}

async function getFiles(dir) {
  const files = await fsPromises.readdir(dir, { withFileTypes: true });
  return files
    .filter((file) => file.isFile() && extname(file.name) === '.css')
    .map((file) => join(dir, file.name));
}

async function readFiles(files) {
  return Promise.all(files.map((file) => fsPromises.readFile(file, 'utf-8')));
}

async function writeStylesBundle(path, content) {
  await fsPromises.writeFile(path, content.join(os.EOL));
}

async function mergeStyles(stylesPath, bundlePath) {
  try {
    const stylesFiles = await getFiles(stylesPath);
    const styles = await readFiles(stylesFiles);

    await writeStylesBundle(bundlePath, styles);
  } catch (error) {
    console.error('mergeStyles Error:', error.message);
  }
}

async function copyDir(folderPath, copyPath) {
  const copyFile = async (file) => {
    const filePath = join(folderPath, file.name);
    const copyFilePath = join(copyPath, file.name);
    try {
      if (file.isDirectory()) {
        await fsPromises.mkdir(copyFilePath, { recursive: true });
        await copyDir(filePath, copyFilePath);
      } else {
        await fsPromises.copyFile(filePath, copyFilePath);
      }
    } catch (error) {
      console.error('copyFile Error:', error.message);
    }
  };
  try {
    await fsPromises.rm(copyPath, { recursive: true, force: true });
    await fsPromises.mkdir(copyPath, { recursive: true });
    const files = await fsPromises.readdir(folderPath, { withFileTypes: true });
    const promises = files.map(copyFile);

    await Promise.all(promises);
  } catch (error) {
    console.error('copyDir Error:', error.message);
  }
}

async function buildProject() {
  try {
    await checkDir(projectDir);
    await processTemplate();
    await mergeStyles(stylesDirPath, bundlePath);
    await copyDir(assetsDirPath, projectAssetsDir);
  } catch (error) {
    console.error('buildProject Error:', error.message);
  }
}

buildProject();
