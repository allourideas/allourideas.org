import fs from 'fs';
import path from 'path';
import tar from 'tar';
import os from 'os';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const repackPackage = async () => {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Create a safe package name that can be used in file paths
    const safePackageName = packageJson.name.replace('/', '-').replace('@', '');
    const packageName = `${safePackageName}-${packageJson.version}.tgz`;

    // Create temporary directories
    const tmpDir = path.join(os.tmpdir(), `pck${Math.floor(Math.random() * 10000)}`);
    const newDir = path.join(tmpDir, 'package');
    fs.mkdirSync(newDir, { recursive: true });

    // Extract the original package
    await promisify(tar.x)({ file: packageName, C: tmpDir });

    // Function to recursively move files
    const moveAndRemove = (srcPath, destPath) => {
        const entries = fs.readdirSync(srcPath, { withFileTypes: true });
        entries.forEach(entry => {
            const srcEntryPath = path.join(srcPath, entry.name);
            const destEntryPath = path.join(destPath, entry.name);

            if (entry.isDirectory()) {
                fs.mkdirSync(destEntryPath, { recursive: true });
                moveAndRemove(srcEntryPath, destEntryPath);
            } else {
                fs.renameSync(srcEntryPath, destEntryPath);
            }
        });

        // Remove the source directory after moving its contents
        fs.rmSync(srcPath, { recursive: true, force: true });
    };

    // Move files from 'ts-out' and 'src' directories to 'new-folder'
    moveAndRemove(path.join(tmpDir, 'package', 'ts-out'), newDir);

    // Create a new tarball from 'new-folder'
    const newPackageName = path.join(tmpDir, `${safePackageName}-${packageJson.version}.tgz`);
    await promisify(tar.c)(
        {
            gzip: true,
            file: newPackageName,
            C: tmpDir,
        },
        ['package']
    );

    // Replace the original package with the new one
    //fs.renameSync(newPackageName, path.join(__dirname, packageName));

    // Clean up the temporary directory
    //fs.rmSync(tmpDir, { recursive: true, force: true });

    console.log('Package repacked.');
    console.log(`New tarball: ${newPackageName.replace("-new", "")}`);
};

repackPackage().catch(console.error);
