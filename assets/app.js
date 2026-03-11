(() => {
  'use strict';

  const $ = window.jQuery;
  if (!$ || !window.bootstrap) return;

  $(function () {
    const navCollapseEl = document.getElementById('menu');
    const navCollapse = navCollapseEl
      ? bootstrap.Collapse.getOrCreateInstance(navCollapseEl, { toggle: false })
      : null;
    const heroCarousel = document.getElementById('heroCarousel');

    if (heroCarousel) {
      bootstrap.Carousel.getOrCreateInstance(heroCarousel);
      let parallaxFrame = 0;
      const heroItems = Array.from(heroCarousel.querySelectorAll('.carousel-item'));
      const revealTimers = new WeakMap();

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
              '.hero-title-enter-up, .hero-title-enter-down, .hero-body-enter-up, .hero-body-enter-down, .hero-circle-enter-up, .hero-circle-enter-down, .hero-title-exit-up, .hero-title-exit-down, .hero-body-exit-up, .hero-body-exit-down, .hero-circle-exit-up, .hero-circle-exit-down, .hero-media-circles-enter-up, .hero-media-circles-enter-down, .hero-media-circles-exit-up, .hero-media-circles-exit-down',
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
                'hero-media-circles-exit-down',
              );
            });
        });
      };

      const ENTRY_VISIBLE_TIMINGS = {
        title: 820,
        body: 1140,
        circle: 1340,
      };
      const INITIAL_MEDIA_ENTRY_MS = 600;
      const MEDIA_CIRCLES_VISIBLE_TIMINGS = {
        top: 820,
        bottom: 1140,
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
          { once: true },
        );
      };

      const animateHeroMediaCircles = (item, direction) => {
        const media = item?.querySelector('.hero-media');
        if (!media) return;

        void media.offsetWidth;
        media.classList.add(direction === 'down' ? 'hero-media-circles-enter-down' : 'hero-media-circles-enter-up');

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
        media.classList.add(direction === 'down' ? 'hero-media-circles-exit-down' : 'hero-media-circles-exit-up');
      };

      const animateHeroText = (item, direction) => {
        if (!item) return;

        const title = item.querySelector('h1, h2');
        const body = item.querySelector('p');
        const caption = item.querySelector('.carousel-caption');
        const titleClass = direction === 'down' ? 'hero-title-enter-down' : 'hero-title-enter-up';
        const bodyClass = direction === 'down' ? 'hero-body-enter-down' : 'hero-body-enter-up';
        const circleClass = direction === 'down' ? 'hero-circle-enter-down' : 'hero-circle-enter-up';

        [title, body, caption].forEach((node) => {
          if (!node) return;
          void node.offsetWidth;
        });

        setHeroVisibleState(item, false);
        title?.classList.add(titleClass);
        body?.classList.add(bodyClass);
        caption?.classList.add(circleClass);

        const titleTimer = window.setTimeout(() => {
          title?.classList.add('hero-title-visible');
        }, ENTRY_VISIBLE_TIMINGS.title);

        const bodyTimer = window.setTimeout(() => {
          body?.classList.add('hero-body-visible');
        }, ENTRY_VISIBLE_TIMINGS.body);

        const circleTimer = window.setTimeout(() => {
          caption?.classList.add('hero-circle-visible');
        }, ENTRY_VISIBLE_TIMINGS.circle);

        revealTimers.set(item, [titleTimer, bodyTimer, circleTimer]);
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

      const applyScrollParallax = () => {
        parallaxFrame = 0;

        if (
          window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
          window.innerWidth <= 767
        ) {
          heroItems.forEach((item) => {
            item.style.setProperty('--parallax-title-y', '0px');
            item.style.setProperty('--parallax-media-y', '0px');
          });
          return;
        }

        const rect = heroCarousel.getBoundingClientRect();
        const viewportCenter = window.innerHeight * 0.5;
        const heroCenter = rect.top + rect.height * 0.5;
        const offset = (heroCenter - viewportCenter) / window.innerHeight;
        const clampedOffset = Math.max(-1, Math.min(1, offset));
        const titleShift = clampedOffset * -72;
        const mediaShift = clampedOffset * -132;

        heroItems.forEach((item) => {
          item.style.setProperty('--parallax-title-y', `${titleShift.toFixed(2)}px`);
          item.style.setProperty('--parallax-media-y', `${mediaShift.toFixed(2)}px`);
        });
      };

      const applyInitialSlideDistance = () => {
        const slideWidth = `${heroCarousel.getBoundingClientRect().width.toFixed(2)}px`;
        heroItems.forEach((item) => {
          item.style.setProperty('--hero-initial-slide-x', slideWidth);
        });
      };

      const scheduleScrollParallax = () => {
        if (!parallaxFrame) {
          parallaxFrame = window.requestAnimationFrame(applyScrollParallax);
        }
      };

      const getActiveIndex = () =>
        heroItems.findIndex((item) => item.classList.contains('active'));

      const activeIndex = getActiveIndex();
      resetHeroRevealClasses();
      heroItems.forEach((item) => {
        setHeroVisibleState(item, false);
        setHeroMediaCirclesVisibleState(item, false);
      });
      applyInitialSlideDistance();
      applyScrollParallax();
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

      window.addEventListener('scroll', scheduleScrollParallax, { passive: true });
      window.addEventListener('resize', () => {
        applyInitialSlideDistance();
        scheduleScrollParallax();
      });

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
        scheduleScrollParallax();
      });
    }

    $('a.nav-link[href^="#"]').on('click', function (event) {
      const href = $(this).attr('href');
      if (!href || href.length < 2) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (navCollapseEl && navCollapseEl.classList.contains('show')) {
        navCollapse.hide();
      }
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
