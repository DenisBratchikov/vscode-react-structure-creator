# VSCode Extension. React File Structure Creator

This extension allows you to create react component file structure with one command. It gets component path from prompt dialog and creates folders and file with some preset code.

## Usage

The extension can be activated both via command palette and via folder context menu in VSCode file explorer. There are two commands for creating file structure:
* Create react file structure
* Create react file structure with options

The only difference between them is that the second command has an opportunity to override some settings (only for current execution).
In both commands you will be asked for a path to component. If you use index files (see [settings](#settings)) you should specify only component path, e.g. **user/profile**. Otherwise, you should also add component name in path, e.g. **user/profile/Avatar**.

Second command supports some options separated with comma, which *must* be before component path:
* **"l"** for extension, e.g. **l=TSX**
* **"s"** for style file, e.g. **s=CSS**
* **"i"** for interface file with **+** or **-** for including or excluding respectively, e.g. **i+**
* **"t"** for test file with **+** or **-** like interface above
* **"h"** for using hooks or not with **+** or **-** like interface above

Full second command input may look like **"l=TSX, s=CSS, i-, t-, h+, user/profile/Avatar"**.

![video](images/sample.gif)

## Settings

| Setting | Description | Default value |
|  ------ | ----------- | ------------- |
| Extension | Extension for react components (JS / JSX / TS) | TSX |
| Use React Hooks | Use react functions (on hooks) instead of classes | true |
| Root Path | Path to the folder, where component path calculation starts | current workspace |
| Use Index File | Create unnamed (style.css, index.jsx, test.js etc.) files instead of named files in component folder | true |
| Style files | Specifies extension for style files | SCSS (Sass) |
| Style Files Folder | If specified style files will be created in separate folder | component folder |
| Add Interface File | Adds interface file to component (for TSX extension only!) | true |
| Interface Files Folder | If specified interface files will created in separate folder | component folder |
| Add Test File | Adds test file to component | true |
| Test Files Folder | If specified test files will created in separate folder | component folder |

## Installation

You can download the extension from the VSCode marketplace [here](https://marketplace.visualstudio.com/items?itemName=DenisBratchikov.react-file-structure).

## License

React File Structure Creator is released under the [MIT License](https://github.com/DenisBratchikov/vscode-react-structure-creator/blob/master/LICENSE).

## Release

### 1.0.0

* Create extenstion
* Add two user commands
* Add settings to configure extension
