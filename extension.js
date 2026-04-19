const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function isShinyProject() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) return false;

  const root = workspaceFolders[0].uri.fsPath;

  if (fs.existsSync(path.join(root, 'app.R'))) return true;

  if (
    fs.existsSync(path.join(root, 'ui.R')) &&
    fs.existsSync(path.join(root, 'server.R'))
  ) return true;

  return false;
}

function isShinyRmd() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return false;

  const filePath = editor.document.uri.fsPath;
  if (!filePath.match(/\.Rmd$/i)) return false;

  const content = editor.document.getText();
  return /^runtime:\s*shiny/m.test(content);
}

function updateContext() {
  vscode.commands.executeCommand(
    'setContext',
    'shinyConsoleRunner.isShinyProject',
    isShinyProject()
  );
  vscode.commands.executeCommand(
    'setContext',
    'shinyConsoleRunner.isShinyRmd',
    isShinyRmd()
  );
}

function getPositron() {
  return vscode.extensions.getExtension('vscode.positron')?.exports
    ?? require('positron');
}

function activate(context) {
  updateContext();

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(updateContext)
  );

  // Ctrl+Shift+Enter: run shiny app from app.R / ui.R + server.R
  context.subscriptions.push(
    vscode.commands.registerCommand('shiny-console-runner.run', async () => {
      const positron = getPositron();
      await positron.runtime.executeCode(
        'r',
        'shiny::runApp(launch.browser = rstudioapi::viewer)',
        true
      );
    })
  );

  // Ctrl+Shift+K: run shiny Rmd via rmarkdown::run()
  context.subscriptions.push(
    vscode.commands.registerCommand('shiny-console-runner.runRmd', async () => {
      const editor = vscode.window.activeTextEditor;
      const filePath = editor.document.uri.fsPath;
      const fileName = path.basename(filePath);
      const positron = getPositron();
      await positron.runtime.executeCode(
        'r',
        `rmarkdown::run(${JSON.stringify(fileName)}, shiny_args = list(launch.browser = rstudioapi::viewer))`,
        true
      );
    })
  );
}

function deactivate() {}

module.exports = { activate, deactivate };