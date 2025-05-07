export function generateBreadcrumbs(url, prefix) {
  return `<div class="breadcrumb">
    <a href="/"><i class="fas fa-home"></i> Home</a>
    ${prefix ? prefix.split('/').filter(Boolean).map((part, i, parts) => {
      const path = parts.slice(0, i + 1).join('/') + '/';
      return `
        <span class="breadcrumb-separator">/</span>
        <a href="?prefix=${encodeURIComponent(path)}">
          <i class="fas fa-folder"></i> ${part}
        </a>
      `;
    }).join('') : ''}
  </div>`;
}

export function generateFileStats(folders, files) {
  return `<div class="stats-bar">
    <span><i class="fas fa-folder"></i> ${folders.length} ${folders.length === 1 ? 'Folder' : 'Folders'}</span>
    <span><i class="fas fa-file"></i> ${files.length} ${files.length === 1 ? 'File' : 'Files'}</span>
  </div>`;
}

export function generateFileGrid(url, prefix, folders, files, formatFileSize) {
  if (folders.length === 0 && files.length === 0) {
    return `<div class="file-grid">
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fas fa-folder-open"></i>
        </div>
        <h3>This folder is empty</h3>
        <p>No files or subfolders found</p>
      </div>
    </div>`;
  }

  let html = `<div class="file-grid">`;

  // Display folders
  for (const folder of folders) {
    const folderName = folder.replace(prefix, '').replace(/\/$/, '');
    const folderUrl = `${url.pathname}?prefix=${encodeURIComponent(folder)}`;
    html += `
      <div class="file-card">
        <div class="file-card-icon">
          <i class="fas fa-folder"></i>
        </div>
        <div class="file-card-body">
          <div class="file-card-name">${folderName}</div>
          <div class="file-card-meta">
            <span>Folder</span>
          </div>
        </div>
        <div class="file-card-footer">
          <a href="${folderUrl}" class="file-card-link">
            Open <i class="fas fa-chevron-right" style="margin-left: 0.25rem;"></i>
          </a>
        </div>
      </div>
    `;
  }

  // Display files
  for (const file of files) {
    const fileName = file.key.replace(prefix, '');
    const fileUrl = `${url.pathname}?download=${encodeURIComponent(file.key)}`;
    const uploadDate = new Date(file.uploaded).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    // Determine if file is new (uploaded in last 7 days)
    const isNew = (Date.now() - new Date(file.uploaded).getTime()) < 7 * 24 * 60 * 60 * 1000;
    // Determine if file is updated (uploaded in last 30 days)
    const isUpdated = (Date.now() - new Date(file.uploaded).getTime()) < 30 * 24 * 60 * 60 * 1000;
    
    html += `
      <div class="file-card">
        <div class="file-card-icon">
          <i class="fas fa-mobile-alt"></i>
        </div>
        <div class="file-card-body">
          <div class="file-card-name">
            ${fileName}
            ${isNew ? '<span class="badge badge-new">New</span>' : ''}
            ${!isNew && isUpdated ? '<span class="badge badge-updated">Updated</span>' : ''}
          </div>
          <div class="file-card-meta">
            <span>${formatFileSize(file.size)}</span>
            <span>•</span>
            <span>${uploadDate}</span>
          </div>
        </div>
        <div class="file-card-footer">
          <a href="${fileUrl}" class="file-card-link" download>
            Download <i class="fas fa-download" style="margin-left: 0.25rem;"></i>
          </a>
        </div>
      </div>
    `;
  }

  html += `</div>`;
  return html;
}

export function generatePagination(url, prefix, cursor) {
  const nextUrl = new URL(url);
  nextUrl.searchParams.set('cursor', cursor);
  if (prefix) {
    nextUrl.searchParams.set('prefix', prefix);
  }
  nextUrl.searchParams.delete('download');
  
  return `<div class="pagination">
    <a href="${nextUrl.pathname + nextUrl.search}" class="btn">
      Load More <i class="fas fa-plus" style="margin-left: 0.5rem;"></i>
    </a>
  </div>`;
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
