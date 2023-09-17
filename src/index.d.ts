import { COMPONENT_EXTENSIONS, COMPONENT_FUNCTIONS, INDEX_FILE_TYPES, COMPONENT_TYPES } from './constants';

export interface IConfig {
  componentExtension: COMPONENT_EXTENSIONS;
  componentFunction: COMPONENT_FUNCTIONS;
  indexFile: INDEX_FILE_TYPES;
  stylesFileExtension?: string;
  stylesFileName?: string;
  stylesFileFolder?: string;
  componentTypes: COMPONENT_TYPES;
  typesFileName?: string;
  typesFileFolder?: string;
  testFile?: boolean;
  testFileFolder?: string;
  rootPath: string;
  useSnippets: boolean;
}
