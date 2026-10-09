// js/disk-image-store.js
// Disk Image Store: pick a directory, scan images, persist thumbnails in IndexedDB.

const DISK_DB_NAME = 'opay_disk_image_store_v1';
const DISK_STORE_DIRS = 'dirHandles';
const DISK_STORE_IMAGES = 'images';

function openDiskDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DISK_DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DISK_STORE_DIRS)) db.createObjectStore(DISK_STORE_DIRS, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(DISK_STORE_IMAGES)) db.createObjectStore(DISK_STORE_IMAGES, { keyPath: 'name' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function diskIdbPut(storeName, value) {
  const db = await openDiskDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const req = tx.objectStore(storeName).put(value);
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = () => reject(req.error);
  });
}

async function diskIdbGetAll(storeName) {
  const db = await openDiskDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function diskIdbGet(storeName, key) {
  const db = await openDiskDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function diskIdbDelete(storeName, key) {
  const db = await openDiskDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const req = tx.objectStore(storeName).delete(key);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

// Generate a thumbnail blob from an image/blob. Returns a PNG blob.
function generateThumbnailBlob(blob, maxDim = 256, quality = 0.85) {
  return new Promise(async (resolve, reject) => {
    try {
      let bitmap;
      if (window.createImageBitmap) {
        bitmap = await createImageBitmap(blob);
      } else {
        // Fallback: use Image element
        const url = URL.createObjectURL(blob);
        await new Promise((res, rej) => {
          const img = new Image();
          img.onload = () => { bitmap = img; res(); URL.revokeObjectURL(url); };
          img.onerror = (e) => { URL.revokeObjectURL(url); rej(e); };
          img.src = url;
        });
      }

      let width = bitmap.width || bitmap.naturalWidth;
      let height = bitmap.height || bitmap.naturalHeight;
      const scale = Math.min(1, maxDim / Math.max(width, height));
      const w = Math.round(width * scale);
      const h = Math.round(height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      // If bitmap is an Image element (fallback) drawImage works; createImageBitmap returns an ImageBitmap which also works
      ctx.drawImage(bitmap, 0, 0, w, h);

      canvas.toBlob((thumbBlob) => {
        if (!thumbBlob) return reject(new Error('Thumbnail generation failed'));
        resolve(thumbBlob);
      }, 'image/png', quality);
    } catch (err) {
      reject(err);
    }
  });
}

const DiskImageStore = {
  async pickDirectoryAndScan() {
    if (window.showDirectoryPicker) {
      try {
        const dirHandle = await window.showDirectoryPicker();
        // Save a reference keyed by 'primary'
        try {
          await diskIdbPut(DISK_STORE_DIRS, { id: 'primary', handle: dirHandle });
        } catch (e) {
          // Some browsers may not allow storing handles; ignore but continue scanning
          console.warn('Could not persist directory handle:', e);
        }
        await this.scanDirectoryHandleAndStoreImages(dirHandle);
        return true;
      } catch (err) {
        console.warn('Directory pick cancelled or failed', err);
        return false;
      }
    }
    // Fallback
    return this.fallbackSelectFolder();
  },

  async scanDirectoryHandleAndStoreImages(dirHandle, pathPrefix = '') {
    // Walk directory recursively
    for await (const [name, handle] of dirHandle.entries()) {
      const fullPath = pathPrefix ? `${pathPrefix}/${name}` : name;
      if (handle.kind === 'file') {
        try {
          const file = await handle.getFile();
          if (!file.type.startsWith('image/')) continue;
          // generate thumbnail and store thumbnail blob only
          try {
            const thumb = await generateThumbnailBlob(file, 256);
            const key = fullPath; // unique within store
            await diskIdbPut(DISK_STORE_IMAGES, { name: key, thumb, type: file.type, size: file.size, lastModified: file.lastModified });
          } catch (thumbErr) {
            console.warn('Thumbnail generation failed for', fullPath, thumbErr);
            // fallback: store original blob if thumbnail fails
            const blob = file.slice(0, file.size);
            await diskIdbPut(DISK_STORE_IMAGES, { name: fullPath, thumb: blob, type: file.type, size: file.size, lastModified: file.lastModified });
          }
        } catch (err) {
          console.error('Error reading file', fullPath, err);
        }
      } else if (handle.kind === 'directory') {
        // recurse
        await this.scanDirectoryHandleAndStoreImages(handle, fullPath);
      }
    }
  },

  async fallbackSelectFolder() {
    return new Promise((resolve) => {
      let input = document.getElementById('opay-folder-input');
      if (!input) {
        input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;
        input.multiple = true;
        input.style.display = 'none';
        input.id = 'opay-folder-input';
        document.body.appendChild(input);
      }

      input.onchange = async (e) => {
        const files = Array.from(e.target.files || []);
        for (const f of files) {
          if (!f.type.startsWith('image/')) continue;
          try {
            const thumb = await generateThumbnailBlob(f, 256);
            const key = f.webkitRelativePath || f.name;
            await diskIdbPut(DISK_STORE_IMAGES, { name: key, thumb, type: f.type, size: f.size, lastModified: f.lastModified });
          } catch (err) {
            console.error('Error storing fallback file', f.name, err);
            const blob = f.slice(0, f.size);
            await diskIdbPut(DISK_STORE_IMAGES, { name: f.name, thumb: blob, type: f.type, size: f.size, lastModified: f.lastModified });
          }
        }
        input.value = '';
        resolve(true);
      };

      input.click();
    });
  },

  async loadStoredImages() {
    const rows = await diskIdbGetAll(DISK_STORE_IMAGES);
    return rows.map(r => {
      const url = URL.createObjectURL(r.thumb);
      return { name: r.name, url, type: r.type, size: r.size, lastModified: r.lastModified };
    });
  },

  async getRawImageBlob(name) {
    const row = await diskIdbGet(DISK_STORE_IMAGES, name);
    return row ? row.thumb : null;
  },

  async clearAll() {
    const rows = await diskIdbGetAll(DISK_STORE_IMAGES);
    for (const r of rows) {
      await diskIdbDelete(DISK_STORE_IMAGES, r.name);
    }
    try {
      await diskIdbDelete(DISK_STORE_DIRS, 'primary');
    } catch (e) {}
  },

  // Rescan using the stored directory handle if available
  async rescanPrimary() {
    try {
      const record = await diskIdbGet(DISK_STORE_DIRS, 'primary');
      if (!record || !record.handle) return false;
      const dirHandle = record.handle;
      // Clear images first to avoid duplicates
      const rows = await diskIdbGetAll(DISK_STORE_IMAGES);
      for (const r of rows) await diskIdbDelete(DISK_STORE_IMAGES, r.name);
      await this.scanDirectoryHandleAndStoreImages(dirHandle);
      return true;
    } catch (e) {
      console.warn('Rescan failed', e);
      return false;
    }
  }
};

window.DiskImageStore = DiskImageStore;
