# VSCode Extension. React File Structure Creator

This extension allows you to create react component file structure with one command. It gets component path from prompt dialog and creates folders and file with some preset code.

## Usage

The extension can be activated both via command palette and via folder context menu in VSCode file explorer. There are two commands for creating file structure:
* Create react file structure
* Create react file structure with options

The only difference between them is that the second command has an opportunity to override some settings (only for current usage).
In both commands you will be asked for a path to the component. If you use an index file for the component content (see [settings](#settings)) you should specify only component path, e.g. **user/profile**. Otherwise, you should also add component name in path, e.g. **user/profile/Avatar**.

Second command supports some options separated with comma, which *must* be before component path:
* **"e"** for the extension select, e.g. **e=.tsx**
* **"i"** for the index file usage, e.g. **i=EXPORTS**
* **"s"** for the style file exnetsion, e.g. **s=.less**
* **"t"** for the types file, e.g. **t=FILE**
* **"qa"** for test file with **+** or **-** for including or excluding respectively, e.g. **qa=+**

Full second command input may look like **"e=.tsx i=EXPORTS s=.less t=FILE qa=- user/profile/Avatar"**.

![video](images/sample.gif)

## Settings

| Setting | Description | Default value |
|  ------ | ----------- | ------------- |
| Component Extension | Extension for creating components (JS / JSX / TS) | TSX |
| Component Function | Function declaration and the way of exporting components | AD
| Index File | Use index file for the component | NONE |
| Styles File Extension | Specifies extension for styles files | '.css' |
| Styles File Name | One name for any styles file (otherwise it inherited from the component name) | Not specified |
| Style Files Folder | If specified style files will be created in the separate folder (otherwise in component folder) | Not specified |
| Component Types | Place to put types of the component | FILE |
| Types File Name | One name for any types file (otherwise it inherited from the component name with .d.ts suffix) | Not specified |
| Types File Folder | If specified types files will be created in the separate folder (otherwise in component folder) | Not specified |
| Component Test File | Should test file be created for the component | false |
| Test Files Folder | If specified test files will be created in the separate folder (otherwise in component folder) | Not specified |
| Root Path | Path to the folder, where component path calculation starts | current workspace |

## Installation

You can download the extension from the VSCode marketplace [here](https://marketplace.visualstudio.com/items?itemName=DenisBratchikov.react-file-structure).

## License

React File Structure Creator is released under the [MIT License](https://github.com/DenisBratchikov/vscode-react-structure-creator/blob/master/LICENSE).

## Release

### 1.0.0

* Create extenstion
* Add two user commands
* Add settings to configure extension

### 2.0.0
* Refactor using parameters
* Add new parameters
