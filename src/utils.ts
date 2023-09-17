import { workspace, window } from 'vscode';
import * as fs from 'fs';
import { IConfig } from '.';
import {
  ERRORS,
  PROMPT_MSG,
  COMPONENT_EXTENSIONS,
  COMPONENT_FUNCTIONS,
  COMPONENT_TYPES,
  NAME_REG_EXP,
  STYLES_EXTENSION_REG_EXP,
  COMPONENT_PATH_REG_EXP,
  INDEX_FILE_TYPES
} from './constants';

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
      rootPath = folders[0].uri.path;
    }
  }
  const config: IConfig = {
    componentExtension: vsConfig.get('react-file-structure.Component File Extension') ?? COMPONENT_EXTENSIONS.TSX,
    componentFunction: vsConfig.get('react-file-structure.Component Function') ?? COMPONENT_FUNCTIONS.AD,
    indexFile: vsConfig.get('react-file-structure.Index File') ?? INDEX_FILE_TYPES.NONE,
    stylesFileExtension: vsConfig.get('react-file-structure.Styles File Extension'),
    stylesFileName: vsConfig.get('react-file-structure.Styles File Name'),
    stylesFileFolder: vsConfig.get('react-file-structure.Styles File Folder'),
    componentTypes: vsConfig.get('react-file-structure.Component Types') ?? COMPONENT_TYPES.FILE,
    typesFileName: vsConfig.get('react-file-structure.Types File Name'),
    typesFileFolder: vsConfig.get('react-file-structure.Types File Folder'),
    testFile: vsConfig.get('react-file-structure.Test File') ?? false,
    testFileFolder: vsConfig.get('react-file-structure.Test File Folder'),
    useSnippets: vsConfig.get('react-file-structure.Use Snippets') ?? true,
    rootPath
  };
  checkConfig(config);
  makeConfigConsistent(config);
  return config;
}

function checkConfig(config: IConfig): void | never {
  if (config.stylesFileFolder && !NAME_REG_EXP.test(config.stylesFileFolder)) {
    throw new Error(ERRORS.invalidFolderName.replace('%%', 'styles'));
  } else if (config.typesFileFolder && !NAME_REG_EXP.test(config.typesFileFolder)) {
    throw new Error(ERRORS.invalidFolderName.replace('%%', 'types'));
  } else if (config.testFileFolder && !NAME_REG_EXP.test(config.testFileFolder)) {
    throw new Error(ERRORS.invalidFolderName.replace('%%', 'test'));
  } else if (config.stylesFileName && !NAME_REG_EXP.test(config.stylesFileName)) {
    throw new Error(ERRORS.invalidFileName.replace('%%', 'styles'));
  } else if (config.typesFileName && !NAME_REG_EXP.test(config.typesFileName)) {
    throw new Error(ERRORS.invalidFileName.replace('%%', 'types'));
  } else if (config.stylesFileExtension && !STYLES_EXTENSION_REG_EXP.test(config.stylesFileExtension)) {
    throw new Error(ERRORS.invalidStylesExtension);
  }
}

function makeConfigConsistent(config: IConfig): void {
  if (config.componentExtension !== COMPONENT_EXTENSIONS.TSX) {
    config.componentTypes = COMPONENT_TYPES.NONE;
  }
}

async function getPathWithUserPrompt(placeholder: string, checkExistence?: boolean): Promise<string | never> {
  const userInput: string | undefined = await window.showInputBox({ placeHolder: placeholder });
  if (!userInput || !userInput.trim()) {
    throw new Error(ERRORS.emptyInput);
  }
  if (checkExistence && !fs.existsSync(userInput)) {
    throw new Error(ERRORS.invalidInput);
  }
  return userInput;
}

export async function getComponentPath(config: IConfig): Promise<string | never> {
  const prompt = config.indexFile === INDEX_FILE_TYPES.COMPONENT ? PROMPT_MSG.compPath : PROMPT_MSG.compPathWithName;
  const componentPath = await getPathWithUserPrompt(prompt);
  return getCheckedComponentPath(componentPath);
}

function checkPathOption(param: string, availableParams: string[]): boolean {
  return !!param && availableParams.includes(param.toUpperCase());
}

export async function getComponentPathWithOptions(config: IConfig): Promise<string | never> {
  const prompt =
    config.indexFile !== INDEX_FILE_TYPES.COMPONENT ? PROMPT_MSG.compPathWithOpts : PROMPT_MSG.compPathWithNameAndOpts;
  const userInput = await getPathWithUserPrompt(prompt);
  const parts = userInput.split(' ');
  const componentPath = parts.pop() as string;
  parts.forEach((elem) => {
    const trimmed = elem.trim();
    const [param, value] = trimmed.split('=');
    switch (param) {
      case 'e':
        if (checkPathOption(value, Object.keys(COMPONENT_EXTENSIONS))) {
          config.componentExtension = value as COMPONENT_EXTENSIONS;
        }
        break;
      case 'i':
        if (checkPathOption(value, Object.keys(INDEX_FILE_TYPES))) {
          config.indexFile = value as INDEX_FILE_TYPES;
        }
        break;
      case 's':
        config.stylesFileExtension = value;
        break;
      case 't':
        if (checkPathOption(value, Object.keys(COMPONENT_TYPES))) {
          config.componentTypes = value as COMPONENT_TYPES;
        }
        break;
      case 'qa':
        config.testFile = value === '+';
        break;
    }
  });
  makeConfigConsistent(config);
  return getCheckedComponentPath(componentPath);
}

function getCheckedComponentPath(componentPath: string): never | string {
  if (!COMPONENT_PATH_REG_EXP.test(componentPath)) {
    throw new Error(ERRORS.invaidComponentPath);
  }
  return componentPath.replace(/\s/g, '');
}

export function showError(error: Error | null): void {
  if (error) {
    window.showErrorMessage(error.message);
  }
}

export function errorDecorator(cb: Function): (err: NodeJS.ErrnoException | null) => void {
  return (error: Error | null) => {
    if (error) {
      showError(error);
    } else {
      cb();
    }
  };
}
