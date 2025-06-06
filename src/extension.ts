import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
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
    const debug = config.get<boolean>('debugLogs') || false;

    if (debug) {
      console.log('[AnythingLLM] Extension loaded.');
      console.log(`[AnythingLLM] API Base URL: ${apiBaseUrl}`);
      console.log(`[AnythingLLM] API Key Set: ${apiKey ? '✔️' : '❌'}`);
    }

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
