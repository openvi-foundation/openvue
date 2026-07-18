import fs from 'fs';
import path from 'path';
import { removeBuild, resolvePath, updatePackageJson } from '../../../scripts/build-helper.mjs';

removeBuild(import.meta.url);

const { __dirname, __workspace } = resolvePath(import.meta.url);
const packageJsonPath = path.resolve(__dirname, '../package.json');

updatePackageJson(packageJsonPath);

// The shared helper syncs engines from the workspace root, but this CLI ships an ES2022 ESM bundle.
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

pkg.engines = { node: '>=18.0.0' };
fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 4) + '\n');

fs.copyFileSync(path.resolve(__workspace, 'LICENSE.md'), path.resolve(__dirname, '../LICENSE.md'));
