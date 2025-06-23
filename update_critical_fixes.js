/**
 * Script to update all HTML files with critical fixes
 * Run this script with Node.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const htmlFiles = [
    'index.html',
    'products.html',
    'brands/nike.html',
    'brands/adidas.html',
    'brands/jordan.html',
    'brands/new-balance.html',
    'brands/puma.html',
    'brands/reebok.html',
    'brands/asics.html',
    'brands/converse.html'
];

// Critical fix scripts to include
const criticalScripts = [
    '<script src="/js/currency-fix.js"></script>',
    '<script src="/js/filter-fix.js"></script>',
    '<script src="/js/direct-fix.js"></script>'
];

// Critical CSS to include
const criticalCSS = [
    '<link rel="stylesheet" href="/css/grid-fix.css">'
];

// Process each HTML file
htmlFiles.forEach(htmlFile => {
    const filePath = path.join(__dirname, htmlFile);
    
    try {
        // Read the file
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if fixes are already applied
        const hasAllScripts = criticalScripts.every(script => content.includes(script));
        const hasAllCSS = criticalCSS.every(css => content.includes(css));
        
        if (hasAllScripts && hasAllCSS) {
            console.log(`${htmlFile} already has all critical fixes`);
            return;
        }
        
        // Insert critical scripts before </body>
        criticalScripts.forEach(script => {
            if (!content.includes(script)) {
                content = content.replace('</body>', `    ${script}\n</body>`);
                console.log(`Added ${script} to ${htmlFile}`);
            }
        });
        
        // Insert critical CSS before </head>
        criticalCSS.forEach(css => {
            if (!content.includes(css)) {
                content = content.replace('</head>', `    ${css}\n</head>`);
                console.log(`Added ${css} to ${htmlFile}`);
            }
        });
        
        // Write the updated content back to the file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${htmlFile} with critical fixes`);
    } catch (error) {
        console.error(`Error updating ${htmlFile}:`, error);
    }
});

console.log('Critical fixes update complete'); 