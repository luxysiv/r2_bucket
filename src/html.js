export function generateHtml(url, prefix, folders, files, isTruncated, cursor, formatFileSize) {
  // Dynamic stats
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const lastUpdated = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
      <title>ReVanced Apps Repository</title>
      <meta name="description" content="Download pre-patched ReVanced Android applications">
      
      <!-- Preload critical resources -->
      <link rel="preload" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto+Mono&display=swap" as="style">
      <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" as="style">
      
      <!-- Dynamic favicon -->
      <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><defs><linearGradient id=%22grad%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22><stop offset=%220%25%22 style=%22stop-color:%23FF0000;stop-opacity:1%22 /><stop offset=%22100%25%22 style=%22stop-color:%23B71C1C;stop-opacity:1%22 /></linearGradient></defs><text x=%2210%22 y=%2280%22 font-size=%2280%22 font-family=%22Poppins, sans-serif%22 font-weight=%22700%22 fill=%22url(%23grad)%22>R</text></svg>">
      
      <!-- Inline critical CSS -->
      <style>
        :root {
          --primary: #FF0000;
          --primary-light: #FF5722;
          --accent: #FF5722;
          --text: #E0E0E0;
          --text-light: #B0B0B0;
          --bg: #121212;
          --surface: #1E1E1E;
          --border: #2C2C2C;
          --error: #B71C1C;
          --error-light: #3F0A0A;
          --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
          --hover-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
          --gradient: linear-gradient(135deg, #FF0000 0%, #B71C1C 100%);
          /* Light mode variables */
          --bg-light: #F5F5F5;
          --surface-light: #FFFFFF;
          --text-light-mode: #212121;
          --text-light-secondary: #424242;
          --border-light: #E0E0E0;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Poppins', sans-serif;
          background-color: var(--bg);
          color: var(--text);
          line-height: 1.5;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          transition: background-color 0.3s, color 0.3s;
        }

        body.light-mode {
          background-color: var(--bg-light);
          color: var(--text-light-mode);
        }

        body.light-mode .hero,
        body.light-mode .file-explorer,
        body.light-mode .stat-card,
        body.light-mode .error-container {
          background-color: var(--surface-light);
          color: var(--text-light-mode);
        }

        body.light-mode .header {
          background: linear-gradient(135deg, #FF5722 0%, #D81B60 100%);
        }

        body.light-mode .file-table th {
          background-color: var(--primary-light);
          color: var(--text);
        }

        body.light-mode .search-input {
          background-color: var(--surface-light);
          border-color: var(--border-light);
          color: var(--text-light-mode);
        }

        body.light-mode .file-link,
        body.light-mode .file-size,
        body.light-mode .file-date,
        body.light-mode .search-icon,
        body.light-mode .breadcrumb a {
          color: var(--text-light-mode);
        }

        body.light-mode .file-size,
        body.light-mode .file-date,
        body.light-mode .search-icon {
          color: var(--text-light-secondary);
        }

        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem;
          flex: 1;
        }

        /* Header */
        .header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: var(--gradient);
          box-shadow: var(--card-shadow);
          padding: 1rem 1.5rem;
          transition: all 0.3s;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: var(--text);
        }

        .header-logo-icon {
          width: 32px;
          height: 32px;
          transition: transform 0.2s;
        }

        .header-logo-icon:hover {
          transform: scale(1.1);
        }

        .header-logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .header-nav a {
          color: var(--text);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .header-nav a:hover {
          color: var(--primary-light);
        }

        .theme-toggle {
          background: none;
          border: none;
          color: var(--text);
          font-size: 1.25rem;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .theme-toggle:hover {
          transform: scale(1.1);
        }

        /* Hero Section */
        .hero {
          background: var(--surface);
          color: var(--text);
          padding: 2.5rem 1.5rem;
          border-radius: 1rem;
          margin-bottom: 1.5rem;
          position: relative;
          overflow: hidden;
          box-shadow: var(--card-shadow);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
        }

        h1 {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          opacity: 0.95;
          max-width: 700px;
          margin: 0 auto 1.5rem;
        }

        /* Breadcrumb */
        .breadcrumb {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }

        .breadcrumb a {
          color: var(--primary-light);
          text-decoration: none;
          padding: 0.375rem 0.5rem;
          border-radius: 0.375rem;
          transition: all 0.2s;
        }

        .breadcrumb a:hover {
          background-color: rgba(255, 87, 34, 0.1);
        }

        /* Stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: var(--surface);
          padding: 1.25rem;
          border-radius: 0.75rem;
          box-shadow: var(--card-shadow);
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--hover-shadow);
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.25rem;
        }

        /* File explorer */
        .file-explorer {
          background: var(--surface);
          border-radius: 0.75rem;
          box-shadow: var(--card-shadow);
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .file-header {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .file-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .search-box {
          position: relative;
          width: 100%;
        }

        @media (min-width: 640px) {
          .search-box {
            width: 300px;
          }
        }

        .search-input {
          width: 100%;
          padding: 0.625rem 1rem 0.625rem 2.5rem;
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          font-family: 'Poppins', sans-serif;
          background-color: var(--surface);
          color: var(--text);
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.2);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
        }

        /* File table */
        .file-table {
          width: 100%;
          border-collapse: collapse;
        }

        .file-table th {
          background-color: var(--primary);
          color: var(--text);
          padding: 1rem;
          text-align: left;
          font-weight: 500;
        }

        .file-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          vertical-align: middle;
        }

        /* Enhanced file icon styling */
        .file-icon {
          width: 40px;
          height: 40px;
          background-color: rgba(255, 0, 0, 0.1);
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          color: var(--primary);
          flex-shrink: 0;
          font-size: 1.5rem;
        }

        .file-name {
          display: flex;
          align-items: center;
          min-width: 0;
        }

        .file-name-content {
          min-width: 0;
          padding-right: 8px;
          white-space: normal;
          word-break: break-word;
        }

        .file-link {
          color: var(--text);
          text-decoration: none;
          transition: color 0.2s;
        }

        .file-link:hover {
          color: var(--primary-light);
        }

        .file-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background-color: var(--primary-light);
          color: var(--text);
          border-radius: 0.25rem;
          font-size: 0.6875rem;
          font-weight: 600;
          margin-left: 0.5rem;
          flex-shrink: 0;
        }

        .file-size {
          font-family: 'Roboto Mono', monospace;
          color: var(--text-light);
          white-space: nowrap;
        }

        .file-date {
          color: var(--text-light);
          font-size: 0.8125rem;
          white-space: nowrap;
        }

        /* Mobile-specific adaptations */
        @media (max-width: 640px) {
          .container {
            padding: 1rem;
          }

          .header {
            padding: 0.75rem 1rem;
          }

          .header-logo-text {
            font-size: 1.25rem;
          }

          .header-nav {
            gap: 1rem;
          }

          .header-nav a {
            font-size: 0.875rem;
          }

          .file-table thead {
            display: none;
          }

          .file-table tr {
            display: flex;
            flex-direction: column;
            padding: 1rem;
            gap: 8px;
          }

          .file-table td {
            padding: 0;
            border: none;
            display: flex;
            align-items: flex-start;
          }

          .file-table td:before {
            content: attr(data-label);
            font-weight: 600;
            width: 100px;
            color: var(--text-light);
            flex-shrink: 0;
            margin-top: 4px;
          }

          body.light-mode .file-table td:before {
            color: var(--text-light-secondary);
          }

          .file-table td:not(:first-child) {
            border-top: 1px dashed var(--border);
            padding-top: 0.5rem;
            margin-top: 0.5rem;
          }

          .file-name-content {
            white-space: normal;
            word-break: break-word;
          }
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 0.5rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
          text-align: center;
        }

        .btn-primary {
          background-color: var(--primary);
          color: var(--text);
          box-shadow: 0 4px 6px -1px rgba(255, 0, 0, 0.3);
        }

        .btn-primary:hover {
          background-color: var(--primary-light);
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(255, 87, 34, 0.3);
        }

        .btn-outline {
          border: 1px solid var(--primary);
          color: var(--primary);
          background: transparent;
        }

        body.light-mode .btn-outline {
          color: var(--primary-light);
          border-color: var(--primary-light);
        }

        /* Footer */
        .footer {
          text-align: center;
          padding: 1.5rem;
          color: var(--text-light);
          font-size: 0.875rem;
          margin-top: auto;
        }

        body.light-mode .footer {
          color: var(--text-light-secondary);
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .animate-in {
          opacity: 0;
          animation: fadeIn 0.5s ease forwards;
        }
      </style>
      
      <!-- Load non-critical CSS -->
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto+Mono&display=swap" media="print" onload="this.media='all'">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media='all'">
    </head>
    <body>
      <header class="header">
        <div class="header-content">
          <a href="/" class="header-logo">
            <svg class="header-logo-icon" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#FF0000;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#B71C1C;stop-opacity:1" />
                </linearGradient>
              </defs>
              <text x="10" y="80" font-size="80" font-family="'Poppins', sans-serif" font-weight="700" fill="url(#logoGrad)">R</text>
            </svg>
            <span class="header-logo-text">ReVanced</span>
          </a>
          <nav class="header-nav">
            <a href="/">Home</a>
            <a href="https://github.com/luxysiv/revanced-nonroot" target="_blank">GitHub</a>
            <a href="#stats">Stats</a>
            <button class="theme-toggle" aria-label="Toggle theme">
              <i class="fas fa-moon"></i>
            </button>
          </nav>
        </div>
      </header>

      <div class="container">
        <!-- Hero Section -->
        <section class="hero">
          <div class="hero-content">
            <h1>ReVanced Apps Repository</h1>
            <p class="subtitle">Download pre-patched Android applications with extended features</p>
            <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
              <a href="https://github.com/luxysiv/revanced-nonroot" class="btn btn-primary" target="_blank">
                <i class="fab fa-github"></i>
                GitHub Project
              </a>
              <a href="#file-explorer" class="btn btn-primary">
                <i class="fas fa-folder-open"></i>
                View Files
              </a>
            </div>
          </div>
        </section>

        <!-- Breadcrumb Navigation -->
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="/"><i class="fas fa-home"></i> Home</a>
          ${prefix ? prefix.split('/').filter(Boolean).map((part, i, parts) => {
            const path = parts.slice(0, i + 1).join('/') + '/';
            return `
              <i class="fas fa-chevron-right" style="color: var(--text-light); font-size: 0.75rem;"></i>
              <a href="?prefix=${encodeURIComponent(path)}">${part}</a>
            `;
          }).join('') : ''}
        </nav>

        <!-- Statistics Cards -->
        <section id="stats" class="stats-grid">
          <div class="stat-card animate-in" style="animation-delay: 0.1s">
            <div class="stat-value">${folders.length}</div>
            <div>Folders</div>
          </div>
          <div class="stat-card animate-in" style="animation-delay: 0.2s">
            <div class="stat-value">${files.length}</div>
            <div>Files</div>
          </div>
          <div class="stat-card animate-in" style="animation-delay: 0.3s">
            <div class="stat-value">${formatFileSize(totalSize)}</div>
            <div>Total Size</div>
          </div>
          <div class="stat-card animate-in" style="animation-delay: 0.4s">
            <div class="stat-value">${lastUpdated}</div>
            <div>Last Updated</div>
          </div>
        </section>

        <!-- File Explorer -->
        <div id="file-explorer" class="file-explorer animate-in" style="animation-delay: 0.5s">
          <div class="file-header">
            <h2 style="font-size: 1.125rem; font-weight: 600;">File Explorer</h2>
            <div class="search-box">
              <i class="fas fa-search search-icon"></i>
              <input type="text" class="search-input" placeholder="Search files..." id="searchInput" aria-label="Search files">
            </div>
          </div>

          <table class="file-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Modified</th>
              </tr>
            </thead>
            <tbody id="fileTableBody">
              ${folders.length === 0 && files.length === 0 ? `
                <tr>
                  <td colspan="3" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-folder-open" style="font-size: 2.5rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                    <p style="color: var(--text-light);">This folder is empty</p>
                  </td>
                </tr>
              ` : ''}
              ${folders.map(folder => {
                const folderName = folder.replace(prefix, '').replace(/\/$/, '');
                const folderUrl = `${url.pathname}?prefix=${encodeURIComponent(folder)}`;
                return `
                  <tr class="file-row" data-name="${folderName.toLowerCase()}">
                    <td data-label="Name">
                      <div class="file-name">
                        <div class="file-icon" style="color: var(--accent); background-color: rgba(255, 87, 34, 0.1)">
                          <i class="fas fa-folder-open"></i>
                        </div>
                        <div class="file-name-content">
                          <a href="${folderUrl}" class="file-link">${folderName}</a>
                          <span class="file-badge">Folder</span>
                        </div>
                      </div>
                    </td>
                    <td data-label="Size" class="file-size">-</td>
                    <td data-label="Modified" class="file-date">-</td>
                  </tr>
                `;
              }).join('')}
              ${files.map(file => {
                const fileName = file.key.replace(prefix, '');
                const fileUrl = `${url.pathname}?download=${encodeURIComponent(file.key)}`;
                const uploadDate = new Date(file.uploaded).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                // Enhanced file type detection
                const fileExt = fileName.split('.').pop().toLowerCase();
                let fileType, fileIcon, iconColor, iconBg;

                if (['apk', 'aab'].includes(fileExt)) {
                  fileType = 'Android';
                  fileIcon = 'robot';
                  iconColor = '#FF0000';
                  iconBg = 'rgba(255, 0, 0, 0.1)';
                } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(fileExt)) {
                  fileType = 'Archive';
                  fileIcon = 'file-archive';
                  iconColor = '#FF5722';
                  iconBg = 'rgba(255, 87, 34, 0.1)';
                } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExt)) {
                  fileType = 'Image';
                  fileIcon = 'file-image';
                  iconColor = '#E0E0E0';
                  iconBg = 'rgba(224, 224, 224, 0.1)';
                } else if (['mp3', 'wav', 'ogg', 'flac'].includes(fileExt)) {
                  fileType = 'Audio';
                  fileIcon = 'file-audio';
                  iconColor = '#B0B0B0';
                  iconBg = 'rgba(176, 176, 176, 0.1)';
                } else if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(fileExt)) {
                  fileType = 'Video';
                  fileIcon = 'file-video';
                  iconColor = '#FF5722';
                  iconBg = 'rgba(255, 87, 34, 0.1)';
                } else if (['pdf'].includes(fileExt)) {
                  fileType = 'PDF';
                  fileIcon = 'file-pdf';
                  iconColor = '#FF0000';
                  iconBg = 'rgba(255, 0, 0, 0.1)';
                } else if (['txt', 'csv', 'json', 'xml'].includes(fileExt)) {
                  fileType = 'Text';
                  fileIcon = 'file-alt';
                  iconColor = '#B0B0B0';
                  iconBg = 'rgba(176, 176, 176, 0.1)';
                } else if (['doc', 'docx', 'odt'].includes(fileExt)) {
                  fileType = 'Word';
                  fileIcon = 'file-word';
                  iconColor = '#E0E0E0';
                  iconBg = 'rgba(224, 224, 224, 0.1)';
                } else if (['xls', 'xlsx', 'ods'].includes(fileExt)) {
                  fileType = 'Excel';
                  fileIcon = 'file-excel';
                  iconColor = '#FF5722';
                  iconBg = 'rgba(255, 87, 34, 0.1)';
                } else if (['ppt', 'pptx', 'odp'].includes(fileExt)) {
                  fileType = 'PowerPoint';
                  fileIcon = 'file-powerpoint';
                  iconColor = '#FF5722';
                  iconBg = 'rgba(255, 87, 34, 0.1)';
                } else {
                  fileType = 'File';
                  fileIcon = 'file';
                  iconColor = '#B0B0B0';
                  iconBg = 'rgba(176, 176, 176, 0.1)';
                }

                return `
                  <tr class="file-row" data-name="${fileName.toLowerCase()}">
                    <td data-label="Name">
                      <div class="file-name">
                        <div class="file-icon" style="color: ${iconColor}; background-color: ${iconBg}">
                          <i class="fas fa-${fileIcon}"></i>
                          ${fileExt === 'apk' || fileExt === 'aab' ? `
                            <span style="display: none;">APK</span>
                          ` : ''}
                        </div>
                        <div class="file-name-content">
                          <a href="${fileUrl}" class="file-link" download data-filename="${fileName}">${fileName}</a>
                          <span class="file-badge">${fileType}</span>
                        </div>
                      </div>
                    </td>
                    <td data-label="Size" class="file-size">${formatFileSize(file.size)}</td>
                    <td data-label="Modified" class="file-date">${uploadDate}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        ${isTruncated ? `
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <a href="${url.pathname}?prefix=${encodeURIComponent(prefix || '')}&cursor=${encodeURIComponent(cursor)}" 
             class="btn btn-primary" id="loadMoreBtn">
            <i class="fas fa-plus"></i> Load More
          </a>
        </div>
        ` : ''}

        <!-- Footer -->
        <footer class="footer">
          <p>© ${new Date().getFullYear()} ReVanced Apps Repository • Created by <a href="https://github.com/luxysiv" target="_blank">Manh Duong</a></p>
          <p>Version ${lastUpdated} • Powered by Cloudflare Workers</p>
        </footer>
      </div>

      <!-- JavaScript Enhancements -->
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          // Theme Toggle
          const themeToggle = document.querySelector('.theme-toggle');
          const body = document.body;
          
          if (localStorage.getItem('theme') === 'light') {
            body.classList.add('light-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
          }

          themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLightMode = body.classList.contains('light-mode');
            themeToggle.innerHTML = isLightMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
          });

          // Search
          const searchInput = document.getElementById('searchInput');
          const fileRows = document.querySelectorAll('.file-row');
          
          searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            fileRows.forEach(row => {
              const fileName = row.getAttribute('data-name');
              row.style.display = fileName.includes(searchTerm) ? '' : 'none';
            });
          });

          // Download Feedback
          document.querySelectorAll('.file-link[download]').forEach(link => {
            link.addEventListener('click', function(e) {
              e.preventDefault();
              const fileName = this.getAttribute('data-filename');
              const fileUrl = this.href;
              const icon = this.closest('.file-name').querySelector('.file-icon');
              icon.style.transform = 'scale(1.1)';
              showToast(\`Downloading \${fileName}...\`, 'success');
              setTimeout(() => {
                window.open(fileUrl, '_blank');
                icon.style.transform = '';
              }, 300);
            });
          });

          // Load More
          const loadMoreBtn = document.getElementById('loadMoreBtn');
          if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
              this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
              this.style.pointerEvents = 'none';
            });
          }

          // Responsive Tables
          function setupResponsiveTables() {
            if (window.innerWidth < 640) {
              document.querySelectorAll('.file-table td').forEach(td => {
                const header = td.closest('table').querySelector('th:nth-child(' + (td.cellIndex + 1) + ')');
                if (header) td.setAttribute('data-label', header.textContent);
              });
            }
          }
          
          setupResponsiveTables();
          window.addEventListener('resize', setupResponsiveTables);

          // Toast
          function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.style.cssText = \`
              position: fixed;
              bottom: 20px;
              left: 50%;
              transform: translateX(-50%) translateY(100%);
              background-color: \${type === 'error' ? '#B71C1C' : '#FF0000'};
              color: #E0E0E0;
              padding: 12px 24px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              z-index: 1000;
              opacity: 0;
              transition: all 0.3s ease;
              white-space: nowrap;
              max-width: 90%;
              overflow: hidden;
              text-overflow: ellipsis;
            \`;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
              toast.style.opacity = '1';
              toast.style.transform = 'translateX(-50%) translateY(0)';
            }, 10);
            
            setTimeout(() => {
              toast.style.opacity = '0';
              toast.style.transform = 'translateX(-50%) translateY(-20px)';
              setTimeout(() => toast.remove(), 300);
            }, 3000);
          }

          // Viewport Height
          function setViewportHeight() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', \`\${vh}px\`);
          }
          
          setViewportHeight();
          window.addEventListener('resize', setViewportHeight);

          // APK Icon Fallback
          document.querySelectorAll('.file-icon').forEach(icon => {
            if (icon.querySelector('i.fa-android') && !icon.querySelector('i').offsetWidth) {
              icon.innerHTML = '<span style="font-size: 1.5rem;">📱</span>';
            }
          });
        });
      </script>
    </body>
    </html>
  `;

  return html;
}

export function generateErrorHtml(errorMessage, url) {
  const errorId = `ERR-${Date.now().toString(36).toUpperCase()}`;
  
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
      <title>Error | ReVanced Repository</title>
      
      <!-- Shared CSS -->
      <style>
        :root {
          --primary: #FF0000;
          --primary-light: #FF5722;
          --error: #B71C1C;
          --error-light: #3F0A0A;
          --text: #E0E0E0;
          --text-light: #B0B0B0;
          --bg: #121212;
          --surface: #1E1E1E;
          --border: #2C2C2C;
          --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
          --gradient: linear-gradient(135deg, #FF0000 0%, #B71C1C 100%);
          /* Light mode */
          --bg-light: #F5F5F5;
          --surface-light: #FFFFFF;
          --text-light-mode: #212121;
          --text-light-secondary: #424242;
          --border-light: #E0E0E0;
        }

        body {
          font-family: 'Poppins', sans-serif;
          background-color: var(--bg);
          color: var(--text);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 1rem;
          line-height: 1.5;
          transition: background-color 0.3s, color 0.3s;
        }

        body.light-mode {
          background-color: var(--bg-light);
          color: var(--text-light-mode);
        }

        body.light-mode .error-container {
          background-color: var(--surface-light);
          color: var(--text-light-mode);
        }

        body.light-mode .error-header {
          background: linear-gradient(135deg, #FF5722 0%, #D81B60 100%);
        }

        body.light-mode .error-code {
          background: #FFE0E0;
          color: #B71C1C;
        }

        body.light-mode .error-footer {
          color: var(--text-light-secondary);
          border-top-color: var(--border-light);
        }

        .error-container {
          max-width: 600px;
          width: 100%;
          background: var(--surface);
          border-radius: 1rem;
          box-shadow: var(--card-shadow);
          overflow: hidden;
        }

        .error-header {
          background: var(--gradient);
          color: var(--text);
          padding: 1.5rem;
          text-align: center;
        }

        .error-body {
          padding: 2rem;
          text-align: center;
        }

        .error-icon {
          font-size: 3rem;
          color: var(--error);
          margin-bottom: 1rem;
        }

        .error-code {
          display: inline-block;
          background: var(--error-light);
          color: var(--error);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-family: 'Roboto Mono', monospace;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 0.5rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
        }

        .btn-primary {
          background: var(--primary);
          color: var(--text);
          border: none;
          box-shadow: 0 4px 6px -1px rgba(255, 0, 0, 0.3);
        }

        .btn-primary:hover {
          background: var(--primary-light);
          transform: translateY(-2px);
        }

        .btn-outline {
          border: 1px solid var(--primary);
          color: var(--primary);
          background: transparent;
        }

        body.light-mode .btn-outline {
          color: var(--primary-light);
          border-color: var(--primary-light);
        }

        .error-footer {
          padding: 1rem;
          text-align: center;
          border-top: 1px solid var(--border);
          color: var(--text-light);
          font-size: 0.875rem;
        }

        /* Mobile */
        @media (max-width: 640px) {
          .error-body {
            padding: 1.5rem;
          }

          .error-actions {
            flex-direction: column;
            gap: 0.75rem;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      </style>
      
      <!-- Fonts -->
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto+Mono&display=swap">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    </head>
    <body>
      <div class="error-container">
        <div class="error-header">
          <h1>Error Occurred</h1>
        </div>
        
        <div class="error-body">
          <div class="error-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
        
          <div class="error-code">Error ID: ${errorId}</div>
        
          <p>${errorMessage}</p>
        
          <div class="error-actions">
            <a href="/" class="btn btn-primary">
              <i class="fas fa-home"></i> Return Home
            </a>
            <a href="${url?.pathname || '/'}" class="btn btn-outline">
              <i class="fas fa-redo"></i> Try Again
            </a>
          </div>
        </div>
      
        <div class="error-footer">
          <p>Please contact support if the problem persists</p>
        </div>
      </div>
    
      <script>
        // Theme
        if (localStorage.getItem('theme') === 'light') {
          document.body.classList.add('light-mode');
        }

        // Error reporting
        if (navigator.sendBeacon) {
          const errorData = {
            errorId: '${errorId}',
            message: ${JSON.stringify(errorMessage)},
            url: location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          };
          navigator.sendBeacon('/error-log', JSON.stringify(errorData));
        }
      
        // Viewport
        function setViewportHeight() {
          document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
        }
        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
      </script>
    </body>
    </html>
  `;
  
  return html;
                    }
