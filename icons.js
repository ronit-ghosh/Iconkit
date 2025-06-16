import fs from "node:fs"

const iconsDir = fs.readdirSync('./icons');
const icons = {};
for (const icon of iconsDir) {
  const formattedName = icon.replace('.svg', '').toLowerCase();
  icons[formattedName] = String(fs.readFileSync(`./icons/${icon}`));
}

fs.writeFileSync('./icons.json', JSON.stringify(icons));
