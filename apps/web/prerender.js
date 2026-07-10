import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (p) => path.resolve(__dirname, p);

const template = fs.readFileSync(resolve("build/static/index.html"), "utf-8");
const { render } = await import("./build/server/entry-server.js");

const routesToPrerender = fs.readdirSync(resolve("src/pages"))
  .map(file => {
    const name = file.replace("Page.tsx", "").toLowerCase();
    return name === "home" ? "/" : `/${name}`;
  })
  .filter(route => ["/", "/history", "/profile"].includes(route));

for (const url of routesToPrerender) {
  const helmetContext = {};
  const appHtml = render(url, helmetContext);

  const { helmet } = helmetContext;

  const headMeta = helmet ? `
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    ${helmet.script.toString()}
  ` : "";

  const html = template
    .replace(`<!--app-html-->`, appHtml)
    .replace(`<!--head-meta-->`, headMeta);

  const filePath = url === "/" ? "index.html" : `${url}/index.html`;
  const fullPath = resolve(`build/static/${filePath}`);
  
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, html);
  
  console.log(`pre-rendered: ${filePath}`);
}
