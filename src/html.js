export function generateHtml(url, prefix, folders, files, isTruncated, cursor, formatFileSize) {
  // Logic kiểm tra để hiển thị thông báo phù hợp
  let alertHtml = '';
  const currentPath = prefix.toLowerCase();
  
  // Kiểm tra nếu folder chứa "youtube-music" hoặc "youtube"
  if (currentPath.includes('youtube-music')) {
    alertHtml = `
      <div class="gmscore-alert">
        <i class="material-icons">info</i>
        <span>
          YouTube Music ReVanced requires <strong>GmsCore</strong> to activate. 
          <a href="https://github.com/revanced/gmscore/releases/latest" target="_blank" rel="noopener">Download ReVanced GmsCore here</a>.
        </span>
      </div>`;
  } else if (currentPath.includes('youtube')) {
    alertHtml = `
      <div class="gmscore-alert">
        <i class="material-icons">info</i>
        <span>
          YouTube ReVanced requires <strong>GmsCore</strong> to activate. 
          <a href="https://github.com/revanced/gmscore/releases/latest" target="_blank" rel="noopener">Download ReVanced GmsCore here</a>.
        </span>
      </div>`;
  }

  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ReVanced Apps Repository</title>
      <meta name="description" content="Download patched ReVanced apps">
      
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      
      <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2306b6d4'><path d='M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z'/></svg>">
      
      <style>
        :root {
          --primary: #06b6d4;
          --primary-dark: #0891b2;
          --text: #083344;
          --text-light: #64748b;
          --border: #e2e8f0;
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

        .breadcrumb {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: var(--text-light);
        }

        /* Vị trí Banner mới: Nằm giữa Breadcrumb và File Explorer */
        .gmscore-alert {
          background-color: var(--warning-bg);
          border: 1px solid var(--warning-border);
          border-radius: 0.5rem;
          padding: 0.875rem 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--warning-text);
          font-size: 0.9rem;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .gmscore-alert a {
          color: var(--primary-dark);
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid var(--warning-border);
        }

        .gmscore-alert a:hover {
          border-bottom-color: var(--primary-dark);
        }
        
        .file-explorer {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .file-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .file-table th {
          background-color: #f0fdfa;
          color: var(--text-light);
          font-weight: 500;
          text-align: left;
          padding: 1rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
        
        .file-table td {
          padding: 0.875rem 1rem;
          border-top: 1px solid var(--border);
        }
        
        .file-table tr:hover {
          background-color: #f8fafc;
        }
        
        .file-icon {
          margin-right: 0.75rem;
          color: var(--primary);
          vertical-align: middle;
        }
        
        .file-link { color: var(--text); text-decoration: none; }
        .folder-link { color: var(--primary); font-weight: 500; text-decoration: none; }
        
        .footer {
          text-align: center;
          padding: 3rem 0 2rem;
          color: var(--text-light);
          font-size: 0.875rem;
          border-top: 1px solid var(--border);
          margin-top: 2rem;
        }
        
        .footer a { color: var(--primary); text-decoration: none; }

        /* Download Popup */
        .download-popup {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: none;
          justify-content: center; align-items: center;
          z-index: 1000;
        }
        .download-popup.active { display: flex; }
        .download-content {
          background: white; padding: 2rem; border-radius: 0.5rem;
          width: 90%; max-width: 400px; text-align: center;
        }
        .download-progress {
          margin: 1.5rem 0; height: 6px;
          background: #e2e8f0; border-radius: 3px; overflow: hidden;
        }
        .download-progress-bar { height: 100%; background: var(--primary); width: 0%; transition: width 0.2s; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="breadcrumb">
          <a href="/" style="color: var(--primary); text-decoration: none;">Home</a>
          ${prefix ? prefix.split('/').filter(Boolean).map((part, i, parts) => {
            const path = parts.slice(0, i + 1).join('/') + '/';
            return `<span style="margin: 0 0.5rem">/</span><a href="?prefix=${encodeURIComponent(path)}" style="color: var(--text-light); text-decoration: none;">${part}</a>`;
          }).join('') : ''}
        </div>

        ${alertHtml}
        
        <div class="file-explorer">
          <table class="file-table">
            <thead>
              <tr><th>Name</th><th>Size</th><th>Last Modified</th></tr>
            </thead>
            <tbody>
              ${folders.length === 0 && files.length === 0 ? `<tr><td colspan="3" style="text-align: center; padding: 3rem; color: var(--text-light);">No files found</td></tr>` : ''}
              ${folders.map(folder => {
                const folderName = folder.replace(prefix, '').replace(/\/$/, '');
                return `
                  <tr>
                    <td><i class="material-icons file-icon">folder</i><a href="?prefix=${encodeURIComponent(folder)}" class="folder-link">${folderName}</a></td>
                    <td style="color: var(--text-light)">-</td><td style="color: var(--text-light)">-</td>
                  </tr>`;
              }).join('')}
              ${files.map(file => {
                const fileName = file.key.replace(prefix, '');
                return `
                  <tr>
                    <td><i class="material-icons file-icon">android</i><a href="?download=${encodeURIComponent(file.key)}" class="file-link" download data-filename="${fileName}" data-filesize="${formatFileSize(file.size)}">${fileName}</a></td>
                    <td style="color: var(--text-light)">${formatFileSize(file.size)}</td>
                    <td style="color: var(--text-light)">${new Date(file.uploaded).toLocaleDateString()}</td>
                  </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>

        <footer class="footer">
          <p>ReVanced Apps Repository - Maintained by <a href="https://github.com/luxysiv" target="_blank">Manh Duong</a></p>
          <p style="font-size: 0.75rem; margin-top: 0.5rem;">Powered by Cloudflare Workers & R2 • ${new Date().getFullYear()}</p>
        </footer>

        <div class="download-popup" id="downloadPopup">
          <div class="download-content">
            <i class="material-icons" style="font-size: 3rem; color: var(--primary);">file_download</i>
            <h3>Downloading</h3>
            <div class="download-progress"><div class="download-progress-bar" id="downloadProgressBar"></div></div>
            <p id="downloadFilename" style="font-size: 0.875rem; word-break: break-all; color: var(--text-light);"></p>
            <button id="downloadClose" style="margin-top: 1rem; padding: 0.5rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
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
                p += Math.floor(Math.random() * 20);
                if (p >= 100) {
                  p = 100; clearInterval(inv);
                  window.location.href = this.href;
                  setTimeout(() => { popup.classList.remove('active'); bar.style.width = '0%'; }, 1000);
                }
                bar.style.width = p + '%';
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
      <meta charset="UTF-8"><title>Error</title>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <style>
        body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f8fafc; margin: 0; }
        .card { background: white; padding: 2rem; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .icon { color: #ef4444; font-size: 48px; }
        a { color: #06b6d4; text-decoration: none; font-weight: bold; display: block; margin-top: 1rem; }
      </style>
    </head>
    <body>
      <div class="card">
        <i class="material-icons icon">error_outline</i>
        <h2>Build Error</h2>
        <p>${errorMessage}</p>
        <a href="/">Back to Home</a>
      </div>
    </body>
    </html>
  `;
}
