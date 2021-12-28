// Default file names
export const enum FILE_NAMES {
	lang = 'index',
	style = 'style',
	test = 'test',
	interface = 'index.d'
}

// File extensions
export const enum FILE_EXTENSIONS {
	js = '.js',
	jsx = '.jsx',
	ts = '.ts',
	tsx = '.tsx',
	css = '.css',
	cssModules = '.module.css',
	less = '.less',
	scss = '.scss',
	test = '.test'
}

// Error messages for user
export enum ERRORS {
	invalidLangExtension = 'Invalid language extenstion. Expected: JS, JSX or TSX',
	invalidStyleExtension = 'Invalid style extenstion. Expected: CSS, LESS, SCSS or NONE',
	fileAlreadyExists = 'File %% already exists.'
}
