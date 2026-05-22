function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildHtml({ title, client, date, bodyHtml, css }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>${css}</style>
</head>
<body>
  <div class="cover">
    <div class="cover-wordmark">pearce<span class="slash">/</span>labs</div>
    <div class="cover-body">
      <h1 class="cover-title">${esc(title)}</h1>
      <p class="cover-client">${esc(client)}</p>
    </div>
    <div>
      <div class="cover-footer-rule"></div>
      <div class="cover-footer">
        <span class="cover-meta">Falls Church, VA&nbsp;&nbsp;·&nbsp;&nbsp;pearcelabs.com</span>
        <span class="cover-meta">${esc(date)}</span>
      </div>
    </div>
  </div>
  <div class="prose">${bodyHtml}</div>
</body>
</html>`;
}
