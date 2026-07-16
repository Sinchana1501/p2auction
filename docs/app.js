// ---------- Config ----------
const DEFAULT_API_BASE = "https://p2auction.onrender.com";

function getApiBase() {
  return localStorage.getItem("p2a_api_base") || DEFAULT_API_BASE;
}
function setApiBase(url) {
  localStorage.setItem("p2a_api_base", url.replace(/\/$/, ""));
}

// ---------- Session ----------
function getSession() {
  const raw = localStorage.getItem("p2a_session");
  return raw ? JSON.parse(raw) : null;
}
function setSession(user) {
  localStorage.setItem("p2a_session", JSON.stringify({
    rollNo: user.rollNo,
    fname: user.fname,
    lname: user.lname,
  }));
}
function clearSession() {
  localStorage.removeItem("p2a_session");
}

// ---------- API ----------
async function apiRequest(method, path, body) {
  const opts = { method, headers: {} };
  if (body) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(getApiBase() + path, opts);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) {
    const message = (data && data.error) ? data.error : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

// ---------- Shared nav rendering ----------
function renderNav(activePage) {
  const session = getSession();
  const navEl = document.getElementById("topnav");
  if (!navEl) return;

  navEl.innerHTML = `
    <a class="brand-mark" href="index.html">The <em>p2auction</em> House</a>
    <nav>
      <a href="index.html" class="${activePage === 'browse' ? 'active' : ''}">Browse</a>
      <a href="sell.html" class="${activePage === 'sell' ? 'active' : ''}">List an item</a>
    </nav>
    <div class="nav-spacer"></div>
    <div class="session-pill" id="sessionPill"></div>
  `;

  const pill = document.getElementById("sessionPill");
  if (session) {
    pill.innerHTML = `Signed in as <strong>${escapeHtml(session.fname)}</strong> (${escapeHtml(session.rollNo)}) <button id="logoutBtn">Sign out</button>`;
    document.getElementById("logoutBtn").addEventListener("click", () => {
      clearSession();
      window.location.href = "index.html";
    });
  } else {
    pill.innerHTML = `<a href="account.html">Sign in</a>`;
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins + "m ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + "h ago";
  return Math.floor(hrs / 24) + "d ago";
}
