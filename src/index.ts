#!/usr/bin/env node

import fs from 'fs';
import {program} from 'commander';
import {generate} from './generate';

program.argument('<files...>').action((files: string[]) => {
  files.forEach(filePath => {
    const newFile = generate(filePath);
    if (newFile) {
      const currentFile = fs.readFileSync(filePath).toString();
      if (newFile !== currentFile) fs.writeFileSync(filePath, newFile);
    }
  });
});

program.parse();
