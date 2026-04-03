(() => {
  'use strict';

  const $ = window.jQuery;
  if (!$ || !window.bootstrap) return;

  $(function () {
    const navCollapseEl = document.getElementById('menu');
    const navCollapse = navCollapseEl
      ? bootstrap.Collapse.getOrCreateInstance(navCollapseEl, { toggle: false })
      : null;
    const navbarEl = document.querySelector('.navbar');
    const statsSectionEl = document.querySelector('.stats-section');
    const navLinks = Array.from(document.querySelectorAll('a.nav-link[href^="#"]'));
    const heroCarousel = document.getElementById('heroCarousel');
    const testimonialTracks = Array.from(document.querySelectorAll('.testimonial-track'));
    const productCarousels = Array.from(document.querySelectorAll('.product-carousel'));
    const lenis =
      window.Lenis
        ? new window.Lenis({
            duration: 1.85,
            smoothWheel: true,
            smoothTouch: false,
            wheelMultiplier: 0.95,
            touchMultiplier: 1,
            lerp: 0.085
          })
        : null;

    const isMobileViewport = () => window.innerWidth < 992;
    const isNavMenuExpanded = () =>
      navCollapseEl?.classList.contains('show') || navCollapseEl?.classList.contains('collapsing');
    const getExpandedNavOffset = () => navbarEl?.offsetHeight ?? 0;
    const getNavOffset = () => {
      if (!navbarEl) return 0;

      const expandedMenuHeight = isNavMenuExpanded() ? (navCollapseEl?.offsetHeight ?? 0) : 0;

      return Math.max(navbarEl.offsetHeight - expandedMenuHeight, 0);
    };
    const isNavbarHidden = () => navbarEl?.classList.contains('is-hidden');
    const getActiveNavOffset = () => {
      const isMenuExpanded = isNavMenuExpanded();
      if (isNavbarHidden() && !isMenuExpanded) return 0;
      return isMenuExpanded ? getExpandedNavOffset() : getNavOffset();
    };

    const syncNavOffset = () => {
      document.documentElement.style.setProperty('--nav-offset', `${getNavOffset()}px`);
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

        navCollapseEl.addEventListener(
          'hidden.bs.collapse',
          () => {
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

      const statsSection = document.querySelector('.stats-section');
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
      currentOffsetPx: null
    }));
    const orbParallaxSections = Array.from(
      document.querySelectorAll('.stats-section, #yorumlar')
    ).map((sectionEl) => ({
      sectionEl,
      currentPinkOffsetPx: 0,
      currentBlueOffsetPx: 0
    }));
    let scrollEffectsFrame = 0;
    let activeSectionHash = '';
    let lastScrollY = window.scrollY;
    let lastNavbarToggleScrollY = window.scrollY;
    let navbarScrollLock = null;
    let applyHeroScrollParallax = () => false;
    let syncHeroParallaxLayout = () => {};

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const lerp = (start, end, amount) => start + (end - start) * amount;

    const updateNavbarVisibility = (currentScrollY = window.scrollY) => {
      if (!navbarEl) return;

      const safeScrollY = Math.max(currentScrollY, 0);
      if (isMobileViewport()) {
        navbarScrollLock = null;
        navbarEl.classList.remove('is-hidden');
        lastNavbarToggleScrollY = safeScrollY;
        return;
      }

      if (navbarScrollLock) {
        navbarEl.classList.toggle('is-hidden', navbarScrollLock.hidden);
        lastNavbarToggleScrollY = safeScrollY;

        if (Math.abs(safeScrollY - navbarScrollLock.targetY) <= 2) {
          navbarScrollLock = null;
          return;
        } else {
          return;
        }
      }

      const deltaY = safeScrollY - lastNavbarToggleScrollY;
      const isMenuExpanded = navCollapseEl?.classList.contains('show');

      if (safeScrollY <= getNavOffset() || isMenuExpanded) {
        navbarEl.classList.remove('is-hidden');
        lastNavbarToggleScrollY = safeScrollY;
        return;
      }

      if (Math.abs(deltaY) < 1) return;

      if (deltaY > 0) {
        navbarEl.classList.add('is-hidden');
      } else {
        navbarEl.classList.remove('is-hidden');
      }

      lastNavbarToggleScrollY = safeScrollY;
    };

    const lockNavbarDuringNavScroll = (hidden, targetY, durationMs = 1250) => {
      if (isMobileViewport()) {
        navbarScrollLock = null;
        navbarEl?.classList.remove('is-hidden');
        return;
      }

      navbarScrollLock = {
        hidden,
        targetY: Math.max(targetY, 0)
      };
      navbarEl?.classList.toggle('is-hidden', hidden);

      window.setTimeout(() => {
        if (!navbarScrollLock || navbarScrollLock.targetY !== Math.max(targetY, 0)) return;
        navbarScrollLock = null;
      }, durationMs);
    };

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

    const getScrollEase = (delta) => {
      if (delta <= 0.5) return 1;
      if (delta <= 14) return 0.24;
      if (delta <= 40) return 0.18;
      return 0.14;
    };

    const refreshGhostMetrics = () => {
      if (!ghostSectionMetrics.length) return;

      ghostSectionMetrics.forEach((metric) => {
        if (!metric.titleWrapEl) return;

        const wrapRect = metric.titleWrapEl.getBoundingClientRect();
        metric.sectionTop = getDocumentTop(metric.sectionEl);
        metric.sectionHeight = metric.sectionEl.offsetHeight || window.innerHeight;
        metric.titleWrapLeft = wrapRect.left;
      });
    };

    const getGhostTargetOffset = (metric) => {
      if (!metric.titleWrapEl) return 0;

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const scrollMarker = lastScrollY + getNavOffset() + 24;
      const sectionTop = metric.sectionTop ?? getDocumentTop(metric.sectionEl);
      const sectionHeight = metric.sectionHeight || metric.sectionEl.offsetHeight || viewportHeight;
      const titleWrapLeft =
        metric.titleWrapLeft ?? metric.titleWrapEl.getBoundingClientRect().left;
      const maxOffsetPx = Math.max(window.innerWidth - titleWrapLeft + 180, 360);
      const startMarker = sectionTop - viewportHeight * 0.65;
      const arriveDenominator = Math.max(sectionTop - startMarker, 1);
      const arriveProgress = clamp((scrollMarker - startMarker) / arriveDenominator, 0, 1);
      let offsetPx = (1 - arriveProgress) * maxOffsetPx;

      if (scrollMarker > sectionTop) {
        const continueProgress = clamp((scrollMarker - sectionTop) / (sectionHeight * 0.6), 0, 1);
        offsetPx = continueProgress * (maxOffsetPx * -0.35);
      }

      return offsetPx;
    };

    const updateGhostHeadingPosition = () => {
      if (!ghostSectionMetrics.length) return false;

      let isStillAnimating = false;

      ghostSectionMetrics.forEach((metric) => {
        if (!metric.titleWrapEl) return;

        const targetOffsetPx = getGhostTargetOffset(metric);
        const currentOffsetPx =
          metric.currentOffsetPx === null ? targetOffsetPx : metric.currentOffsetPx;
        const delta = Math.abs(targetOffsetPx - currentOffsetPx);
        const nextOffsetPx = delta < 0.12
          ? targetOffsetPx
          : lerp(currentOffsetPx, targetOffsetPx, getScrollEase(delta));

        metric.currentOffsetPx = nextOffsetPx;
        metric.sectionEl.style.setProperty('--ghost-offset', `${nextOffsetPx.toFixed(3)}px`);

        if (Math.abs(targetOffsetPx - nextOffsetPx) >= 0.12) {
          isStillAnimating = true;
        }
      });

      return isStillAnimating;
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

      const viewportCenter = window.innerHeight * 0.5;
      let isStillAnimating = false;

      orbParallaxSections.forEach((metric) => {
        const rect = metric.sectionEl.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height * 0.5;
        const normalizedOffset = clamp((sectionCenter - viewportCenter) / window.innerHeight, -1, 1);
        const orbRangePx = window.innerWidth <= 767 ? 64 : 132;
        const pinkTargetOffsetPx = normalizedOffset * -orbRangePx;
        const blueTargetOffsetPx = normalizedOffset * orbRangePx;
        const pinkDelta = Math.abs(pinkTargetOffsetPx - metric.currentPinkOffsetPx);
        const blueDelta = Math.abs(blueTargetOffsetPx - metric.currentBlueOffsetPx);
        const pinkNextOffsetPx = pinkDelta < 0.08
          ? pinkTargetOffsetPx
          : lerp(metric.currentPinkOffsetPx, pinkTargetOffsetPx, getScrollEase(pinkDelta));
        const blueNextOffsetPx = blueDelta < 0.08
          ? blueTargetOffsetPx
          : lerp(metric.currentBlueOffsetPx, blueTargetOffsetPx, getScrollEase(blueDelta));

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

        if (pinkDelta >= 0.08 || blueDelta >= 0.08) {
          isStillAnimating = true;
        }
      });

      return isStillAnimating;
    };

    const updateProductImageParallax = () => {
      const productCardImages = Array.from(document.querySelectorAll('.product-card .card-img-top')).map(
        (imageEl) => ({
          imageEl,
          currentOffsetPx: Number.parseFloat(imageEl.dataset.productImageParallaxY ?? '0')
        })
      );
      if (!productCardImages.length) return false;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        productCardImages.forEach((item) => {
          item.currentOffsetPx = 0;
          item.imageEl.dataset.productImageParallaxY = '0';
          item.imageEl.style.setProperty('--product-image-parallax-y', '0px');
        });
        return false;
      }

      const viewportCenter = window.innerHeight * 0.5;
      let isStillAnimating = false;

      productCardImages.forEach((item) => {
        const rect = item.imageEl.getBoundingClientRect();
        const imageCenter = rect.top + rect.height * 0.5;
        const normalizedOffset = clamp((imageCenter - viewportCenter) / window.innerHeight, -1, 1);
        const targetOffsetPx = normalizedOffset * -52;
        const delta = Math.abs(targetOffsetPx - item.currentOffsetPx);
        const nextOffsetPx = delta < 0.1
          ? targetOffsetPx
          : lerp(item.currentOffsetPx, targetOffsetPx, getScrollEase(delta));

        item.currentOffsetPx = nextOffsetPx;
        item.imageEl.dataset.productImageParallaxY = `${nextOffsetPx}`;
        item.imageEl.style.setProperty('--product-image-parallax-y', `${nextOffsetPx.toFixed(3)}px`);

        if (Math.abs(targetOffsetPx - nextOffsetPx) >= 0.1) {
          isStillAnimating = true;
        }
      });

      return isStillAnimating;
    };

    const updateTitleReveal = (sectionEl) => {
      if (!sectionEl) return false;

      const rect = sectionEl.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const start = viewportHeight * 0.88;
      const end = viewportHeight * 0.22;
      const progress = clamp((start - rect.top) / Math.max(start - end, 1), 0, 1);
      const lineOneProgress = progress;
      const lineTwoProgress = clamp((progress - 0.16) / 0.84, 0, 1);
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
      const isStatsAnimating = updateTitleReveal(statsSectionEl);
      const isFeedbackAnimating = updateTitleReveal(document.querySelector('#yorumlar'));
      return isStatsAnimating || isFeedbackAnimating;
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
        updateActiveSection();
        window.requestAnimationFrame(runLenisFrame);
      };

      window.requestAnimationFrame(runLenisFrame);
      lenis.resize();
      lenis.on('scroll', () => {
        lastScrollY = window.scrollY;
        updateNavbarVisibility(lastScrollY);
        updateActiveSection();
        if (!scrollEffectsFrame) {
          scrollEffectsFrame = window.requestAnimationFrame(runScrollEffects);
        }
      });
    }

    if (heroCarousel) {
      const heroCarouselInstance = bootstrap.Carousel.getOrCreateInstance(heroCarousel, {
        interval: isMobileViewport() ? false : 6000,
        touch: true,
        ride: isMobileViewport() ? false : 'carousel',
        pause: false,
        wrap: true
      });
      const heroItems = Array.from(heroCarousel.querySelectorAll('.carousel-item'));
      const revealTimers = new WeakMap();
      const syncStaticHeroState = () => {
        const activeIndex = heroItems.findIndex((item) => item.classList.contains('active'));

        heroItems.forEach((item, index) => {
          setHeroVisibleState(item, index === activeIndex);
          setHeroMediaCirclesVisibleState(item, false);
        });
      };

      const setBackgroundDirection = (item, isReverse) => {
        if (!item) return;
        item.classList.toggle('bg-forward', !isReverse);
        item.classList.toggle('bg-reverse', isReverse);
      };

      const isReverseBackground = (item) => item?.classList.contains('bg-reverse');

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

      const ENTRY_VISIBLE_TIMINGS = {
        circle: 820,
        body: 970,
        title: 1140
      };
      const ENTRY_START_DELAYS = {
        circle: 0,
        body: 150,
        title: 320
      };
      const INITIAL_MEDIA_ENTRY_MS = 600;
      const MEDIA_CIRCLES_VISIBLE_TIMINGS = {
        top: 820,
        bottom: 1140
      };

      const setHeroVisibleState = (item, isVisible) => {
        if (!item) return;

        const title = item.querySelector('h1, h2');
        const body = item.querySelector('p');
        const caption = item.querySelector('.carousel-caption');

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

        const title = item.querySelector('h1, h2');
        const body = item.querySelector('p');
        const caption = item.querySelector('.carousel-caption');
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

        const bodyStartTimer = window.setTimeout(() => {
          body?.classList.add(bodyClass);
        }, ENTRY_START_DELAYS.body);

        const titleStartTimer = window.setTimeout(() => {
          title?.classList.add(titleClass);
        }, ENTRY_START_DELAYS.title);

        const titleTimer = window.setTimeout(() => {
          title?.classList.add('hero-title-visible');
        }, ENTRY_VISIBLE_TIMINGS.title);

        const bodyTimer = window.setTimeout(() => {
          body?.classList.add('hero-body-visible');
        }, ENTRY_VISIBLE_TIMINGS.body);

        const circleTimer = window.setTimeout(() => {
          caption?.classList.add('hero-circle-visible');
        }, ENTRY_VISIBLE_TIMINGS.circle);

        revealTimers.set(item, [bodyStartTimer, titleStartTimer, titleTimer, bodyTimer, circleTimer]);
      };

      const animateHeroExit = (item, direction) => {
        if (!item) return;

        const title = item.querySelector('h1, h2');
        const body = item.querySelector('p');
        const caption = item.querySelector('.carousel-caption');
        const titleClass = direction === 'down' ? 'hero-title-exit-down' : 'hero-title-exit-up';
        const bodyClass = direction === 'down' ? 'hero-body-exit-down' : 'hero-body-exit-up';
        const circleClass = direction === 'down' ? 'hero-circle-exit-down' : 'hero-circle-exit-up';

        [title, body, caption].forEach((node) => {
          if (!node) return;
          void node.offsetWidth;
        });

        title?.classList.add(titleClass);
        body?.classList.add(bodyClass);
        caption?.classList.add(circleClass);
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

      if (isMobileViewport()) {
        heroCarousel.classList.remove('hero-animated');
        heroCarouselInstance.pause();
      }

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
        scheduleScrollEffects();
      });
    }

    const productCarouselsState = [];
    const isProductPeekViewport = () => window.innerWidth <= 767;

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
      return Number.isFinite(computedGap) ? computedGap : getProductGapPx();
    };

    const getProductCloneCount = (carouselEl) => {
      const visibleCount = getProductVisibleCount(carouselEl);
      return isProductPeekViewport() ? visibleCount + 2 : visibleCount;
    };

    const buildProductCarousels = () => {
      productCarousels.forEach((carouselEl) => {
        if (carouselEl.dataset.carouselReady === 'true') return;

        const carouselInner = carouselEl.querySelector('.carousel-inner');
        if (!carouselInner) return;

        const sourceCards = Array.from(carouselInner.querySelectorAll('.product-card')).map((card) =>
          card.outerHTML
        );
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
          dragState: null
        });
      });
    };

    const renderProductCarousel = (slider) => {
      const visibleCount = getProductVisibleCount(slider.carouselEl);
      const cloneCount = getProductCloneCount(slider.carouselEl);
      const leadingCards = slider.sourceCards.slice(-cloneCount);
      const trailingCards = slider.sourceCards.slice(0, cloneCount);
      const trackMarkup = [...leadingCards, ...slider.sourceCards, ...trailingCards]
        .map((cardMarkup) => `<div class="product-carousel-item">${cardMarkup}</div>`)
        .join('');

      slider.carouselInner.innerHTML = `<div class="product-carousel-track">${trackMarkup}</div>`;
      slider.trackEl = slider.carouselInner.querySelector('.product-carousel-track');
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

      trackEl.style.transition = useTransition ? 'transform 760ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
      trackEl.style.transform = `translate3d(${-offsetPx.toFixed(3)}px, 0, 0)`;
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
          if (!isProductPeekViewport() || slider.isAnimating || slider.sourceCards.length <= 1) return;

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
          slider.trackEl.style.transform = `translate3d(${-nextOffsetPx.toFixed(3)}px, 0, 0)`;
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
          moveProductCarousel(slider, direction);
        } else {
          syncProductCarouselPosition(slider, true);
        }

        startProductCarousels();
      };

      slider.carouselInner.addEventListener('touchend', finishSwipe);
      slider.carouselInner.addEventListener('touchcancel', finishSwipe);
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
        const itemWidthPx = isProductPeekViewport()
          ? Math.min(Math.max(carouselWidth * 0.64, 208), Math.max(carouselWidth - gapPx * 2, 0))
          : Math.max((carouselWidth - gapPx * (visibleCount - 1)) / visibleCount, 0);
        slider.carouselEl.style.setProperty('--product-carousel-item-width', `${itemWidthPx.toFixed(3)}px`);
        trackEl.querySelectorAll('.product-carousel-item').forEach((itemEl) => {
          itemEl.style.flexBasis = `${itemWidthPx.toFixed(3)}px`;
          itemEl.style.width = `${itemWidthPx.toFixed(3)}px`;
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

        if (slider.currentIndex <= 0) {
          slider.currentIndex = slider.sourceCards.length;
        } else if (slider.currentIndex >= slider.sourceCards.length + cloneCount) {
          slider.currentIndex = cloneCount;
        }

        syncProductCarouselPosition(slider, false);
        void trackEl.offsetWidth;
        slider.isAnimating = false;
      };

      trackEl.addEventListener('transitionend', handleTrackTransitionEnd);
    };

    const startProductCarousels = () => {
      productCarouselsState.forEach((slider) => {
        if (slider.timerId) {
          window.clearInterval(slider.timerId);
        }

        if (slider.sourceCards.length <= 1) {
          slider.timerId = null;
          return;
        }

        slider.timerId = window.setInterval(() => {
          moveProductCarousel(slider, 1);
        }, 3400);
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

    buildProductCarousels();
    syncProductCarouselLayout();
    productCarouselsState.forEach((slider) => {
      bindProductCarouselSwipe(slider);
    });

    if (productCarouselsState.length) {
      window.requestAnimationFrame(() => {
        syncProductCarouselLayout();
        syncProductCardHeights();
        updateProductImageParallax();
        startProductCarousels();
      });

      window.addEventListener(
        'load',
        () => {
          syncProductCarouselLayout();
          syncProductCardHeights();
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
    updateNavbarVisibility();
    updateActiveSection();
    updateGhostHeadingPosition();
    updateSectionOrbParallax();
    updateProductImageParallax();

    const runScrollEffects = () => {
      scrollEffectsFrame = 0;
      lastScrollY = window.scrollY;
      updateActiveSection();
      const isStatsTitleAnimating = updateStatsTitleReveal();
      const isGhostAnimating = updateGhostHeadingPosition();
      const isOrbAnimating = updateSectionOrbParallax();
      const isProductImageAnimating = updateProductImageParallax();
      const isHeroAnimating = applyHeroScrollParallax();
      if (
        isStatsTitleAnimating ||
        isGhostAnimating ||
        isOrbAnimating ||
        isProductImageAnimating ||
        isHeroAnimating
      ) {
        scrollEffectsFrame = window.requestAnimationFrame(runScrollEffects);
      }
    };

    const scheduleScrollEffects = () => {
      if (scrollEffectsFrame) return;
      scrollEffectsFrame = window.requestAnimationFrame(runScrollEffects);
    };

    window.addEventListener(
      'scroll',
      () => {
        updateNavbarVisibility(window.scrollY);
        updateActiveSection();
        scheduleScrollEffects();
      },
      { passive: true }
    );
    window.addEventListener('resize', () => {
      syncNavOffset();
      syncNavLinkWidths();
      updateNavbarVisibility(window.scrollY);
      syncTestimonialMarquee();
      updateStatsTitleReveal();
      refreshGhostMetrics();
      updateActiveSection();
      updateGhostHeadingPosition();
      updateSectionOrbParallax();
      syncHeroParallaxLayout();
      syncProductCarouselLayout();
      syncProductCardHeights();
      updateProductImageParallax();
      lenis?.resize();
    });

    prefersReducedMotion.addEventListener('change', () => {
      if (prefersReducedMotion.matches) {
        testimonialMarqueeState.forEach((item) => {
          item.offsetPx = 0;
          item.track.style.transform = 'translate3d(0, 0, 0)';
        });
        stopTestimonialMarquee();
        return;
      }

      startTestimonialMarquee();
    });

    $('a.navbar-brand[href^="#"], a.nav-link[href^="#"]').on('click', async function (event) {
      const href = $(this).attr('href');
      if (!href || href.length < 2) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      await closeNavMenuIfNeeded();
      syncNavOffset();
      activeSectionHash = href;
      setActiveNavLink(href);
      const currentScrollY = window.scrollY;
      const targetDocumentTop = target.getBoundingClientRect().top + currentScrollY;
      const isScrollingDown = targetDocumentTop > currentScrollY;
      const targetOffset = isMobileViewport()
        ? getNavOffset()
        : (isScrollingDown ? 0 : getNavOffset());
      const targetTop = targetDocumentTop - targetOffset;
      const nextTop = Math.max(targetTop, 0);
      lockNavbarDuringNavScroll(isScrollingDown, nextTop);
      if (lenis) {
        lenis.scrollTo(nextTop, {
          duration: 1.1,
          easing: (t) => 1 - Math.pow(1 - t, 3.2)
        });
      } else {
        window.scrollTo({ top: nextTop, behavior: 'smooth' });
      }
      window.history.replaceState(null, '', href);
    });

    navCollapseEl?.addEventListener('show.bs.collapse', () => {
      navbarEl?.classList.remove('is-hidden');
      lastNavbarToggleScrollY = window.scrollY;
    });

    navCollapseEl?.addEventListener('hidden.bs.collapse', () => {
      updateNavbarVisibility(window.scrollY);
      updateActiveSection();
    });


    $('form[novalidate]').on('submit', function (event) {
      const form = this;
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });
})();
