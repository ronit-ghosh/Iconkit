import { Hono } from "hono"
import icons from "./icons.json"

const app = new Hono()

const iconNameList = [...new Set(Object.keys(icons).map(i => i.split('-')[0]))];

const shortNames = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  tailwind: 'tailwindcss',
  vue: 'vuejs',
  nuxt: 'nuxtjs',
  go: 'golang',
  cf: 'cloudflare',
  wasm: 'webassembly',
  postgres: 'postgresql',
  k8s: 'kubernetes',
  next: 'nextjs',
  mongo: 'mongodb',
  md: 'markdown',
  ps: 'photoshop',
  ai: 'illustrator',
  pr: 'premiere',
  ae: 'aftereffects',
  scss: 'sass',
  sc: 'scala',
  net: 'dotnet',
  gatsbyjs: 'gatsby',
  gql: 'graphql',
  vlang: 'v',
  amazonwebservices: 'aws',
  bots: 'discordbots',
  express: 'expressjs',
  googlecloud: 'gcp',
  mui: 'materialui',
  windi: 'windicss',
  unreal: 'unrealengine',
  nest: 'nestjs',
  ktorio: 'ktor',
  pwsh: 'powershell',
  au: 'audition',
  rollup: 'rollupjs',
  rxjs: 'reactivex',
  rxjava: 'reactivex',
  ghactions: 'githubactions',
  sklearn: 'scikitlearn',
  f360: 'fusion360',
  jupyter: 'jupyternotebook',
  gcolab: 'googlecolab',
  motion: 'framermotion'
};

const themedIcons = [
  ...Object.keys(icons)
    .filter(i => i.includes('-light') || i.includes('-dark') || i.includes('-charcoal'))
    .map(i => i.split('-')[0]),
];

const ICONS_PER_LINE = 15;
const SINGLE_ICON = 48;
const SCALE = SINGLE_ICON / (300 - 44);

function generateSvg(iconNames, perLine) {
  const iconSvgList = iconNames.map(i => icons[i]); // put the svg as an array 

  const length = Math.min(perLine * 300, iconNames.length * 300) - 44;
  const height = Math.ceil(iconSvgList.length / perLine) * 300 - 44;
  const scaledHeight = height * SCALE;
  const scaledWidth = length * SCALE;

  return `
  <svg width="${scaledWidth}" height="${scaledHeight}" viewBox="0 0 ${length} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
    ${iconSvgList
      .map(
        (i, index) =>
          `
        <g transform="translate(${(index % perLine) * 300}, ${Math.floor(index / perLine) * 300
          })">
          ${i}
        </g>
        `
      )
      .join(' ')}
  </svg>
  `;
}

function parseShortNames(names, theme = 'dark') {
  return names.map(name => {
    if (iconNameList.includes(name))
      return name + (themedIcons.includes(name) ? `-${theme}` : '');
    else if (name in shortNames)
      return (
        shortNames[name] +
        (themedIcons.includes(shortNames[name]) ? `-${theme}` : '')
      );
  });
}

app.get("/icons", (c) => {
  try {
    const { i, t, pl } = c.req.query();

    if (!i) {
      return c.json({ msg: "You didn't specify any icons!" }, 400);
    }

    const theme = t || "dark";

    if (theme !== 'light' && theme !== 'dark' && theme !== 'charcoal') {
      return c.json({ msg: "Theme must be either 'light', 'dark' or 'charcoal';" }, 400);
    }

    const perline = pl || ICONS_PER_LINE

    if (isNaN(perline) || perline < -1 || perline > 50) {
      return c.json({ msg: "Icons per line must be a number between 1 and 50" }, 400)
    }

    let iconShortNames = [];
    if (i === 'all') iconShortNames = iconNameList;
    else iconShortNames = i.split(',');

    const iconNames = parseShortNames(iconShortNames, theme || undefined);
    if (!iconNames) {
      return c.json({ msg: "You didn't format the icons param correctly!" }, 400);
    }

    const svg = generateSvg(iconNames, perline);

    return c.html(
      svg,
      200,
      { "Content-Type": "image/svg+xml" }
    );
  } catch (error) {
    console.error(error)
    c.json({ msg: "Something went wrong!" }, 500)
  }
});

app.get("/", (c) => { return c.redirect("./icons?i=all&t=dark") })

export default app
