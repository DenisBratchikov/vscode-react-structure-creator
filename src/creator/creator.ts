import * as path from 'path';
import * as fs from 'fs';
import { getComponentData, getStyleData, getInterfaceData, getTestData, getIndexData } from './insertions';
import { IConfig } from '..';
import { INDEX_FILE_TYPES, COMPONENT_EXTENSIONS, COMPONENT_FUNCTIONS, COMPONENT_TYPES } from '../constants';
import { errorDecorator, showError } from '../utils';
import { IInitData, IInsertionData } from '.';
import { FILE_NAMES, ERRORS } from './constants';

/**
 * Creates folder with given path
 * @param {string} path Path with the folder name
 * @param {Function} callback Function, that will be called on success creation
 */
function createFolder(path: string, callback: Function): void {
  fs.access(path, (err: NodeJS.ErrnoException | null) => {
    if (err) {
      fs.mkdir(path, errorDecorator(callback));
    } else {
      callback();
    }
  });
}

/**
 * Creates file with given path and data
 * @param {string} path Path to the file
 * @param {string} data Data to write in the file
 * @param {Function} callback Function, that will be called on success creation
 */
function createFile(path: string, data: string, callback: Function): void {
  fs.access(path, (err: NodeJS.ErrnoException | null) => {
    if (err) {
      fs.appendFile(path, data, errorDecorator(callback));
    } else {
      showError(new Error(ERRORS.fileAlreadyExists.replace('%%', path)));
    }
  });
}

/**
 * Class for creating a react files structure/
 */
export default class Creator {
  private readonly componentPath: string;
  private readonly config: IConfig;
  private rootPath: string;
  private folders: string[] = [];
  private componentFileName: string = '';
  private stylesFileName: string | null = '';
  private testFileName: string | null = '';
  private typesFileName: string | null = '';
  private indexFileName: string | null = '';
  private insertionData: IInsertionData = { component: '' };

  constructor({ componentPath }: IInitData, config: IConfig) {
    this.componentPath = componentPath;
    this.config = config;
    this.rootPath = config.rootPath;
  }

  execute() {
    const elems = this.componentPath.replace('\\', '/').split('/');
    const { componentExtension } = this.config;

    let componentName =
      (this.config.indexFile !== INDEX_FILE_TYPES.COMPONENT ? (elems.pop() as string) : null) || FILE_NAMES.component;
    this.insertionData.component = componentName;

    this.componentFileName = `${componentName}${componentExtension}`;
    this.stylesFileName = this.config.stylesFileExtension
      ? `${this.config.stylesFileName || componentName || FILE_NAMES.styles}${this.config.stylesFileExtension}`
      : null;
    this.typesFileName =
      this.config.componentTypes === COMPONENT_TYPES.FILE
        ? this.config.typesFileName || componentName || FILE_NAMES.types
        : null;
    this.typesFileName && (this.typesFileName += this.typesFileName === componentName ? '.d.ts' : '.ts');
    this.testFileName = this.config.testFile ? `${componentName}.test${componentExtension}` : null;
    this.indexFileName =
      this.config.indexFile === INDEX_FILE_TYPES.EXPORTS ? `${FILE_NAMES.component}${componentExtension}` : null;

    this.folders = elems;
    this._createStructure();
  }

  private async _createStructure(): Promise<void> {
    this.rootPath = await this._createFolders(this.rootPath, this.folders);
    const creationPromises = [];

    const stylesFileName = this.stylesFileName;
    if (stylesFileName) {
      let styleFolderPromise;
      if (this.config.stylesFileFolder) {
        styleFolderPromise = this._createFolders(this.rootPath, [this.config.stylesFileFolder]);
        this.insertionData.stylesPath = `${this.config.stylesFileFolder}/${stylesFileName}`;
      } else {
        styleFolderPromise = Promise.resolve(this.rootPath);
        this.insertionData.stylesPath = stylesFileName;
      }
      creationPromises.push(
        styleFolderPromise.then((rootPath) =>
          this._createFile(rootPath, stylesFileName, this.config.useSnippets ? getStyleData() : '')
        )
      );
    }

    const typesFileName = this.typesFileName;
    if (typesFileName) {
      let typesFolderPromise;
      if (this.config.typesFileFolder) {
        typesFolderPromise = this._createFolders(this.rootPath, [this.config.typesFileFolder]);
        this.insertionData.typesPath = `${this.config.typesFileFolder}/${typesFileName}`;
      } else {
        typesFolderPromise = Promise.resolve(this.rootPath);
        this.insertionData.typesPath = typesFileName;
      }
      creationPromises.push(
        typesFolderPromise.then((rootPath) =>
          this._createFile(rootPath, typesFileName, this.config.useSnippets ? getInterfaceData(this.insertionData) : '')
        )
      );
    }

    const testFileName = this.testFileName;
    if (testFileName) {
      const testFolderPromise = this.config.testFileFolder
        ? this._createFolders(this.rootPath, [this.config.testFileFolder])
        : Promise.resolve(this.rootPath);
      creationPromises.push(
        testFolderPromise.then((rootPath) =>
          this._createFile(
            rootPath,
            testFileName,
            this.config.useSnippets ? getTestData(this.insertionData, this.config) : ''
          )
        )
      );
    }

    creationPromises.push(
      this._createFile(
        this.rootPath,
        this.componentFileName,
        this.config.useSnippets ? getComponentData(this.insertionData, this.config) : ''
      )
    );

    if (this.indexFileName) {
      creationPromises.push(
        this._createFile(
          this.rootPath,
          this.indexFileName,
          this.config.useSnippets ? getIndexData(this.insertionData, this.config) : ''
        )
      );
    }

    await Promise.all(creationPromises);
  }

  /**
   * Recursively creates folders from root path
   * @param {string} root Path to the root folder
   * @param {string[]} folders Folder names to create
   */
  private async _createFolders(root: string, folders: string[]): Promise<string> {
    return new Promise((resolve) => {
      this._createFoldersRecursively(root, folders, resolve);
    });
  }

  private _createFoldersRecursively(root: string, folders: string[], cb: Function): void {
    if (!folders.length) {
      cb(root);
    }
    const folderPath = path.join(root, folders.shift() as string);
    createFolder(folderPath, () => this._createFoldersRecursively(folderPath, folders, cb));
  }

  /**
   * Creates file with given path and data
   * @param {string} root Path to the root folder (where we create file)
   * @param {string} name File name with extension
   * @param {string} data Data to write in the file
   */
  private async _createFile(root: string, name: string, data: string): Promise<void> {
    return new Promise((resolve) => createFile(path.join(root, name), data, resolve));
  }
}
