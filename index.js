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

function generateButton(variant = "default", size = "default", txt = "Button", href = "#", icon) {
  // Base styles
  const baseStyles = `
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    white-space: nowrap;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 700;
    border: none;
    outline: none;
    font-family: verdana;
    text-decoration: none;
    text-transform: uppercase;
  `;

  // Variant styles
  const variants = {
    default: `
      background-color: hsl(0, 0%, 9%);
      color: hsl(0, 0%, 98%);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    `,
    destructive: `
      background-color: hsl(0, 84%, 60%);
      color: hsl(0, 0%, 100%);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    `,
    outline: `
      border: 1px solid hsl(0, 0%, 89%);
      background-color: hsl(0, 0%, 100%);
      color: hsl(0, 0%, 9%);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    `,
    secondary: `
      background-color: hsl(0, 0%, 96%);
      color: hsl(0, 0%, 9%);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    `,
    ghost: `
      background-color: transparent;
      color: hsl(0, 0%, 9%);
    `,
    link: `
      background-color: transparent;
      color: hsl(0, 0%, 9%);
      text-decoration: underline;
      text-decoration-skip-ink: auto;
      text-underline-offset: 4px;
    `,
  };

  // Size styles
  const sizes = {
    default: `
      height: 2.25rem;
      padding: 0.5rem 1rem;
    `,
    sm: `
      height: 2rem;
      border-radius: 0.375rem;
      padding: 0rem 0.75rem;
    `,
    lg: `
      height: 2.5rem;
      border-radius: 0.375rem;
      padding: 0rem 1.5rem;
    `,
    icon: `
      width: 2.25rem;
      height: 2.25rem;
    `,
  };

  const buttonStyles = baseStyles + variants[variant] + sizes[size];

  return `
    <a target="_blank" href="https://${href}" style="${buttonStyles}">
     <img width="24px" src="https://iconkit.ronitghosh.site/icons?i=${icon}&t=light" alt="linkedin"/>
      ${txt}
    </a>
  `;
}

app.get("/buttons", (c) => {
  const { variant, size, text, href, icon } = c.req.query()

  if (variant !== 'default' &&
    variant !== 'destructive' &&
    variant !== 'outline' &&
    variant !== 'secondary' &&
    variant !== 'ghost' &&
    variant !== 'link') {
    return c.json({ msg: `${variant} is not valid variant!` }, 400)
  }
  if (size !== 'default' &&
    size !== 'sm' &&
    size !== 'lg' &&
    size !== 'icon') {
    return c.json({ msg: `${size} is not valid size!` }, 400)
  }

  const firstIcon = icon.split(",")[0]

  return c.html(
    generateButton(variant, size, text, href, firstIcon),
    200,
    { "Content-Type": "text/html" }
  )
})

app.get("/", (c) => { return c.redirect("./icons?i=all&t=dark") })

export default app
