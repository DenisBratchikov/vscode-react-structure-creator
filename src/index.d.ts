import {LANGUAGES, STYLES} from './constants';

/**
 * Extension configuration interface
 * @interface
 * @property {LANGUAGES} language Language for react components
 * @property {boolean} hooks Use react hooks instead of classes
 * @property {string} rootPath Root path to calc component path
 * @property {boolean} useIndex Use index file instead of named file
 * @property {STYLES} styles Style files for react components
 * @property {string | null | undefined} stylesFolder Folder for style files
 * @property {boolean} interface Put interfaces to separate files
 * @property {string | null | undefined} interfaceFolder Folder for interface files
 * @property {boolean} tests Create test files for react component
 * @property {string | null | undefined} testsFolder Folder for test files
 */
export interface IConfig {
   language: LANGUAGES;
   hooks: boolean;
   rootPath: string;
   useIndex: boolean;
   styles: STYLES;
   stylesFolder: string | null | undefined;
   interface: boolean;
   interfaceFolder: string | null | undefined;
   tests: boolean;
   testsFolder: string | null | undefined;
}
