// import * as vscode from 'vscode';
// import * as fs from 'fs';
// import * as path from 'path';
// import {
//     DEFAULT_INIT_DATA, USER_INPUT_PLACEHOLDER, USER_INPUT_REG_EXPS, ERRORS
// } from './constants';
// import {IInitData} from '.';

// /**
//  * Returns initializating data for creating library
//  * @param {string} path Path to the folder, where the context menu was opened
//  */
// export function getLibraryData(path: string): Promise<IInitData> {
//     return getPath(path, USER_INPUT_PLACEHOLDER.libraryPath).then(modulePath => {
//         return getLibraryInitData(modulePath).then((initData: IInitData | void) => {
// 			if (initData) {
// 				return initData;
// 			}
// 			throw new Error(ERRORS.initData);
// 		});
//     });
// }

// /**
//  * Returns initializating data for creating library
//  * @param {string} path Path to the folder, where the context menu was opened
//  */
// export function getComponentData(path: string): Promise<IInitData> {
//     return getPath(path, USER_INPUT_PLACEHOLDER.componentPath).then(libraryPath => {
//         return getComponentInitData(libraryPath).then((initData: IInitData | void) => {
// 			if (initData) {
// 				return initData;
// 			}
// 			throw new Error(ERRORS.initData)
// 		});
//     });
// }

// /**
//  * Returns absolute path to the module
//  * @param {string} modulePath Path to the module
//  * @param {string} placeHolder Placeholder for the dropdown
//  */
// async function getPath(modulePath: string, placeHolder: string): Promise<string | never> {
//     if (modulePath) {
//         return modulePath;
//     }
//     const userInput: string | undefined = await vscode.window.showInputBox({ placeHolder });
//     if (userInput && fs.existsSync(userInput)) {
//         return userInput;
//     }
//     throw new Error(ERRORS.path);
// }

// /**
//  * Returns valid initialization data for the creating library
//  * @param {string} modulePath Path to the module
//  */
// async function getLibraryInitData(modulePath: string): Promise<IInitData | never> {
//     const userInput: string | undefined = await getEntityName(USER_INPUT_PLACEHOLDER.libraryNames);
//     const initData: IInitData = collectLibraryData(userInput, modulePath);
//     return checkPathExistence(initData.path).then(() => initData);
// }

// /**
//  * Returns valid initialization data for the creating component in library
//  * @param {string} modulePath Path to the module
//  */
// async function getComponentInitData(modulePath: string): Promise<IInitData | never> {
//     const userInput: string | undefined = await getEntityName(USER_INPUT_PLACEHOLDER.componentName);
//     const initData: IInitData = collectComponentData(userInput, modulePath);
//     return checkPathExistence(initData.path).then(() => initData);
// }

// /**
//  * Returns user input - name creating entities
//  * @param {string} placeHolder Placeholder for the dropdown
//  */
// function getEntityName(placeHolder: string): Thenable<string | undefined> {
//     return vscode.window.showInputBox({ placeHolder });
// }

// /**
//  * Parses user input and collects initialozation data for creating library
//  * @param {string} userInput User input string
//  * @param {string} moduleparsePath Path to the module
//  */
// function collectLibraryData(userInput: string | undefined, modulePath: string): IInitData | never {
//     if (!userInput || !USER_INPUT_REG_EXPS.library.test(userInput)) {
//         throw new Error(ERRORS.userInput)
//     }

//     const names: string[] = userInput.split('/');
//     const initData: IInitData = DEFAULT_INIT_DATA;

//     if (names.length === 2) {
//         [initData.names.lib, initData.names.component] = names;
//         initData.names.module = parsePath(modulePath).name;
//         initData.path = modulePath
//         return initData;
//     } else {
//         throw new Error(ERRORS.userInput)
//     }
// }

// /**
//  * Parses user input and collects initialozation data for creating component in library
//  * @param {string} userInput User input string
//  * @param {string} libraryPath Path to the library, where the component is creating
//  */
// function collectComponentData(userInput: string | undefined, libraryPath: string): IInitData | never {
//     if (!userInput || !USER_INPUT_REG_EXPS.component.test(userInput)) {
//         throw new Error(ERRORS.userInput)
//     }

//     const initData: IInitData = DEFAULT_INIT_DATA;
//     const {name: libraryFolder, dir: modulePath} = parsePath(libraryPath);
//     initData.names.component = userInput;
//     initData.names.lib = libraryFolder.replace(/^_/, '');
//     initData.path = modulePath;
//     initData.names.module = parsePath(modulePath).name;
//     return initData;
// }

// /**
//  * Returns parsed path
//  * @param {string} folderPath Absolute path to the folder (module or library)
//  */
// function parsePath(folderPath: string): path.ParsedPath {
//     const parsedPath: path.ParsedPath = path.parse(folderPath);
//     if (parsedPath.ext) {
//         throw new Error(ERRORS.path);
//     }
//     return parsedPath;
// }

// /**
//  * Checks path existence
//  * @param {string} folderPath Absolute path to the folder (module or library)
//  */
// function checkPathExistence(folderPath: string): Promise<boolean | never> {
//     return new Promise((resolve) => {
//         fs.exists(folderPath, (exists: boolean) => {
//             if (exists) {
//                 resolve(exists);
//             }
//             throw new Error(ERRORS.nonexistentPath)
//         })
//     });
// }
