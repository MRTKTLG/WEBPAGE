(() => {
  'use strict';

  if (!window.bootstrap) return;

  document.addEventListener('DOMContentLoaded', () => {
    const navCollapseEl = document.getElementById('menu');
    const navCollapse = navCollapseEl
      ? bootstrap.Collapse.getOrCreateInstance(navCollapseEl, { toggle: false })
      : null;
    const navbarEl = document.querySelector('.navbar');
    const preloaderEl = document.querySelector('.page-preloader');
    const statsSectionEl = document.getElementById('sayaclar');
    const navLinks = Array.from(document.querySelectorAll('a.nav-link[href^="#"]'));
    const heroCarousel = document.getElementById('heroCarousel');
    const testimonialTracks = Array.from(document.querySelectorAll('.testimonial-track'));

    const productCarousels = Array.from(document.querySelectorAll('.product-carousel'));
    const documentEl = document.documentElement;
    const bodyEl = document.body;
    const productFullscreenModalEl = document.getElementById('productFullscreenModal');
    const productFullscreenModal = productFullscreenModalEl
      ? bootstrap.Modal.getOrCreateInstance(productFullscreenModalEl, { focus: false })
      : null;
    const productFullscreenMediaEl = productFullscreenModalEl?.querySelector('.product-fullscreen-media');
    const productFullscreenImageEl = document.getElementById('productFullscreenImage');
    const productFullscreenActionsEl = productFullscreenModalEl?.querySelector('.product-fullscreen-actions');
    const productFullscreenShareEl = productFullscreenModalEl?.querySelector('.product-fullscreen-share');
    const productFullscreenShareMenuEl = document.getElementById('productShareMenu');
    const productFullscreenShareWhatsAppEl = document.getElementById('productShareWhatsApp');
    const productFullscreenShareInstagramEl = document.getElementById('productShareInstagram');
    const productFullscreenZoomEl = productFullscreenModalEl?.querySelector('.product-fullscreen-zoom');
    const productFullscreenNativeToggleEl = productFullscreenModalEl?.querySelector(
      '.product-fullscreen-native-toggle'
    );
    const HERO_CAROUSEL_INTERVAL_MS = 6000;
    const PRODUCT_FLOW_INTERVAL_MS = 3000;
    const lenis =
      window.Lenis
        ? new window.Lenis({
            duration: 1.85,
            smoothWheel: true,
            smoothTouch: true,
            wheelMultiplier: 0.95,
            touchMultiplier: 0.9,
            lerp: 0.075
          })
        : null;
    const isMobileViewport = () => window.innerWidth < 992;

    const isNavMenuExpanded = () =>
      navCollapseEl?.classList.contains('show') || navCollapseEl?.classList.contains('collapsing');
    let frozenNavOffsetPx = null;
    let navOffsetFreezeTimerId = null;
    let navScrollSnapTimerId = null;
    let navScrollUserInterrupted = false;
    let collapsedNavOffsetPx = 0;
    const measureNavbarHeight = () => {
      if (!navbarEl) return 0;
      return Math.max(Math.round(navbarEl.getBoundingClientRect().height), 0);
    };
    const refreshCollapsedNavOffset = () => {
      if (isNavMenuExpanded()) return;
      collapsedNavOffsetPx = measureNavbarHeight();
    };
    const getBaseNavOffset = () => {
      if (!navbarEl) return 0;
      if (collapsedNavOffsetPx > 0) return collapsedNavOffsetPx;
      return measureNavbarHeight();
    };
    const getNavOffset = () => {
      if (Number.isFinite(frozenNavOffsetPx)) {
        return Math.max(Number(frozenNavOffsetPx), 0);
      }
      return getBaseNavOffset();
    };
    const getActiveNavOffset = () => getNavOffset();

    const syncNavOffset = () => {
      document.documentElement.style.setProperty('--nav-offset', `${getNavOffset()}px`);
    };

    const clearFrozenNavOffset = () => {
      if (navOffsetFreezeTimerId) {
        window.clearTimeout(navOffsetFreezeTimerId);
        navOffsetFreezeTimerId = null;
      }
      if (navScrollSnapTimerId) {
        window.clearTimeout(navScrollSnapTimerId);
        navScrollSnapTimerId = null;
      }
      navScrollUserInterrupted = false;
      frozenNavOffsetPx = null;
      syncNavOffset();
    };

    const freezeNavOffset = (offsetPx) => {
      frozenNavOffsetPx = Math.max(Math.round(offsetPx), 0);
      syncNavOffset();
    };

    const scheduleNavOffsetUnfreeze = (delayMs) => {
      if (navOffsetFreezeTimerId) {
        window.clearTimeout(navOffsetFreezeTimerId);
      }
      navOffsetFreezeTimerId = window.setTimeout(() => {
        clearFrozenNavOffset();
      }, delayMs);
    };
    window.addEventListener(
      'wheel',
      () => {
        navScrollUserInterrupted = true;
      },
      { passive: true }
    );
    window.addEventListener(
      'touchmove',
      () => {
        navScrollUserInterrupted = true;
      },
      { passive: true }
    );

    const hidePreloader = () => {
      if (!preloaderEl || preloaderEl.dataset.dismissed === 'true') return;

      preloaderEl.dataset.dismissed = 'true';
      window.setTimeout(() => {
        preloaderEl.classList.add('is-hidden');
        document.body.classList.remove('is-preloading');
      }, 220);
    };

    const syncNavLinkWidths = () => {
      if (!navLinks.length) return;

      if (window.innerWidth < 992) {
        document.documentElement.style.removeProperty('--nav-link-uniform-width');
        return;
      }

      let maxWidth = 0;

      navLinks.forEach((link) => {
        const previousInlineSize = link.style.inlineSize;
        link.style.inlineSize = 'auto';
        maxWidth = Math.max(maxWidth, Math.ceil(link.getBoundingClientRect().width));
        link.style.inlineSize = previousInlineSize;
      });

      if (maxWidth > 0) {
        document.documentElement.style.setProperty('--nav-link-uniform-width', `${maxWidth}px`);
      }
    };

    const setActiveNavLink = (hash) => {
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === hash);
      });
    };

    const closeNavMenuIfNeeded = () =>
      new Promise((resolve) => {
        if (!navCollapseEl?.classList.contains('show') || !navCollapse) {
          resolve();
          return;
        }

        if (isMobileViewport()) {
          documentEl.classList.add('is-nav-collapsing');
          bodyEl.classList.add('is-nav-collapsing');
        }

        navCollapseEl.addEventListener(
          'hidden.bs.collapse',
          () => {
            documentEl.classList.remove('is-nav-collapsing');
            bodyEl.classList.remove('is-nav-collapsing');
            refreshCollapsedNavOffset();
            resolve();
          },
          { once: true }
        );
        navCollapse.hide();
      });

    const statCounters = Array.from(document.querySelectorAll('.stat-counter[data-count]'));

    const createStatDigitFace = (digit) => {
      const face = document.createElement('span');
      face.className = 'stat-digit-face';
      face.textContent = String(digit);
      face.setAttribute('aria-hidden', 'true');
      return face;
    };

    const measureStatDigitHeight = (counterEl) => {
      const measure = document.createElement('span');
      measure.className = 'stat-digit-face stat-digit-face-measure';
      measure.textContent = '0';
      counterEl.append(measure);
      const height = Math.ceil(measure.getBoundingClientRect().height);
      measure.remove();
      return height || Math.ceil(counterEl.getBoundingClientRect().height) || 48;
    };

    const setupStatCounter = (counterEl) => {
      const count = counterEl.dataset.count?.trim() ?? '';
      const suffix = counterEl.dataset.suffix ?? '';

      if (!/^\d+$/.test(count)) return;

      const digitHeight = measureStatDigitHeight(counterEl);
      counterEl.style.setProperty('--stat-digit-height', `${digitHeight}px`);
      counterEl.textContent = '';
      counterEl.setAttribute('aria-label', `${count}${suffix}`);

      const fragment = document.createDocumentFragment();

      Array.from(count).forEach((digitChar) => {
        const digitEl = document.createElement('span');
        const stripEl = document.createElement('span');
        const targetDigit = Number.parseInt(digitChar, 10);

        digitEl.className = 'stat-digit';
        stripEl.className = 'stat-digit-strip';

        for (let value = 0; value <= targetDigit; value += 1) {
          stripEl.append(createStatDigitFace(value));
        }

        digitEl.dataset.targetDigit = String(targetDigit);
        digitEl.append(stripEl);
        fragment.append(digitEl);
      });

      if (suffix) {
        const suffixEl = document.createElement('span');
        suffixEl.className = 'stat-suffix';
        suffixEl.textContent = suffix;
        suffixEl.setAttribute('aria-hidden', 'true');
        fragment.append(suffixEl);
      }

      counterEl.append(fragment);
      counterEl.dataset.counterReady = 'true';
    };

    const animateStatCounter = (counterEl) => {
      if (counterEl.dataset.animated === 'true') return;
      counterEl.dataset.animated = 'true';

      const digitHeight =
        Number.parseFloat(counterEl.style.getPropertyValue('--stat-digit-height')) || 48;
      const duration = 2200;
      const easing = 'cubic-bezier(0.2, 0.9, 0.2, 1)';

      counterEl.querySelectorAll('.stat-digit').forEach((digitEl) => {
        const targetDigit = Number.parseInt(digitEl.dataset.targetDigit ?? '0', 10);
        const stripEl = digitEl.querySelector('.stat-digit-strip');
        if (!stripEl || Number.isNaN(targetDigit)) return;

        stripEl.style.transform = 'translate3d(0, 0, 0)';
        stripEl.style.transition = 'none';

        if (targetDigit === 0) return;

        const finalOffset = digitHeight * targetDigit * -1;
        window.requestAnimationFrame(() => {
          stripEl.style.transition = `transform ${duration}ms ${easing}`;
          stripEl.style.transform = `translate3d(0, ${finalOffset}px, 0)`;
        });
      });
    };

    const initStatCounters = () => {
      if (!statCounters.length) return;

      statCounters.forEach(setupStatCounter);

      const statsSection = statsSectionEl;
      if (!statsSection) {
        statCounters.forEach(animateStatCounter);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            statCounters.forEach(animateStatCounter);
            observer.disconnect();
          });
        },
        {
          threshold: 0.35
        }
      );

      observer.observe(statsSection);
    };

    const getNavSections = () =>
      navLinks
        .map((link) => {
          const hash = link.getAttribute('href');
          const target = hash ? document.querySelector(hash) : null;

          return target ? { hash, target } : null;
        })
        .filter(Boolean);

    const getDocumentTop = (element) => element.getBoundingClientRect().top + window.scrollY;

    const ghostSections = Array.from(document.querySelectorAll('section.section-ghost'));
    const ghostSectionMetrics = ghostSections.map((sectionEl) => ({
      sectionEl,
      titleWrapEl: sectionEl.querySelector('.ghost-title-wrap'),
      ghostHeadingEl: sectionEl.querySelector('.ghost-heading'),
      sectionTitleEl: sectionEl.querySelector('.section-title'),
      currentOffsetPx: null
    }));
    const orbParallaxSections = Array.from(
      document.querySelectorAll('.stats-section, #yorumlar')
    ).map((sectionEl) => ({
      sectionEl,
      currentPinkOffsetPx: 0,
      currentBlueOffsetPx: 0
    }));
    const productCardImageMetrics = Array.from(
      document.querySelectorAll('.product-card .card-img-top')
    ).map((imageEl) => ({
      imageEl,
      currentOffsetPx: Number.parseFloat(imageEl.dataset.productImageParallaxY ?? '0')
    }));
    let activeSectionHash = '';
    let lastScrollY = window.scrollY;
    let applyHeroScrollParallax = () => false;
    let syncHeroParallaxLayout = () => {};

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let testimonialMarqueeFrame = 0;
    let testimonialMarqueeLastTime = 0;
    const testimonialMarqueeState = testimonialTracks.map((track, index) => ({
      track,
      offsetPx: 0,
      // Keep columns distinct but close enough to feel like one continuous wall.
      speedPxPerSecond: [16, 19, 14][index] ?? 16,
      loopHeightPx: 0
    }));

    const syncTestimonialMarquee = () => {
      testimonialMarqueeState.forEach((item) => {
        const cardCount = item.track.children.length;
        const duplicateStartIndex = Math.floor(cardCount / 2);
        const duplicateStartCard = item.track.children[duplicateStartIndex];

        item.loopHeightPx = duplicateStartCard
          ? duplicateStartCard.offsetTop - item.track.children[0].offsetTop
          : 0;

        if (item.loopHeightPx <= 0) {
          item.offsetPx = 0;
          item.track.style.transform = 'translate3d(0, 0, 0)';
          return;
        }

        item.offsetPx %= item.loopHeightPx;
        item.track.style.transform = `translate3d(0, ${item.offsetPx * -1}px, 0)`;
      });
    };

    const stopTestimonialMarquee = () => {
      if (!testimonialMarqueeFrame) return;
      window.cancelAnimationFrame(testimonialMarqueeFrame);
      testimonialMarqueeFrame = 0;
      testimonialMarqueeLastTime = 0;
    };

    const runTestimonialMarquee = (time) => {
      if (prefersReducedMotion.matches || !testimonialMarqueeState.length) {
        stopTestimonialMarquee();
        return;
      }

      if (!testimonialMarqueeLastTime) {
        testimonialMarqueeLastTime = time;
      }

      const elapsedSeconds = Math.min((time - testimonialMarqueeLastTime) / 1000, 0.05);
      testimonialMarqueeLastTime = time;

      testimonialMarqueeState.forEach((item) => {
        if (!item.loopHeightPx) return;

        item.offsetPx += item.speedPxPerSecond * elapsedSeconds;
        if (item.offsetPx >= item.loopHeightPx) {
          item.offsetPx -= item.loopHeightPx;
        }

        item.track.style.transform = `translate3d(0, ${item.offsetPx * -1}px, 0)`;
      });

      testimonialMarqueeFrame = window.requestAnimationFrame(runTestimonialMarquee);
    };

    const startTestimonialMarquee = () => {
      if (!testimonialMarqueeState.length || prefersReducedMotion.matches) return;
      stopTestimonialMarquee();
      syncTestimonialMarquee();
      testimonialMarqueeFrame = window.requestAnimationFrame(runTestimonialMarquee);
    };

    const refreshGhostMetrics = () => {
      if (!ghostSectionMetrics.length) return;

      ghostSectionMetrics.forEach((metric) => {
        if (!metric.titleWrapEl) return;

        const wrapRect = metric.titleWrapEl.getBoundingClientRect();
        const ghostRect = metric.ghostHeadingEl?.getBoundingClientRect();
        const titleRect = metric.sectionTitleEl?.getBoundingClientRect();
        const widthDeltaPx =
          ghostRect && titleRect ? Math.max(ghostRect.width - titleRect.width, 0) : 0;
        const opticalAdjustPx = Math.min(widthDeltaPx * 0.018, 24);

        metric.sectionTop = getDocumentTop(metric.sectionEl);
        metric.sectionHeight = metric.sectionEl.offsetHeight || window.innerHeight;
        metric.titleWrapLeft = wrapRect.left;
        metric.titleWrapEl.style.setProperty('--ghost-left-adjust', `${opticalAdjustPx.toFixed(3)}px`);
      });
    };

    const getGhostTargetOffset = (metric) => {
      if (!metric.titleWrapEl) return 0;

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const scrollMarker = lastScrollY + getNavOffset();
      const sectionTop = metric.sectionTop ?? getDocumentTop(metric.sectionEl);
      const sectionHeight = metric.sectionHeight || metric.sectionEl.offsetHeight || viewportHeight;
      const titleWrapLeft =
        metric.titleWrapLeft ?? metric.titleWrapEl.getBoundingClientRect().left;
      const maxOffsetPx = Math.max(window.innerWidth - titleWrapLeft + 180, 360);
      const startMarker = sectionTop - viewportHeight * 0.65;
      const arriveDistance = Math.max(sectionTop - startMarker, 1);
      const continueDistance = Math.min(sectionHeight * 0.6, viewportHeight * 0.95);
      const totalDistance = Math.max(arriveDistance + continueDistance, 1);
      const progress = clamp((scrollMarker - startMarker) / totalDistance, 0, 1);
      const endOffsetPx = maxOffsetPx * (-continueDistance / arriveDistance);

      return maxOffsetPx + (endOffsetPx - maxOffsetPx) * progress;
    };

    const updateGhostHeadingPosition = () => {
      if (!ghostSectionMetrics.length) return false;

      ghostSectionMetrics.forEach((metric) => {
        if (!metric.titleWrapEl) return;

        const targetOffsetPx = getGhostTargetOffset(metric);
        metric.currentOffsetPx = targetOffsetPx;
        metric.sectionEl.style.setProperty('--ghost-offset', `${targetOffsetPx.toFixed(3)}px`);
      });

      return false;
    };

    const updateSectionOrbParallax = () => {
      if (!orbParallaxSections.length) return false;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        orbParallaxSections.forEach((metric) => {
          metric.currentPinkOffsetPx = 0;
          metric.currentBlueOffsetPx = 0;
          metric.sectionEl.style.setProperty('--section-orb-pink-x', '0px');
          metric.sectionEl.style.setProperty('--section-orb-blue-x', '0px');
        });
        return false;
      }

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      let isStillAnimating = false;

      orbParallaxSections.forEach((metric) => {
        const rect = metric.sectionEl.getBoundingClientRect();
        const sectionTravel = Math.max(viewportHeight + rect.height, 1);
        const progress = clamp((viewportHeight - rect.top) / sectionTravel, 0, 1);
        const normalizedOffset = progress * 2 - 1;
        const orbRangePx = window.innerWidth <= 767 ? 42 : 132;
        const pinkNextOffsetPx = normalizedOffset * -orbRangePx;
        const blueNextOffsetPx = normalizedOffset * orbRangePx;

        metric.currentPinkOffsetPx = pinkNextOffsetPx;
        metric.currentBlueOffsetPx = blueNextOffsetPx;
        metric.sectionEl.style.setProperty(
          '--section-orb-pink-x',
          `${pinkNextOffsetPx.toFixed(3)}px`
        );
        metric.sectionEl.style.setProperty(
          '--section-orb-blue-x',
          `${blueNextOffsetPx.toFixed(3)}px`
        );
      });

      return isStillAnimating;
    };

    const updateProductImageParallax = () => {
      if (!productCardImageMetrics.length) return false;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        productCardImageMetrics.forEach((item) => {
          item.currentOffsetPx = 0;
          item.imageEl.dataset.productImageParallaxY = '0';
          item.imageEl.style.setProperty('--product-image-parallax-y', '0px');
        });
        return false;
      }

      const viewportCenter = window.innerHeight * 0.5;
      let isStillAnimating = false;

      productCardImageMetrics.forEach((item) => {
        if (item.imageEl.closest('.product-carousel')) {
          if (item.currentOffsetPx !== 0 || item.imageEl.dataset.productImageParallaxY !== '0') {
            item.currentOffsetPx = 0;
            item.imageEl.dataset.productImageParallaxY = '0';
            item.imageEl.style.setProperty('--product-image-parallax-y', '0px');
          }
          return;
        }

        const rect = item.imageEl.getBoundingClientRect();
        const imageCenter = rect.top + rect.height * 0.5;
        const normalizedOffset = clamp((imageCenter - viewportCenter) / window.innerHeight, -1, 1);
        const nextOffsetPx = normalizedOffset * -52;

        item.currentOffsetPx = nextOffsetPx;
        item.imageEl.dataset.productImageParallaxY = `${nextOffsetPx}`;
        item.imageEl.style.setProperty('--product-image-parallax-y', `${nextOffsetPx.toFixed(3)}px`);
      });

      return isStillAnimating;
    };

    const updateTitleReveal = (sectionEl) => {
      if (!sectionEl) return false;

      const rect = sectionEl.getBoundingClientRect();
      const sectionStyles = window.getComputedStyle(sectionEl);
      const primaryCompleteAtRaw = Number.parseFloat(
        sectionStyles.getPropertyValue('--stats-title-primary-complete-at')
      );
      const secondaryStartAtRaw = Number.parseFloat(
        sectionStyles.getPropertyValue('--stats-title-secondary-start-at')
      );
      const revealDelayRaw = Number.parseFloat(
        sectionStyles.getPropertyValue('--stats-title-secondary-delay')
      );
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const start = viewportHeight * 0.88;
      const end = viewportHeight * 0.22;
      const progress = clamp((start - rect.top) / Math.max(start - end, 1), 0, 1);
      const hasPrimaryPhaseSplit = Number.isFinite(primaryCompleteAtRaw);
      const primaryCompleteAt = hasPrimaryPhaseSplit
        ? clamp(primaryCompleteAtRaw, 0.05, 0.95)
        : 1;
      const secondaryStartAt = hasPrimaryPhaseSplit
        ? clamp(
            Number.isFinite(secondaryStartAtRaw) ? secondaryStartAtRaw : primaryCompleteAt,
            0,
            primaryCompleteAt
          )
        : 0;
      const revealDelay = Number.isFinite(revealDelayRaw)
        ? clamp(revealDelayRaw, 0, 0.95)
        : 0.16;
      const lineOneProgress = hasPrimaryPhaseSplit
        ? clamp(progress / primaryCompleteAt, 0, 1)
        : progress;
      const lineTwoProgress = hasPrimaryPhaseSplit
        ? clamp(
            (progress - secondaryStartAt) /
              Math.max(1 - secondaryStartAt, 0.01),
            0,
            1
          )
        : clamp((progress - revealDelay) / Math.max(1 - revealDelay, 0.01), 0, 1);
      const nextRevealOne = `${(lineOneProgress * 100).toFixed(2)}%`;
      const nextRevealTwo = `${(lineTwoProgress * 100).toFixed(2)}%`;

      if (
        sectionEl.style.getPropertyValue('--stats-title-reveal-1') === nextRevealOne &&
        sectionEl.style.getPropertyValue('--stats-title-reveal-2') === nextRevealTwo
      ) {
        return progress > 0 && progress < 1;
      }

      sectionEl.style.setProperty('--stats-title-reveal-1', nextRevealOne);
      sectionEl.style.setProperty('--stats-title-reveal-2', nextRevealTwo);
      return progress > 0 && progress < 1;
    };

    const updateStatsTitleReveal = () => {
      const isJourneyAnimating = updateTitleReveal(document.querySelector('#urun-yolculugu'));
      const isStatsAnimating = updateTitleReveal(statsSectionEl);
      const isFeedbackAnimating = updateTitleReveal(document.querySelector('#yorumlar'));
      return isJourneyAnimating || isStatsAnimating || isFeedbackAnimating;
    };

    const updateActiveSection = () => {
      const navSections = getNavSections();
      const firstHash = navSections[0]?.hash ?? navLinks[0]?.getAttribute('href') ?? '';
      const scrollMarker = window.scrollY + getActiveNavOffset() + 1;
      let currentHash = firstHash;

      navSections.forEach((section) => {
        const sectionTop = getDocumentTop(section.target);
        if (sectionTop <= scrollMarker) {
          currentHash = section.hash;
        }
      });

      if (currentHash && currentHash !== activeSectionHash) {
        activeSectionHash = currentHash;
        setActiveNavLink(currentHash);
      }
    };

    if (lenis) {
      const runLenisFrame = (time) => {
        lenis.raf(time);
        window.requestAnimationFrame(runLenisFrame);
      };

      window.requestAnimationFrame(runLenisFrame);
      lenis.resize();
      lenis.on('scroll', () => {
        lastScrollY = window.scrollY;
        performScrollEffects();
      });
    }

    refreshCollapsedNavOffset();

    if (heroCarousel) {
      bootstrap.Carousel.getOrCreateInstance(heroCarousel, {
        interval: HERO_CAROUSEL_INTERVAL_MS,
        touch: true,
        ride: 'carousel',
        pause: false,
        wrap: true
      });
      const heroItems = Array.from(heroCarousel.querySelectorAll('.carousel-item'));
      const revealTimers = new WeakMap();

      const setBackgroundDirection = (item, isReverse) => {
        if (!item) return;
        item.classList.toggle('bg-forward', !isReverse);
        item.classList.toggle('bg-reverse', isReverse);
      };

      const isReverseBackground = (item) => item?.classList.contains('bg-reverse');

      const getHeroTextElements = (item) => ({
        title: item?.querySelector('h1, h2') ?? null,
        body: item?.querySelector('.carousel-caption > p') ?? null,
        caption: item?.querySelector('.carousel-caption') ?? null
      });

      const resetHeroRevealClasses = () => {
        heroItems.forEach((item) => {
          const timers = revealTimers.get(item) ?? [];
          timers.forEach((timerId) => window.clearTimeout(timerId));
          revealTimers.set(item, []);
          item
            .querySelectorAll(
              '.hero-title-enter-up, .hero-title-enter-down, .hero-body-enter-up, .hero-body-enter-down, .hero-circle-enter-up, .hero-circle-enter-down, .hero-title-exit-up, .hero-title-exit-down, .hero-body-exit-up, .hero-body-exit-down, .hero-circle-exit-up, .hero-circle-exit-down, .hero-media-circles-enter-up, .hero-media-circles-enter-down, .hero-media-circles-exit-up, .hero-media-circles-exit-down'
            )
            .forEach((node) => {
              node.classList.remove(
                'hero-title-enter-up',
                'hero-title-enter-down',
                'hero-body-enter-up',
                'hero-body-enter-down',
                'hero-circle-enter-up',
                'hero-circle-enter-down',
                'hero-title-exit-up',
                'hero-title-exit-down',
                'hero-body-exit-up',
                'hero-body-exit-down',
                'hero-circle-exit-up',
                'hero-circle-exit-down',
                'hero-media-circles-enter-up',
                'hero-media-circles-enter-down',
                'hero-media-circles-exit-up',
                'hero-media-circles-exit-down'
              );
            });
        });
      };

      const HERO_ANIMATION_DURATION_MS = 820;
      const HERO_ANIMATION_STAGGER_MS = 160;
      const ENTRY_VISIBLE_TIMINGS = {
        circle: HERO_ANIMATION_DURATION_MS,
        title: HERO_ANIMATION_DURATION_MS + HERO_ANIMATION_STAGGER_MS,
        body: HERO_ANIMATION_DURATION_MS + HERO_ANIMATION_STAGGER_MS * 2
      };
      const ENTRY_START_DELAYS = {
        circle: 0,
        title: HERO_ANIMATION_STAGGER_MS,
        body: HERO_ANIMATION_STAGGER_MS * 2
      };
      const EXIT_START_DELAYS = {
        circle: 0,
        title: HERO_ANIMATION_STAGGER_MS,
        body: HERO_ANIMATION_STAGGER_MS * 2
      };
      const INITIAL_MEDIA_ENTRY_MS = 600;
      const MEDIA_CIRCLES_VISIBLE_TIMINGS = {
        top: 820,
        bottom: 1140
      };

      const setHeroVisibleState = (item, isVisible) => {
        if (!item) return;

        const { title, body, caption } = getHeroTextElements(item);

        title?.classList.toggle('hero-title-visible', isVisible);
        body?.classList.toggle('hero-body-visible', isVisible);
        caption?.classList.toggle('hero-circle-visible', isVisible);
      };

      const setHeroMediaCirclesVisibleState = (item, isVisible) => {
        if (!item) return;

        const media = item.querySelector('.hero-media');
        media?.classList.toggle('hero-media-circles-visible-top', isVisible);
        media?.classList.toggle('hero-media-circles-visible-bottom', isVisible);
      };

      const animateInitialHeroMedia = (item) => {
        const media = item?.querySelector('.hero-media');
        if (!media) return;

        media.classList.remove('hero-media-enter-initial');
        void media.offsetWidth;
        media.classList.add('hero-media-enter-initial');
        media.addEventListener(
          'animationend',
          () => {
            media.classList.remove('hero-media-enter-initial');
          },
          { once: true }
        );
      };

      const animateHeroMediaCircles = (item, direction) => {
        const media = item?.querySelector('.hero-media');
        if (!media) return;

        void media.offsetWidth;
        media.classList.add(
          direction === 'down' ? 'hero-media-circles-enter-down' : 'hero-media-circles-enter-up'
        );

        const topCircleTimer = window.setTimeout(() => {
          media.classList.add('hero-media-circles-visible-top');
        }, MEDIA_CIRCLES_VISIBLE_TIMINGS.top);

        const bottomCircleTimer = window.setTimeout(() => {
          media.classList.add('hero-media-circles-visible-bottom');
          media.classList.remove('hero-media-circles-enter-up', 'hero-media-circles-enter-down');
        }, MEDIA_CIRCLES_VISIBLE_TIMINGS.bottom);

        const timers = revealTimers.get(item) ?? [];
        revealTimers.set(item, [...timers, topCircleTimer, bottomCircleTimer]);
      };

      const animateHeroMediaCirclesExit = (item, direction) => {
        const media = item?.querySelector('.hero-media');
        if (!media) return;

        void media.offsetWidth;
        media.classList.add(
          direction === 'down' ? 'hero-media-circles-exit-down' : 'hero-media-circles-exit-up'
        );
      };

      const animateHeroText = (item, direction) => {
        if (!item) return;

        const { title, body, caption } = getHeroTextElements(item);
        const titleClass = direction === 'down' ? 'hero-title-enter-down' : 'hero-title-enter-up';
        const bodyClass = direction === 'down' ? 'hero-body-enter-down' : 'hero-body-enter-up';
        const circleClass =
          direction === 'down' ? 'hero-circle-enter-down' : 'hero-circle-enter-up';

        [title, body, caption].forEach((node) => {
          if (!node) return;
          void node.offsetWidth;
        });

        setHeroVisibleState(item, false);
        caption?.classList.add(circleClass);

        const titleStartTimer = window.setTimeout(() => {
          title?.classList.add(titleClass);
        }, ENTRY_START_DELAYS.title);

        const bodyStartTimer = window.setTimeout(() => {
          body?.classList.add(bodyClass);
        }, ENTRY_START_DELAYS.body);

        const titleTimer = window.setTimeout(() => {
          title?.classList.add('hero-title-visible');
        }, ENTRY_VISIBLE_TIMINGS.title);

        const bodyTimer = window.setTimeout(() => {
          body?.classList.add('hero-body-visible');
        }, ENTRY_VISIBLE_TIMINGS.body);

        const circleTimer = window.setTimeout(() => {
          caption?.classList.add('hero-circle-visible');
        }, ENTRY_VISIBLE_TIMINGS.circle);

        revealTimers.set(item, [
          titleStartTimer,
          bodyStartTimer,
          titleTimer,
          bodyTimer,
          circleTimer
        ]);
      };

      const animateHeroExit = (item, direction) => {
        if (!item) return;

        const { title, body, caption } = getHeroTextElements(item);
        const titleClass = direction === 'down' ? 'hero-title-exit-down' : 'hero-title-exit-up';
        const bodyClass = direction === 'down' ? 'hero-body-exit-down' : 'hero-body-exit-up';
        const circleClass = direction === 'down' ? 'hero-circle-exit-down' : 'hero-circle-exit-up';

        [title, body, caption].forEach((node) => {
          if (!node) return;
          void node.offsetWidth;
        });

        const circleTimer = window.setTimeout(() => {
          caption?.classList.add(circleClass);
        }, EXIT_START_DELAYS.circle);

        const titleTimer = window.setTimeout(() => {
          title?.classList.add(titleClass);
        }, EXIT_START_DELAYS.title);

        const bodyTimer = window.setTimeout(() => {
          body?.classList.add(bodyClass);
        }, EXIT_START_DELAYS.body);

        const timers = revealTimers.get(item) ?? [];
        revealTimers.set(item, [...timers, circleTimer, titleTimer, bodyTimer]);
      };

      const applyInitialSlideDistance = () => {
        const slideWidth = `${heroCarousel.getBoundingClientRect().width.toFixed(2)}px`;
        heroItems.forEach((item) => {
          item.style.setProperty('--hero-initial-slide-x', slideWidth);
        });
      };

      const getActiveIndex = () => heroItems.findIndex((item) => item.classList.contains('active'));

      const activeIndex = getActiveIndex();
      resetHeroRevealClasses();
      heroItems.forEach((item) => {
        setHeroVisibleState(item, false);
        setHeroMediaCirclesVisibleState(item, false);
      });
      applyInitialSlideDistance();
      syncHeroParallaxLayout = () => {
        applyInitialSlideDistance();
      };
      window.requestAnimationFrame(() => {
        heroCarousel.classList.add('is-parallax-ready');
      });

      if (activeIndex !== -1) {
        window.requestAnimationFrame(() => {
          animateInitialHeroMedia(heroItems[activeIndex]);
          window.setTimeout(() => {
            animateHeroMediaCircles(heroItems[activeIndex], 'up');
          }, INITIAL_MEDIA_ENTRY_MS);
          window.setTimeout(() => {
            animateHeroText(heroItems[activeIndex], 'up');
          }, INITIAL_MEDIA_ENTRY_MS);
        });
      }

      heroCarousel.addEventListener('slide.bs.carousel', (event) => {
        const currentItem = heroItems[event.from];
        const targetItem = heroItems[event.to];
        const direction = event.direction === 'right' ? 'down' : 'up';
        resetHeroRevealClasses();
        setHeroVisibleState(currentItem, true);
        setHeroMediaCirclesVisibleState(currentItem, true);
        setHeroVisibleState(targetItem, false);
        setHeroMediaCirclesVisibleState(targetItem, false);
        animateHeroMediaCirclesExit(currentItem, direction);
        animateHeroExit(currentItem, direction);
        setBackgroundDirection(targetItem, !isReverseBackground(currentItem));
      });

      heroCarousel.addEventListener('slid.bs.carousel', (event) => {
        resetHeroRevealClasses();
        heroItems.forEach((item, index) => {
          setHeroVisibleState(item, index === event.to);
          setHeroMediaCirclesVisibleState(item, false);
        });
        if (heroItems[event.to]) {
          const direction = event.direction === 'right' ? 'down' : 'up';
          animateHeroMediaCircles(heroItems[event.to], direction);
          animateHeroText(heroItems[event.to], direction);
        }
        performScrollEffects();
      });
    }

    const productCarouselsState = [];
    const isProductMobileViewport = () => window.innerWidth <= 767;
    const isProductPeekViewport = () => false;
    const shouldRunProductCarouselAutoplay = () =>
      !isProductModalOpen && !prefersReducedMotion.matches && !document.hidden;

    const getProductVisibleCount = (carouselEl) => {
      if (window.innerWidth <= 767) {
        return Number.parseInt(carouselEl?.dataset.visibleMobile ?? '1', 10) || 1;
      }
      if (window.innerWidth <= 991) {
        return Number.parseInt(carouselEl?.dataset.visibleTablet ?? '2', 10) || 2;
      }
      return Number.parseInt(carouselEl?.dataset.visibleDesktop ?? '4', 10) || 4;
    };

    const getProductGapPx = () => {
      const probe = document.createElement('div');
      probe.style.position = 'absolute';
      probe.style.visibility = 'hidden';
      probe.style.pointerEvents = 'none';
      probe.style.width = 'var(--component-gap)';
      document.body.append(probe);
      const gapPx = probe.getBoundingClientRect().width || 24;
      probe.remove();
      return gapPx;
    };

    const getProductTrackGapPx = (trackEl) => {
      if (!trackEl) return getProductGapPx();

      const computedGap = Number.parseFloat(window.getComputedStyle(trackEl).gap);
      const resolvedGap = Number.isFinite(computedGap) ? computedGap : getProductGapPx();
      return Math.round(resolvedGap);
    };

    const getProductCloneCount = (carouselEl) => {
      const visibleCount = getProductVisibleCount(carouselEl);
      return isProductPeekViewport() ? visibleCount + 2 : visibleCount;
    };

    const ensureProductPreviewTrigger = (cardEl) => {
      if (!cardEl) return;

      const nameText = cardEl.querySelector('.product-meta-row h3.card-title')?.textContent?.trim();
      cardEl.removeAttribute('role');
      cardEl.removeAttribute('tabindex');
      cardEl.removeAttribute('aria-label');

      const mediaEl = cardEl.querySelector('.product-media');
      if (!mediaEl) return;

      let previewTriggerEl = mediaEl.querySelector('.product-preview-trigger');
      if (!previewTriggerEl) {
        previewTriggerEl = document.createElement('button');
        previewTriggerEl.type = 'button';
        previewTriggerEl.className = 'product-preview-trigger';
        mediaEl.append(previewTriggerEl);
      }
      if (previewTriggerEl.dataset.iconReady !== 'true') {
        previewTriggerEl.innerHTML = `
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path class="corner-segment corner-tl" d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path class="corner-segment corner-tr" d="M16 3h3a2 2 0 0 1 2 2v3" />
            <path class="corner-segment corner-bl" d="M8 21H5a2 2 0 0 1-2-2v-3" />
            <path class="corner-segment corner-br" d="M16 21h3a2 2 0 0 0 2-2v-3" />
          </svg>
        `;
        previewTriggerEl.dataset.iconReady = 'true';
      }

      previewTriggerEl.setAttribute('aria-label', `${nameText || 'Ürün'} görselini modalda aç`);
    };

    const ensureProductPreviewTriggerMarkup = (cardMarkup) => {
      const templateEl = document.createElement('template');
      templateEl.innerHTML = String(cardMarkup ?? '').trim();
      const cardEl = templateEl.content.querySelector('.product-card');
      ensureProductPreviewTrigger(cardEl);
      return cardEl?.outerHTML ?? String(cardMarkup ?? '');
    };

    const buildProductCarousels = () => {
      productCarousels.forEach((carouselEl) => {
        if (carouselEl.dataset.carouselReady === 'true') return;

        const carouselInner = carouselEl.querySelector('.carousel-inner');
        if (!carouselInner) return;

        const sourceCards = Array.from(carouselInner.querySelectorAll('.product-card')).map((card) => {
          ensureProductPreviewTrigger(card);
          return card.outerHTML;
        });
        if (!sourceCards.length) return;

        carouselEl.dataset.carouselReady = 'true';
        productCarouselsState.push({
          carouselEl,
          carouselInner,
          sourceCards,
          trackEl: null,
          currentIndex: 0,
          visibleCount: getProductVisibleCount(carouselEl),
          isAnimating: false,
          timerId: null,
          gapPx: 0,
          dragState: null,
          isPausedByInteraction: false,
          suppressClickUntil: 0
        });
      });
    };

    const setProductCarouselPaused = (slider, paused) => {
      if (!slider) return;
      slider.isPausedByInteraction = paused;
      if (paused) {
        if (slider.timerId) {
          window.clearInterval(slider.timerId);
          slider.timerId = null;
        }
        return;
      }
      startProductCarousels();
    };

    const getProductSliderState = (carouselEl) =>
      productCarouselsState.find((slider) => slider.carouselEl === carouselEl) ?? null;

    const mountProductCarouselControls = (slider) => {
      if (!slider?.carouselEl || slider.carouselEl.querySelector('.product-carousel-controls')) return;

      const controlsEl = document.createElement('div');
      controlsEl.className = 'product-carousel-controls';
      const carouselName = slider.carouselEl.getAttribute('aria-label')?.trim() || 'Ürün carousel';
      controlsEl.innerHTML = `
        <button
          type="button"
          class="product-carousel-control is-prev"
          aria-label="${carouselName} için önceki ürün"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          class="product-carousel-control is-next"
          aria-label="${carouselName} için sonraki ürün"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      `;
      slider.carouselEl.append(controlsEl);

      const prevButton = controlsEl.querySelector('.is-prev');
      const nextButton = controlsEl.querySelector('.is-next');
      prevButton?.addEventListener('click', () => {
        if (slider.sourceCards.length <= 1) return;
        if (slider.timerId) {
          window.clearInterval(slider.timerId);
          slider.timerId = null;
        }
        moveProductCarousel(slider, -1);
        startProductCarousels();
      });
      nextButton?.addEventListener('click', () => {
        if (slider.sourceCards.length <= 1) return;
        if (slider.timerId) {
          window.clearInterval(slider.timerId);
          slider.timerId = null;
        }
        moveProductCarousel(slider, 1);
        startProductCarousels();
      });
    };

    const renderProductCarousel = (slider) => {
      const visibleCount = getProductVisibleCount(slider.carouselEl);
      const cloneCount = getProductCloneCount(slider.carouselEl);
      const leadingCards = slider.sourceCards.slice(-cloneCount);
      const trailingCards = slider.sourceCards.slice(0, cloneCount);
      const trackMarkup = [...leadingCards, ...slider.sourceCards, ...trailingCards]
        .map(
          (cardMarkup) =>
            `<div class="product-carousel-item">${ensureProductPreviewTriggerMarkup(cardMarkup)}</div>`
        )
        .join('');

      slider.carouselInner.innerHTML = `<div class="product-carousel-track">${trackMarkup}</div>`;
      slider.trackEl = slider.carouselInner.querySelector('.product-carousel-track');
      slider.carouselInner.querySelectorAll('.product-card').forEach((cardEl) => {
        ensureProductPreviewTrigger(cardEl);
      });
      slider.visibleCount = visibleCount;
      slider.currentIndex = cloneCount;
      slider.isAnimating = false;
    };

    const syncProductCarouselPosition = (slider, useTransition = false) => {
      const { trackEl, gapPx, currentIndex } = slider;
      if (!trackEl?.firstElementChild) return;

      const itemWidthPx = trackEl.firstElementChild.offsetWidth;
      const viewportWidth = slider.carouselInner.clientWidth || slider.carouselEl.clientWidth || itemWidthPx;
      const centerShiftPx = isProductPeekViewport() ? Math.max((viewportWidth - itemWidthPx) / 2, 0) : 0;
      const offsetPx = (itemWidthPx + gapPx) * currentIndex - centerShiftPx;
      const translateXPx = -Math.round(offsetPx);

      trackEl.style.transition = useTransition ? 'transform 820ms cubic-bezier(0.76, 0, 0.24, 1)' : 'none';
      trackEl.style.transform = `translateX(${translateXPx}px)`;
    };

    const getProductCarouselOffsetPx = (slider) => {
      const { trackEl, gapPx, currentIndex } = slider;
      if (!trackEl?.firstElementChild) return 0;

      const itemWidthPx = trackEl.firstElementChild.offsetWidth;
      const viewportWidth = slider.carouselInner.clientWidth || slider.carouselEl.clientWidth || itemWidthPx;
      const centerShiftPx = isProductPeekViewport() ? Math.max((viewportWidth - itemWidthPx) / 2, 0) : 0;

      return (itemWidthPx + gapPx) * currentIndex - centerShiftPx;
    };

    const bindProductCarouselSwipe = (slider) => {
      let dragState = null;

      slider.carouselInner.addEventListener(
        'touchstart',
        (event) => {
          if (isProductMobileViewport() || slider.isAnimating || slider.sourceCards.length <= 1) return;

          const touch = event.touches[0];
          if (!touch) return;

          if (slider.timerId) {
            window.clearInterval(slider.timerId);
            slider.timerId = null;
          }

          dragState = {
            startX: touch.clientX,
            startY: touch.clientY,
            deltaX: 0,
            isSwiping: false,
            baseOffsetPx: getProductCarouselOffsetPx(slider)
          };
          slider.dragState = dragState;
          slider.trackEl.style.transition = 'none';
        },
        { passive: true }
      );

      slider.carouselInner.addEventListener(
        'touchmove',
        (event) => {
          if (!dragState || !slider.trackEl) return;

          const touch = event.touches[0];
          if (!touch) return;

          dragState.deltaX = touch.clientX - dragState.startX;
          const deltaY = touch.clientY - dragState.startY;

          if (!dragState.isSwiping) {
            if (Math.abs(dragState.deltaX) < 8) return;
            if (Math.abs(dragState.deltaX) <= Math.abs(deltaY)) {
              dragState = null;
              slider.dragState = null;
              startProductCarousels();
              return;
            }
            dragState.isSwiping = true;
          }

          event.preventDefault();
          const nextOffsetPx = dragState.baseOffsetPx - dragState.deltaX;
          const swipeTranslateXPx = -Math.round(nextOffsetPx);
          slider.trackEl.style.transform = `translateX(${swipeTranslateXPx}px)`;
        },
        { passive: false }
      );

      const finishSwipe = () => {
        if (!dragState) return;

        const swipeThresholdPx = Math.min(slider.carouselInner.clientWidth * 0.12, 56);
        const shouldMove = dragState.isSwiping && Math.abs(dragState.deltaX) >= swipeThresholdPx;
        const direction = dragState.deltaX < 0 ? 1 : -1;

        dragState = null;
        slider.dragState = null;

        if (shouldMove) {
          slider.suppressClickUntil = performance.now() + 420;
          moveProductCarousel(slider, direction);
        } else {
          syncProductCarouselPosition(slider, true);
        }

        startProductCarousels();
      };

      slider.carouselInner.addEventListener('touchend', finishSwipe);
      slider.carouselInner.addEventListener('touchcancel', finishSwipe);
    };

    const bindProductCarouselAccessibility = (slider) => {
      slider.carouselEl.addEventListener('mouseenter', () => {
        if (isProductMobileViewport()) return;
        setProductCarouselPaused(slider, true);
      });
      slider.carouselEl.addEventListener('mouseleave', () => {
        if (isProductMobileViewport()) return;
        setProductCarouselPaused(slider, false);
      });
      slider.carouselEl.addEventListener('focusin', () => {
        setProductCarouselPaused(slider, true);
      });
      slider.carouselEl.addEventListener('focusout', (event) => {
        if (slider.carouselEl.contains(event.relatedTarget)) return;
        setProductCarouselPaused(slider, false);
      });
      slider.carouselEl.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        if (slider.sourceCards.length <= 1) return;
        event.preventDefault();
        if (slider.timerId) {
          window.clearInterval(slider.timerId);
          slider.timerId = null;
        }
        moveProductCarousel(slider, event.key === 'ArrowRight' ? 1 : -1);
        startProductCarousels();
      });
    };

    const bindOneShotArrowAnimation = (triggerEl, iconEl) => {
      if (!triggerEl || !iconEl) return;
      if (triggerEl.dataset.arrowAnimationBound === 'true') return;

      const playAnimation = () => {
        if (prefersReducedMotion.matches) return;
        iconEl.classList.remove('is-arrow-animating');
        void iconEl.offsetWidth;
        iconEl.classList.add('is-arrow-animating');
      };

      const clearAnimation = () => {
        iconEl.classList.remove('is-arrow-animating');
      };

      triggerEl.addEventListener('click', playAnimation);
      iconEl.addEventListener('animationend', clearAnimation);
      triggerEl.dataset.arrowAnimationBound = 'true';
    };

    const bindArrowAnimations = () => {
      document
        .querySelectorAll('.carousel-control-prev, .carousel-control-next')
        .forEach((controlEl) => {
          const iconEl = controlEl.querySelector('.carousel-control-prev-icon, .carousel-control-next-icon');
          bindOneShotArrowAnimation(controlEl, iconEl);
        });

      document.querySelectorAll('.product-carousel-control').forEach((controlEl) => {
        const iconEl = controlEl.querySelector('svg');
        bindOneShotArrowAnimation(controlEl, iconEl);
        });
    };

    const PREVIEW_ICON_CLICK_CLOSE_DURATION_MS = 500;

    const triggerProductPreviewIconAnimation = (triggerEl) => {
      if (!triggerEl || prefersReducedMotion.matches) return 0;

      const activeTimerId = Number(triggerEl.dataset.previewCloseTimerId || 0);
      if (activeTimerId) {
        window.clearTimeout(activeTimerId);
      }

      triggerEl.classList.remove('is-click-closing');
      void triggerEl.offsetWidth;
      triggerEl.classList.add('is-click-closing');

      const timerId = window.setTimeout(() => {
        triggerEl.classList.remove('is-click-closing');
        delete triggerEl.dataset.previewCloseTimerId;
      }, PREVIEW_ICON_CLICK_CLOSE_DURATION_MS);

      triggerEl.dataset.previewCloseTimerId = String(timerId);
      return 0;
    };

    const syncProductCarouselLayout = () => {
      if (!productCarouselsState.length) return;

      productCarouselsState.forEach((slider) => {
        const visibleCount = getProductVisibleCount(slider.carouselEl);
        if (!slider.trackEl || slider.visibleCount !== visibleCount) {
          renderProductCarousel(slider);
        }

        const { trackEl } = slider;
        if (!trackEl) return;

        const gapPx = getProductTrackGapPx(trackEl);
        const carouselWidth = slider.carouselInner.clientWidth || slider.carouselEl.clientWidth;
        const itemWidthPxRaw = isProductPeekViewport()
          ? Math.min(
              Math.max(
                carouselWidth * (window.innerWidth <= 430 ? 0.82 : 0.78),
                window.innerWidth <= 430 ? 252 : 236
              ),
              Math.max(carouselWidth - gapPx * 1.15, 0)
            )
          : Math.max((carouselWidth - gapPx * (visibleCount - 1)) / visibleCount, 0);
        const itemWidthPx = Math.round(itemWidthPxRaw);
        slider.carouselEl.style.setProperty('--product-carousel-item-width', `${itemWidthPx}px`);
        trackEl.querySelectorAll('.product-carousel-item').forEach((itemEl) => {
          itemEl.style.flexBasis = `${itemWidthPx}px`;
          itemEl.style.width = `${itemWidthPx}px`;
        });

        slider.visibleCount = visibleCount;
        const cloneCount = getProductCloneCount(slider.carouselEl);
        slider.currentIndex = Math.min(
          Math.max(slider.currentIndex, cloneCount),
          slider.sourceCards.length + cloneCount
        );
        slider.gapPx = gapPx;
        syncProductCarouselPosition(slider, false);
        slider.isAnimating = false;
      });

      syncProductCardInteractivity();
    };

    const moveProductCarousel = (slider, direction) => {
      const { trackEl } = slider;
      if (slider.isAnimating || !trackEl?.firstElementChild || slider.sourceCards.length <= 1) return;

      slider.isAnimating = true;
      slider.currentIndex += direction;
      syncProductCarouselPosition(slider, true);

      const handleTrackTransitionEnd = (event) => {
        if (event.target !== trackEl || event.propertyName !== 'transform') return;
        trackEl.removeEventListener('transitionend', handleTrackTransitionEnd);
        const cloneCount = getProductCloneCount(slider.carouselEl);
        let needsIndexReset = false;

        if (slider.currentIndex <= 0) {
          slider.currentIndex = slider.sourceCards.length;
          needsIndexReset = true;
        } else if (slider.currentIndex >= slider.sourceCards.length + cloneCount) {
          slider.currentIndex = cloneCount;
          needsIndexReset = true;
        }

        if (needsIndexReset) {
          syncProductCarouselPosition(slider, false);
          void trackEl.offsetWidth;
        }
        slider.isAnimating = false;
      };

      trackEl.addEventListener('transitionend', handleTrackTransitionEnd);
    };

    const stopProductCarousels = () => {
      productCarouselsState.forEach((slider) => {
        if (!slider.timerId) return;
        window.clearInterval(slider.timerId);
        slider.timerId = null;
      });
    };

    const startProductCarousels = () => {
      if (!shouldRunProductCarouselAutoplay()) {
        stopProductCarousels();
        return;
      }

      productCarouselsState.forEach((slider) => {
        if (slider.timerId) {
          window.clearInterval(slider.timerId);
        }

        if (slider.sourceCards.length <= 1) {
          slider.timerId = null;
          return;
        }
        if (slider.isPausedByInteraction) {
          slider.timerId = null;
          return;
        }

        slider.timerId = window.setInterval(() => {
          if (
            slider.carouselEl.matches(':hover') ||
            slider.carouselEl.querySelector('.product-card:hover')
          ) {
            return;
          }
          moveProductCarousel(slider, 1);
        }, PRODUCT_FLOW_INTERVAL_MS);
      });
    };

    const syncProductCardHeights = () => {
      if (!productCarousels.length) return;

      productCarousels.forEach((carouselEl) => {
        const productCards = Array.from(carouselEl.querySelectorAll('.product-card'));
        if (!productCards.length) return;

        productCards.forEach((card) => {
          card.style.height = 'auto';
        });

        const maxHeight = Math.max(
          ...productCards.map((card) => Math.ceil(card.getBoundingClientRect().height))
        );

        carouselEl.style.setProperty('--product-card-height', `${maxHeight}px`);

        productCards.forEach((card) => {
          card.style.height = `${maxHeight}px`;
        });
      });
    };

    const syncProductCardInteractivity = () => {
      productCarousels.forEach((carouselEl) => {
        const productCards = Array.from(carouselEl.querySelectorAll('.product-card'));
        productCards.forEach((cardEl) => {
          ensureProductPreviewTrigger(cardEl);
        });
      });
    };

    const getProductPreviewData = (cardEl) => {
      const imageEl = cardEl.querySelector('.card-img-top');
      const name = cardEl.querySelector('.product-meta-row h3.card-title')?.textContent?.trim() ?? '';

      return {
        imageSrc: imageEl?.getAttribute('src') ?? '',
        imageAlt: imageEl?.getAttribute('alt') || name || 'Ürün görseli',
        name
      };
    };

    const applyProductPreviewDataToModal = (data) => {
      if (productFullscreenImageEl) {
        productFullscreenImageEl.src = data.imageSrc;
        productFullscreenImageEl.alt = data.imageAlt;
      }
      currentProductPreviewData = data;
    };

    let isProductModalOpen = false;
    let modalScrollY = 0;
    let allowImmediateModalHide = false;
    let modalCloseAnimationTimer = null;
    let modalOpenAnimationTimer = null;
    let modalDismissAnimationTimer = null;
    let lastProductPreviewTriggerEl = null;
    let currentProductPreviewData = null;
    let productModalImageZoomed = false;
    let productModalPanX = 0;
    let productModalPanY = 0;
    let productModalIsPanning = false;
    let productModalPanStartX = 0;
    let productModalPanStartY = 0;
    let productModalPointerStartX = 0;
    let productModalPointerStartY = 0;
    let productModalNativeFullscreen = false;
    const PRODUCT_MODAL_ZOOM_SCALE = 1.4;

    const getProductModalPanBounds = () => {
      if (!productFullscreenMediaEl) return { maxX: 0, maxY: 0 };
      const mediaRect = productFullscreenMediaEl.getBoundingClientRect();
      const maxX = Math.max(((mediaRect.width * PRODUCT_MODAL_ZOOM_SCALE) - mediaRect.width) / 2, 0);
      const maxY = Math.max(((mediaRect.height * PRODUCT_MODAL_ZOOM_SCALE) - mediaRect.height) / 2, 0);
      return { maxX, maxY };
    };

    const applyProductModalPan = () => {
      if (!productFullscreenImageEl) return;
      productFullscreenImageEl.style.setProperty('--modal-image-pan-x', `${productModalPanX}px`);
      productFullscreenImageEl.style.setProperty('--modal-image-pan-y', `${productModalPanY}px`);
    };

    const clampProductModalPan = () => {
      const { maxX, maxY } = getProductModalPanBounds();
      productModalPanX = Math.max(-maxX, Math.min(maxX, productModalPanX));
      productModalPanY = Math.max(-maxY, Math.min(maxY, productModalPanY));
      applyProductModalPan();
    };

    const resetProductModalPan = () => {
      productModalPanX = 0;
      productModalPanY = 0;
      productModalIsPanning = false;
      productFullscreenModalEl?.classList.remove('is-image-panning');
      applyProductModalPan();
    };

    const setProductModalZoomState = (zoomed) => {
      productModalImageZoomed = Boolean(zoomed);
      productFullscreenModalEl?.classList.toggle('is-image-zoomed', productModalImageZoomed);
      if (productFullscreenZoomEl) {
        productFullscreenZoomEl.setAttribute('aria-pressed', productModalImageZoomed ? 'true' : 'false');
        productFullscreenZoomEl.setAttribute('aria-label', productModalImageZoomed ? 'Uzaklaştır' : 'Yakınlaştır');
        productFullscreenZoomEl.setAttribute('title', productModalImageZoomed ? 'Uzaklaştır' : 'Yakınlaştır');
        const zoomIconEl = productFullscreenZoomEl.querySelector('svg');
        if (zoomIconEl) {
          zoomIconEl.innerHTML = productModalImageZoomed
            ? '<path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /><path d="M7 10h6" />'
            : '<path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /><path d="M10 7v6" /><path d="M7 10h6" />';
        }
      }
      if (!productModalImageZoomed) {
        resetProductModalPan();
      } else {
        clampProductModalPan();
      }
    };

    const setProductModalNativeFullscreenState = (active) => {
      productModalNativeFullscreen = Boolean(active);
      productFullscreenModalEl?.classList.toggle('is-native-fullscreen', productModalNativeFullscreen);
      if (!productFullscreenNativeToggleEl) return;
      productFullscreenNativeToggleEl.setAttribute(
        'aria-pressed',
        productModalNativeFullscreen ? 'true' : 'false'
      );
      productFullscreenNativeToggleEl.setAttribute(
        'aria-label',
        productModalNativeFullscreen ? 'Tam ekrandan çık' : 'Tam ekran'
      );
      productFullscreenNativeToggleEl.setAttribute(
        'title',
        productModalNativeFullscreen ? 'Tam ekrandan çık' : 'Tam ekran'
      );
    };

    const getShareableProductUrl = (rawSrc) => {
      if (!rawSrc) return window.location.href;
      try {
        return new URL(rawSrc, window.location.href).href;
      } catch {
        return window.location.href;
      }
    };

    const closeProductShareMenu = () => {
      if (!productFullscreenShareEl) return;
      productFullscreenActionsEl?.classList.remove('is-share-open');
      if (productFullscreenShareMenuEl) {
        productFullscreenShareMenuEl.setAttribute('aria-hidden', 'true');
      }
      productFullscreenShareEl.setAttribute('aria-expanded', 'false');
    };

    const syncProductShareLinks = () => {
      if (
        !productFullscreenShareWhatsAppEl ||
        !productFullscreenShareInstagramEl ||
        !currentProductPreviewData?.imageSrc
      ) {
        return;
      }

      const shareUrl = getShareableProductUrl(currentProductPreviewData.imageSrc);
      const shareText = encodeURIComponent(`${currentProductPreviewData.name || 'Ürün'} ${shareUrl}`);
      productFullscreenShareWhatsAppEl.href = `https://wa.me/?text=${shareText}`;
      productFullscreenShareInstagramEl.href = 'https://www.instagram.com/';
    };

    const lockPageForProductModal = () => {
      modalScrollY = window.scrollY || window.pageYOffset || 0;
      documentEl.classList.add('is-modal-scroll-locked');
      bodyEl.classList.add('is-modal-scroll-locked');
    };

    const unlockPageForProductModal = () => {
      documentEl.classList.remove('is-modal-scroll-locked');
      bodyEl.classList.remove('is-modal-scroll-locked');
      window.scrollTo(0, modalScrollY);
    };

    const openProductFullscreenModal = (cardEl) => {
      if (!productFullscreenModal || !productFullscreenModalEl) return;

      const carouselEl = cardEl.closest('.product-carousel');
      if (!carouselEl) return;
      const rawData = getProductPreviewData(cardEl);
      if (!rawData.imageSrc || !rawData.name) return;

      applyProductPreviewDataToModal(rawData);
      isProductModalOpen = true;

      productFullscreenModal.show();
    };

    const canUseNativeFullscreen = () =>
      typeof document !== 'undefined' &&
      typeof document.fullscreenEnabled !== 'undefined' &&
      document.fullscreenEnabled &&
      typeof productFullscreenModalEl?.requestFullscreen === 'function';

    const handleProductCardOpen = (event, cardEl, delayMs = 0) => {
      const triggerEl = event.target?.closest?.('.product-preview-trigger');
      if (!triggerEl) return;
      if (!cardEl?.closest('.product-carousel')) return;
      if (event.defaultPrevented) return;
      if (document.body.classList.contains('is-product-carousel-dragging')) return;
      const carouselEl = cardEl.closest('.product-carousel');
      if (carouselEl?.classList.contains('is-dragging')) return;
      const slider = getProductSliderState(carouselEl);
      if (slider && slider.suppressClickUntil > performance.now()) return;

      event.preventDefault();
      if (delayMs > 0) {
        window.setTimeout(() => {
          openProductFullscreenModal(cardEl);
        }, delayMs);
        return;
      }
      openProductFullscreenModal(cardEl);
    };

    productFullscreenModalEl?.classList.remove('fade');

    productFullscreenModalEl?.addEventListener('show.bs.modal', () => {
      if (modalOpenAnimationTimer) {
        window.clearTimeout(modalOpenAnimationTimer);
        modalOpenAnimationTimer = null;
      }
      if (modalDismissAnimationTimer) {
        window.clearTimeout(modalDismissAnimationTimer);
        modalDismissAnimationTimer = null;
      }
      if (modalCloseAnimationTimer) {
        window.clearTimeout(modalCloseAnimationTimer);
        modalCloseAnimationTimer = null;
      }
      allowImmediateModalHide = false;
      setProductModalNativeFullscreenState(false);
      setProductModalZoomState(false);
      resetProductModalPan();
      closeProductShareMenu();
      lockPageForProductModal();
      lenis?.stop();
      stopProductCarousels();
      productFullscreenModalEl.classList.remove('is-dismiss-closing');
      productFullscreenModalEl.classList.remove('is-closing');
      productFullscreenModalEl.classList.remove('is-opening');
      void productFullscreenModalEl.offsetWidth;
      productFullscreenModalEl.classList.add('is-opening');
      modalOpenAnimationTimer = window.setTimeout(() => {
        productFullscreenModalEl.classList.remove('is-opening');
        modalOpenAnimationTimer = null;
      }, 420);
    });

    productFullscreenModalEl?.addEventListener('hidden.bs.modal', () => {
      const clearCarouselFocus = () => {
        const focusedEl = document.activeElement;
        if (!(focusedEl instanceof HTMLElement)) return;
        if (
          focusedEl.closest('.product-carousel') ||
          focusedEl.classList.contains('product-preview-trigger')
        ) {
          focusedEl.blur();
        }
      };

      if (lastProductPreviewTriggerEl) {
        lastProductPreviewTriggerEl.blur();
        lastProductPreviewTriggerEl = null;
      }
      if (modalCloseAnimationTimer) {
        window.clearTimeout(modalCloseAnimationTimer);
        modalCloseAnimationTimer = null;
      }
      if (modalOpenAnimationTimer) {
        window.clearTimeout(modalOpenAnimationTimer);
        modalOpenAnimationTimer = null;
      }
      if (modalDismissAnimationTimer) {
        window.clearTimeout(modalDismissAnimationTimer);
        modalDismissAnimationTimer = null;
      }
      allowImmediateModalHide = false;
      clearCarouselFocus();
      isProductModalOpen = false;
      if (document.fullscreenElement === productFullscreenModalEl && document.exitFullscreen) {
        void document.exitFullscreen();
      }
      setProductModalNativeFullscreenState(false);
      setProductModalZoomState(false);
      resetProductModalPan();
      closeProductShareMenu();
      unlockPageForProductModal();
      if (lenis?.scrollTo) {
        lenis.scrollTo(modalScrollY, { immediate: true, force: true });
      }
      lenis?.start();
      productFullscreenModalEl.classList.remove('is-dismiss-closing');
      productFullscreenModalEl.classList.remove('is-closing');
      productFullscreenModalEl.classList.remove('is-opening');
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          clearCarouselFocus();
          syncProductCarouselLayout();
          syncProductCardHeights();
          syncProductCardInteractivity();
          updateProductImageParallax();
          startProductCarousels();
        });
      });
    });

    productFullscreenModalEl?.addEventListener('hide.bs.modal', (event) => {
      if (!allowImmediateModalHide) {
        const modalIsShown = productFullscreenModalEl.classList.contains('show');
        if (modalIsShown) {
          if (modalOpenAnimationTimer) {
            window.clearTimeout(modalOpenAnimationTimer);
            modalOpenAnimationTimer = null;
          }
          if (modalDismissAnimationTimer) {
            window.clearTimeout(modalDismissAnimationTimer);
            modalDismissAnimationTimer = null;
          }
          window.clearTimeout(modalCloseAnimationTimer);
          productFullscreenModalEl.classList.remove('is-dismiss-closing');
          productFullscreenModalEl.classList.remove('is-opening');
          productFullscreenModalEl.classList.remove('is-closing');
          void productFullscreenModalEl.offsetWidth;
          event.preventDefault();
          productFullscreenModalEl.classList.add('is-closing');
          modalCloseAnimationTimer = window.setTimeout(() => {
            allowImmediateModalHide = true;
            productFullscreenModal.hide();
          }, 420);
          return;
        }
      }

      allowImmediateModalHide = false;
      window.requestAnimationFrame(() => {
        syncProductCarouselLayout();
        syncProductCardHeights();
        syncProductCardInteractivity();
      });
    });

    document.addEventListener('click', (event) => {
      const triggerEl = event.target.closest('.product-preview-trigger');
      if (!triggerEl) return;
      const cardEl = triggerEl.closest('.product-card');
      if (!cardEl) return;
      if (triggerEl instanceof HTMLElement) {
        lastProductPreviewTriggerEl = triggerEl;
      }
      const clickAnimationDelayMs = triggerProductPreviewIconAnimation(triggerEl);
      handleProductCardOpen(event, cardEl, clickAnimationDelayMs);
    });

    productFullscreenZoomEl?.addEventListener('click', (event) => {
      event.preventDefault();
      setProductModalZoomState(!productModalImageZoomed);
    });

    const startProductModalPan = (event) => {
      if (!productModalImageZoomed || !productFullscreenMediaEl) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (!event.isPrimary) return;

      productModalIsPanning = true;
      productModalPanStartX = productModalPanX;
      productModalPanStartY = productModalPanY;
      productModalPointerStartX = event.clientX;
      productModalPointerStartY = event.clientY;
      productFullscreenModalEl?.classList.add('is-image-panning');
      productFullscreenMediaEl.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    };

    const moveProductModalPan = (event) => {
      if (!productModalIsPanning || !productModalImageZoomed) return;
      const deltaX = event.clientX - productModalPointerStartX;
      const deltaY = event.clientY - productModalPointerStartY;
      productModalPanX = productModalPanStartX + deltaX;
      productModalPanY = productModalPanStartY + deltaY;
      clampProductModalPan();
      event.preventDefault();
    };

    const endProductModalPan = (event) => {
      if (!productModalIsPanning || !productFullscreenMediaEl) return;
      productModalIsPanning = false;
      productFullscreenModalEl?.classList.remove('is-image-panning');
      productFullscreenMediaEl.releasePointerCapture?.(event.pointerId);
    };

    productFullscreenMediaEl?.addEventListener('pointerdown', startProductModalPan);
    productFullscreenMediaEl?.addEventListener('pointermove', moveProductModalPan);
    productFullscreenMediaEl?.addEventListener('pointerup', endProductModalPan);
    productFullscreenMediaEl?.addEventListener('pointercancel', endProductModalPan);
    productFullscreenMediaEl?.addEventListener('lostpointercapture', () => {
      productModalIsPanning = false;
      productFullscreenModalEl?.classList.remove('is-image-panning');
    });

    if (!canUseNativeFullscreen() && productFullscreenNativeToggleEl) {
      productFullscreenNativeToggleEl.hidden = true;
    }

    productFullscreenNativeToggleEl?.addEventListener('click', async (event) => {
      event.preventDefault();
      if (!canUseNativeFullscreen()) return;

      try {
        const fullscreenActive = document.fullscreenElement === productFullscreenModalEl;
        if (fullscreenActive) {
          await document.exitFullscreen();
        } else {
          await productFullscreenModalEl.requestFullscreen();
        }
      } catch {
        // Ignore fullscreen permission/capability errors.
      }
    });

    productFullscreenShareEl?.addEventListener('click', (event) => {
      event.preventDefault();
      if (!productFullscreenShareEl) return;
      syncProductShareLinks();
      const nextOpenState = !productFullscreenActionsEl?.classList.contains('is-share-open');
      productFullscreenActionsEl?.classList.toggle('is-share-open', nextOpenState);
      if (productFullscreenShareMenuEl) {
        productFullscreenShareMenuEl.setAttribute('aria-hidden', nextOpenState ? 'false' : 'true');
      }
      productFullscreenShareEl.setAttribute('aria-expanded', nextOpenState ? 'true' : 'false');
    });

    productFullscreenShareInstagramEl?.addEventListener('click', async () => {
      if (!currentProductPreviewData?.imageSrc) return;
      const shareUrl = getShareableProductUrl(currentProductPreviewData.imageSrc);
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(shareUrl);
        } catch {
          // Ignore clipboard errors; Instagram link still opens.
        }
      }
      closeProductShareMenu();
    });

    productFullscreenShareWhatsAppEl?.addEventListener('click', () => {
      closeProductShareMenu();
    });

    document.addEventListener('click', (event) => {
      if (!productFullscreenActionsEl?.classList.contains('is-share-open')) return;
      const targetEl = event.target;
      if (!(targetEl instanceof Element)) return;
      if (targetEl.closest('.product-fullscreen-share') || targetEl.closest('.product-fullscreen-share-cluster')) {
        return;
      }
      closeProductShareMenu();
    });

    document.addEventListener('fullscreenchange', () => {
      const fullscreenActive = document.fullscreenElement === productFullscreenModalEl;
      setProductModalNativeFullscreenState(fullscreenActive);
    });

    buildProductCarousels();
    productCarouselsState.forEach((slider) => {
      mountProductCarouselControls(slider);
    });
    bindArrowAnimations();
    syncProductCarouselLayout();
    productCarouselsState.forEach((slider) => {
      bindProductCarouselSwipe(slider);
      bindProductCarouselAccessibility(slider);
    });

    if (productCarouselsState.length) {
      window.requestAnimationFrame(() => {
        syncProductCarouselLayout();
        syncProductCardHeights();
        syncProductCardInteractivity();
        updateProductImageParallax();
        startProductCarousels();
      });

      window.addEventListener(
        'load',
        () => {
          syncProductCarouselLayout();
          syncProductCardHeights();
          syncProductCardInteractivity();
          updateProductImageParallax();
        },
        { once: true }
      );
    }

    initStatCounters();
    startTestimonialMarquee();
    syncNavOffset();
    syncNavLinkWidths();
    updateStatsTitleReveal();
    refreshGhostMetrics();
    updateActiveSection();
    updateGhostHeadingPosition();
    updateSectionOrbParallax();
    updateProductImageParallax();

    function performScrollEffects() {
      lastScrollY = window.scrollY;
      updateActiveSection();
      updateStatsTitleReveal();
      updateGhostHeadingPosition();
      updateSectionOrbParallax();
      updateProductImageParallax();
      applyHeroScrollParallax();
    }

    if (!lenis) {
      window.addEventListener(
        'scroll',
        () => {
          performScrollEffects();
        },
        { passive: true }
      );
    }
    window.addEventListener('resize', () => {
      refreshCollapsedNavOffset();
      syncNavOffset();
      syncNavLinkWidths();
      syncTestimonialMarquee();
      updateStatsTitleReveal();
      refreshGhostMetrics();
      updateActiveSection();
      updateGhostHeadingPosition();
      updateSectionOrbParallax();
      syncHeroParallaxLayout();
      syncProductCarouselLayout();
      syncProductCardHeights();
      syncProductCardInteractivity();
      updateProductImageParallax();
      lenis?.resize();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopProductCarousels();
        return;
      }
      startProductCarousels();
    });

    prefersReducedMotion.addEventListener('change', () => {
      if (prefersReducedMotion.matches) {
        testimonialMarqueeState.forEach((item) => {
          item.offsetPx = 0;
          item.track.style.transform = 'translate3d(0, 0, 0)';
        });
        stopTestimonialMarquee();
        stopProductCarousels();
        return;
      }

      startTestimonialMarquee();
      startProductCarousels();
    });

    const clickableNavAnchors = Array.from(
      document.querySelectorAll('a.navbar-brand[href^="#"], a.nav-link[href^="#"]')
    );
    clickableNavAnchors.forEach((anchor) => {
      anchor.addEventListener('click', async (event) => {
        const currentAnchor = event.currentTarget;
        if (!(currentAnchor instanceof HTMLAnchorElement)) return;

        const href = currentAnchor.getAttribute('href');
      if (!href || href.length < 2) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      syncNavOffset();
      const isHomeTarget = href === '#anasayfa';
      const targetViewportTop = isHomeTarget ? 0 : target.getBoundingClientRect().top;
      const currentVisibleNavOffset = getActiveNavOffset();
      const isCurrentTargetAligned = isHomeTarget
        ? Math.abs(window.scrollY) <= 6
        : Math.abs(targetViewportTop - currentVisibleNavOffset) <= 6;
      const isCurrentLinkActive =
        currentAnchor.classList.contains('nav-link') &&
        (currentAnchor.classList.contains('is-active') || href === activeSectionHash);

      if (isCurrentLinkActive && isCurrentTargetAligned) {
        await closeNavMenuIfNeeded();
        return;
      }

      freezeNavOffset(getNavOffset());

      const clickScrollY = window.scrollY;
      if (currentAnchor instanceof HTMLElement) {
        currentAnchor.blur();
      }

      await closeNavMenuIfNeeded();
      if (isMobileViewport()) {
        if (lenis?.scrollTo) {
          lenis.scrollTo(clickScrollY, { immediate: true, force: true });
        } else {
          window.scrollTo(0, clickScrollY);
        }
        await new Promise((resolve) => {
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(resolve);
          });
        });
      }
      syncNavOffset();
      const focusedEl = document.activeElement;
      if (
        focusedEl instanceof HTMLElement &&
        navCollapseEl?.contains(focusedEl)
      ) {
        focusedEl.blur();
      }

      const targetDocumentTop = isHomeTarget
        ? 0
        : getDocumentTop(target);
      const targetOffset = getNavOffset();
      const targetTop = isHomeTarget ? 0 : targetDocumentTop - targetOffset;
      const nextTop = Math.max(targetTop, 0);

      activeSectionHash = href;
      setActiveNavLink(href);
      if (lenis) {
        const duration = isMobileViewport() ? 0.95 : 1.1;
        navScrollUserInterrupted = false;
        lenis.scrollTo(nextTop, {
          duration,
          easing: (t) => 1 - Math.pow(1 - t, 3.2)
        });
        if (navScrollSnapTimerId) {
          window.clearTimeout(navScrollSnapTimerId);
        }
        navScrollSnapTimerId = window.setTimeout(() => {
          const distanceToTarget = Math.abs(window.scrollY - nextTop);
          if (!navScrollUserInterrupted && distanceToTarget <= 80) {
            lenis.scrollTo(nextTop, { immediate: true, force: true });
          }
          navScrollSnapTimerId = null;
        }, Math.round(duration * 1000 + 50));
        scheduleNavOffsetUnfreeze(Math.round(duration * 1000 + 260));
      } else {
        window.scrollTo({ top: nextTop, behavior: 'smooth' });
        scheduleNavOffsetUnfreeze(1400);
      }
      window.history.replaceState(null, '', href);
      });
    });

    navCollapseEl?.addEventListener('hidden.bs.collapse', () => {
      refreshCollapsedNavOffset();
      updateActiveSection();
    });


    const forms = Array.from(document.querySelectorAll('form[novalidate]'));
    forms.forEach((form) => {
      form.addEventListener('submit', (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      });
    });

    if (document.readyState === 'complete') {
      hidePreloader();
    } else {
      window.addEventListener('load', hidePreloader, { once: true });
    }
  });
})();
