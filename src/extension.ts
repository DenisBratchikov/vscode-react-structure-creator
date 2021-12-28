import * as vscode from 'vscode';
import Creator from './creator/creator';
import {showError, getConfig, getComponentPath, getComponentPathWithOptions} from './utils';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const creation = vscode.commands.registerCommand('extension.create', (folder) => {
		// The code you place here will be executed every time your command is executed

		getConfig(folder?.fsPath).then(
			cfg => getComponentPath(cfg).then(path => new Creator({componentPath: path}, cfg).execute())
		).catch(showError);
	});

	const customCreation = vscode.commands.registerCommand('extension.createCustom', (folder) => {
		// The code you place here will be executed every time your command is executed

		getConfig(folder?.fsPath).then(
			cfg => getComponentPathWithOptions(cfg).then(path => new Creator({componentPath: path}, cfg).execute())
		).catch(showError);
	});

	// const componentDoc = vscode.commands.registerCommand('extension.openComponentDoc', () => getLink());

	context.subscriptions.push(creation, customCreation);
}

// this method is called when your extension is deactivated
export function deactivate() {}
