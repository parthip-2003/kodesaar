document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');

    // Custom Cursor Movement
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Cursor hover effects
    const interactiveElements = document.querySelectorAll('a, button, .gallery-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2.5)';
            cursor.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.backgroundColor = 'transparent';
        });
    });

    // Reveal animations on scroll
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- GALLERY ENGINE ---

    // --- GALLERY ENGINE ---
    const INSTAGRAM_ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_HERE';

    // Local Media Fallback (Cleaned)
    const LOCAL_MEDIA = [];

    const galleryGrid = document.querySelector('.gallery-grid');

    async function fetchGalleryContent() {
        let mediaItems = [];

        // 1. Fetch Dynamic Media from Supabase (Primary Source)
        try {
            const { data, error } = await supabaseClient
                .from('gallery')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) {
                const dbItems = data.map(item => ({
                    type: item.type === 'photo' ? 'IMAGE' : 'VIDEO',
                    media_url: item.url,
                    permalink: item.url,
                    caption: item.caption
                }));
                mediaItems = [...mediaItems, ...dbItems];
            }
        } catch (dbError) {
            console.warn('Supabase Gallery Error:', dbError);
        }

        // 2. Fetch Instagram (Secondary)
        if (INSTAGRAM_ACCESS_TOKEN && INSTAGRAM_ACCESS_TOKEN !== 'YOUR_ACCESS_TOKEN_HERE') {
            try {
                const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&access_token=${INSTAGRAM_ACCESS_TOKEN}`);
                const data = await response.json();
                if (data.data) mediaItems = [...mediaItems, ...data.data];
            } catch (error) {
                console.error('Instagram Error:', error);
            }
        }

        // 3. Fallback / Empty State
        if (mediaItems.length === 0) {
            // If nothing found, show a message instead of broken images
            galleryGrid.innerHTML = `
                <div style="text-align:center; grid-column: 1/-1; color:#666;">
                    <i class="fas fa-folder-open" style="font-size:3em; margin-bottom:10px;"></i>
                    <p>No moments captured yet. Upload via Admin Panel.</p>
                </div>
           `;
            return;
        }

        renderMedia(mediaItems);
    }

    function renderMedia(mediaItems) {
        galleryGrid.innerHTML = '';
        mediaItems.slice(0, 16).forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';

            const urlRaw = item.media_url || item.url;
            const url = urlRaw.toLowerCase();
            const thumb = item.thumbnail_url || item.thumb || '';

            // STRICT FIX: Only treat as video if extension matches, otherwise it's an image.
            // This overrides any database errors where photos were saved as 'video'.
            const isDefiniteVideo = url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') || url.includes('.ogg');

            if (isDefiniteVideo) {
                galleryItem.innerHTML = `
                    <video src="${urlRaw}" poster="${thumb}" loop muted playsinline></video>
                    <div class="video-overlay"><i class="fas fa-play"></i></div>
                `;
                galleryItem.addEventListener('mouseenter', () => galleryItem.querySelector('video').play());
                galleryItem.addEventListener('mouseleave', () => {
                    const v = galleryItem.querySelector('video');
                    v.pause();
                    v.currentTime = 0;
                });
            } else {
                galleryItem.innerHTML = `<img src="${urlRaw}" alt="Kodesaar Gallery">`;
            }

            galleryItem.addEventListener('click', () => window.open(item.permalink || url, '_blank'));
            galleryGrid.appendChild(galleryItem);
        });
    }

    // --- CONTACT FORM HANDLER ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Auto-fill if user is logged in
        const loggedInUser = localStorage.getItem('kodesaar_user');
        if (loggedInUser) {
            const nameInput = document.getElementById('contact-name');
            // Try to find email from session if possible, otherwise leave blank or try to store it too
            // For now, simpler:
            if (nameInput) nameInput.value = loggedInUser;
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const sendBtn = contactForm.querySelector('.send-btn');
            const originalText = sendBtn.innerHTML;

            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;

            // Simulate Sending
            sendBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
            sendBtn.style.opacity = '0.7';
            sendBtn.disabled = true;

            try {
                // Save to Supabase
                const { error } = await supabaseClient
                    .from('messages')
                    .insert([
                        {
                            name: name,
                            email: email,
                            message: message,
                            created_at: new Date().toISOString()
                        }
                    ]);

                if (error) throw error;

                // Success State
                sendBtn.innerHTML = '<span>Sent Successfully!</span> <i class="fas fa-check"></i>';
                sendBtn.style.backgroundColor = '#2ecc71';
                sendBtn.style.opacity = '1';

                // Reset Form after delay
                setTimeout(() => {
                    contactForm.reset();
                    sendBtn.innerHTML = originalText;
                    sendBtn.style.backgroundColor = '';
                    sendBtn.disabled = false;
                }, 3000);

            } catch (error) {
                console.error('Error sending message:', error);

                // SHOW EXPLICIT ERROR TO USER
                alert('⚠️ TRANSMISSION FAILED ⚠️\n\nReason: ' + (error.message || 'Unknown Error') + '\n\nPlease ensure you have run the MASTER_SQL_FIX script in Supabase!');

                sendBtn.innerHTML = originalText;
                sendBtn.style.backgroundColor = '#e74c3c'; // Red for error
                sendBtn.disabled = false;

                // Revert red color after delay
                setTimeout(() => {
                    sendBtn.style.backgroundColor = '';
                }, 3000);
            }
        });
    }

    fetchGalleryContent();
});
