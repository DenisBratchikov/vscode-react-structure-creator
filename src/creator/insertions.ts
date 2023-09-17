import { IInsertionData } from '.';
import { IConfig } from '..';
import { COMPONENT_EXTENSIONS, COMPONENT_FUNCTIONS, COMPONENT_TYPES, INDEX_FILE_TYPES } from '../constants';

function isDefaultExport(config: IConfig): boolean {
  return config.componentFunction === COMPONENT_FUNCTIONS.AD || config.componentFunction === COMPONENT_FUNCTIONS.DD;
}

function clearExtension(path: string) {
  return path.replace(/(\.ts|\.js|\.tsx)$/, '');
}

/**
 * Returns data for react component
 * @param config Configuration for creator class
 * @param data Data from creator class
 */
export function getComponentData(data: IInsertionData, config: IConfig): string {
  const name = data.component;
  const result = ["import React from 'react';"];

  if (data.stylesPath) {
    result.push('', `import styles from './${clearExtension(data.stylesPath)}';`, '');
  }

  if (config.componentTypes === COMPONENT_TYPES.FILE && data.typesPath) {
    result.push('', `import { ${name}Props } from './${clearExtension(data.typesPath)}';`, '');
  } else if (config.componentTypes === COMPONENT_TYPES.INLINE) {
    result.push('', `export interface ${name}Props { }`, '');
  }

  if (config.componentFunction === COMPONENT_FUNCTIONS.AD || config.componentFunction === COMPONENT_FUNCTIONS.AN) {
    result.push(
      '',
      `${config.componentFunction === COMPONENT_FUNCTIONS.AN ? 'export ' : ''}const ${name}${
        config.componentTypes !== COMPONENT_TYPES.NONE ? `: React.FC<${name}Props>` : ''
      } = () => {`
    );
  } else if (config.componentFunction === COMPONENT_FUNCTIONS.DD) {
    result.push(
      '',
      `export default function ${name}(${config.componentTypes !== COMPONENT_TYPES.NONE ? `props: ${name}Props` : ''})${
        config.componentTypes !== COMPONENT_TYPES.NONE ? ': ReturnType<React.FC>' : ''
      } {`
    );
  } else if (config.componentFunction === COMPONENT_FUNCTIONS.DN) {
    result.push(
      '',
      `export function ${name}(${config.componentTypes !== COMPONENT_TYPES.NONE ? `props: ${name}Props` : ''})${
        config.componentTypes !== COMPONENT_TYPES.NONE ? ': ReturnType<React.FC>' : ''
      } {`
    );
  }

  result.push('  return <div />;', '}', '');

  if (config.componentFunction === COMPONENT_FUNCTIONS.AD) {
    result.push(`export default ${name};`, '');
  }

  return result.filter((elem, index, arr) => !(elem === '' && arr[index - 1] === '')).join('\n');
}

export function getStyleData(): string {
  return '';
}

export function getInterfaceData(data: IInsertionData): string {
  return `export interface ${data.component}Props { };\n`;
}

export function getIndexData(data: IInsertionData, config: IConfig): string {
  return `export ${isDefaultExport(config) ? `{ default as ${data.component} }` : `{ ${data.component} }`} from './${
    data.component
  }';\n`;
}

export function getTestData(data: IInsertionData, config: IConfig): string {
  const { component } = data;
  const componentImport = isDefaultExport(config) ? `import ${component}` : `import { ${component} }`;
  const componentImportFrom =
    config.indexFile === INDEX_FILE_TYPES.COMPONENT
      ? `from '${config.testFileFolder ? '.' : ''}.';`
      : `from '${config.testFileFolder ? '.' : ''}./${component}';`;

  return [
    `${componentImport} ${componentImportFrom}`,
    '',
    `describe('${component}', () => {`,
    "  it('', () => { });",
    '});',
    ''
  ].join('\n');
}
