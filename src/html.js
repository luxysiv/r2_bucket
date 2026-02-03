export function generateHtml(url, prefix, folders, files, isTruncated, cursor, formatFileSize) {
  // Logic kiểm tra để hiển thị thông báo phù hợp
  let alertHtml = '';
  const currentPath = prefix.toLowerCase();
  
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
    // Luôn ưu tiên youtube-music trước, nếu không phải thì mới check youtube
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

        .gmscore-alert {
          background-color: var(--warning-bg);
          border: 1px solid var(--warning-border);
          border-radius: 0.5rem;
          padding: 1rem;
          margin-top: 2rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--warning-text);
          font-size: 0.9rem;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .gmscore-alert a {
          color: var(--primary-dark);
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid transparent;
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
        
        .footer {
          text-align: center;
          padding: 2rem 0;
          color: var(--text-light);
          font-size: 0.875rem;
        }
        
        .footer a {
          color: var(--primary);
          text-decoration: none;
        }

        /* Download Popup Styles */
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
          transition: width 0.2s;
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

        ${alertHtml}

        <footer class="footer">
          <div style="margin-bottom: 0.5rem;">ReVanced Apps Repository</div>
          <div>Maintained with ❤️ by <a href="https://github.com/luxysiv" target="_blank">Manh Duong</a></div>
          <div style="margin-top: 0.5rem; font-size: 0.75rem; opacity: 0.8;">
            Powered by Cloudflare Workers • ${new Date().getFullYear()}
          </div>
        </footer>

        <div class="download-popup" id="downloadPopup">
          <div class="download-content">
            <i class="material-icons" style="font-size: 3rem; color: var(--primary);">file_download</i>
            <h3 id="dl-title">Preparing Download</h3>
            <div class="download-progress"><div class="download-progress-bar" id="downloadProgressBar"></div></div>
            <p id="downloadFilename" style="font-weight: 500; font-size: 0.9rem; word-break: break-all;"></p>
            <button id="downloadClose" style="margin-top: 1rem; padding: 0.5rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
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
                p += Math.floor(Math.random() * 15) + 5;
                if (p >= 100) {
                  p = 100;
                  clearInterval(inv);
                  window.location.href = this.href;
                  setTimeout(() => { 
                    popup.classList.remove('active'); 
                    bar.style.width = '0%'; 
                  }, 800);
                }
                bar.style.width = p + '%';
              }, 150);
            });
          });
          
          closeBtn.onclick = () => popup.classList.remove('active');
          popup.onclick = (e) => { if(e.target === popup) popup.classList.remove('active'); };
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
      <title>Error - ReVanced Repo</title>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <style>
        body { font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f8fafc; margin: 0; }
        .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center; max-width: 400px; }
        .icon { color: #ef4444; font-size: 48px; margin-bottom: 1rem; }
        h2 { margin: 0; color: #083344; }
        p { color: #64748b; margin: 1rem 0; }
        a { color: #06b6d4; text-decoration: none; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="card">
        <i class="material-icons icon">error_outline</i>
        <h2>Something went wrong</h2>
        <p>${errorMessage}</p>
        <a href="/">Return to Home</a>
      </div>
    </body>
    </html>
  `;
}
