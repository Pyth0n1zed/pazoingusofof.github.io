// Define the path where you saved the Chromium SVGs
export const ASSET_PATH = "/assets/chrome"; 

export function initUI(app: HTMLElement) {
  app.innerHTML = `
    <style>
      :root {
        --cr-frame-bg: #222222;       
        --cr-toolbar-bg: rgba(60,60,60,1);     
        --cr-omnibox-bg: #222222;     
        --cr-omnibox-hover: rgb(75, 75, 75);  
        --cr-text-primary: #e3e3e3;
        --cr-text-secondary: #c7c7c7;
        --cr-hover-bg: rgba(255, 255, 255, 0.08);
        --cr-active-bg: rgba(255, 255, 255, 0.12);
        --cr-border-radius-pill: 999px;
        --cr-border-radius-tab: 10px 10px 0 0;
      }

      * { box-sizing: border-box; }

      body, html {
        margin: 0; padding: 0; height: 100%; width: 100%;
        background-color: var(--cr-toolbar-bg);
        overflow: hidden;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      /* --- CORE LAYOUT --- */
      #view-stack { display: flex; flex-direction: column; height: 100%; width: 100%; }
      #web-view { display: flex; flex-direction: column; flex: 1; position: relative; }
      
      #chrome-ui-wrapper {
        width: 100%; display: flex; flex-direction: column;
        user-select: none; background-color: var(--cr-frame-bg);
      }

      /* --- TAB STRIP --- */
      #tab-strip-container {
        display: flex; align-items: flex-end; height: 42px; padding-left: 8px; position: relative;
      }

      #tab-bar { display: flex; align-items: flex-end; height: 100%; }

      .cr-icon-btn {
        background-color: transparent; background-position: center; background-repeat: no-repeat;
        background-size: 16px; border: none; width: 28px; height: 28px; border-radius: 6px;
        display: flex; align-items: center; justify-content: center; cursor: pointer;
        transition: background-color 0.15s ease; flex-shrink: 0;
      }
      .cr-icon-btn:hover { background-color: var(--cr-hover-bg); }
      .cr-icon-btn:active { background-color: var(--cr-active-bg); }

      #new-tab-btn {
        background-image: url(${ASSET_PATH}/plus.png); background-size: 12px;
        margin-left: 6px; margin-bottom: 6px; border-radius: 50%; color: transparent;
      }

      .tab {
        background-color: transparent; color: var(--cr-text-secondary);
        border-radius: var(--cr-border-radius-tab); height: 34px; width: 240px;
        display: flex; align-items: center; padding: 0 10px; gap: 8px;
        position: relative; cursor: pointer; border-right: 1px solid rgba(255,255,255,0.1);
      }

      .tab.active {
        background-color: var(--cr-toolbar-bg); color: var(--cr-text-primary);
        border-right: none; z-index: 2;
      }

      .tab.active::before, .tab.active::after {
        content: ''; position: absolute; bottom: 0; width: 10px; height: 10px;
      }
      .tab.active::before { left: -10px; background: radial-gradient(circle at top left, transparent 10px, var(--cr-toolbar-bg) 10px); }
      .tab.active::after { right: -10px; background: radial-gradient(circle at top right, transparent 10px, var(--cr-toolbar-bg) 10px); }

      .tab-favicon { width: 16px; height: 16px; object-fit: contain; }
      .tab-title { flex: 1; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .tab-close {
        width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-size: 14px; font-weight: bold; transition: background-color 0.15s;
      }
      .tab-close:hover { background-color: rgba(255, 255, 255, 0.15); color: #fff; }

      /* --- TOOLBAR & OMNIBOX --- */
      #topbar {
        background-color: var(--cr-toolbar-bg); height: 44px; display: flex;
        align-items: center; padding: 0 8px; gap: 8px;
      }

      .nav-group { display: flex; gap: 2px; }
      .nav-group .cr-icon-btn { border-radius: 50%; color: transparent; }

      #back-btn { background-image: url(${ASSET_PATH}/icon_arrow_back.svg); } 
      #forward-btn { background-image: url(${ASSET_PATH}/icon_arrow_forward.svg); }
      #reload-btn { background-image: url(${ASSET_PATH}/icon_refresh.svg); }

      .omnibox-container {
        flex: 1; height: 34px; background-color: var(--cr-omnibox-bg);
        border-radius: var(--cr-border-radius-pill); display: flex; align-items: center;
        padding: 0 14px 0 12px; gap: 10px; transition: background-color 0.2s; border: 2px solid transparent;
      }
      .omnibox-container:hover { background-color: var(--cr-omnibox-hover); }
      .omnibox-container:focus-within { border-color: #8ab4f8; }

      .omnibox-security-icon {
        width: 16px; height: 16px; background-image: url(${ASSET_PATH}/lock.svg);
        background-size: contain; background-repeat: no-repeat;
      }

      #url-bar {
        flex: 1; background: transparent; border: none; outline: none;
        color: var(--cr-text-primary); font-size: 13px; font-family: inherit; width: 100%;
      }

      .actions-group { display: flex; gap: 2px; }
      #settings-btn { background-image: url(${ASSET_PATH}/icon_more_vert.svg); color: transparent;}

      /* --- VIEWPORT --- */
      #frames-container {
        flex: 1; width: 100%; height: 100%; position: relative; background-color: var(--cr-toolbar-bg);
      }

      /* --- SETTINGS MODAL STYLING --- */
      #settings-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(2px);
        z-index: 9999; display: flex; justify-content: center; align-items: center;
      }
      #settings-modal {
        background-color: var(--cr-toolbar-bg); border-radius: 12px; width: 450px;
        padding: 24px; color: var(--cr-text-primary); box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        border: 1px solid rgba(255,255,255,0.1);
      }
      #settings-title { margin: 0 0 20px 0; font-size: 18px; font-weight: 500; }
      .settings-section { margin-bottom: 20px; }
      .settings-section label { display: block; margin-bottom: 8px; font-size: 13px; color: var(--cr-text-secondary); }
      .settings-section input[type="text"] {
        width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2);
        background: var(--cr-frame-bg); color: #fff; font-family: inherit; outline: none;
      }
      .settings-section input[type="text"]:focus { border-color: #8ab4f8; }
      .settings-hint { font-size: 11px; color: #9aa0a6; margin-top: 6px; }
      .choice-actions button, .data-actions button {
        background: var(--cr-frame-bg); border: 1px solid rgba(255,255,255,0.2);
        color: var(--cr-text-primary); padding: 6px 12px; border-radius: 4px;
        cursor: pointer; margin-right: 8px; transition: background 0.2s;
      }
      .choice-actions button:hover, .data-actions button:hover { background: var(--cr-hover-bg); }
      .settings-actions { display: flex; justify-content: space-between; margin-top: 30px; }
      .settings-actions button {
        padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-weight: 500;
      }
      #settings-reset { background: transparent; color: #f28b82; border: 1px solid rgba(242, 139, 130, 0.3); }
      #settings-cancel { background: transparent; color: var(--cr-text-primary); margin-right: 8px; }
      #settings-cancel:hover { background: var(--cr-hover-bg); }
      .primary-btn { background: #8ab4f8; color: #202124; }
      .primary-btn:hover { background: #aecbfa; }
    </style>

    <div id="view-stack">
      <div id="web-view" class="view-container">
        
        <div id="chrome-ui-wrapper">
          <div id="tab-strip-container">
            <div id="tab-bar">
              <button id="new-tab-btn" class="cr-icon-btn" title="New tab">+</button>
            </div>
          </div>

          <div id="topbar">
            <div class="nav-group">
              <button id="back-btn" class="cr-icon-btn" title="Click to go back">&lt;</button>
              <button id="forward-btn" class="cr-icon-btn" title="Click to go forward">&gt;</button>
              <button id="reload-btn" class="cr-icon-btn" title="Reload this page">R</button>
            </div>

            <div class="omnibox-container">
              <div class="omnibox-security-icon"></div>
              <input id="url-bar" type="text" placeholder="Ask Google or type a URL" autocomplete="off" spellcheck="false" />
            </div>

            <div class="actions-group">
              <button id="settings-btn" class="cr-icon-btn" title="Settings and control">⋮</button>
            </div>
          </div>
        </div>

        <div id="frames-container"></div>
      </div>
    </div>

    <div id="settings-overlay" style="display: none;">
      <div id="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <h2 id="settings-title">Settings</h2>
        
        <div class="settings-section">
          <label for="wisp-input">Wisp server</label>
          <input id="wisp-input" type="text" spellcheck="false" autocomplete="off" placeholder="wss://example.com/" />
          <p class="settings-hint">WebSocket URL used for the proxy transport.</p>
        </div>

        <div class="settings-section">
          <label for="proxy-choice">Proxy</label>
          <div class="choice-actions">
            <button id="choice-uv">Ultraviolet</button><button id="choice-scram">Scramjet</button>
          </div>
          <p class="settings-hint">Scramjet is newer and is still maintained. There are few reasons to choose Ultraviolet.</p>
        </div>

        <div class="settings-section">
          <label>Data Management</label>
          <div class="data-actions">
            <button id="export-data" type="button">Export Data</button>
            <button id="import-data" type="button">Import Data</button>
            <input type="file" id="import-input" accept=".json" style="display: none;" />
          </div>
          <p class="settings-hint">Backup or restore your settings and site data.</p>
        </div>

        <div class="settings-actions">
          <button id="settings-reset" type="button">Reset</button>
          <div class="settings-actions-right">
            <button id="settings-cancel" type="button">Cancel</button>
            <button id="settings-save" type="button" class="primary-btn">Save</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // --- OMNIBOX SUBMISSION LOGIC ---
  const urlBar = document.getElementById("url-bar") as HTMLInputElement;
  urlBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      let query = urlBar.value.trim();
      if (!query) return;

      const isUrl = query.includes(".") && !query.includes(" ");
      if (isUrl && !query.startsWith("http")) query = "https://" + query;
      else if (!isUrl) query = "https://www.google.com/search?q=" + encodeURIComponent(query);
      
      document.dispatchEvent(new CustomEvent("omnibox-submit", { detail: query }));
    }
  });

  // --- STARTPAGE.TS MESSAGE INTERCEPTOR ---
  window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "navigate" && event.data.value) {
      let query = event.data.value.trim();
      if (!query.startsWith("http") && !query.includes(".")) {
        query = "https://www.google.com/search?q=" + encodeURIComponent(query);
      } else if (!query.startsWith("http")) {
        query = "https://" + query;
      }
      document.dispatchEvent(new CustomEvent("omnibox-submit", { detail: query }));
    }
  });

  // --- SETTINGS OVERLAY TOGGLES ---
  const settingsBtn = document.getElementById("settings-btn");
  const settingsOverlay = document.getElementById("settings-overlay");
  const settingsCancel = document.getElementById("settings-cancel");

  if (settingsBtn && settingsOverlay && settingsCancel) {
    settingsBtn.addEventListener("click", () => {
      settingsOverlay.style.display = "flex";
    });
    
    settingsCancel.addEventListener("click", () => {
      settingsOverlay.style.display = "none";
    });

    // Close on background click
    settingsOverlay.addEventListener("click", (e) => {
      if (e.target === settingsOverlay) {
        settingsOverlay.style.display = "none";
      }
    });
  }
}
