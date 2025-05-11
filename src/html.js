export function generateHtml(url, prefix, folders, files, isTruncated, cursor, formatFileSize) {
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ReVanced Apps Repository</title>
      <meta name="description" content="Download patched ReVanced apps">
      
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      
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
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          color: var(--text-light);
          padding: 0.5rem 0;
        }
        
        .file-explorer {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: var(--card-shadow);
          overflow: hidden;
          margin-bottom: 2rem;
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
          letter-spacing: 0.05em;
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
          cursor: pointer;
        }
        
        .folder-link {
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
        }
        
        .file-size, .file-date {
          color: var(--text-light);
          font-size: 0.875rem;
        }
        
        /* Download Popup */
        .download-popup {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: none;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .download-popup.active {
          display: flex;
          animation: fadeIn 0.3s ease;
        }
        
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
          transition: width 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* Footer */
        .footer {
          text-align: center;
          margin-top: 3rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          color: var(--text-light);
        }
        
        .footer a {
          color: var(--primary);
          text-decoration: none;
        }
        
        .footer a:hover {
          text-decoration: underline;
        }
        
        .github-link {
          display: inline-flex;
          align-items: center;
          margin-top: 0.5rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="breadcrumb">
          <a href="/">Home</a>
          ${prefix ? prefix.split('/').filter(Boolean).map((part, i, parts) => {
            const path = parts.slice(0, i + 1).join('/') + '/';
            return `
              <span class="breadcrumb-separator">/</span>
              <a href="?prefix=${encodeURIComponent(path)}">${part}</a>
            `;
          }).join('') : ''}
        </div>
        
        <div class="file-explorer">
          <table class="file-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Last Modified</th>
              </tr>
            </thead>
            <tbody>
              ${folders.length === 0 && files.length === 0 ? `
                <tr>
                  <td colspan="3" style="text-align: center; padding: 3rem; color: var(--text-light);">
                    <i class="material-icons" style="font-size: 3rem; color: var(--border);">folder_open</i>
                    <p>This folder is empty</p>
                  </td>
                </tr>
              ` : ''}
              ${folders.map(folder => {
                const folderName = folder.replace(prefix, '').replace(/\/$/, '');
                return `
                  <tr>
                    <td>
                      <div style="display: flex; align-items: center;">
                        <i class="material-icons file-icon">folder</i>
                        <a href="?prefix=${encodeURIComponent(folder)}" class="folder-link">${folderName}</a>
                      </div>
                    </td>
                    <td class="file-size">-</td>
                    <td class="file-date">-</td>
                  </tr>
                `;
              }).join('')}
              ${files.map(file => {
                const fileName = file.key.replace(prefix, '');
                return `
                  <tr>
                    <td>
                      <div style="display: flex; align-items: center;">
                        <i class="material-icons file-icon">android</i>
                        <a href="?download=${encodeURIComponent(file.key)}" 
                           class="file-link" 
                           download 
                           data-filename="${fileName}" 
                           data-filesize="${formatFileSize(file.size)}">
                          ${fileName}
                        </a>
                      </div>
                    </td>
                    <td class="file-size">${formatFileSize(file.size)}</td>
                    <td class="file-date">${new Date(file.uploaded).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Download Popup -->
        <div class="download-popup" id="downloadPopup">
          <div class="download-content">
            <i class="material-icons" style="font-size: 3rem; color: var(--primary);">file_download</i>
            <h3>Downloading File</h3>
            <div class="download-progress">
              <div class="download-progress-bar" id="downloadProgressBar"></div>
            </div>
            <div style="margin: 1rem 0;">
              <p id="downloadFilename" style="margin: 0.5rem 0; font-weight: 500;"></p>
              <p id="downloadFilesize" style="margin: 0.5rem 0; color: var(--text-light);"></p>
            </div>
            <button id="downloadClose" style="
              padding: 0.5rem 1.5rem;
              background-color: var(--primary);
              color: white;
              border: none;
              border-radius: 0.375rem;
              cursor: pointer;
              transition: background-color 0.2s;
            ">
              Close
            </button>
          </div>
        </div>

        <!-- Footer -->
        <footer class="footer">
          <p>ReVanced Apps Repository - Pre-patched Android applications</p>
          <p>Maintained with ❤️ by <a href="https://github.com/luxysiv" target="_blank">Manh Duong</a></p>
          <a href="https://github.com/luxysiv/revanced-nonroot" class="github-link" target="_blank">
            <i class="material-icons" style="margin-right: 0.25rem;">code</i>
            View on GitHub
          </a>
          <p style="margin-top: 1rem; font-size: 0.75rem;">
            Powered by Cloudflare Workers • ${new Date().getFullYear()}
          </p>
        </footer>

        <script>
          (function() {
            // DOM elements
            const downloadPopup = document.getElementById('downloadPopup');
            const progressBar = document.getElementById('downloadProgressBar');
            const filenameEl = document.getElementById('downloadFilename');
            const filesizeEl = document.getElementById('downloadFilesize');
            const closeBtn = document.getElementById('downloadClose');
            
            // Handle file downloads
            document.querySelectorAll('.file-link[download]').forEach(link => {
              link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get file info
                const filename = this.getAttribute('data-filename');
                const filesize = this.getAttribute('data-filesize');
                const downloadUrl = this.href;
                
                // Show popup
                filenameEl.textContent = filename;
                filesizeEl.textContent = filesize;
                downloadPopup.classList.add('active');
                
                // Simulate download progress
                let progress = 0;
                const interval = setInterval(() => {
                  progress += Math.random() * 15;
                  if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    
                    // Trigger actual download after short delay
                    setTimeout(() => {
                      const a = document.createElement('a');
                      a.href = downloadUrl;
                      a.download = filename;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      
                      // Close popup after download
                      setTimeout(() => {
                        downloadPopup.classList.remove('active');
                        progressBar.style.width = '0%';
                      }, 500);
                    }, 300);
                  }
                  progressBar.style.width = progress + '%';
                }, 150);
                
                // Close button handler
                const closeHandler = () => {
                  clearInterval(interval);
                  downloadPopup.classList.remove('active');
                  progressBar.style.width = '0%';
                };
                
                closeBtn.onclick = closeHandler;
                downloadPopup.onclick = (e) => e.target === downloadPopup && closeHandler();
              });
            });
          })();
        </script>
      </div>
    </body>
    </html>
  `;

  return html;
}

export function generateErrorHtml(errorMessage) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Error</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <style>
        body {
          font-family: 'Inter', sans-serif;
          background-color: #f8fafc;
          color: #083344;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          padding: 1rem;
        }
        .error-container {
          text-align: center;
          max-width: 600px;
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #06b6d4;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        a {
          color: #06b6d4;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <h1><i class="material-icons">error</i> An Error Occurred</h1>
        <p>${errorMessage}</p>
        <a href="/"><i class="material-icons">home</i>Return to home page</a>
      </div>
    </body>
    </html>
  `;
}