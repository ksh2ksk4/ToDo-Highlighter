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
  const styles = {
    default: {
      backgroundColor: '#d66a35',  // 黄櫨染(こうろぜん)
      color: 'black'
    },
    changed: {
      backgroundColor: '#8f2e14',  // 弁柄色(べんがらいろ)
      color: 'black'
    },
    fixme: {
      backgroundColor: '#69b076',  // 薄緑(うすみどり)
      color: 'black'
    },
    hack: {
      backgroundColor: '#aa4c8f',  // 梅紫(うめむらさき)
      color: 'black'
    },
    note: {
      backgroundColor: '#d0af47',  // 芥子色(からしいろ)
      color: 'black'
    },
    optimize: {
      backgroundColor: '#a22041',  // 真紅(しんく)
      color: 'black'
    },
    review: {
      backgroundColor: '#5c929a',  // 錆浅葱(さびあさぎ)
      color: 'black'
    },
    todo: {
      backgroundColor: '#cca6bf',  // 紅藤色(べにふじいろ)
      color: 'black'
    },
    warning: {
      backgroundColor: '#19448e',  // 瑠璃紺(るりこん)
      color: 'black'
    },
    xxx: {
      backgroundColor: '#74325c',  // 暗紅色(あんこうしょく)
      color: 'black'
    }
  };
  const decorationTypes = {
    default: vscode.window.createTextEditorDecorationType({
      backgroundColor: styles.default.backgroundColor,
      color: styles.default.color
    }),
    changed: vscode.window.createTextEditorDecorationType({
      backgroundColor: styles.changed.backgroundColor,
      color: styles.changed.color
    }),
    fixme: vscode.window.createTextEditorDecorationType({
      backgroundColor: styles.fixme.backgroundColor,
      color: styles.fixme.color
    }),
    hack: vscode.window.createTextEditorDecorationType({
      backgroundColor: styles.hack.backgroundColor,
      color: styles.hack.color
    }),
    note: vscode.window.createTextEditorDecorationType({
      backgroundColor: styles.note.backgroundColor,
      color: styles.note.color
    }),
    optimize: vscode.window.createTextEditorDecorationType({
      backgroundColor: styles.optimize.backgroundColor,
      color: styles.optimize.color
    }),
    review: vscode.window.createTextEditorDecorationType({
      backgroundColor: styles.review.backgroundColor,
      color: styles.review.color
    }),
    todo: vscode.window.createTextEditorDecorationType({
      backgroundColor: styles.todo.backgroundColor,
      color: styles.todo.color
    }),
    warning: vscode.window.createTextEditorDecorationType({
      backgroundColor: styles.warning.backgroundColor,
      color: styles.warning.color
    }),
    xxx: vscode.window.createTextEditorDecorationType({
      backgroundColor: styles.xxx.backgroundColor,
      color: styles.xxx.color
    })
  };
  console.log('todo-highlighter - decorationTypes:');
  console.dir(decorationTypes);

  let activeTextEditor = vscode.window.activeTextEditor;

  function updateDecorations() {
    if (!activeTextEditor) {
      return;
    }

    const re = /\/\/\s*(changed|fixme|hack|note|optimize|review|todo|warning|xxx)\s+.*?\n|\/\*\*\n\s+\*\s*(changed|fixme|hack|note|optimize|review|todo|warning|xxx)\s+.*?\n(?:.*?\n)*?\s+\*\//ig;

    let text = activeTextEditor.document.getText();
    let match;

    let comments = [];

    for (let i = 0; i < keywords.length; i++) {
      comments[keywords[i]] = [];
    }

    while ((match = re.exec(text))) {
      console.log(`todo-highlighter - match[0]: ${match[0]}`);
      console.log(`todo-highlighter - match[1]: ${match[1]}`);
      console.log(`todo-highlighter - match[2]: ${match[2]}`);

      let decoration = {
        range: new vscode.Range(
          activeTextEditor.document.positionAt(match.index),
          activeTextEditor.document.positionAt(match.index + match[0].length)
        ),
        hoverMessage: 'comments'
      }

      match[2] === undefined && comments[match[1]].push(decoration);
      match[1] === undefined && comments[match[2]].push(decoration);
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
