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

  const configuration = vscode.workspace.getConfiguration('todo-highlighter');
  console.log('todo-highlighter - configuration:');
  console.dir(configuration);

  let settings = {
    'keywords': {
      'activated': {
        'changed': configuration.get('keywords.activated.changed'),
        'fixme': configuration.get('keywords.activated.fixme'),
        'hack': configuration.get('keywords.activated.hack'),
        'note': configuration.get('keywords.activated.note'),
        'optimize': configuration.get('keywords.activated.optimize'),
        'review': configuration.get('keywords.activated.review'),
        'todo': configuration.get('keywords.activated.todo'),
        'warning': configuration.get('keywords.activated.warning'),
        'xxx': configuration.get('keywords.activated.xxx')
      },
      'decorationTypes': {
        'changed': vscode.window.createTextEditorDecorationType({
          backgroundColor: configuration.get('keywords.backgroundColor.changed'),
          color: configuration.get('keywords.color.changed')
        }),
        'fixme': vscode.window.createTextEditorDecorationType({
          backgroundColor: configuration.get('keywords.backgroundColor.fixme'),
          color: configuration.get('keywords.color.fixme')
        }),
        'hack': vscode.window.createTextEditorDecorationType({
          backgroundColor: configuration.get('keywords.backgroundColor.hack'),
          color: configuration.get('keywords.color.hack')
        }),
        'note': vscode.window.createTextEditorDecorationType({
          backgroundColor: configuration.get('keywords.backgroundColor.note'),
          color: configuration.get('keywords.color.note')
        }),
        'optimize': vscode.window.createTextEditorDecorationType({
          backgroundColor: configuration.get('keywords.backgroundColor.optimize'),
          color: configuration.get('keywords.color.optimize')
        }),
        'review': vscode.window.createTextEditorDecorationType({
          backgroundColor: configuration.get('keywords.backgroundColor.review'),
          color: configuration.get('keywords.color.review')
        }),
        'todo': vscode.window.createTextEditorDecorationType({
          backgroundColor: configuration.get('keywords.backgroundColor.todo'),
          color: configuration.get('keywords.color.todo')
        }),
        'warning': vscode.window.createTextEditorDecorationType({
          backgroundColor: configuration.get('keywords.backgroundColor.warning'),
          color: configuration.get('keywords.color.warning')
        }),
        'xxx': vscode.window.createTextEditorDecorationType({
          backgroundColor: configuration.get('keywords.backgroundColor.xxx'),
          color: configuration.get('keywords.color.xxx')
        })
      }
    },
    'misc': configuration.get('misc.regexps')
  };
  console.dir(settings);

  let activeTextEditor = vscode.window.activeTextEditor;

  function updateDecorations() {
    if (!activeTextEditor) {
      return;
    }

    //const re = /\/\/\s*(changed|fixme|hack|note|optimize|review|todo|warning|xxx)\s+.*?\n|\/\*\*\n\s+\*\s*(changed|fixme|hack|note|optimize|review|todo|warning|xxx)\s+.*?\n(?:.*?\n)*?\s+\*\/\n/ig;
    //const re = new RegExp(
    //  '//\\s*?(changed|fixme|hack|note|optimize|review|todo|warning|xxx)\\s+.*?\\n|/\\*\\*\\n\\s+\\*\\s*(changed|fixme|hack|note|optimize|review|todo|warning|xxx)\\s+.*?\\n(?:.*?\\n)*?\\s+\\*/\\n',
    //  'ig'
    //);

    let group = [];

    for (let i = 0; i < keywords.length; i++) {
      if (settings.keywords.activated[keywords[i]] === true) {
        group.push(keywords[i]);
      }
    }

    const re = RegExp(
      '//\\s*?(' + group.join('|') + ')\\s+.*?\\n|/\\*\\*\\n\\s+\\*\\s*(' + group.join('|') + ')\\s+.*?\\n(?:.*?\\n)*?\\s+\\*/\\n',
      'ig'
    );

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

      match[2] === undefined && comments[match[1].toLowerCase()].push(decoration);
      match[1] === undefined && comments[match[2].toLowerCase()].push(decoration);
    }
    console.log('todo-highlighter - comments:');
    console.dir(comments);

    for (let i = 0; i < keywords.length; i++) {
      let keyword = keywords[i];

      if (comments[keyword] !== []) {
        activeTextEditor.setDecorations(settings.keywords.decorationTypes[keyword], comments[keyword]);
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
