const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else if (fullPath.endsWith('.jsx')) {
            results.push(fullPath);
        }
    });
    return results;
}

const files = walk(srcDir);
let totalReplaced = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    // Backgrounds
    content = content.replace(/bg-\[\#0a0a1a\]/g, 'bg-bgPrimary');
    content = content.replace(/bg-white\/5(?!0)/g, 'bg-bgSecondary');
    content = content.replace(/bg-white\/10/g, 'bg-bgSecondary');
    
    // Borders
    content = content.replace(/border-white\/10/g, 'border-borderColor');
    content = content.replace(/border-white\/20/g, 'border-borderColor');
    content = content.replace(/border-white\/5/g, 'border-borderColor');
    
    // Texts
    content = content.replace(/text-white(?!\/)/g, 'text-textPrimary');
    content = content.replace(/text-white\/50/g, 'text-textSecondary');
    content = content.replace(/text-white\/40/g, 'text-textSecondary');
    content = content.replace(/text-white\/60/g, 'text-textSecondary');
    content = content.replace(/text-white\/30/g, 'text-textSecondary');
    content = content.replace(/text-white\/70/g, 'text-textSecondary');
    
    if (content !== originalContent) {
        fs.writeFileSync(file, content);
        totalReplaced++;
        console.log('Updated:', path.basename(file));
    }
});

console.log(`\nSuccessfully updated ${totalReplaced} files.`);
