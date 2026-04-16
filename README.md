# XML XSLT Transformer

A powerful VS Code extension to transform XML documents using XSLT. No Java/JAR dependencies required - everything runs in Node.js with the xslt-processor library for reliable XSLT transformation.

## Features

* 🚀 **No Java Required**: Uses Node.js instead of Java for fast transformations
* 📄 **Multiple Output Formats**: Supports HTML, XML, XHTML, Text, JSON, and Adaptive output methods
* 🔍 **Smart XSL Detection**: Automatically finds XSL files via XML processing instructions or filename matching
* 🎨 **Auto-Formatting**: Beautifies output for better readability
* 🖱️ **Context Menu Integration**: Right-click on XML files for quick access
* ⚡ **Fast & Lightweight**: Minimal footprint with instant transformations

## Installation

1. Download the `.vsix` file from the [Releases](https://github.com/Capycodigo/XSL-Transform/releases) page
2. In VS Code: `Extensions > Install from VSIX...` or drag the file into the editor
3. Reload VS Code

## Usage

### Method 1: Command Palette
1. Open an XML file in VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "XSL: Transform XML" and select it

### Method 2: Context Menu
1. Right-click on an open XML file
2. Select "XSL: Transform XML" from the context menu

## How It Works

1. **XSL Detection**: The extension looks for XSL references in XML `<?xml-stylesheet?>` processing instructions
2. **Fallback**: If no reference found, it searches for a same-name `.xsl` file in the same directory
3. **Transformation**: Uses the `xslt-processor` library for reliable XSLT 1.0+ processing
4. **Output**: Saves the result with appropriate extension based on XSL output method

## Output Formats

The extension automatically detects the output format from your XSL:

| XSL Output Method | File Extension | Description |
|-------------------|----------------|-------------|
| `html` | `.html` | HTML document |
| `xhtml` | `.xhtml` | XHTML document |
| `xml` | `.xml` | XML document |
| `text` | `.txt` | Plain text |
| `json` | `.json` | JSON data |
| `adaptive` | `.html` | Adaptive (defaults to HTML) |

## Example

### XML File (data.xml)
```xml
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="transform.xsl"?>
<books>
  <book id="1">
    <title>XML Guide</title>
    <author>John Doe</author>
  </book>
</books>
```

### XSL File (transform.xsl)
```xml
<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html"/>
  <xsl:template match="/">
    <html>
      <body>
        <h1>Book List</h1>
        <ul>
          <xsl:for-each select="books/book">
            <li><xsl:value-of select="title"/> by <xsl:value-of select="author"/></li>
          </xsl:for-each>
        </ul>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
```

### Output (data.html)
```html
<html>
  <body>
    <h1>Book List</h1>
    <ul>
      <li>XML Guide by John Doe</li>
    </ul>
  </body>
</html>
```

## Requirements

- Visual Studio Code 1.115.0 or later
- Local XML and XSL files

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter issues or have questions:
- Check the [Issues](https://github.com/Capycodigo/XSL-Transform/issues) page
- Create a new issue with detailed information
- Include sample XML/XSL files if possible

## Notes

* The extension uses the `xslt-processor` npm package.
* No Java or external processor is required.
* If no stylesheet instruction is present and no same-name XSL file exists, the extension will report the missing XSL file.

## Release Notes

### 1.0.0

* Initial public version with XML/XSL transformation support.
