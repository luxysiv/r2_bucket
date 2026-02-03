export function generateHtml(url, prefix, folders, files, isTruncated, cursor, formatFileSize) {
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ReVanced Apps Repository</title>
      <meta name="description" content="Download patched ReVanced apps">
      
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      
      <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2306b6d4'><path d='M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z'/></svg>">
      
      <style>
        :root {
          --primary: #06b6d4;
          --primary-dark: #0891b2;
          --primary-light: #67e8f9;
          --secondary: #f0fdfa;
          --text: #083344;
          --text-light: #64748b;
          --border: #e2e8f0;
          --hover-bg: #f8fafc;
          --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          --warning-bg: #fff7ed;
          --warning-border: #fdba74;
          --warning-text: #9a3412;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
          color: var(--text);
          background-color: #f8fafc;
          margin: 0;
          min-height: 100vh;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        /* Gmscore Alert Box - Đã được chuyển xuống gần footer */
        .gmscore-alert {
          background-color: var(--warning-bg);
          border: 1px solid var(--warning-border);
          border-radius: 0.5rem;
          padding: 1rem;
          margin-top: 2rem; /* Tạo khoảng cách với bảng file */
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--warning-text);
          font-size: 0.9rem;
        }

        .gmscore-alert a {
          color: var(--primary-dark);
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .gmscore-alert a:hover {
          border-color: var(--primary-dark);
        }
        
        .breadcrumb {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          color: var(--text-light);
        }
        
        .file-explorer {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: var(--card-shadow);
          overflow: hidden;
        }
        
        .file-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .file-table th {
          background-color: var(--secondary);
          color: var(--text-light);
          font-weight: 500;
          text-align: left;
          padding: 1rem;
          font-size: 0.75rem;
        }
        
        .file-table td {
          padding: 0.75rem 1rem;
          border-top: 1px solid var(--border);
        }
        
        .file-table tr:hover {
          background-color: var(--hover-bg);
        }
        
        .file-icon {
          margin-right: 0.75rem;
          color: var(--primary);
        }
        
        .file-link {
          color: var(--text);
          text-decoration: none;
        }
        
        .folder-link {
          color: var(--primary);
          font-weight: 500;
          text-decoration: none;
        }
        
        .file-size, .file-date {
          color: var(--text-light);
          font-size: 0.875rem;
        }
        
        .footer {
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          color: var(--text-light);
        }
        
        .footer a {
          color: var(--primary);
          text-decoration: none;
        }
        
        /* Download Popup */
        .download-popup {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: none;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .download-popup.active { display: flex; }
        .download-content {
          background-color: white;
          padding: 2rem;
          border-radius: 0.5rem;
          width: 90%;
          max-width: 400px;
          text-align: center;
        }
        .download-progress {
          margin: 1.5rem 0;
          height: 6px;
          background-color: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }
        .download-progress-bar {
          height: 100%;
          background-color: var(--primary);
          width: 0%;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="breadcrumb">
          <a href="/">Home</a>
          ${prefix ? prefix.split('/').filter(Boolean).map((part, i, parts) => {
            const path = parts.slice(0, i + 1).join('/') + '/';
            return `<span style="margin: 0 0.5rem">/</span><a href="?prefix=${encodeURIComponent(path)}">${part}</a>`;
          }).join('') : ''}
        </div>
        
        <div class="file-explorer">
          <table class="file-table">
            <thead>
              <tr><th>Name</th><th>Size</th><th>Last Modified</th></tr>
            </thead>
            <tbody>
              ${folders.length === 0 && files.length === 0 ? `<tr><td colspan="3" style="text-align: center; padding: 3rem; color: var(--text-light);">Folder is empty</td></tr>` : ''}
              ${folders.map(folder => {
                const folderName = folder.replace(prefix, '').replace(/\/$/, '');
                return `
                  <tr>
                    <td><div style="display: flex; align-items: center;"><i class="material-icons file-icon">folder</i><a href="?prefix=${encodeURIComponent(folder)}" class="folder-link">${folderName}</a></div></td>
                    <td class="file-size">-</td><td class="file-date">-</td>
                  </tr>`;
              }).join('')}
              ${files.map(file => {
                const fileName = file.key.replace(prefix, '');
                return `
                  <tr>
                    <td><div style="display: flex; align-items: center;"><i class="material-icons file-icon">android</i><a href="?download=${encodeURIComponent(file.key)}" class="file-link" download data-filename="${fileName}" data-filesize="${formatFileSize(file.size)}">${fileName}</a></div></td>
                    <td class="file-size">${formatFileSize(file.size)}</td>
                    <td class="file-date">${new Date(file.uploaded).toLocaleDateString()}</td>
                  </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="gmscore-alert">
          <i class="material-icons">info</i>
          <span>
            YouTube ReVanced requires <strong>GmsCore</strong> to function. 
            <a href="https://github.com/revanced/gmscore/releases/latest" target="_blank" rel="noopener">Download ReVanced GmsCore here</a>.
          </span>
        </div>

        <footer class="footer">
          <p>ReVanced Apps Repository - Maintained by <a href="https://github.com/luxysiv" target="_blank">Manh Duong</a></p>
          <p style="font-size: 0.75rem;">Powered by Cloudflare Workers • ${new Date().getFullYear()}</p>
        </footer>

        <div class="download-popup" id="downloadPopup">
          <div class="download-content">
            <i class="material-icons" style="font-size: 3rem; color: var(--primary);">file_download</i>
            <h3>Downloading...</h3>
            <div class="download-progress"><div class="download-progress-bar" id="downloadProgressBar"></div></div>
            <p id="downloadFilename" style="font-weight: 500;"></p>
            <button id="downloadClose" style="padding: 0.5rem 1rem; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
          </div>
        </div>
      </div>
      <script>
        (function() {
          const popup = document.getElementById('downloadPopup');
          const bar = document.getElementById('downloadProgressBar');
          const nameEl = document.getElementById('downloadFilename');
          const closeBtn = document.getElementById('downloadClose');
          
          document.querySelectorAll('.file-link[download]').forEach(link => {
            link.addEventListener('click', function(e) {
              e.preventDefault();
              nameEl.textContent = this.getAttribute('data-filename');
              popup.classList.add('active');
              let p = 0;
              const inv = setInterval(() => {
                p += 10;
                bar.style.width = p + '%';
                if (p >= 100) {
                  clearInterval(inv);
                  window.location.href = this.href;
                  setTimeout(() => { popup.classList.remove('active'); bar.style.width = '0%'; }, 1000);
                }
              }, 100);
            });
          });
          closeBtn.onclick = () => popup.classList.remove('active');
        })();
      </script>
    </body>
    </html>
  `;
  return html;
}

export function generateErrorHtml(errorMessage) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Error</title>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <style>
        body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f8fafc; margin: 0; }
        .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
        .icon { color: #ef4444; font-size: 48px; }
        a { color: #06b6d4; text-decoration: none; display: block; margin-top: 1rem; }
      </style>
    </head>
    <body>
      <div class="card">
        <i class="material-icons icon">error</i>
        <h2>Error Occurred</h2>
        <p>${errorMessage}</p>
        <a href="/">Back to Home</a>
      </div>
    </body>
    </html>
  `;
}
