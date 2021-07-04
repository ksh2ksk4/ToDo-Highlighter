const vscode = require('vscode');

function highlight(context) {
  console.log('todo-highlighter - highlight(): start');

  // NodeJS.Timer | undefined
  let timeout = undefined;

  const keywords = [
    'changed',
    'fixme',
    'hack',
    'note',
    'optimize',
    'review',
    'todo',
    'warning',
    'xxx'
  ];
  const backgroundColors = {
    default: '#d66a35',  // 黄櫨染(こうろぜん)
    changed: '#8f2e14',  // 弁柄色(べんがらいろ)
    fixme: '#69b076',  // 薄緑(うすみどり)
    hack: '#aa4c8f',  // 梅紫(うめむらさき)
    note: '#d0af47',  // 芥子色(からしいろ)
    optimize: '#a22041',  // 真紅(しんく)
    review: '#5c929a',  // 錆浅葱(さびあさぎ)
    todo: '#cca6bf',  // 紅藤色(べにふじいろ)
    warning: '#19448e',  // 瑠璃紺(るりこん)
    xxx: '#74325c'  // 暗紅色(あんこうしょく)
  };
  const decorationTypes = {
    default: vscode.window.createTextEditorDecorationType({
      backgroundColor: backgroundColors.default
    }),
    changed: vscode.window.createTextEditorDecorationType({
      backgroundColor: backgroundColors.changed
    }),
    fixme: vscode.window.createTextEditorDecorationType({
      backgroundColor: backgroundColors.fixme
    }),
    hack: vscode.window.createTextEditorDecorationType({
      backgroundColor: backgroundColors.hack
    }),
    note: vscode.window.createTextEditorDecorationType({
      backgroundColor: backgroundColors.note
    }),
    optimize: vscode.window.createTextEditorDecorationType({
      backgroundColor: backgroundColors.optimize
    }),
    review: vscode.window.createTextEditorDecorationType({
      backgroundColor: backgroundColors.review
    }),
    todo: vscode.window.createTextEditorDecorationType({
      backgroundColor: backgroundColors.todo
    }),
    warning: vscode.window.createTextEditorDecorationType({
      backgroundColor: backgroundColors.warning
    }),
    xxx: vscode.window.createTextEditorDecorationType({
      backgroundColor: backgroundColors.xxx
    })
  };
  console.log('todo-highlighter - decorationTypes:');
  console.dir(decorationTypes);

  let activeTextEditor = vscode.window.activeTextEditor;

  function updateDecorations() {
    if (!activeTextEditor) {
      return;
    }

    const re = /\/\/\s*(changed|fixme|hack|note|optimize|review|todo|warning|xxx)\s+.*?\n/ig;
    let text = activeTextEditor.document.getText();
    let match;

    let comments = [];

    for (let i = 0; i < keywords.length; i++) {
      comments[keywords[i]] = [];
    }

    while ((match = re.exec(text))) {
      console.log(`todo-highlighter - match[0]: ${match[0]}`);
      console.log(`todo-highlighter - match[1]: ${match[1]}`);

      let decoration = {
        range: new vscode.Range(
          activeTextEditor.document.positionAt(match.index),
          activeTextEditor.document.positionAt(match.index + match[0].length)
        ),
        hoverMessage: 'comments'
      }

      if (comments[match[1]] === undefined) {
        comments[match[1]] = [];
      }
      comments[match[1]].push(decoration);
    }
    console.log('todo-highlighter - comments:');
    console.dir(comments);

    for (let i = 0; i < keywords.length; i++) {
      let keyword = keywords[i];

      if (comments[keyword] !== []) {
        activeTextEditor.setDecorations(decorationTypes[keyword], comments[keyword]);
      }
    }
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
