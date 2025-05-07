export function generateHtml(url, prefix, folders, files, isTruncated, cursor, formatFileSize) {
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ReVanced Apps Repository</title>
      <meta name="description" content="Download patched ReVanced apps">
      
      <!-- Fonts & Icons -->
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      
      <!-- Modern CSS with variables -->
      <style>
        :root {
          --primary: #6366f1;
          --primary-dark: #4f46e5;
          --primary-light: #a5b4fc;
          --secondary: #f9fafb;
          --text: #1f2937;
          --text-light: #6b7280;
          --border: #e5e7eb;
          --hover-bg: #f3f4f6;
          --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
          color: var(--text);
          background-color: #f8fafc;
          padding: 0;
          margin: 0;
          min-height: 100vh;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        header {
          text-align: center;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          position: relative;
        }
        
        .header-content {
          background: var(--gradient);
          padding: 2rem;
          border-radius: 0.5rem;
          color: white;
          box-shadow: var(--card-shadow);
          margin-bottom: 1.5rem;
        }
        
        h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .subtitle {
          font-size: 1.125rem;
          opacity: 0.9;
          margin-bottom: 1.5rem;
        }
        
        .github-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1.25rem;
          background-color: rgba(255, 255, 255, 0.15);
          color: white;
          border-radius: 0.375rem;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
          margin: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .github-btn:hover {
          background-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }
        
        .github-btn i {
          margin-right: 0.5rem;
        }
        
        .breadcrumb {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          color: var(--text-light);
          background: white;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          box-shadow: var(--card-shadow);
        }
        
        .breadcrumb a {
          color: var(--primary);
          text-decoration: none;
          transition: color 0.2s;
        }
        
        .breadcrumb a:hover {
          color: var(--primary-dark);
          text-decoration: underline;
        }
        
        .breadcrumb-separator {
          margin: 0 0.5rem;
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
          padding: 1rem 1.5rem;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }
        
        .file-table td {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border);
        }
        
        .file-table tr:hover {
          background-color: var(--hover-bg);
        }
        
        .file-icon {
          margin-right: 0.75rem;
          vertical-align: middle;
          color: var(--primary);
        }
        
        .file-name {
          display: flex;
          align-items: center;
        }
        
        .file-link {
          color: var(--text);
          text-decoration: none;
          transition: color 0.2s;
        }
        
        .file-link:hover {
          color: var(--primary);
        }
        
        .folder-link {
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
        }
        
        .folder-link:hover {
          text-decoration: underline;
        }
        
        .file-size {
          color: var(--text-light);
          font-family: monospace;
        }
        
        .file-date {
          color: var(--text-light);
          font-size: 0.875rem;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--text-light);
        }
        
        .empty-state i {
          font-size: 3rem;
          color: var(--border);
          margin-bottom: 1rem;
        }
        
        .pagination {
          display: flex;
          justify-content: center;
          padding: 1.5rem;
          border-top: 1px solid var(--border);
        }
        
        .pagination-button {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1rem;
          background-color: var(--primary);
          color: white;
          border-radius: 0.375rem;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .pagination-button:hover {
          background-color: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .footer {
          text-align: center;
          margin-top: 3rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          color: var(--text-light);
          font-size: 0.875rem;
        }
        
        .footer a {
          color: var(--primary);
          text-decoration: none;
        }
        
        .footer a:hover {
          text-decoration: underline;
        }
        
        .stats-bar {
          display: flex;
          justify-content: space-between;
          background-color: var(--secondary);
          padding: 0.75rem 1.5rem;
          border-bottom: 1px solid var(--border);
          font-size: 0.875rem;
          color: var(--text-light);
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }
          
          h1 {
            font-size: 2rem;
          }
          
          .file-table th, .file-table td {
            padding: 0.75rem;
          }
          
          .file-name span {
            display: none;
          }
          
          .stats-bar {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <div class="header-content">
            <h1>ReVanced Apps Repository</h1>
            <p class="subtitle">Pre-patched Android applications ready for download</p>
            <a href="https://github.com/luxysiv/revanced-nonroot" class="github-btn" target="_blank" rel="noopener">
              <i class="fab fa-github"></i>
              View on GitHub
            </a>
          </div>
        </header>
        
        <!-- Breadcrumb navigation -->
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
          <div class="stats-bar">
            <span>${folders.length} ${folders.length === 1 ? 'folder' : 'folders'}</span>
            <span>${files.length} ${files.length === 1 ? 'file' : 'files'}</span>
          </div>
          
          <table class="file-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Last Modified</th>
              </tr>
            </thead>
            <tbody>
  `;

  // Display empty state if no content
  if (folders.length === 0 && files.length === 0) {
    html += `
              <tr>
                <td colspan="3" class="empty-state">
                  <i class="material-icons">folder_open</i>
                  <p>This folder is empty</p>
                </td>
              </tr>
    `;
  } else {
    // Display folders
    for (const folder of folders) {
      const folderName = folder.replace(prefix, '').replace(/\/$/, '');
      const folderUrl = `${url.pathname}?prefix=${encodeURIComponent(folder)}`;
      html += `
              <tr>
                <td>
                  <div class="file-name">
                    <i class="material-icons file-icon">folder</i>
                    <a href="${folderUrl}" class="folder-link">${folderName}</a>
                  </div>
                </td>
                <td class="file-size">-</td>
                <td class="file-date">-</td>
              </tr>
      `;
    }

    // Display files
    for (const file of files) {
      const fileName = file.key.replace(prefix, '');
      const fileUrl = `${url.pathname}?download=${encodeURIComponent(file.key)}`;
      const uploadDate = new Date(file.uploaded).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      html += `
              <tr>
                <td>
                  <div class="file-name">
                    <i class="material-icons file-icon">android</i>
                    <a href="${fileUrl}" class="file-link" download>${fileName}</a>
                  </div>
                </td>
                <td class="file-size">${formatFileSize(file.size)}</td>
                <td class="file-date">${uploadDate}</td>
              </tr>
      `;
    }
  }

  html += `
            </tbody>
          </table>
  `;

  // Add pagination if needed
  if (isTruncated) {
    const nextUrl = new URL(url);
    nextUrl.searchParams.set('cursor', cursor);
    if (prefix) {
      nextUrl.searchParams.set('prefix', prefix);
    }
    nextUrl.searchParams.delete('download');
    html += `
          <div class="pagination">
            <a href="${nextUrl.pathname + nextUrl.search}" class="pagination-button">
              Load More
              <i class="material-icons" style="margin-left: 0.5rem;">arrow_forward</i>
            </a>
          </div>
    `;
  }

  html += `
        </div>
        
        <footer class="footer">
          <p>Patched with ❤️ by <a href="https://github.com/luxysiv" target="_blank">Manh Duong</a></p>
          <p>ReVanced Apps Repository • Powered by Cloudflare Workers</p>
        </footer>
      </div>
      
      <script>
        // Simple client-side enhancement for file downloads
        document.addEventListener('DOMContentLoaded', function() {
          const fileLinks = document.querySelectorAll('.file-link[download]');
          fileLinks.forEach(link => {
            link.addEventListener('click', function(e) {
              console.log('Downloading:', this.getAttribute('href'));
            });
          });
        });
      </script>
    </body>
    </html>
  `;

  return html;
}

export function generateErrorHtml(errorMessage) {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Error</title>
      <style>
        body {
          font-family: 'Inter', sans-serif;
          background-color: #fef2f2;
          color: #b91c1c;
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
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        a {
          color: #6366f1;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <h1>⚠️ An Error Occurred</h1>
        <p>${errorMessage}</p>
        <p><a href="/">Return to home page</a></p>
      </div>
    </body>
    </html>
  `;
  
  return html;
}
