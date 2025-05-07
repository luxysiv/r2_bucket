import {
  generateBreadcrumbs,
  generateFileStats,
  generateFileGrid,
  generatePagination
} from './utils.js';


export function generateHtml(url, prefix, folders, files, isTruncated, cursor, formatFileSize) {
  const breadcrumbs = generateBreadcrumbs(url, prefix);
  const fileStats = generateFileStats(folders, files);
  const fileGrid = generateFileGrid(url, prefix, folders, files, formatFileSize);
  const pagination = isTruncated ? generatePagination(url, prefix, cursor) : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ReVanced Apps | APK Repository</title>
  <meta name="description" content="Download pre-patched ReVanced apps for Android">
  <meta name="theme-color" content="#6366f1">
  
  <!-- Fonts & Icons -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
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
      --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
      --gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      --success: #10b981;
      --warning: #f59e0b;
      --error: #ef4444;
      --radius: 12px;
      --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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
      padding: 1.5rem;
    }
    
    /* Header Styles */
    .header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .header-content {
      background: white;
      padding: 2rem;
      border-radius: var(--radius);
      box-shadow: var(--card-shadow);
      margin-bottom: 1.5rem;
      position: relative;
      overflow: hidden;
      border: 1px solid var(--border);
    }
    
    .logo {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: var(--gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: inline-block;
    }
    
    .subtitle {
      font-size: 1.125rem;
      color: var(--text-light);
      margin-bottom: 1.5rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    /* Button Styles */
    .btn-group {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      background-color: var(--primary);
      color: white;
      border-radius: var(--radius);
      text-decoration: none;
      font-weight: 500;
      transition: var(--transition);
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
      box-shadow: 0 2px 5px rgba(99, 102, 241, 0.3);
    }
    
    .btn:hover {
      background-color: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
    }
    
    .btn i {
      margin-right: 0.5rem;
    }
    
    .btn-outline {
      background-color: transparent;
      border: 1px solid var(--primary);
      color: var(--primary);
      box-shadow: none;
    }
    
    .btn-outline:hover {
      background-color: rgba(99, 102, 241, 0.1);
    }
    
    /* Breadcrumb */
    .breadcrumb {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      color: var(--text-light);
      flex-wrap: wrap;
      gap: 0.25rem;
    }
    
    .breadcrumb a {
      color: var(--primary);
      text-decoration: none;
      transition: var(--transition);
      display: flex;
      align-items: center;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
    }
    
    .breadcrumb a:hover {
      background-color: rgba(99, 102, 241, 0.1);
    }
    
    .breadcrumb-separator {
      margin: 0 0.25rem;
      color: var(--text-light);
    }
    
    /* File Explorer */
    .file-explorer {
      background-color: white;
      border-radius: var(--radius);
      box-shadow: var(--card-shadow);
      overflow: hidden;
      margin-bottom: 2rem;
      border: 1px solid var(--border);
    }
    
    /* Grid View */
    .file-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      padding: 1.5rem;
    }
    
    .file-card {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      transition: var(--transition);
    }
    
    .file-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    
    .file-card-icon {
      padding: 1.5rem;
      text-align: center;
      background-color: rgba(99, 102, 241, 0.05);
      color: var(--primary);
      font-size: 2.5rem;
    }
    
    .file-card-body {
      padding: 1rem;
      flex-grow: 1;
    }
    
    .file-card-name {
      font-weight: 500;
      margin-bottom: 0.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .file-card-meta {
      font-size: 0.75rem;
      color: var(--text-light);
      margin-top: auto;
    }
    
    .file-card-footer {
      padding: 0.75rem 1rem;
      background-color: var(--secondary);
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .file-card-link {
      color: var(--primary);
      text-decoration: none;
      font-size: 0.75rem;
      font-weight: 500;
      display: flex;
      align-items: center;
    }
    
    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.65rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-left: 0.5rem;
    }
    
    .badge-new {
      background-color: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }
    
    .badge-updated {
      background-color: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }
    
    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      grid-column: 1 / -1;
    }
    
    .empty-state-icon {
      font-size: 3rem;
      color: var(--border);
      margin-bottom: 1rem;
      opacity: 0.5;
    }
    
    /* Pagination */
    .pagination {
      display: flex;
      justify-content: center;
      padding: 1.5rem;
      border-top: 1px solid var(--border);
    }
    
    /* Footer */
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
    
    /* Stats Bar */
    .stats-bar {
      display: flex;
      justify-content: space-between;
      background-color: var(--secondary);
      padding: 0.75rem 1.5rem;
      border-bottom: 1px solid var(--border);
      font-size: 0.875rem;
      color: var(--text-light);
    }
    
    /* Dark Mode */
    @media (prefers-color-scheme: dark) {
      :root {
        --primary: #818cf8;
        --primary-dark: #6366f1;
        --secondary: #1e293b;
        --text: #f8fafc;
        --text-light: #94a3b8;
        --border: #334155;
        --hover-bg: #1e293b;
      }
      
      body {
        background-color: #0f172a;
      }
      
      .header-content,
      .file-explorer {
        background-color: #1e293b;
        border-color: #334155;
      }
      
      .file-card {
        background-color: #1e293b;
        border-color: #334155;
      }
      
      .file-card-icon {
        background-color: rgba(99, 102, 241, 0.1);
      }
      
      .file-card-footer {
        background-color: #0f172a;
        border-color: #334155;
      }
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      .logo {
        font-size: 2rem;
      }
      
      .file-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
      
      .btn-group {
        flex-direction: column;
        align-items: center;
      }
      
      .btn {
        width: 100%;
        justify-content: center;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <div class="header-content">
        <h1 class="logo">ReVanced Repository</h1>
        <p class="subtitle">Download pre-patched Android apps with ReVanced</p>
        <div class="btn-group">
          <a href="https://github.com/luxysiv/revanced-nonroot" class="btn" target="_blank" rel="noopener">
            <i class="fab fa-github"></i>
            GitHub
          </a>
          <a href="https://revanced.app" class="btn btn-outline" target="_blank" rel="noopener">
            <i class="fas fa-external-link-alt"></i>
            Official Site
          </a>
        </div>
      </div>
    </header>
    
    ${breadcrumbs}
    
    <div class="file-explorer">
      ${fileStats}
      
      ${fileGrid}
      
      ${pagination}
    </div>
    
    <footer class="footer">
      <p>Patched with ❤️ by <a href="https://github.com/luxysiv" target="_blank">Manh Duong</a></p>
      <p>ReVanced APK Repository • Powered by Cloudflare Workers</p>
      <p style="margin-top: 0.5rem; font-size: 0.75rem; opacity: 0.7;">
        Last updated: ${new Date().toLocaleString()}
      </p>
    </footer>
  </div>
  
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Track downloads
      const downloadLinks = document.querySelectorAll('[download]');
      downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          // Add visual feedback
          const originalText = this.innerHTML;
          this.innerHTML = '<i class="fas fa-check"></i> Downloading...';
          setTimeout(() => {
            this.innerHTML = originalText;
          }, 2000);
        });
      });
    });
  </script>
</body>
</html>`;
}


export function generateErrorHtml(errorMessage) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error | ReVanced Repository</title>
  <style>
    :root {
      --primary: #6366f1;
      --error: #ef4444;
      --text: #1f2937;
      --text-light: #6b7280;
      --border: #e5e7eb;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background-color: #fef2f2;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      padding: 1rem;
      color: var(--text);
    }
    
    .error-container {
      max-width: 600px;
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      text-align: center;
      border: 1px solid var(--border);
    }
    
    h1 {
      color: var(--error);
      margin-bottom: 1rem;
    }
    
    .error-icon {
      font-size: 3rem;
      color: var(--error);
      margin-bottom: 1rem;
    }
    
    a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      display: inline-block;
      margin-top: 1rem;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #1e293b;
      }
      
      .error-container {
        background-color: #334155;
        border-color: #475569;
        color: #f8fafc;
      }
    }
  </style>
</head>
<body>
  <div class="error-container">
    <div class="error-icon">
      <i class="fas fa-exclamation-triangle"></i>
    </div>
    <h1>An Error Occurred</h1>
    <p>${errorMessage}</p>
    <a href="/"><i class="fas fa-arrow-left"></i> Return to home page</a>
  </div>
</body>
</html>`;
}
