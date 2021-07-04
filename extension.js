const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  vscode.window.showInformationMessage('activated');
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
}
