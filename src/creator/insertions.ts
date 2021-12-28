import {IInsertionData} from '.';
import {IConfig} from '..';
import {LANGUAGES, STYLES} from '../constants';

// Reg exp for searching anchors in template strings
const TEMPLATE_REG_EXP = /(%(\w|-)+?\n?%)/ig;

// Template for react hook component
const COMPONENT_HOOK_TEMPLATE = `import { useState, useRef } from 'react';
%imports%
export default function %name%(props%i-name%) {
    return (<div></div>);
}
`;

// Template for react class component
const COMPONENT_CLASS_TEMPLATE = `import React%r-import% from 'react';
%imports%
export default class $name$ extends React.Component%i-generic% {

    constructor(props%i-name%) {
        super(props);
    }

    render()%r-node% {
        return (<div></div>);
    }
}
`;

/**
 * Returns data for react component
 * @param config Configuration for creator class
 * @param data Data from creator class
 */
export function getComponentData(config: IConfig, data: IInsertionData): string {
    const name = data.component;
    let result = (config.hooks ? COMPONENT_HOOK_TEMPLATE : COMPONENT_CLASS_TEMPLATE).replace(/\$name\$/, name);
    if (config.language === LANGUAGES.TSX) {
        result = bringToTS(result, config, data);
    } else {
        result = removeAnchors(result);
    }
    return result;
}

/**
 * Replaces string anchors with TypeScript constructions
 * @param origin String to process
 * @param config Configuration for creator class
 * @param data Data from creator class
 */
function bringToTS(origin: string, config: IConfig, {component, interfacePath, stylePath}: IInsertionData) {
    const interfaceName = getPropsInterfaceName(component);
    return origin.replace(TEMPLATE_REG_EXP, (match: string): string => {
        switch (match) {
            case '%r-import%':
                return ', {ReactNode}';
            case '%imports%':
                let result = '';
                let styleText = '';
                if (stylePath) {
                    styleText = config.styles === STYLES.CSS_MODULES ?
                        `\nimport classes from './${stylePath}';\n` :
                        `\nimport './${stylePath}';\n`;
                }
                if (interfacePath) {
                    result += `\nimport ${interfaceName} from './${interfacePath}';\n`;
                    result += styleText;
                } else {
                    result += styleText;
                    result += `\nexport interface ${interfaceName} { };\n`;
                }
                return result;
            case '%i-generic%':
                return `<${interfaceName}>`;
            case '%i-name%':
                return `: ${interfaceName}`;
            case '%r-node%':
                return ': ReactNode';
            default:
                return '';
        }
    });
}

/**
 * Returns interface props name for react component interface
 * @param component
 */
function getPropsInterfaceName(component: string): string {
    return `I${component}Props`;
}

/**
 * Removes anchors from template
 * @param origin String to process
 */
function removeAnchors(origin: string): string {
    return origin.replace(TEMPLATE_REG_EXP, '');
}

/**
 * Returns data for react component styles file
 */
export function getStyleData(): string {
    return '';
}

/**
 * Returns data for react component interface file
 * @param config Configuration for creator class
 * @param data Data from creator class
 */
export function getInterfaceData(config: IConfig, data: IInsertionData): string {
    return `export default interface ${getPropsInterfaceName(data.component)} { }`;
}

/**
 * Returns data for react component tests file
 */
export function getTestData(): string {
    return '';
}
