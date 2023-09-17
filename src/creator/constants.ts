export const enum FILE_NAMES {
	component = 'index',
	styles = 'styles',
	types = 'types'
}

export enum ERRORS {
	invalidLangExtension = 'Invalid language extenstion. Expected: JS, JSX or TSX',
	invalidStyleExtension = 'Invalid style extenstion. Expected: CSS, LESS, SCSS or NONE',
	fileAlreadyExists = 'File %% already exists.'
}
