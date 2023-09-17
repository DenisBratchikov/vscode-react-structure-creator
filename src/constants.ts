export const enum ERRORS {
  emptyWorkspace = 'Can not define workspace folder. No worspace found.',
  severalWorkspaces = 'Can not define workspace folder, because you use several workspaces.',
  invalidInput = 'Invalid input. Entered path does not exists.',
  emptyInput = 'Input is empty.',
  invaidComponentPath = 'Invalid component path.',
  invalidFolderName = 'Invalid %% folder name. Expected letters, numbers, "_", "-", "." symbols',
  invalidFileName = 'Invalid %% file name. Expected letters, numbers, "_", "-", "." symbols',
  invalidStylesExtension = 'Invalid styles file extension. Expected letters and "." symbols',
  invalidComponentPath = 'Invalid component path. Expected letters, numbers, spaces, "_", "-", "\\", "/" symbols'
}

export const enum PROMPT_MSG {
  rootFolder = 'Enter absolute path to base folder (where path starts)',
  compPath = 'Enter component path with / or \\ (e.g. user/profile)',
  compPathWithName = 'Enter component path and name with / or \\ (e.g. user/profile/Avatar)',
  compPathWithOpts = 'Enter options (e=.tsx i=EXPORTS s=.less t=FILE qa=-) and then component path with / or \\',
  compPathWithNameAndOpts = 'Enter options (e=.tsx i=EXPORTS s=.less t=FILE qa=-) and name and then component path with / or \\'
}

export enum COMPONENT_EXTENSIONS {
  JS = '.js',
  JSX = '.jsx',
  TSX = '.tsx'
}

export enum COMPONENT_FUNCTIONS {
  AD = 'ARROW_DEFAULT',
  AN = 'ARROW_NAMED',
  DD = 'DECLARATION_DEFAULT',
  DN = 'DECLARATION_NAMED'
}

export enum INDEX_FILE_TYPES {
  NONE = 'NONE',
  COMPONENT = 'COMPONENT',
  EXPORTS = 'EXPORTS'
}

export enum COMPONENT_TYPES {
  NONE = 'NONE',
  INLINE = 'INLINE',
  FILE = 'FILE'
}

// Regular expression for checking folder or file name in configuration
export const NAME_REG_EXP = /^(\w|\d|_|-|\.)*(\w|\d|_|-)+$/i;

// Regular expression for checking css extension in configuration
export const STYLES_EXTENSION_REG_EXP = /^\.([a-zA-Z]|\.)+[a-zA-Z]+$/i;

// Regular expression for checking user input
export const COMPONENT_PATH_REG_EXP = /^(\w|\d|\s|_|-|\/|\\)+?$/i;
