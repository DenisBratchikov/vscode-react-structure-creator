import * as path from 'path';
import * as fs from 'fs';
import {getComponentData, getStyleData, getInterfaceData, getTestData} from './insertions';
import {IConfig} from '..';
import {LANGUAGES, STYLES} from '../constants';
import {errorDecorator, showError} from '../utils';
import {IInitData, IInsertionData} from '.';
import {FILE_NAMES, FILE_EXTENSIONS, ERRORS} from './constants';

/**
 * Creates folder with given path
 * @param {string} path Path with the folder name
 * @param {Function} callback Function, that will be called on success creation
 */
function createFolder(path: string, callback: Function): void {
    fs.access(path, (err: NodeJS.ErrnoException | null) => {
        if (err) {
            fs.mkdir(path, errorDecorator(callback))
        } else {
            callback()
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
    private componentName: string = '';
    private styleName: string | null = '';
    private testName: string | null = '';
    private interfaceName: string | null = '';
    private insertionData: IInsertionData = {component: ''};

    constructor({componentPath}: IInitData, config: IConfig) {
        this.componentPath = componentPath;
        this.config = config;
        this.rootPath = config.rootPath;
    }

    /**
     * Public method for activating class
     */
    execute() {
        const elems = this.componentPath.replace('\\', '/').split('/');
        const useIndex = this.config.useIndex;
        if (useIndex) {
            this.componentName = FILE_NAMES.lang;
            this.styleName = FILE_NAMES.style;
            this.interfaceName = FILE_NAMES.interface;
            this.testName = FILE_NAMES.test;
            const componentFolder = elems[elems.length - 1];
            this.insertionData.component = componentFolder[0].toUpperCase() + componentFolder.slice(1);
        } else {
            const name = elems.pop() as string;
            this.componentName = this.styleName = this.insertionData.component = this.interfaceName = name;
            this.testName = `${name}${FILE_EXTENSIONS.test}`;
        }

        const langExt = this._getLangExtension();
        this.componentName += langExt;
        this.folders = elems;

        if (this.config.interface) {
            this.interfaceName += FILE_EXTENSIONS.ts;
        } else {
            this.interfaceName = null;
        }

        if (this.config.tests) {
            this.testName += langExt === FILE_EXTENSIONS.tsx ? FILE_EXTENSIONS.ts : FILE_EXTENSIONS.js;
        } else {
            this.testName = null;
        }

        const styleExt = this._getStylesExtension();
        if (styleExt) {
            this.styleName += styleExt;
        } else {
            this.styleName = null;
        }

        this._createStructure();
    }

    /**
     * Returns extension for react component file
     */
    private _getLangExtension(): string {
        switch (this.config.language) {
            case LANGUAGES.JS:
                return FILE_EXTENSIONS.js;
            case LANGUAGES.JSX:
                return FILE_EXTENSIONS.jsx;
            case LANGUAGES.TSX:
                return FILE_EXTENSIONS.tsx;
            default:
                throw new Error(ERRORS.invalidLangExtension)
        }
    }

    /**
     * Returns extension for styles file
     */
    private _getStylesExtension(): string {
        switch (this.config.styles) {
            case STYLES.NO:
                return '';
            case STYLES.CSS:
                return FILE_EXTENSIONS.css;
            case STYLES.CSS_MODULES:
                return FILE_EXTENSIONS.cssModules;
            case STYLES.LESS:
                return FILE_EXTENSIONS.less;
            case STYLES.SCSS:
                return FILE_EXTENSIONS.scss;
            default:
                throw new Error(ERRORS.invalidLangExtension)
        }
    }

    /**
     * Creates file structure for react component
     */
    private async _createStructure(): Promise<void> {
        this.rootPath = await this._createFolders(this.rootPath, this.folders);
        const creationPromises = [];
        const styleFileName = this.styleName;
        if (styleFileName) {
            let styleFolderPromise;
            if (this.config.stylesFolder) {
                styleFolderPromise = this._createFolders(this.rootPath, [this.config.stylesFolder]);
                this.insertionData.stylePath = `${this.config.stylesFolder}/${this.styleName}`;
            } else {
                styleFolderPromise = Promise.resolve(this.rootPath);
                this.insertionData.stylePath = styleFileName;
            }
            creationPromises.push(styleFolderPromise.then(
                rootPath => this._createFile(rootPath, styleFileName, getStyleData())
            ));
        }
        const interfaceFileName = this.interfaceName;
        if (interfaceFileName) {
            let interfaceFolderPromise;
            const importInterfaceName = interfaceFileName.slice(0, interfaceFileName.length - 3);
            if (this.config.interfaceFolder) {
                interfaceFolderPromise = this._createFolders(this.rootPath, [this.config.interfaceFolder]);
                this.insertionData.interfacePath = `${this.config.interfaceFolder}/${importInterfaceName}`;
            } else {
                interfaceFolderPromise = Promise.resolve(this.rootPath);
                this.insertionData.interfacePath = importInterfaceName;
            }
            creationPromises.push(interfaceFolderPromise.then(
                rootPath => this._createFile(
                    rootPath, interfaceFileName, getInterfaceData(this.config, this.insertionData)
                )
            ));
        }
        const testFileName = this.testName;
        if (testFileName) {
            const testFolderPromise = this.config.testsFolder ?
                this._createFolders(this.rootPath, [this.config.testsFolder]) :
                Promise.resolve(this.rootPath);
            creationPromises.push(testFolderPromise.then(
                rootPath => this._createFile(rootPath, testFileName, getTestData())
            ));
        }
        creationPromises.push(
            this._createFile(this.rootPath, this.componentName, getComponentData(this.config, this.insertionData))
        );
        await Promise.all(creationPromises);
    }

    /**
     * Recursively creates folders from root path
     * @param {string} root Path to the root folder
     * @param {string[]} folders Folder names to create
     */
    private async _createFolders(root: string, folders: string[]): Promise<string> {
        return new Promise(resolve => {
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
        return new Promise(resolve => createFile(path.join(root, name), data, resolve));
    }
}
