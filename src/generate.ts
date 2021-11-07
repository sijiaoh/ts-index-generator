import fs from 'fs';
import {EOL} from 'os';
import path from 'path';

const mark = 'ts-index-generator';
const excludes = ['.test.'];

export const generate = (filePath: string) => {
  const indexTs = 'index.ts';
  if (path.basename(filePath) !== indexTs) return;

  const file = fs.readFileSync(filePath).toString();
  const firstLine = file.split(EOL)[0];
  if (!firstLine?.includes(mark)) return;

  const dirName = path.dirname(filePath);
  const dirFileNames = fs.readdirSync(dirName);

  const exportFileNames = dirFileNames
    .filter(dirFileName => {
      const isExcludeFile = excludes.some(exclude =>
        dirFileName.includes(exclude)
      );
      return !isExcludeFile;
    })
    .filter(dirFileName => dirFileName !== indexTs)
    .filter(dirFileName => {
      const dirFilePath = path.join(dirName, dirFileName);
      const stat = fs.statSync(dirFilePath);
      if (stat.isDirectory()) {
        try {
          fs.statSync(path.join(dirFilePath, indexTs));
          return true;
        } catch {
          return false;
        }
      }
      return dirFileName.endsWith('.ts') || dirFileName.endsWith('.tsx');
    });

  const fileBody = exportFileNames
    .map(exportFileName =>
      path.basename(exportFileName, path.extname(exportFileName))
    )
    .map(exportBaseName => `export * from './${exportBaseName}';`)
    .join(EOL);

  const newFile =
    [firstLine, '/* eslint-disable */', '// prettier-ignore', fileBody].join(
      EOL
    ) + EOL;
  return newFile;
};
