import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

class AnythingLLMViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly context: vscode.ExtensionContext) {
    console.log('AnythingLLMViewProvider constructor called.');
  }

  resolveWebviewView(webviewView: vscode.WebviewView) {
    console.log('AnythingLLMViewProvider: resolveWebviewView CALLED.');
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(path.join(this.context.extensionPath, 'dist', 'media'))]
    };
    const config = vscode.workspace.getConfiguration('anythingLLM');
    const apiBaseUrl = config.get<string>('apiBaseUrl') || '';
    const apiKey = config.get<string>('apiKey') || '';

    const htmlPath = path.join(this.context.extensionPath, 'dist', 'media', 'chat-ui.html');
    let html = fs.readFileSync(htmlPath, 'utf8');
    html = html
      .replace('API_URL_PLACEHOLDER', apiBaseUrl)
      .replace('API_KEY_PLACEHOLDER', apiKey);

    webviewView.webview.html = html;
    console.log('AnythingLLMViewProvider: resolveWebviewView FINISHED (full HTML).');
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('AnythingLLM extension activating...'); 

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

  console.log('Registering AnythingLLMViewProvider...'); 
  const viewProvider = new AnythingLLMViewProvider(context);
  console.log('AnythingLLMViewProvider instance created.');
  const registration = vscode.window.registerWebviewViewProvider('anythingLLMView', viewProvider);
  console.log('View provider registration call completed.');
  context.subscriptions.push(registration);
  console.log('AnythingLLMViewProvider pushed to subscriptions.');

  // Attempt to focus the view programmatically
  // vscode.commands.executeCommand('anythingLLMView.focus').then(() => {
  //   console.log('Command anythingLLMView.focus executed successfully.');
  // }, (err) => {
  //   console.error('Command anythingLLMView.focus failed:', err);
  // });

  const disposable = vscode.commands.registerCommand('anything-llm.openChat', () => {
    const panel = vscode.window.createWebviewPanel(
      'anythingLLMChat',
      'AnythingLLM Chat Viewer',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'dist', 'media'))
        ]
      }
    );

    const config = vscode.workspace.getConfiguration('anythingLLM');
    const apiBaseUrl = config.get<string>('apiBaseUrl') || '';
    const apiKey = config.get<string>('apiKey') || '';

    const htmlPath = path.join(context.extensionPath, 'dist', 'media', 'chat-ui.html');
    let html = fs.readFileSync(htmlPath, 'utf8');
    html = html
      .replace('API_URL_PLACEHOLDER', apiBaseUrl)
      .replace('API_KEY_PLACEHOLDER', apiKey);

    panel.webview.html = html;
  });

  context.subscriptions.push(disposable);
  console.log('AnythingLLM extension activation complete.');
}

export function deactivate() {
  console.log('AnythingLLM extension deactivating...'); 
}
