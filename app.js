const OWNER  = "CoreScriptDev";
const REPO   = "CoreScript";
const BRANCH = "main";

// ---------- Theme ----------
if (localStorage.theme === "dark") document.body.classList.add("dark");

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.theme =
    document.body.classList.contains("dark") ? "dark" : "light";
}

// ---------- Navigation ----------
function showPage(id) {
  document.querySelectorAll("main section").forEach(s => s.hidden = true);
  document.getElementById(id).hidden = false;
}

// ---------- Typing ----------
function typeText(text, el, i = 0, done) {
  if (i <= text.length) {
    el.textContent = text.slice(0, i);
    setTimeout(() => typeText(text, el, i + 1, done), 40);
  } else if (done) {
    done();
  }
}

typeText(
  "CoreScript — a modern programming language.",
  document.getElementById("typing")
);

// ---------- Markdown Reveal ----------
function revealMarkdown(container) {
  const blocks = Array.from(container.children);
  const total = Math.min(2000, Math.max(1000, blocks.length * 120));
  const step = total / blocks.length;

  blocks.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.animationDelay = `${i * step}ms`;
  });
}

// ---------- Markdown Loader ----------
async function loadMarkdown(path, target) {
  const res = await fetch(
    `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`
  );

  target.innerHTML = marked.parse(await res.text());
  revealMarkdown(target);
  hljs.highlightAll();
}

// ---------- Static Pages ----------
loadMarkdown("README.md", home);
loadMarkdown("CSX-Manual.md", csx);
loadMarkdown("CHANGELOG.md", changelog);

// ---------- Downloads ----------
async function loadDownloads() {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/builds`
  );
  const versions = await res.json();

  let html = `
  <table>
    <tr>
      <th>Version</th>
      <th>Status</th>
      <th>Installer</th>
      <th>README</th>
    </tr>`;

  for (const v of versions.filter(x => x.type === "dir")) {
    const files = await (await fetch(v.url)).json();
    const exe = files.find(f => f.name.endsWith(".exe"));
    const md  = files.find(f => f.name === "README.md");

    html += `
    <tr class="reveal">
      <td>${v.name}</td>
      <td>${exe ? "Released" : "Not released"}</td>
      <td>${exe ? `<a href="${exe.download_url}" download>Download</a>` : "-"}</td>
      <td>${md ? `<a onclick="openRelease('${md.download_url}')">Read</a>` : "-"}</td>
    </tr>`;
  }

  html += "</table>";
  downloads.innerHTML = html;
}

loadDownloads();

// ---------- Release README ----------
async function openRelease(url) {
  const res = await fetch(url);
  home.innerHTML = marked.parse(await res.text());
  showPage("home");
  revealMarkdown(home);
  hljs.highlightAll();
}

// ---------- CSC Syntax ----------
hljs.registerLanguage("csc", () => ({
  keywords: {
    keyword:
      "if else match case default while for foreach in with as return continue break",
    type:
      "class func int float string list dict",
    literal:
      "true false null"
  },
  contains: [
    hljs.C_LINE_COMMENT_MODE,
    hljs.QUOTE_STRING_MODE,
    hljs.NUMBER_MODE
  ]
}));