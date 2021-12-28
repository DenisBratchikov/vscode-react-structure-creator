/**
 * Extension initialization data
 * @interface
 * @property {string} componentPath Path from user input
 */
export interface IInitData {
   componentPath: string;
}

export interface IInsertionData {
   component: string;
   stylePath?: string;
   interfacePath?: string;
}
