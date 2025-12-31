const OWNER = "CoreScriptDev";
const REPO  = "CoreScript";
const CACHE_TIME = 10 * 60 * 1000;

// ---------- Theme ----------
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark") ? "dark" : "light");
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// ---------- Pages ----------
function showPage(id) {
  document.querySelectorAll("section").forEach(s => s.hidden = true);
  document.getElementById(id).hidden = false;
}

// ---------- Downloads ----------
async function loadDownloads() {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/build`);
  const versions = await res.json();

  let html = `<table>
  <tr><th>Version</th><th>Status</th><th>Installer</th><th>README</th></tr>`;

  for (const v of versions.filter(x => x.type === "dir")) {
    const r = await fetch(v.url);
    const files = await r.json();

    const exe = files.find(f => f.name.endsWith(".exe"));
    const md  = files.find(f => f.name.toLowerCase() === "readme.md");

    html += `<tr>
      <td>${v.name}</td>
      <td>${exe ? "Veröffentlicht" : "Noch nicht veröffentlicht"}</td>
      <td>${exe ? `<a href="${exe.download_url}" download>Download</a>` : "-"}</td>
      <td>${md ? `<a onclick="openMarkdown('${md.download_url}')">Lesen</a>` : "-"}</td>
    </tr>`;
  }

  html += `</table>`;
  document.getElementById("downloads").innerHTML = html;
}

// ---------- Markdown ----------
async function openMarkdown(url) {
  const res = await fetch(url);
  const text = await res.text();

  const html = marked.parse(text);
  const viewer = document.getElementById("viewer");
  viewer.innerHTML = html;
  viewer.hidden = false;

  hljs.highlightAll();
}

// ---------- CSX Manual ----------
async function loadCSX() {
  openMarkdown(`https://raw.githubusercontent.com/${OWNER}/${REPO}/main/CSX-Manual.md`);
}

// ---------- Init ----------
loadDownloads();
