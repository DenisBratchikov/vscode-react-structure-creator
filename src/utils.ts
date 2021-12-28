import {workspace, window} from 'vscode';
import * as fs from 'fs';
import {IConfig} from '.';
import {ERRORS, PROMPT_MSG, LANGUAGES, STYLES, FOLDER_REG_EXP, COMPONENT_PATH_REG_EXP} from './constants';

/**
 * Returns root folder path from user input
 */
async function getPathWithUserPrompt(placeholder: string, checkExistence?: boolean): Promise<string | never> {
    const userInput: string | undefined = await window.showInputBox({placeHolder: placeholder});
    if (!userInput || !userInput.trim()) {
        throw new Error(ERRORS.emptyInput);
    }
    if (checkExistence && !fs.existsSync(userInput)) {
        throw new Error(ERRORS.invalidInput);
    }
    return userInput;
}

/**
 * Returns config for extenstion
 */
export async function getConfig(rootFolder: string | undefined): Promise<IConfig | never> {
    const vsConfig = workspace.getConfiguration();
    let rootPath: string | undefined = rootFolder || vsConfig.get('react-file-structure.Root Path');
    if (!rootPath) {
        const folders = workspace.workspaceFolders;
        if (!folders) {
            showError(new Error(ERRORS.emptyWorkspace));
            rootPath = await getPathWithUserPrompt(PROMPT_MSG.rootFolder, true);
        } else if (folders.length > 1) {
            showError(new Error(ERRORS.severalWorkspaces));
            rootPath = await getPathWithUserPrompt(PROMPT_MSG.rootFolder, true);
        } else {
            rootPath = folders[0].uri.path
        }
    }
    const config: IConfig = {
        language: vsConfig.get('react-file-structure.Language') ?? LANGUAGES.TSX,
        hooks: vsConfig.get('react-file-structure.Use React Hooks') ?? true,
        useIndex: vsConfig.get('react-file-structure.Use Index File') ?? true,
        styles: vsConfig.get('react-file-structure.Style files') ?? STYLES.SCSS,
        stylesFolder: vsConfig.get('react-file-structure.Style Files Folder'),
        interface: vsConfig.get('react-file-structure.Add Interface Files') ?? true,
        interfaceFolder: vsConfig.get('react-file-structure.Interface Files Folder'),
        tests: vsConfig.get('react-file-structure.Add Test File') ?? true,
        testsFolder: vsConfig.get('react-file-structure.Test Files Folder'),
        rootPath,
    };
    checkConfig(config);
    return config;
}

/**
 * Checks configuration on invalid values
 * @param {IConfig} config Current config
 */
function checkConfig(config: IConfig): void | never {
    if (config.stylesFolder && !FOLDER_REG_EXP.test(config.stylesFolder)) {
        throw new Error(ERRORS.invalidFolderName.replace('%%', 'style'));
    } else if (config.interfaceFolder && !FOLDER_REG_EXP.test(config.interfaceFolder)) {
        throw new Error(ERRORS.invalidFolderName.replace('%%', 'interface'));
    } else if (config.testsFolder && !FOLDER_REG_EXP.test(config.testsFolder)) {
        throw new Error(ERRORS.invalidFolderName.replace('%%', 'test'));
    }
    if (config.language !== LANGUAGES.TSX) {
        config.interface = false;
    }
}

/**
 * Returns component path from user input
 */
export async function getComponentPath(config: IConfig): Promise<string | never> {
    const prompt = config.useIndex ? PROMPT_MSG.compPath : PROMPT_MSG.compPathWithName;
    const componentPath = await getPathWithUserPrompt(prompt);
    return getCheckedComponentPath(componentPath);
}

/**
 * Updates config and returns component path from user input
 * @param config Extension configuration
 */
export async function getComponentPathWithOptions(config: IConfig): Promise<string | never> {
    const prompt = config.useIndex ? PROMPT_MSG.compPathWithOpts : PROMPT_MSG.compPathWithNameAndOpts;
    const userInput = await getPathWithUserPrompt(prompt);
    const parts = userInput.split(',');
    const componentPath = parts.pop() as string;
    parts.forEach(elem => {
        const value = elem.trim();
        const firstChar = value[0];
        if (firstChar === 'h') {
            config.hooks = value[1] === '+';
        } else if (firstChar === 'i') {
            config.interface = value[1] === '+'
        } else if (firstChar === 't') {
            config.tests = value[1] === '+';
        } else if (firstChar === 's') {
            const css = value[2];
            if (!css || !Object.keys(STYLES).includes(css.toUpperCase())) {
                return;
            }
            config.styles = css as STYLES;
        } else if (firstChar === 'l') {
            const lang = value[2];
            if (!lang || !Object.keys(LANGUAGES).includes(lang.toUpperCase())) {
                return;
            }
            config.language = lang as LANGUAGES;
        }
    });
    return getCheckedComponentPath(componentPath);
}

/**
 * Checks component path and returns it without extra spaces, if it is valid
 * @param componentPath Path to component from user input
 */
function getCheckedComponentPath(componentPath: string): never | string {
    if (!COMPONENT_PATH_REG_EXP.test(componentPath)) {
        throw new Error(ERRORS.invaidComponentPath);
    }
    return componentPath.replace(' ', '');
}

/**
 * Shows errors with vscode native motification window
 * @param {Error | null} error Error object
 */
export function showError(error: Error | null): void {
    if (error) {
        window.showErrorMessage(error.message)
    }
}

/**
 * Returns callback function to fs module handlers with throwing an error
 * @param cb Callback if no errors occured
 */
export function errorDecorator(cb: Function): (err: NodeJS.ErrnoException | null) => void {
    return (error: Error | null) => {
        if (error) {
            showError(error);
        } else {
            cb();
        }
    }
}
