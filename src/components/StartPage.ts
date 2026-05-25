import logo from "../assets/logo.png";

export const startPageHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      font-family: "Nunito", sans-serif;
      background: #111;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    .container {
      width: 90%;
      max-width: 680px;
      text-align: center;
    }
    .logo-container {
      margin-bottom: 24px;
    }
    .logo {
      width: 400px;
      max-width: 80%;
      height: auto;
      display: block;
      margin: 0 auto;
    }
    h1 {
      font-size: 34px;
      margin: 0 0 18px;
      font-weight: 600;
    }
    form {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
    input {
      flex: 1;
      padding: 14px 16px;
      font-size: 16px;
      border: 1px solid #333;
      border-radius: 8px;
      background: #1a1a1a;
      color: #fff;
      outline: none;
      transition: border-color 0.2s;
    }
    input:focus {
      border-color: #555;
    }
    button {
      padding: 14px 20px;
      font-size: 16px;
      border: 1px solid #333;
      border-radius: 8px;
      background: #1a1a1a;
      color: #fff;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover {
      background: #222;
    }
    button:active {
      background: #2a2a2a;
    }
    p {
      margin-top: 14px;
      font-size: 13px;
      color: #aaa;
    }
    .discord-link {
      margin-top: 20px;
      font-size: 14px;
      color: #888;
    }
    .discord-link a {
      color: #5865F2;
      text-decoration: none;
      font-weight: 600;
    }
    .discord-link a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-container">
      <img src="${logo}" class="logo" alt="Logo" />
    </div>
    <h1>Search</h1>
    <form id="search-form">
      <input id="search-input" type="text" placeholder="Enter URL or search query" autocomplete="off" autofocus />
      <button type="submit">Go</button>
    </form>
    <p>Type a URL or a search query</p>
    <p class="discord-link">Feedback? <a href="https://discord.gg/VWh8UmD2gv" target="_blank" rel="noopener noreferrer">Join our Discord!</a></p>
  </div>
  <script>
    const form = document.getElementById("search-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = document.getElementById("search-input").value.trim();
      if (!value) return;
      parent.postMessage({ type: "navigate", value }, "*");
    });
  </script>
</body>
</html>
`;

export const homeDataURL =
  "data:text/html;charset=utf-8," + encodeURIComponent(startPageHTML);
