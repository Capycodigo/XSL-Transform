import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { Xslt, XmlParser } from 'xslt-processor';

type XsltOutputMethod = 'html' | 'text' | 'json' | 'xml' | 'xhtml' | 'adaptive';

function resolveXslPath(xmlPath: string, xmlString: string): string | undefined {
    const piMatch = xmlString.match(/<\?xml-stylesheet[^>]*href=["']([^"']+)["'][^>]*\?>/i);
    if (piMatch && piMatch[1]) {
        return path.resolve(path.dirname(xmlPath), piMatch[1]);
    }

    return path.format({
        dir: path.dirname(xmlPath),
        name: path.basename(xmlPath, path.extname(xmlPath)),
        ext: '.xsl'
    });
}

function getXslOutputMethod(xslString: string): XsltOutputMethod | undefined {
    const match = xslString.match(/<xsl:output[^>]*method=["']([^"']+)["'][^>]*\/?>(?:<\/xsl:output>)?/i);
    const method = match?.[1].toLowerCase();
    const validMethods: XsltOutputMethod[] = ['html', 'text', 'json', 'xml', 'xhtml', 'adaptive'];
    return validMethods.includes(method as XsltOutputMethod) ? (method as XsltOutputMethod) : undefined;
}

function getOutputExtension(method?: XsltOutputMethod): string {
    switch (method) {
        case 'html':
            return '.html';
        case 'xhtml':
            return '.xhtml';
        case 'text':
            return '.txt';
        case 'json':
            return '.json';
        case 'xml':
            return '.xml';
        default:
            return '.html';
    }
}

function formatHtmlOrXml(value: string): string {
    const indentSize = 2;
    const xml = value.replace(/>\s*</g, '>' + '\n' + '<').trim();
    const tokens = xml.split(/\r?\n/);

    let indentLevel = 0;
    return tokens
        .map((token) => {
            const trimmed = token.trim();
            if (trimmed.match(/^<\/[^>]+>/)) {
                indentLevel = Math.max(indentLevel - 1, 0);
            }

            const indent = ' '.repeat(indentLevel * indentSize);
            const line = indent + trimmed;

            const isOpeningTag = /^<[^\/?!][^>]*>$/.test(trimmed);
            const isSelfClosing = /<[^>]+\/>$/.test(trimmed);
            const hasClosingOnSameLine = /^<[^>]+>.*<\/[^>]+>$/.test(trimmed);

            if (isOpeningTag && !isSelfClosing && !hasClosingOnSameLine) {
                indentLevel += 1;
            }

            return line;
        })
        .join('\n');
}

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('xml-xslt-transformer.runTransform', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found. Open an XML file first.');
            return;
        }

        const document = editor.document;
        const xmlPath = document.uri.fsPath;
        const xmlExt = path.extname(xmlPath).toLowerCase();

        if (xmlExt !== '.xml') {
            vscode.window.showErrorMessage('The active file is not XML. Open a .xml file to transform.');
            return;
        }

        try {
            const xmlString = fs.readFileSync(xmlPath, 'utf8');
            const xslPath = resolveXslPath(xmlPath, xmlString);

            if (!xslPath || !fs.existsSync(xslPath)) {
                vscode.window.showErrorMessage(`XSL file not found. Expected: ${xslPath}`);
                return;
            }

            const xslString = fs.readFileSync(xslPath, 'utf8');
            const xslMethod = getXslOutputMethod(xslString);
            const outputPath = path.format({
                dir: path.dirname(xmlPath),
                name: path.basename(xmlPath, xmlExt),
                ext: getOutputExtension(xslMethod)
            });

            const xmlParser = new XmlParser();
            const xslt = new Xslt({
                outputMethod: xslMethod ?? 'html',
                selfClosingTags: false
            });

            const xmlDoc = xmlParser.xmlParse(xmlString);
            const xslDoc = xmlParser.xmlParse(xslString);
            const result = await xslt.xsltProcess(xmlDoc, xslDoc);

            const formatted = formatHtmlOrXml(result);
            fs.writeFileSync(outputPath, formatted, 'utf8');

            vscode.window.showInformationMessage(`Transformation completed: ${path.basename(outputPath)}`);
        } catch (err: any) {
            vscode.window.showErrorMessage(`XSLT transformation failed: ${err.message ?? err.toString()}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
