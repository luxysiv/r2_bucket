import { 
  generateHtml,
  generateErrorHtml
} from './html.js';
import { formatFileSize } from './utils.js';

export async function handleRequest(request) {
  try {
    const url = new URL(request.url);
    const cursor = url.searchParams.get('cursor') || undefined;
    const downloadKey = url.searchParams.get('download');
    const prefix = url.searchParams.get('prefix') || '';
    const limit = 10;

    // Connect to R2 bucket
    const bucket = R2;

    // Handle file download
    if (downloadKey) {
      const object = await bucket.get(downloadKey);
      if (!object) {
        return new Response('File not found', { status: 404 });
      }

      const headers = new Headers();
      headers.set('Content-Type', 'application/vnd.android.package-archive');
      headers.set('Content-Disposition', `attachment; filename="${downloadKey.split('/').pop()}"`);
      headers.set('Cache-Control', 'private, max-age=3600');
      return new Response(object.body, { headers });
    }

    // Configure bucket listing options
    const listOptions = {
      limit,
      delimiter: '/',
      prefix: prefix || undefined,
    };
    if (cursor) {
      listOptions.cursor = cursor;
    }
    const list = await bucket.list(listOptions);

    // Get folders and files
    let folders = list.prefixes || [];
    let files = list.objects || [];

    // If no prefixes at root level, build folder list manually
    if (!prefix && !folders.length && !files.length) {
      const allObjects = await bucket.list({ limit: 1000 });
      const folderSet = new Set();
      for (const obj of allObjects.objects) {
        const folder = obj.key.split('/')[0];
        if (folder) {
          folderSet.add(`${folder}/`);
        }
      }
      folders = Array.from(folderSet).sort();
    }

    // Generate HTML
    const html = generateHtml(url, prefix, folders, files, list.truncated, list.cursor, formatFileSize);

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(generateErrorHtml(error.message), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });    
  }
}
