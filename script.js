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
    const INSTAGRAM_ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_HERE';

    // Unified Local Media (Photos & Videos)
    const LOCAL_MEDIA = [
        { type: 'IMAGE', url: 'assets/photos/534731945_1950978785735410_3945485115337309224_n.heic' },
        { type: 'IMAGE', url: 'assets/photos/534993259_24406171155645914_5518254396982700814_n.heic' },
        { type: 'IMAGE', url: 'assets/photos/536605522_1324390542635108_8855419695353112354_n.heic' },
        { type: 'IMAGE', url: 'assets/photos/552594129_17851441227554136_3272607357505550803_n.heic' },
        { type: 'IMAGE', url: 'assets/photos/622898839_17867368326554136_9008185039673851018_n.heic' },
        { type: 'VIDEO', url: 'assets/videos/AQMEvgr8St-I02Ylk-h-kWIFCTqNEbgNt4OKh7FFqQWnDl_QzEAkgW63d-c7DKVGaP-GezVqkS2yLxaYECoY5IqVGUr1VmSBdlOV2Ec.mp4' },
        { type: 'VIDEO', url: 'assets/videos/AQMLRDOOPEVGyLojUi7yOHJA6EEGHyz2sKIMbWTT5r2CZ6M1Z5eFqepvMYtwt-23u9MDPY-w3UlSQ47T-p2XEWscnq9008fAQq4xH88.mp4' },
        { type: 'VIDEO', url: 'assets/videos/AQMRZNTBXhcjorPsnmLYBW9KeSCjXNn9abt5Rxr933FhjFb3dZDfy51NHUvUSvbP07R9itpD4FD0lhaIJuM-kG3tJwB0qjH8Ep2PLnY.mp4' },
        { type: 'VIDEO', url: 'assets/videos/AQMZFQmkET4m4XXJIt1ohvsNNyLuyImc-KqgsR6FW5ZQ29f-h0KQd38QQP4CcFfdu9YJr22ymzAQ817ivbO76FUXlSPTem1x_8vaT-o.mp4' },
        { type: 'VIDEO', url: 'assets/videos/AQNUHez11Aa6qYLNPWyT0ZzUyCPERYhFBOuSn3r8_YznHx9llWcQafmoL-Zn3tvx9fQnygARzH_0uTf_nzYfaI2a5DSYBGmTJhAdeZY.mp4' },
        { type: 'VIDEO', url: 'assets/videos/AQNqQ9CnM27VjG-m28tsxXKARJWLeTBs8XnHxqgWt6rJ9SziwLq_i2f9N2Ig8pzlcMyHC6HFMsd9xUJZOoJHJ59W2r6-cHPWjrUFoXk.mp4' },
        { type: 'VIDEO', url: 'assets/videos/AQNspw7hx8WLhEiGs6i11VkNLxI3WKGpggpsWiDfHHdkZeurvR_Jc5zLMrp0sRO7YmNtWi2OB_G405n54ZXgmIcVrnnpbodv1e-roII.mp4' },
        { type: 'VIDEO', url: 'assets/videos/AQO0o1wiOm_wAzknP5TL2FiLh5gHwrfFgsLlozzPujKqE2-jOFE3xJCO-8m01QPnFHsZ4FabY2SYFcJI1zT-F7Zmyuza9f7O-E3E4x0.mp4' },
        { type: 'VIDEO', url: 'assets/videos/AQONyoFdh2dAoIguhklbH53KBe_fvOscNd5qeECWlBcuUTKXl1hi0ewMcmpL4TWHq0P_IQ2vbh9O90OUJHZ54V1S_ikR0WJNy3dl-sw.mp4' },
        { type: 'VIDEO', url: 'assets/videos/AQOkXI-NQNM1Ozq5lepGZ8pWrRQDrDJt0hADeg27uD8380YRd0ty7whrcmyIjtllFmI4Yb07e2ZG-Qw1abJdoHKKBZ63xS2huaMmIxw.mp4' },
        { type: 'VIDEO', url: 'assets/videos/AQPQy-UbUqpf2X5nMbAAgG7AF6pjwEjc5SwoIvCmMeETOxqmbn1UF-9_mGnRtN2BxJjMsFOTnrFU4dnkmqfzCUy3NKmXCErj74HAd5k.mp4' },
        { type: 'VIDEO', url: 'assets/videos/AQNeCmC8FG6_kDP_jTSjOtv4XCTAYL3EUg_aaM1FzaQYbfwyqz1I9t_f1vBHzvScIHJFcT1qXj016OimszUjrnMyxIp7ZwuNoz02-yI.mp4' }
    ];

    const galleryGrid = document.querySelector('.gallery-grid');

    async function fetchGalleryContent() {
        let mediaItems = [];

        // 1. Load Local Media first
        LOCAL_MEDIA.forEach(item => {
            mediaItems.push({
                type: item.type,
                media_url: item.url,
                permalink: item.url
            });
        });

        // 2. Try Instagram Content
        if (INSTAGRAM_ACCESS_TOKEN !== 'YOUR_ACCESS_TOKEN_HERE') {
            try {
                const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&access_token=${INSTAGRAM_ACCESS_TOKEN}`);
                const data = await response.json();
                if (data.data) mediaItems = [...mediaItems, ...data.data];
            } catch (error) {
                console.error('Instagram Error:', error);
            }
        }

        // 3. Fallback to Demo if empty
        if (mediaItems.length === 0) {
            mediaItems = [
                { type: 'VIDEO', media_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumb: 'assets/post1.png' },
                { type: 'IMAGE', media_url: 'assets/post2.png' },
                { type: 'IMAGE', media_url: 'assets/post3.png' },
                { type: 'VIDEO', media_url: 'https://www.w3schools.com/html/movie.mp4', thumb: 'assets/post2.png' },
                { type: 'IMAGE', media_url: 'assets/profile.png' },
                { type: 'IMAGE', media_url: 'assets/post1.png' }
            ];
        }

        renderMedia(mediaItems);
    }

    function renderMedia(mediaItems) {
        galleryGrid.innerHTML = '';
        mediaItems.slice(0, 16).forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';

            const isVideo = item.media_type === 'VIDEO' || item.type === 'VIDEO';
            const url = item.media_url || item.url;
            const thumb = item.thumbnail_url || item.thumb || '';

            if (isVideo) {
                galleryItem.innerHTML = `
                    <video src="${url}" poster="${thumb}" loop muted playsinline></video>
                    <div class="video-overlay"><i class="fas fa-play"></i></div>
                `;
                galleryItem.addEventListener('mouseenter', () => galleryItem.querySelector('video').play());
                galleryItem.addEventListener('mouseleave', () => {
                    const v = galleryItem.querySelector('video');
                    v.pause();
                    v.currentTime = 0;
                });
            } else {
                galleryItem.innerHTML = `<img src="${url}" alt="Kodesaar Gallery">`;
            }

            galleryItem.addEventListener('click', () => window.open(item.permalink || url, '_blank'));
            galleryGrid.appendChild(galleryItem);
        });
    }

    // --- CONTACT FORM HANDLER ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const sendBtn = contactForm.querySelector('.send-btn');
            const originalText = sendBtn.innerHTML;

            // Simulate Sending
            sendBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
            sendBtn.style.opacity = '0.7';
            sendBtn.disabled = true;

            setTimeout(() => {
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
            }, 1500);
        });
    }

    fetchGalleryContent();
});
