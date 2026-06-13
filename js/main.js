// ==========================================================================
// GRADUATION INVITATION CORE LOGIC
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  let pageFlip = null;
  let audio = null;
  let isMusicPlaying = false;
  let appConfig = null;

  // Initialize Application
  initApp();

  async function initApp() {
    try {
      // 1. Fetch JSON configuration (with cache-busting)
      const response = await fetch(`config.json?v=${Date.now()}`);
      appConfig = await response.json();

      // 2. Bind JSON data to DOM
      bindConfigData(appConfig);

      // 3. Load Gallery
      loadGallery(appConfig.images);

      // 4. Initialize PageFlip
      initPageFlip();

      // 5. Setup Event Listeners for UI
      setupUIEventListeners();

      // 6. Setup Audio System
      setupAudioSystem(appConfig.music_url);

    } catch (error) {
      console.error('Error initializing application:', error);
    }
  }

  // Bind JSON config content directly to the respective HTML fields
  function bindConfigData(config) {
    // Page 1: Cover
    if (document.getElementById('cover-name')) document.getElementById('cover-name').textContent = config.name || '';
    if (document.getElementById('cover-subtitle')) document.getElementById('cover-subtitle').textContent = config.major ? `Cử nhân ${config.major}` : '';
    
    if (document.getElementById('cover-course')) {
      if (config.course && config.course.includes('(')) {
        document.getElementById('cover-course').textContent = `Khóa ${config.course.split(' ')[0]} (${config.course.split('(')[1].replace(')', '')})`;
      } else {
        document.getElementById('cover-course').textContent = config.course || '';
      }
    }
    
    if (document.getElementById('cover-university')) document.getElementById('cover-university').textContent = config.university || '';

    // Page 4: Student Stats
    if (document.getElementById('stat-credits')) document.getElementById('stat-credits').textContent = `${config.total_credits || '0'} tín chỉ`;
    if (document.getElementById('stat-gpa4')) document.getElementById('stat-gpa4').textContent = `${config.gpa_4 || '0.00'} / 4.00`;
    if (document.getElementById('stat-gpa10')) document.getElementById('stat-gpa10').textContent = `${config.gpa_10 || '0.0'} / 10.0`;
    if (document.getElementById('stat-classification')) document.getElementById('stat-classification').textContent = config.classification || '';

    // Page 5: Ceremony Details
    if (document.getElementById('invite-name')) document.getElementById('invite-name').textContent = config.name || '';
    if (document.getElementById('invite-time')) document.getElementById('invite-time').textContent = config.event_time || '';
    if (document.getElementById('invite-location')) document.getElementById('invite-location').textContent = config.event_location || '';
    if (document.getElementById('invite-dress')) document.getElementById('invite-dress').textContent = config.dress_code || '';

    // Page 7: Outro
    if (document.getElementById('outro-signature')) document.getElementById('outro-signature').textContent = config.name || '';
  }

  // Load and generate the photo gallery structure dynamically
  function loadGallery(imageUrls) {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return;

    // Clear loading skeletons
    galleryContainer.innerHTML = '';

    // Drag-to-scroll variables
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let wasDragged = false;
    const dragThreshold = 5;

    // Mouse wheel horizontal scrolling
    galleryContainer.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        galleryContainer.scrollLeft += e.deltaY;
      }
    }, { passive: false });

    // Drag to scroll events for desktop mouse users
    galleryContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - galleryContainer.offsetLeft;
      scrollLeft = galleryContainer.scrollLeft;
      wasDragged = false;
    });

    galleryContainer.addEventListener('mouseleave', () => {
      isDown = false;
    });

    galleryContainer.addEventListener('mouseup', () => {
      isDown = false;
    });

    galleryContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - galleryContainer.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > dragThreshold) {
        wasDragged = true;
      }
      galleryContainer.scrollLeft = scrollLeft - walk;
    });

    // Prevent PageFlip from capturing mouse & touch gestures inside the gallery container
    const stopEvents = ['mousedown', 'mousemove', 'mouseup', 'click', 'touchstart', 'touchmove', 'touchend', 'wheel'];
    stopEvents.forEach(evt => {
      galleryContainer.addEventListener(evt, (e) => {
        e.stopPropagation();
      }, { passive: evt === 'touchstart' || evt === 'touchmove' || evt === 'touchend' });
    });

    imageUrls.forEach((url, index) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `Ảnh kỷ niệm ${index + 1}`);

      const img = document.createElement('img');
      img.src = url;
      img.alt = `Ảnh tốt nghiệp ${index + 1}`;
      img.loading = 'lazy';

      // Fallback for broken/missing image
      img.onerror = () => {
        img.src = 'https://picsum.photos/seed/graduation/600/450';
      };

      item.appendChild(img);
      galleryContainer.appendChild(item);

      // Lightbox click event - only trigger if we didn't drag
      item.addEventListener('click', () => {
        if (!wasDragged) {
          openLightbox(url);
        }
      });
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(url);
        }
      });
    });
  }

  // Initialize PageFlip book transitions
  function initPageFlip() {
    const bookElement = document.getElementById('book');
    const isMobile = window.innerWidth <= 768;

    // Configuration settings for PageFlip
    pageFlip = new St.PageFlip(bookElement, {
      width: 500, // Page base width
      height: 680, // Page base height
      size: 'stretch',
      minWidth: 320,
      maxWidth: 1000,
      minHeight: 480,
      maxHeight: 1350,
      drawShadow: true,
      maxShadowOpacity: 0.35,
      showCover: true,
      mobileScrollSupport: true,
      usePortrait: isMobile // Mobile = portrait (single page), Desktop = landscape (two pages spread)
    });

    // Load static HTML pages
    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    // Bind indicator update
    const totalPages = pageFlip.getPageCount();
    updatePageIndicator(1, totalPages);

    // Bind page turn listener
    pageFlip.on('flip', (e) => {
      const currentPage = e.data + 1;
      updatePageIndicator(currentPage, totalPages);
      handlePageSpecificEffects(currentPage);
    });
  }

  // UI Event Bindings
  function setupUIEventListeners() {
    // "Open invitation" button on Cover
    const btnOpen = document.getElementById('btn-open-book');
    if (btnOpen) {
      btnOpen.addEventListener('click', () => {
        if (pageFlip) pageFlip.flip(1); // Flip to Lời Tri Ân (Page 2)
        startAudio();
      });
    }

    // "Restart" button on Outro page
    const btnRestart = document.getElementById('btn-restart');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        if (pageFlip) pageFlip.flip(0); // Flip back to Cover
      });
    }

    // Arrow navigation
    document.getElementById('btn-prev').addEventListener('click', () => {
      if (pageFlip) pageFlip.flipPrev();
    });

    document.getElementById('btn-next').addEventListener('click', () => {
      if (pageFlip) pageFlip.flipNext();
    });

    // Dynamic ICS Calendar generation
    const btnCal = document.getElementById('btn-add-calendar');
    if (btnCal) {
      btnCal.addEventListener('click', generateCalendarEvent);
    }

    // Window Resize listener to rebuild portrait/landscape sizes
    window.addEventListener('resize', () => {
      if (pageFlip) {
        const isMobile = window.innerWidth <= 768;
        pageFlip.update({
          usePortrait: isMobile
        });
      }
    });

    // Lightbox close binds
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.lightbox-close');
    if (lightbox && closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
      // Close on click anywhere inside the modal (background or image)
      lightbox.addEventListener('click', () => {
        closeLightbox();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
      });
    }
  }

  // Update Bottom text indicator
  function updatePageIndicator(current, total) {
    const indicator = document.getElementById('page-indicator');
    if (indicator) {
      indicator.textContent = `Trang ${current} / ${total}`;
    }
  }

  // Trigger animations or effects based on the page index turned to
  function handlePageSpecificEffects(pageNumber) {
    // Trigger timeline entry animation on Page 3
    if (pageNumber === 2 || pageNumber === 3) {
      const timelineItems = document.querySelectorAll('.timeline-item');
      timelineItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('active');
        }, index * 200); // 200ms stagger offset
      });
    }

    // Trigger fireworks and confetti when lật tới trang cuối (Page 8)
    if (pageNumber === 8) {
      triggerConfettiShow();
    }
  }

  // Background Music Controls
  function setupAudioSystem(musicUrl) {
    audio = new Audio(musicUrl);
    audio.loop = true;
    audio.volume = 0.55;
    // Preload so it's ready immediately on first interaction
    audio.preload = 'auto';

    // Log errors if audio file fails to load
    audio.addEventListener('error', (e) => {
      console.error('Audio load error details:', e);
      console.error('Failed to load audio from source URL:', audio.src);
    });

    const audioBtn = document.getElementById('audio-control');

    if (audioBtn) {
      audioBtn.addEventListener('click', (e) => {
        // Prevent click event from bubbling up to document listener
        e.stopPropagation();
        // Remove autoplay-pending state when user explicitly interacts
        audioBtn.classList.remove('autoplay-pending');
        if (isMusicPlaying) {
          pauseAudio();
        } else {
          startAudio();
        }
      });
    }

    // --- Attempt immediate autoplay (works if browser allows it) ---
    audio.play().then(() => {
      // Autoplay succeeded — update UI to "playing"
      isMusicPlaying = true;
      if (audioBtn) audioBtn.classList.add('playing');
      const audioIcon = document.getElementById('audio-icon');
      if (audioIcon) audioIcon.className = 'ph-light ph-speaker-high';
    }).catch(() => {
      // Autoplay blocked by browser policy — show a pulse hint on the button
      // and start on the first user gesture anywhere on the page
      if (audioBtn) audioBtn.classList.add('autoplay-pending');
      
      const enableAudioOnFirstGesture = () => {
        startAudio();
        if (audioBtn) audioBtn.classList.remove('autoplay-pending');
        document.removeEventListener('click', enableAudioOnFirstGesture);
        document.removeEventListener('touchstart', enableAudioOnFirstGesture);
      };
      document.addEventListener('click', enableAudioOnFirstGesture);
      document.addEventListener('touchstart', enableAudioOnFirstGesture, { passive: true });
    });
  }

  function startAudio() {
    if (audio && !isMusicPlaying) {
      // Toggle UI indicators immediately for instant visual response
      isMusicPlaying = true;
      const audioBtn = document.getElementById('audio-control');
      const audioIcon = document.getElementById('audio-icon');
      
      if (audioBtn) audioBtn.classList.add('playing');
      if (audioIcon) audioIcon.className = 'ph-light ph-speaker-high';

      audio.play().catch(err => {
        console.warn('Audio play failed or was blocked by browser:', err);
        // Revert UI indicators if actual playback fails
        isMusicPlaying = false;
        if (audioBtn) audioBtn.classList.remove('playing');
        if (audioIcon) audioIcon.className = 'ph-light ph-speaker-slash';
      });
    }
  }

  function pauseAudio() {
    if (audio && isMusicPlaying) {
      audio.pause();
      isMusicPlaying = false;
      const audioBtn = document.getElementById('audio-control');
      const audioIcon = document.getElementById('audio-icon');
      audioBtn.classList.remove('playing');
      audioIcon.className = 'ph-light ph-speaker-slash';
    }
  }

  // Lightbox Image Gallery Zoom
  function openLightbox(url) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightbox && lightboxImg) {
      lightboxImg.src = url;
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
    }
  }

  function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
    }
  }

  // Celebrate with Confetti (Triggered on last page flip)
  function triggerConfettiShow() {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      // Confetti particles launched from both sides
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#d4af37', '#ffffff', '#1e293b']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#d4af37', '#ffffff', '#1e293b']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  // Generate and Download an elegant .ics File for calendar integration
  function generateCalendarEvent() {
    if (!appConfig) return;

    // Define standard calendar formatting
    const title = `Lễ Tốt Nghiệp - ${appConfig.name}`;
    const description = `Trân trọng kính mời tham dự Lễ Tốt Nghiệp ngành ${appConfig.major} của ${appConfig.name}. Dresscode: ${appConfig.dress_code}`;
    const location = appConfig.event_location;
    
    // Hardcoded date formatted based on config time (June 27, 2026 08:00 AM to 12:00 PM)
    const startDate = "20260627T080000";
    const endDate = "20260627T120000";

    const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Graduation Invitation//阮英才//EN
BEGIN:VEVENT
UID:${Date.now()}@graduation.invite
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

    // Create a temporary link to download blob file
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `le-tot-nghiep-${appConfig.name.toLowerCase().replace(/\s+/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
});
