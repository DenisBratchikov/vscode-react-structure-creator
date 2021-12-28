// Error messages for user
export const enum ERRORS {
    emptyWorkspace = 'Can not define workspace folder. No worspace found.',
    severalWorkspaces = 'Can not define workspace folder, because you use several workspaces.',
    invalidInput = 'Invalid input. Entered path does not exists.',
    emptyInput = 'Input is empty.',
    invaidComponentPath = 'Invalid component path.',
    invalidFolderName = 'Invalid %% folder name. Expected letters, numbers, "_", "-" symbols',
    invalidComponentPath = 'Invalid component path. Expected letters, numbers, spaces, "_", "-", "\\", "/" symbols'
}

// Prompt messages for user
export const enum PROMPT_MSG {
    rootFolder = 'Enter absolute path to base folder (where path starts)',
    compPath = 'Enter component path with / or \\ (e.g. user/profile)',
    compPathWithName = 'Enter component path and name with / or \\ (e.g. user/profile/Avatar)',
    compPathWithOpts = 'Enter options (e=TS, s=CSS, i+, t+, h+) and then component path with / or \\',
    compPathWithNameAndOpts = 'Enter options (e=TS, s=CSS, i+, t+, h+) and name and then component path with / or \\'
}

// Languages for react components
export enum LANGUAGES {
    JS = 'JS',
    JSX = 'JSX',
    TSX = 'TSX'
}

// Style files for react components
export enum STYLES {
    NO = 'NONE',
    CSS = 'CSS',
    CSS_MODULES = 'CSS modules',
    LESS = 'LESS',
    SCSS = 'SCSS'
}

// Regular expression for checking folder name in configuration
export const FOLDER_REG_EXP = /^(\w|\d|_|-)+?$/i;

// Regular expression for checking user input
export const COMPONENT_PATH_REG_EXP = /^(\w|\d|\s|_|-|\/|\\)+?$/i;
