import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

class AnythingLLMViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    const config = vscode.workspace.getConfiguration('anythingLLM');
    const apiBaseUrl = config.get<string>('apiBaseUrl') || '';
    const apiKey = config.get<string>('apiKey') || '';

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(path.join(this.context.extensionPath, 'media'))]
    };

    const htmlPath = path.join(this.context.extensionPath, 'dist', 'media', 'chat-ui.html');
    let html = fs.readFileSync(htmlPath, 'utf8');
    html = html
      .replace('API_URL_PLACEHOLDER', apiBaseUrl)
      .replace('API_KEY_PLACEHOLDER', apiKey);

    webviewView.webview.html = html;
  }
}

export function activate(context: vscode.ExtensionContext) {
  const currVersion = vscode.extensions.getExtension('MehrdadAlemzadeh.anything-llm')?.packageJSON.version;
  const prevVersion = context.globalState.get<string>('extensionVersion');

  if (!prevVersion) {
    context.globalState.update('extensionVersion', currVersion);
  } else if (prevVersion !== currVersion) {
    vscode.window.showInformationMessage(
      `✅ AnythingLLM updated to v${currVersion}.`,
      'Reload to Apply',
      'View Changelog'
    ).then(selection => {
      if (selection === 'Reload to Apply') {
        vscode.commands.executeCommand('workbench.action.reloadWindow');
      } else if (selection === 'View Changelog') {
        vscode.commands.executeCommand(
          'vscode.open',
          vscode.Uri.parse('https://github.com/mehrdad-zade/vsc-plugin-anythingllm/blob/main/CHANGELOG.md')
        );
      }
    });
    context.globalState.update('extensionVersion', currVersion);
  }

  const viewProvider = new AnythingLLMViewProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('anythingLLMView', viewProvider)
  );

  const disposable = vscode.commands.registerCommand('anything-llm.openChat', () => {
    const panel = vscode.window.createWebviewPanel(
      'anythingLLMChat',
      'AnythingLLM Chat Viewer',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'media'))
        ]
      }
    );

    const config = vscode.workspace.getConfiguration('anythingLLM');
    const apiBaseUrl = config.get<string>('apiBaseUrl') || '';
    const apiKey = config.get<string>('apiKey') || '';

    const htmlPath = path.join(context.extensionPath, 'media', 'chat-ui.html');
    let html = fs.readFileSync(htmlPath, 'utf8');
    html = html
      .replace('API_URL_PLACEHOLDER', apiBaseUrl)
      .replace('API_KEY_PLACEHOLDER', apiKey);

    panel.webview.html = html;
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
