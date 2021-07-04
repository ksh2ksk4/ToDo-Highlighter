const vscode = require('vscode');

function highlight(context) {
  console.log('todo-highlighter - highlight(): start');

  // NodeJS.Timer | undefined
  let timeout = undefined;

  const decorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: '#cca6bf'  // 紅藤色(べにふじいろ)
  });

  let activeTextEditor = vscode.window.activeTextEditor;

  function updateDecorations() {
    if (!activeTextEditor) {
      return;
    }

    const re = /\/\/\s*(changed|fixme|hack|note|optimize|review|todo|warning|xxx).*/ig;
    let text = activeTextEditor.document.getText();
    let match;

    // vscode.DecorationOptions[]
    let keywords = [];

    while ((match = re.exec(text))) {
      console.log(`todo-highlighter - match[1]: ${match[1]}`);

      let decoration = {
      range: new vscode.Range(
        activeTextEditor.document.positionAt(match.index),
        activeTextEditor.document.positionAt(match.index + match[0].length)
      ),
      hoverMessage: 'keywords'
    }

      keywords.push(decoration);
    }

    activeTextEditor.setDecorations(decorationType, keywords);
  }

  function triggerUpdateDecorations() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }

    timeout = setTimeout(updateDecorations, 500);
  }

  if (activeTextEditor) {
    triggerUpdateDecorations();
  }

  vscode.window.onDidChangeActiveTextEditor(editor => {
    activeTextEditor = editor;

    if (editor) {
      triggerUpdateDecorations();
    }
  }, null, context.subscriptions);

  vscode.workspace.onDidChangeTextDocument(event => {
    if (activeTextEditor && event.document === activeTextEditor.document) {
      triggerUpdateDecorations();
    }
  }, null, context.subscriptions);

  console.log('todo-highlighter - highlight(): end');
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('todo-highlighter - activate(): start');
  highlight(context);
  console.log('todo-highlighter - activate(): end');
}

function deactivate() {
  console.log('todo-highlighter - deactivate(): start');
  console.log('todo-highlighter - deactivate(): end');
}

module.exports = {
  activate,
  deactivate
}
