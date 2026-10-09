// Image Gallery & File Picker for Profile Icons

const ImageGallery = {
  // Open file picker to select folder/images
  async openFilePicker() {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'image/*';
      input.webkitdirectory = true; // For folder selection on supported browsers
      
      return new Promise((resolve) => {
        input.addEventListener('change', async (e) => {
          const files = Array.from(e.target.files);
          const images = await this.processFiles(files);
          resolve(images);
        });
        input.click();
      });
    } catch (err) {
      console.error('File picker error:', err);
      return [];
    }
  },

  // Process selected files into image data
  async processFiles(files) {
    const images = [];
    
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      
      try {
        const dataUrl = await this.fileToDataUrl(file);
        images.push({
          name: file.name,
          dataUrl: dataUrl,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        });
      } catch (err) {
        console.error(`Error processing ${file.name}:`, err);
      }
    }
    
    return images;
  },

  // Convert file to data URL
  fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Show gallery modal
  showGallery(images, onSelect) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.6)';
    overlay.style.zIndex = '2000';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'flex-start';
    overlay.style.overflowY = 'auto';
    overlay.style.padding = '1rem 0';

    const modal = document.createElement('div');
    modal.style.background = 'white';
    modal.style.borderRadius = '1rem';
    modal.style.width = '90%';
    modal.style.maxWidth = '500px';
    modal.style.padding = '1.5rem';
    modal.style.boxShadow = '0 10px 40px rgba(0,0,0,0.2)';

    // Header
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '1.5rem';
    header.innerHTML = `
      <h2 style="margin:0;font-size:1.25rem;font-weight:700;color:#111827;">Select Icon</h2>
      <button id="gallery-close" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#6b7280;">&times;</button>
    `;
    modal.appendChild(header);

    // Gallery grid
    const gallery = document.createElement('div');
    gallery.style.display = 'grid';
    gallery.style.gridTemplateColumns = 'repeat(auto-fill, minmax(80px, 1fr))';
    gallery.style.gap = '1rem';
    gallery.style.maxHeight = '60vh';
    gallery.style.overflowY = 'auto';
    gallery.style.marginBottom = '1.5rem';

    if (images.length === 0) {
      gallery.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#9ca3af;padding:2rem 0;">No images found</p>';
    } else {
      images.forEach((img, idx) => {
        const imgContainer = document.createElement('div');
        imgContainer.style.position = 'relative';
        imgContainer.style.paddingBottom = '100%';
        imgContainer.style.backgroundColor = '#f3f4f6';
        imgContainer.style.borderRadius = '0.75rem';
        imgContainer.style.overflow = 'hidden';
        imgContainer.style.cursor = 'pointer';
        imgContainer.style.border = '2px solid transparent';
        imgContainer.style.transition = 'all 0.2s';

        const img_element = document.createElement('img');
        img_element.src = img.dataUrl;
        img_element.style.position = 'absolute';
        img_element.style.top = '0';
        img_element.style.left = '0';
        img_element.style.width = '100%';
        img_element.style.height = '100%';
        img_element.style.objectFit = 'cover';

        imgContainer.appendChild(img_element);

        imgContainer.addEventListener('click', () => {
          overlay.remove();
          onSelect(img);
        });

        imgContainer.addEventListener('mouseenter', () => {
          imgContainer.style.borderColor = '#00BD6A';
          imgContainer.style.boxShadow = '0 0 0 3px rgba(0,189,106,0.1)';
        });

        imgContainer.addEventListener('mouseleave', () => {
          imgContainer.style.borderColor = 'transparent';
          imgContainer.style.boxShadow = 'none';
        });

        gallery.appendChild(imgContainer);
      });
    }

    modal.appendChild(gallery);

    // Footer
    const footer = document.createElement('div');
    footer.style.display = 'flex';
    footer.style.gap = '0.75rem';
    footer.innerHTML = `
      <button id="gallery-upload-more" style="flex:1;padding:0.75rem;border:1px solid #e5e7eb;background:white;border-radius:0.75rem;font-weight:600;cursor:pointer;">Upload More</button>
      <button id="gallery-cancel" style="flex:1;padding:0.75rem;border:none;background:#f3f4f6;border-radius:0.75rem;font-weight:600;cursor:pointer;">Cancel</button>
    `;
    modal.appendChild(footer);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Event listeners
    overlay.querySelector('#gallery-close').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#gallery-cancel').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#gallery-upload-more').addEventListener('click', async () => {
      overlay.remove();
      const newImages = await this.openFilePicker();
      if (newImages.length > 0) {
        this.showGallery([...images, ...newImages], onSelect);
      }
    });
  },

  // Main function - open picker and show gallery
  async start(onSelect) {
    const images = await this.openFilePicker();
    if (images.length > 0) {
      this.showGallery(images, onSelect);
    } else {
      toast.error('No images selected');
    }
  }
};

window.ImageGallery = ImageGallery;
