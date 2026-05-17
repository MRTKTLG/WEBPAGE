(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const bootstrap = window.bootstrap;
    const navCollapseEl = document.getElementById('menu');
    const navCollapse =
      navCollapseEl && bootstrap
        ? bootstrap.Collapse.getOrCreateInstance(navCollapseEl, { toggle: false })
        : null;
    const navbarEl = document.querySelector('.navbar');
    const statsSectionEl = document.getElementById('sayaclar');
    const productsSectionEl = document.getElementById('urunler');
    const navLinks = Array.from(document.querySelectorAll('a.nav-link[href^="#"]'));
    const i18nNodes = Array.from(document.querySelectorAll('[data-i18n]'));
    const languageButtons = Array.from(document.querySelectorAll('[data-lang-btn]'));
    const heroCarousel = document.getElementById('heroCarousel');
    const testimonialTracks = Array.from(document.querySelectorAll('.testimonial-track'));

    const productCarousels = Array.from(document.querySelectorAll('.product-carousel'));
    const documentEl = document.documentElement;
    const bodyEl = document.body;
    const productFullscreenModalEl = document.getElementById('productFullscreenModal');
    const productFullscreenModal =
      productFullscreenModalEl && bootstrap
        ? bootstrap.Modal.getOrCreateInstance(productFullscreenModalEl, { focus: false })
        : null;
    const productFullscreenMediaEl = productFullscreenModalEl?.querySelector(
      '.product-fullscreen-media'
    );
    const productFullscreenImageEl = document.getElementById('productFullscreenImage');
    const productFullscreenActionsEl = productFullscreenModalEl?.querySelector(
      '.product-fullscreen-actions'
    );
    const productFullscreenShareEl = productFullscreenModalEl?.querySelector(
      '.product-fullscreen-share'
    );
    const productFullscreenShareMenuEl = document.getElementById('productShareMenu');
    const productFullscreenShareWhatsAppEl = document.getElementById('productShareWhatsApp');
    const productFullscreenShareInstagramEl = document.getElementById('productShareInstagram');
    const productFullscreenZoomEl = productFullscreenModalEl?.querySelector(
      '.product-fullscreen-zoom'
    );
    const productFullscreenNativeToggleEl = productFullscreenModalEl?.querySelector(
      '.product-fullscreen-native-toggle'
    );
    const LANGUAGE_STORAGE_KEY = 'nova-language';
    const i18nDictionary = {
      tr: {
        'hero.slide1.desc':
          'Yumuşak dokulu ipliklerle hazırlanan sevimli ayıcıklar, hediye ve oda dekoru için sıcak bir seçim.',
        'hero.slide2.desc':
          'Renk, ifade ve detayları özenle çalışılmış amigurumi kedi tasarımları her siparişte ayrı karakter taşır.',
        'hero.slide3.desc':
          'Sıcacık renk paleti ve dengeli formuyla hazırlanan özel figürler, koleksiyonluk ve anlamlı bir hatıraya dönüşür.',
        'nav.home': 'Anasayfa',
        'nav.about': 'Hakkımda',
        'nav.products': 'Ürünler',
        'nav.faq': 'SSS',
        'nav.contact': 'Kontakt',
        'about.ghost': 'Hakkımda',
        'about.title': 'Hakkımda',
        'about.lead':
          'Her amigurumi tasarımında estetik görünümü, temiz işçiliği ve özenli detayları bir araya getiriyorum. Hazırladığım her ürünün, ilk bakışta özen hissi veren ve uzun süre keyifle kullanılabilecek özel bir parça olmasını önemsiyorum.',
        'about.qualityTitle': 'Kalite ve Üretim Anlayışım',
        'about.qualityDesc':
          'Malzeme seçiminden son kontrole kadar her aşamada kaliteyi ön planda tutuyorum. Yumuşak dokulu iplikler, dengeli form ve titiz işçilikle her modelin düzenli, sağlam ve güven veren bir standartta hazırlanmasına özen gösteriyorum. Sipariş öncesinde tüm detayları netleştiriyor, üretim sürecini başından teslimata kadar özenle takip ediyorum.',
        'about.designTitle': 'Tasarım Yaklaşımım',
        'about.designDesc':
          'Tasarımlarımı zamansız, sade ve sıcak bir çizgide hazırlıyor; çocuklara keyifle eşlik edecek, ailelerin ise güvenle tercih edebileceği ürünler ortaya koyuyorum. Her tasarımın sevimli görünmenin ötesinde, özenli ve özel hissettiren bir bütün olmasını önemsiyorum.',
        'journey.title': 'Bir siparişin incelikle tamamlanan hikâyesi',
        'journey.step1.title': 'Siparişin Alınması',
        'journey.step1.desc':
          'Model, renk ve özel detaylar netleştiğinde hazırlık süreci özenle planlanır.',
        'journey.step2.title': 'Hazırlık Süreci',
        'journey.step2.desc':
          'Tasarım, belirlenen detaylara göre özenle hazırlanır ve karakterini kazanmaya başlar.',
        'journey.step3.title': 'Kargoya Teslim',
        'journey.step3.desc':
          'Son kontroller tamamlandığında ürün özenli bir sunumla kargoya teslim edilir.',
        'journey.step4.title': 'Teslimat Anı',
        'journey.step4.desc':
          'Teslimatla birlikte özenle hazırlanan tasarım, özel ve anlamlı bir hediyeye dönüşür.',
        'counter.title': 'Her ilmekte özen, her siparişte mutluluk',
        'counter.item1': 'Özel Tasarım',
        'counter.item2': 'Tamamlanan Sipariş',
        'counter.item3': 'Mutlu Müşteri',
        'products.ghost': 'Ürünler',
        'products.title': 'Ürünler',
        'products.lead':
          'El emeğiyle hazırlanan amigurumi tasarımları arasından en sevilen modelleri ve avantajlı fiyatlarla sunduğum seçili ürünleri burada inceleyebilirsin.',
        'products.popular': 'Popüler Ürünler',
        'products.sale': 'Kampanyalı Ürünler',
        'products.other': 'Diğer Ürünler',
        'faq.ghost': 'Sık Sorulan Sorular',
        'faq.title': 'Sık Sorulan Sorular',
        'faq.lead':
          'Sipariş süreci, teslimat ve kişiye özel hazırlıklarla ilgili en çok sorulan konuları burada topladım. Aklına takılan farklı bir detay olursa iletişim bölümünden her zaman yazabilirsin.',
        'faq.q1.title': 'Siparişim ne kadar sürede hazırlanıyor?',
        'faq.q1.body':
          'Hazır modellerde ortalama 3-6 iş günü içinde üretimi tamamlıyorum. Kişiye özel siparişlerde modelin detayına göre net hazırlık süresini sipariş öncesinde birlikte belirtiyorum.',
        'faq.q2.title': 'Kişiye özel renk veya model seçebiliyor muyum?',
        'faq.q2.body':
          'Evet. Renk, boyut ve bazı tasarım detaylarını birlikte netleştirerek sana özel bir çalışma hazırlayabiliyorum. Referans görsel veya fikir paylaşman süreci daha da kolaylaştırıyor.',
        'faq.q3.title': 'Türkiye geneline gönderim yapıyor musunuz?',
        'faq.q3.body':
          "Evet, Türkiye'nin tüm şehirlerine kargo gönderimi yapıyorum. Paketleme sırasında ürünün formunu koruyacak şekilde özenli bir hazırlık yapıyor, gönderi bilgisini de seninle paylaşıyorum.",
        'faq.q4.title': 'Ürünü hediye olarak göndermek istersem yardımcı oluyor musunuz?',
        'faq.q4.body':
          'Tabii. Hediye notu eklemek, daha özenli bir paketleme hazırlamak veya teslimat zamanını planlamak gibi detaylarda yardımcı oluyorum. Sipariş sırasında bunu belirtmen yeterli.',
        'faq.q5.title': 'Sipariş vermeden önce süreç hakkında bilgi alabilir miyim?',
        'faq.q5.body':
          'Elbette. Sipariş vermeden önce model, fiyat aralığı, hazırlık süresi ve uygunluk hakkında mesaj atabilirsin. Önce tüm detayları netleştirip ardından üretime geçmeyi tercih ediyorum.',
        'testimonials.title': 'Her emeğin ilhamı müşteri memnuniyetidir',
        'testimonials.aria': 'Müşteri yorumları',
        'testimonials.t1':
          'Sipariş öncesinde tüm detayları sabırla konuştuk, süreç boyunca düzenli bilgilendirme aldım ve ürün elime ulaştığında fotoğraftakinden bile daha özenli ve kaliteli olduğunu görmek beni gerçekten çok mutlu etti.',
        'testimonials.t2':
          'Renk ve model seçiminde her ayrıntı tek tek konuşuldu. Sonuç tam hayal ettiğim gibi oldu ve kutuyu açar açmaz emeğin ne kadar özenli olduğunu hissettim.',
        'testimonials.t3':
          'Dikişlerin temizliği, dolgunun dengesi ve genel görünüm gerçekten çok başarılıydı. Fotoğrafta güzel görünüyordu ama canlı hali çok daha etkileyiciydi.',
        'testimonials.t4':
          'İstediğim renkleri ve modeli birebir uygulamış olması harikaydı; ayrıca paketleme o kadar özenliydi ki ürünü hem kendim için çok keyifle açtım hem de hediye etmeden önce içim tamamen rahattı.',
        'testimonials.t5':
          'Üretim süreci boyunca sürekli bilgilendirildim. Sanki hazır ürün almıyormuşum da benim için özel bir hikâye hazırlanıyormuş gibi hissettirdi.',
        'testimonials.t6':
          'Hediye ettiğim kişi ilk bakışta çok etkilendi. Hem sevimli hem kaliteli bir iş çıkmıştı; uzun süre saklanacak özel bir hediye oldu.',
        'testimonials.t7':
          'İletişim baştan sona çok hızlı ve güven vericiydi, her soruma hemen dönüş aldım ve teslimat da konuştuğumuz tarihte sorunsuz şekilde gerçekleştiği için tüm deneyim beklediğimden çok daha rahattı.',
        'testimonials.t8':
          'Hem iletişimdeki sıcak yaklaşım hem de işçilikteki titizlik gerçekten fark ediliyordu; hediye olarak hazırlattığım bu amigurumi karşı tarafı çok mutlu etti ve beklediğimden çok daha özel bir sonuç ortaya çıktı.',
        'testimonials.t9':
          'Kumaş, iplik ve form kalitesi beklediğimden çok daha iyiydi. El emeği olduğu her detayından hissediliyordu ve teslim aldığımda gerçekten gülümsedim.',
        'contact.ghost': 'Kontakt',
        'contact.title': 'Kontakt',
        'contact.note.dm':
          'Aklındaki model, renk veya hediye fikri için Instagram üzerinden mesaj yazabilirsin.',
        'contact.note.marketplaces.prefix': 'Hazır ürünleri',
        'contact.note.marketplaces.between': ' ve ',
        'contact.note.marketplaces.suffix': ' mağazalarında inceleyebilirsin.',
        'contact.note.shipping':
          'Siparişler özenle paketlenir ve Türkiye genelinde kargoya verilir.',
        'contact.note.handmade':
          'Ürünler %100 el işidir; sağlığa zararlı malzemelere yer verilmeden özenle hazırlanır.',
        'contact.feature.aria': 'İletişim seçenekleri',
        'contact.feature.shipping.title': 'Güvenli Kargo',
        'contact.feature.shipping.body':
          "Ürünler formunu koruyacak şekilde paketlenir ve Türkiye'nin her yerine kargo gönderilir.",
        'contact.feature.custom.title': 'Kişiye Özel Tasarım',
        'contact.feature.custom.body':
          'Model, renk ve boyut detayları %100 el işi üretime başlamadan birlikte netleştirilir.',
        'contact.feature.market.title': 'Hazır Ürünler',
        'contact.feature.market.body':
          'Satışa hazır modelleri Shopier ve Endolu mağazalarından kolayca inceleyebilirsin.',
        'contact.feature.instagram.title': 'Mesajla İletişim',
        'contact.feature.instagram.body':
          'Malzeme, sipariş, fiyat ve hazırlık süresiyle ilgili soruların için Instagram DM’den yazabilirsin.',
        'footer.copyright': '© 2026 Nova Crafts - Her hakkı saklıdır.',
        'footer.signature': 'Kocası tarafından sevgiyle tasarlandı.'
      },
      en: {
        'hero.slide1.desc':
          'Cute bears crafted with soft-texture yarn are a warm choice for gifts and room décor.',
        'hero.slide2.desc':
          'Amigurumi cat designs with carefully refined colors, expressions, and details bring a unique character to every order.',
        'hero.slide3.desc':
          'With a cozy color palette and balanced form, these special figures become collectible and meaningful keepsakes.',
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.products': 'Products',
        'nav.faq': 'FAQ',
        'nav.contact': 'Contact',
        'about.ghost': 'About',
        'about.title': 'About',
        'about.lead':
          'In every amigurumi design, I bring together aesthetic appearance, clean craftsmanship, and thoughtful details. I care that each piece feels special at first glance and can be enjoyed for a long time.',
        'about.qualityTitle': 'My Quality & Production Approach',
        'about.qualityDesc':
          'From material selection to final checks, I prioritize quality at every stage. With soft-texture yarns, balanced form, and meticulous workmanship, I ensure each model is prepared to a consistent, durable, and trustworthy standard. Before production, I clarify all details and carefully follow the process from start to delivery.',
        'about.designTitle': 'My Design Approach',
        'about.designDesc':
          'I design in a timeless, simple, and warm style—creating products children can enjoy and families can choose with confidence. Beyond being cute, I care that every design feels thoughtful and truly special as a whole.',
        'journey.title': 'The carefully completed story of an order',
        'journey.step1.title': 'Order Received',
        'journey.step1.desc':
          'Once the model, colors, and special details are finalized, the preparation process is planned with care.',
        'journey.step2.title': 'Preparation Process',
        'journey.step2.desc':
          'The design is crafted according to the agreed details and begins to gain its character.',
        'journey.step3.title': 'Shipped',
        'journey.step3.desc':
          'After final checks, the product is handed over to shipping with careful presentation.',
        'journey.step4.title': 'Delivery Moment',
        'journey.step4.desc':
          'With delivery, the carefully crafted design turns into a special and meaningful gift.',
        'counter.title': 'Care in every stitch, happiness in every order',
        'counter.item1': 'Custom Designs',
        'counter.item2': 'Completed Orders',
        'counter.item3': 'Happy Customers',
        'products.ghost': 'Products',
        'products.title': 'Products',
        'products.lead':
          'Here you can explore the most loved handmade amigurumi designs and selected pieces offered at great prices.',
        'products.popular': 'Popular Products',
        'products.sale': 'Discounted Products',
        'products.other': 'More Products',
        'faq.ghost': 'Frequently Asked Questions',
        'faq.title': 'Frequently Asked Questions',
        'faq.lead':
          'I gathered the most frequently asked topics about ordering, delivery, and personalized preparation here. If you have another question in mind, you can always message me via the contact section.',
        'faq.q1.title': 'How long does it take to prepare my order?',
        'faq.q1.body':
          'For ready models, I complete production in about 3–6 business days. For custom orders, I share a clear preparation timeline based on the model details before confirming the order.',
        'faq.q2.title': 'Can I choose custom colors or a custom model?',
        'faq.q2.body':
          'Yes. We can finalize color, size, and certain design details together to prepare a custom piece for you. Sharing a reference image or idea makes the process even easier.',
        'faq.q3.title': 'Do you ship across all of Turkey?',
        'faq.q3.body':
          'Yes, I ship to all cities in Turkey. I package each product carefully to preserve its form and share shipment details with you.',
        'faq.q4.title': 'Can you help if I want to send it as a gift?',
        'faq.q4.body':
          'Of course. I can help with details like adding a gift note, preparing extra-careful packaging, or planning delivery timing. Just mention this during the order.',
        'faq.q5.title': 'Can I get information before placing an order?',
        'faq.q5.body':
          'Absolutely. Before ordering, you can message me about the model, price range, preparation time, and availability. I prefer clarifying all details first, then starting production.',
        'testimonials.title': 'Customer satisfaction inspires every piece',
        'testimonials.aria': 'Customer reviews',
        'testimonials.t1':
          'Before ordering, we discussed every detail patiently. I received regular updates throughout the process, and when the product arrived, seeing it even more careful and higher quality than the photos made me truly happy.',
        'testimonials.t2':
          'Every detail was discussed one by one during color and model selection. The result was exactly as I imagined, and the care in the craftsmanship was clear the moment I opened the box.',
        'testimonials.t3':
          'The stitching quality, stuffing balance, and overall appearance were truly impressive. It looked great in photos, but in person it was even better.',
        'testimonials.t4':
          'It was amazing that my requested colors and model were followed exactly. The packaging was so thoughtful that I enjoyed opening it myself and felt completely confident before gifting it.',
        'testimonials.t5':
          'I was informed continuously throughout the production process. It felt less like buying a ready product and more like a special story made just for me.',
        'testimonials.t6':
          'The person I gifted it to was impressed at first glance. It was both cute and high quality, and became a special gift to keep for a long time.',
        'testimonials.t7':
          'Communication was fast and reassuring from start to finish. Every question was answered quickly, and delivery happened smoothly on the date we agreed, so the whole experience felt easier than I expected.',
        'testimonials.t8':
          'Both the warm communication and the precision in craftsmanship were clearly noticeable. This amigurumi gift made the recipient very happy and turned out even more special than I expected.',
        'testimonials.t9':
          'The fabric, yarn, and overall form quality were far better than I expected. You could feel the handmade care in every detail, and it genuinely made me smile on delivery.',
        'contact.ghost': 'Contact',
        'contact.title': 'Contact',
        'contact.note.dm':
          'You can message on Instagram for a model, color choice, or gift idea you have in mind.',
        'contact.note.marketplaces.prefix': 'You can browse ready-made pieces on',
        'contact.note.marketplaces.between': ' and ',
        'contact.note.marketplaces.suffix': '.',
        'contact.note.shipping': 'Orders are carefully packed and shipped across Türkiye.',
        'contact.note.handmade':
          'Every piece is 100% handmade and carefully crafted without materials harmful to health.',
        'contact.feature.aria': 'Contact options',
        'contact.feature.shipping.title': 'Secure Shipping',
        'contact.feature.shipping.body':
          'Products are packed to preserve their shape and can be shipped across Türkiye.',
        'contact.feature.custom.title': 'Personalized Design',
        'contact.feature.custom.body':
          'Model, color, and size details are confirmed together before the 100% handmade production begins.',
        'contact.feature.market.title': 'Ready-Made Pieces',
        'contact.feature.market.body':
          'You can browse ready-to-order models through the Shopier and Endolu stores.',
        'contact.feature.instagram.title': 'Message to Order',
        'contact.feature.instagram.body':
          'For questions about materials, orders, pricing, or preparation time, you can send an Instagram DM.',
        'footer.copyright': '© 2026 Nova Crafts - All rights reserved.',
        'footer.signature': 'Lovingly crafted by her husband.'
      }
    };
    const getStoredLanguage = () => {
      const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      return storedLanguage === 'en' ? 'en' : 'tr';
    };
    const titleCircleTargets = [
      { anchorSelector: '.hero-title-anchor', textSelector: '.hero-split-title' },
      { anchorSelector: '.section-title' }
    ];
    const syncTitleCircleAlignment = () => {
      titleCircleTargets.forEach(({ anchorSelector, textSelector }) => {
        const titleAnchors = Array.from(document.querySelectorAll(anchorSelector));

        titleAnchors.forEach((anchorEl) => {
          const circleContent = window.getComputedStyle(anchorEl, '::before').content;
          if (circleContent === 'none' || circleContent === 'normal') return;

          const titleEl = textSelector ? anchorEl.querySelector(textSelector) : anchorEl;
          if (!titleEl) return;

          const range = document.createRange();
          range.selectNodeContents(titleEl);
          const titleRect = range.getBoundingClientRect();
          range.detach();

          const anchorRect = anchorEl.getBoundingClientRect();
          if (!titleRect.height || !anchorRect.height) return;

          const titleCenterY = titleRect.top - anchorRect.top + titleRect.height / 2;
          anchorEl.style.setProperty('--title-circle-anchor-y', `${titleCenterY.toFixed(2)}px`);
        });
      });
    };
    const scheduleTitleCircleAlignment = () => {
      window.requestAnimationFrame(() => {
        syncTitleCircleAlignment();
      });
    };
    const applyLanguage = (languageCode) => {
      const dictionary = i18nDictionary[languageCode] || i18nDictionary.tr;
      document.documentElement.lang = languageCode;
      i18nNodes.forEach((node) => {
        const key = node.getAttribute('data-i18n');
        if (!key || !dictionary[key]) return;
        const translatedText = dictionary[key];
        const targetAttribute = node.getAttribute('data-i18n-attr');
        if (targetAttribute) {
          node.setAttribute(targetAttribute, translatedText);
        }
        if (!targetAttribute) {
          node.textContent = translatedText;
        }
        if (node.hasAttribute('data-text')) {
          node.setAttribute('data-text', translatedText);
        }
      });
      languageButtons.forEach((buttonEl) => {
        const isActive = buttonEl.getAttribute('data-lang-btn') === languageCode;
        buttonEl.classList.toggle('is-active', isActive);
        buttonEl.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
      scheduleTitleCircleAlignment();
    };
    const initialLanguage = getStoredLanguage();
    applyLanguage(initialLanguage);
    languageButtons.forEach((buttonEl) => {
      buttonEl.addEventListener('click', () => {
        const languageCode = buttonEl.getAttribute('data-lang-btn');
        if (languageCode !== 'tr' && languageCode !== 'en') return;
        applyLanguage(languageCode);
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
      });
    });
    document.fonts?.ready?.then(scheduleTitleCircleAlignment).catch(() => {});

    const HERO_CAROUSEL_INTERVAL_MS = 6000;
    const PRODUCT_FLOW_INTERVAL_MS = 3000;
    const isMobileViewport = () => window.innerWidth < 992;
    const lenis = window.Lenis
      ? new window.Lenis({
          duration: 1.85,
          smoothWheel: true,
          wheelMultiplier: 0.95,
          touchMultiplier: 0.9,
          lerp: 0.075,
          // Let touch gestures use native scrolling so mobile Safari
          // can keep pull-to-refresh and top-edge overscroll behavior.
          virtualScroll: ({ event }) => !event.type.startsWith('touch')
        })
      : null;
    const isNavMenuExpanded = () =>
      navCollapseEl?.classList.contains('show') || navCollapseEl?.classList.contains('collapsing');
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
    const getNavOffset = () => getBaseNavOffset();
    const getActiveNavOffset = () => getNavOffset();

    // Prime collapsed navbar height early so first mobile nav click
    // doesn't use expanded menu height in scroll offset calculations.
    refreshCollapsedNavOffset();

    const syncNavOffset = () => {
      document.documentElement.style.setProperty('--nav-offset', `${getNavOffset()}px`);
    };

    const waitForStableNavbar = async (stableFrameCount = 3, maxFrames = 24) => {
      let stableFrames = 0;
      let lastHeight = measureNavbarHeight();
      for (let frame = 0; frame < maxFrames; frame += 1) {
        await new Promise((resolve) => {
          window.requestAnimationFrame(resolve);
        });
        refreshCollapsedNavOffset();
        syncNavOffset();
        const nextHeight = measureNavbarHeight();
        if (Math.abs(nextHeight - lastHeight) <= 1) {
          stableFrames += 1;
        } else {
          stableFrames = 0;
        }
        lastHeight = nextHeight;
        if (stableFrames >= stableFrameCount) break;
      }
    };
    const nextFrame = () =>
      new Promise((resolve) => {
        window.requestAnimationFrame(resolve);
      });
    const waitForImageDecode = (imageEl, timeoutMs = 420) =>
      new Promise((resolve) => {
        if (!(imageEl instanceof HTMLImageElement)) {
          resolve();
          return;
        }
        if (imageEl.complete && imageEl.naturalWidth > 0) {
          if (typeof imageEl.decode === 'function') {
            imageEl
              .decode()
              .catch(() => {})
              .finally(resolve);
            return;
          }
          resolve();
          return;
        }
        let settled = false;
        const cleanup = () => {
          imageEl.removeEventListener('load', onSettled);
          imageEl.removeEventListener('error', onSettled);
          window.clearTimeout(timeoutId);
        };
        const onSettled = () => {
          if (settled) return;
          settled = true;
          cleanup();
          resolve();
        };
        imageEl.addEventListener('load', onSettled, { once: true });
        imageEl.addEventListener('error', onSettled, { once: true });
        const timeoutId = window.setTimeout(onSettled, timeoutMs);
      });
    const waitForPrecedingMediaStability = async (targetEl, timeoutMs = 420) => {
      if (!targetEl) return;
      const targetTop = getDocumentTop(targetEl);
      const candidateImages = Array.from(document.images).filter((imageEl) => {
        if (!(imageEl instanceof HTMLImageElement)) return false;
        const rect = imageEl.getBoundingClientRect();
        const imageTop = rect.top + window.scrollY;
        const imageBottom = imageTop + Math.max(rect.height, 1);
        return imageBottom <= targetTop + 2;
      });
      if (!candidateImages.length) return;
      await Promise.race([
        Promise.all(candidateImages.map((imageEl) => waitForImageDecode(imageEl, timeoutMs))),
        new Promise((resolve) => window.setTimeout(resolve, timeoutMs))
      ]);
      await nextFrame();
      await nextFrame();
    };
    const waitForLayoutStability = async (targetEl, stableFrameCount = 3, maxFrames = 22) => {
      if (!targetEl) return;
      let stableFrames = 0;
      let lastScrollHeight = document.documentElement.scrollHeight;
      let lastTargetTop = getDocumentTop(targetEl);
      for (let frame = 0; frame < maxFrames; frame += 1) {
        await nextFrame();
        const nextScrollHeight = document.documentElement.scrollHeight;
        const nextTargetTop = getDocumentTop(targetEl);
        const isStable =
          Math.abs(nextScrollHeight - lastScrollHeight) <= 1 &&
          Math.abs(nextTargetTop - lastTargetTop) <= 1;
        if (isStable) {
          stableFrames += 1;
        } else {
          stableFrames = 0;
        }
        lastScrollHeight = nextScrollHeight;
        lastTargetTop = nextTargetTop;
        if (stableFrames >= stableFrameCount) break;
      }
    };

    const initMediaSkeletons = () => {
      const mediaContainers = Array.from(
        document.querySelectorAll('.product-media, .journey-visual-media')
      );
      if (!mediaContainers.length) return;

      mediaContainers.forEach((container) => {
        const imageEl = container.querySelector('img');
        if (!(imageEl instanceof HTMLImageElement)) return;

        container.classList.add('media-skeleton');
        container.classList.toggle(
          'is-media-loading',
          !(imageEl.complete && imageEl.naturalWidth > 0)
        );

        waitForImageDecode(imageEl, 7000)
          .catch(() => {})
          .finally(() => {
            container.classList.remove('is-media-loading');
          });
      });
    };

    initMediaSkeletons();

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
        if (!isNavMenuExpanded() || !navCollapse || !navCollapseEl) {
          resolve();
          return;
        }

        const isOpeningTransition =
          navCollapseEl.classList.contains('collapsing') &&
          !navCollapseEl.classList.contains('show');
        if (isOpeningTransition) {
          navCollapseEl.addEventListener(
            'shown.bs.collapse',
            () => {
              closeNavMenuIfNeeded().then(resolve);
            },
            { once: true }
          );
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
        metric.titleWrapEl.style.setProperty(
          '--ghost-left-adjust',
          `${opticalAdjustPx.toFixed(3)}px`
        );
      });
    };

    const getGhostTargetOffset = (metric) => {
      if (!metric.titleWrapEl) return 0;

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const scrollMarker = lastScrollY + getNavOffset();
      const sectionTop = metric.sectionTop ?? getDocumentTop(metric.sectionEl);
      const sectionHeight = metric.sectionHeight || metric.sectionEl.offsetHeight || viewportHeight;
      const titleWrapLeft = metric.titleWrapLeft ?? metric.titleWrapEl.getBoundingClientRect().left;
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
        const isMobileViewport = window.innerWidth <= 767;
        const orbRangeXPx = isMobileViewport ? 86 : 132;
        const pinkNextOffsetPx = normalizedOffset * -orbRangeXPx;
        const blueNextOffsetPx = normalizedOffset * orbRangeXPx;

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
      const primaryCompleteAt = hasPrimaryPhaseSplit ? clamp(primaryCompleteAtRaw, 0.05, 0.95) : 1;
      const secondaryStartAt = hasPrimaryPhaseSplit
        ? clamp(
            Number.isFinite(secondaryStartAtRaw) ? secondaryStartAtRaw : primaryCompleteAt,
            0,
            primaryCompleteAt
          )
        : 0;
      const revealDelay = Number.isFinite(revealDelayRaw) ? clamp(revealDelayRaw, 0, 0.95) : 0.16;
      const lineOneProgress = hasPrimaryPhaseSplit
        ? clamp(progress / primaryCompleteAt, 0, 1)
        : progress;
      const lineTwoProgress = hasPrimaryPhaseSplit
        ? clamp((progress - secondaryStartAt) / Math.max(1 - secondaryStartAt, 0.01), 0, 1)
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
      // Small tolerance avoids boundary flicker when smooth scrolling
      // lands a few pixels above a section start on mobile.
      const scrollMarker = window.scrollY + getActiveNavOffset() + 12;
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

      let shouldSyncLenisBeforeNextInput = true;
      const syncLenisToCurrentScroll = () => {
        const y = window.scrollY;
        if (!Number.isFinite(y) || y <= 1) return false;
        lenis.resize();
        lenis.reset();
        lastScrollY = y;
        performScrollEffects();
        return true;
      };
      const syncLenisBeforeInput = () => {
        if (!shouldSyncLenisBeforeNextInput) return;
        shouldSyncLenisBeforeNextInput = false;
        syncLenisToCurrentScroll();
      };
      const syncLenisScrollState = () => {
        shouldSyncLenisBeforeNextInput = true;
        // After reload, the browser may restore scroll position *after* Lenis
        // has initialized. If we sync too early (while scrollY is still 0),
        // the next wheel/touch scroll can snap back. Poll for a short time and
        // sync once the restored scroll position is observable.
        const maxFrames = 60;
        let frame = 0;
        const tick = () => {
          frame += 1;
          if (syncLenisToCurrentScroll()) {
            shouldSyncLenisBeforeNextInput = false;
            return;
          }
          if (frame < maxFrames) {
            window.requestAnimationFrame(tick);
          }
        };
        window.requestAnimationFrame(tick);
      };

      window.addEventListener('pageshow', syncLenisScrollState);
      window.addEventListener('load', syncLenisScrollState, { once: true });
      ['wheel', 'touchstart', 'touchmove', 'keydown'].forEach((eventName) => {
        window.addEventListener(eventName, syncLenisBeforeInput, {
          capture: true,
          passive: true
        });
      });
    }

    refreshCollapsedNavOffset();

    if (heroCarousel && bootstrap) {
      // Re-create the carousel instance so our touch config wins even when
      // Bootstrap data API auto-initialized it earlier from markup attributes.
      const existingHeroCarousel = bootstrap.Carousel.getInstance(heroCarousel);
      if (existingHeroCarousel) {
        existingHeroCarousel.dispose();
      }
      heroCarousel.setAttribute('data-bs-touch', 'false');
      const heroCarouselInstance = new bootstrap.Carousel(heroCarousel, {
        interval: HERO_CAROUSEL_INTERVAL_MS,
        touch: false,
        ride: 'carousel',
        pause: false,
        wrap: true
      });
      const heroItems = Array.from(heroCarousel.querySelectorAll('.carousel-item'));
      const heroIndicatorButtons = Array.from(
        heroCarousel.querySelectorAll('.carousel-indicators [data-bs-slide-to]')
      );
      let isHeroTransitionLocked = false;
      let isHeroInteractionLocked = true;
      let heroInteractionUnlockTimerId = null;
      const revealTimers = new WeakMap();
      const syncHeroControlLock = () => {
        const isLocked = isHeroTransitionLocked || isHeroInteractionLocked;
        heroIndicatorButtons.forEach((buttonEl) => {
          buttonEl.disabled = isLocked;
          buttonEl.setAttribute('aria-disabled', isLocked ? 'true' : 'false');
          if (isLocked) {
            buttonEl.setAttribute('tabindex', '-1');
          } else {
            buttonEl.removeAttribute('tabindex');
          }
        });
      };
      const setHeroIndicatorLock = (isLocked) => {
        isHeroTransitionLocked = isLocked;
        syncHeroControlLock();
      };
      const setHeroInteractionLock = (isLocked) => {
        isHeroInteractionLocked = isLocked;
        syncHeroControlLock();
      };
      const scheduleHeroInteractionUnlock = (delayMs = 1000) => {
        if (heroInteractionUnlockTimerId) {
          window.clearTimeout(heroInteractionUnlockTimerId);
          heroInteractionUnlockTimerId = null;
        }
        setHeroInteractionLock(true);
        heroInteractionUnlockTimerId = window.setTimeout(() => {
          setHeroInteractionLock(false);
          heroInteractionUnlockTimerId = null;
        }, delayMs);
      };

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
      setHeroIndicatorLock(false);
      setHeroInteractionLock(true);

      const unlockHeroInteractionsAfterReady = async () => {
        const heroImages = Array.from(heroCarousel.querySelectorAll('img'));
        await Promise.all(heroImages.map((imageEl) => waitForImageDecode(imageEl, 1200)));
        scheduleHeroInteractionUnlock(1000);
      };
      unlockHeroInteractionsAfterReady().catch(() => {
        scheduleHeroInteractionUnlock(1000);
      });

      heroIndicatorButtons.forEach((buttonEl) => {
        buttonEl.addEventListener('click', (event) => {
          if (!isHeroTransitionLocked && !isHeroInteractionLocked) return;
          event.preventDefault();
          event.stopPropagation();
        });
      });

      heroCarousel.addEventListener(
        'touchstart',
        (event) => {
          if (isHeroInteractionLocked) {
            event.preventDefault();
          }
        },
        { passive: false }
      );

      let heroTouchState = null;
      heroCarousel.addEventListener(
        'touchstart',
        (event) => {
          if (isHeroInteractionLocked || isHeroTransitionLocked) return;
          const touch = event.touches[0];
          if (!touch) return;
          heroTouchState = {
            startX: touch.clientX,
            startY: touch.clientY,
            deltaX: 0,
            isSwiping: false
          };
        },
        { passive: true }
      );

      heroCarousel.addEventListener(
        'touchmove',
        (event) => {
          if (!heroTouchState || isHeroInteractionLocked || isHeroTransitionLocked) return;
          const touch = event.touches[0];
          if (!touch) return;

          heroTouchState.deltaX = touch.clientX - heroTouchState.startX;
          const deltaY = touch.clientY - heroTouchState.startY;
          if (!heroTouchState.isSwiping) {
            if (Math.abs(heroTouchState.deltaX) < 6) return;
            if (Math.abs(heroTouchState.deltaX) <= Math.abs(deltaY)) {
              heroTouchState = null;
              return;
            }
            heroTouchState.isSwiping = true;
          }
          event.preventDefault();
        },
        { passive: false }
      );

      const finishHeroTouchSwipe = () => {
        if (!heroTouchState) return;
        if (isHeroInteractionLocked || isHeroTransitionLocked) {
          heroTouchState = null;
          return;
        }
        const thresholdPx = Math.min(heroCarousel.clientWidth * 0.12, 56);
        if (heroTouchState.isSwiping && Math.abs(heroTouchState.deltaX) >= thresholdPx) {
          if (heroTouchState.deltaX < 0) {
            heroCarouselInstance.next();
          } else {
            heroCarouselInstance.prev();
          }
        }
        heroTouchState = null;
      };
      heroCarousel.addEventListener('touchend', finishHeroTouchSwipe);
      heroCarousel.addEventListener('touchcancel', finishHeroTouchSwipe);

      heroCarousel.addEventListener('slide.bs.carousel', (event) => {
        setHeroIndicatorLock(true);
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
        setHeroIndicatorLock(false);
        scheduleHeroInteractionUnlock(1000);
        resetHeroRevealClasses();
        heroItems.forEach((item, index) => {
          setHeroVisibleState(item, index === event.to);
          setHeroMediaCirclesVisibleState(item, false);
        });
        scheduleTitleCircleAlignment();
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
    const isProductTouchViewport = () => window.innerWidth <= 991;
    const shouldRunProductCarouselAutoplay = () =>
      !isProductModalOpen &&
      !prefersReducedMotion.matches &&
      !document.hidden &&
      !isProductTouchViewport();

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

    const getProductSwiperBreakpoints = (carouselEl) => ({
      0: {
        slidesPerView: Number.parseInt(carouselEl?.dataset.visibleMobile ?? '1', 10) || 1
      },
      768: {
        slidesPerView: Number.parseInt(carouselEl?.dataset.visibleTablet ?? '2', 10) || 2
      },
      992: {
        slidesPerView: Number.parseInt(carouselEl?.dataset.visibleDesktop ?? '4', 10) || 4
      }
    });

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
          <svg viewBox="0 0 56 56" aria-hidden="true" focusable="false">
            <circle class="preview-trigger-disc" cx="28" cy="28" r="26" />
            <g class="preview-trigger-mark">
              <path class="corner-segment corner-tl" d="M24 17h-4a3 3 0 0 0-3 3v4" />
              <path class="corner-segment corner-tr" d="M32 17h4a3 3 0 0 1 3 3v4" />
              <path class="corner-segment corner-bl" d="M24 39h-4a3 3 0 0 1-3-3v-4" />
              <path class="corner-segment corner-br" d="M32 39h4a3 3 0 0 0 3-3v-4" />
            </g>
          </svg>
        `;
        previewTriggerEl.dataset.iconReady = 'true';
      }

      const previewLabel = `${nameText || 'Ürün'} görselini modalda aç`;
      previewTriggerEl.setAttribute('aria-label', previewLabel);
      previewTriggerEl.setAttribute('title', previewLabel);
    };

    const setProductImagePriority = (imageEl, priority = 'lazy') => {
      if (!(imageEl instanceof HTMLImageElement)) return;
      const isProductCarouselImage = Boolean(imageEl.closest('.product-carousel'));
      if (isProductCarouselImage) {
        imageEl.loading = 'eager';
        imageEl.decoding = 'async';
        imageEl.fetchPriority = 'high';
        if (!imageEl.complete && typeof imageEl.decode === 'function') {
          imageEl.decode().catch(() => {
            // Ignore decode rejections from browser timing/race conditions.
          });
        }
        return;
      }
      const shouldPrioritize = priority === 'high';
      imageEl.loading = shouldPrioritize ? 'eager' : 'lazy';
      imageEl.decoding = 'async';
      imageEl.fetchPriority = shouldPrioritize ? 'high' : 'low';
      if (!shouldPrioritize || imageEl.complete) return;
      if (typeof imageEl.decode === 'function') {
        imageEl.decode().catch(() => {
          // Ignore decode rejections from browser timing/race conditions.
        });
      }
    };

    const primeSliderImages = (rootEl, highPriorityCount = 0) => {
      const images = Array.from(rootEl?.querySelectorAll('.card-img-top') ?? []);
      images.forEach((imageEl) => {
        setProductImagePriority(imageEl, 'lazy');
      });
      images.slice(0, Math.max(highPriorityCount, 0)).forEach((imageEl) => {
        setProductImagePriority(imageEl, 'high');
      });
    };
    const primeAllProductSliderImages = () => {
      document.querySelectorAll('.product-carousel .card-img-top').forEach((imageEl) => {
        setProductImagePriority(imageEl, 'high');
      });
    };
    const observeProductSectionImagePriming = () => {
      if (!productsSectionEl) return;
      if (!('IntersectionObserver' in window)) {
        primeAllProductSliderImages();
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          primeAllProductSliderImages();
          observer.disconnect();
        },
        {
          root: null,
          rootMargin: '300px 0px 300px 0px',
          threshold: 0.01
        }
      );
      observer.observe(productsSectionEl);
    };

    const buildProductCarousels = () => {
      productCarousels.forEach((carouselEl) => {
        if (carouselEl.dataset.carouselReady === 'true') return;

        const carouselInner = carouselEl.querySelector('.carousel-inner');
        if (!carouselInner) return;

        const wrapperEl =
          carouselInner.querySelector('.product-image-grid') ?? carouselInner.firstElementChild;
        if (!(wrapperEl instanceof Element)) return;

        const slides = Array.from(wrapperEl.querySelectorAll('.product-card'));
        if (!slides.length) return;

        slides.forEach((cardEl) => {
          primeSliderImages(cardEl);
          ensureProductPreviewTrigger(cardEl);
        });

        if (typeof window.Swiper !== 'function') {
          carouselEl.dataset.carouselReady = 'static';
          return;
        }

        slides.forEach((cardEl) => {
          cardEl.classList.add('swiper-slide');
        });

        carouselEl.classList.add('product-swiper', 'is-swiper-active');
        carouselInner.classList.add('swiper');
        wrapperEl.classList.add('swiper-wrapper');

        carouselEl.dataset.carouselReady = 'true';
        productCarouselsState.push({
          carouselEl,
          carouselInner,
          wrapperEl,
          swiper: null,
          slideCount: slides.length,
          isPausedByInteraction: false,
          suppressClickUntil: 0,
          controlsLockedUntil: 0
        });
      });
    };

    const setProductCarouselPaused = (slider, paused) => {
      if (!slider) return;
      slider.isPausedByInteraction = paused;
      if (paused) {
        slider.swiper?.autoplay?.stop();
        return;
      }
      startProductCarousels();
    };

    const getProductSliderState = (carouselEl) =>
      productCarouselsState.find((slider) => slider.carouselEl === carouselEl) ?? null;

    const mountProductCarouselControls = (slider) => {
      if (!slider?.carouselEl || slider.carouselEl.querySelector('.product-carousel-controls'))
        return;

      const controlsEl = document.createElement('div');
      controlsEl.className = 'product-carousel-controls';
      const carouselName = slider.carouselEl.getAttribute('aria-label')?.trim() || 'Ürün karuseli';
      controlsEl.innerHTML = `
        <button
          type="button"
          class="product-carousel-control is-prev"
          aria-label="${carouselName} için önceki ürün"
        >
          <svg viewBox="0 0 56 56" aria-hidden="true" focusable="false">
            <circle class="control-icon-disc" cx="28" cy="28" r="26" />
            <path class="control-icon-mark" d="m31 36-8-8 8-8" />
          </svg>
        </button>
        <button
          type="button"
          class="product-carousel-control is-next"
          aria-label="${carouselName} için sonraki ürün"
        >
          <svg viewBox="0 0 56 56" aria-hidden="true" focusable="false">
            <circle class="control-icon-disc" cx="28" cy="28" r="26" />
            <path class="control-icon-mark" d="m25 36 8-8-8-8" />
          </svg>
        </button>
      `;
      slider.carouselEl.append(controlsEl);

      const prevButton = controlsEl.querySelector('.is-prev');
      const nextButton = controlsEl.querySelector('.is-next');
      const onControlClick = (event, direction) => {
        event.preventDefault();
        const now = window.performance?.now ? window.performance.now() : Date.now();
        if (slider.controlsLockedUntil > now) {
          event.stopImmediatePropagation();
          return;
        }
        const didMove = moveProductCarousel(slider, direction);
        if (!didMove) {
          event.stopImmediatePropagation();
          return;
        }
        const speed = Number(slider.swiper?.params?.speed) || 0;
        slider.controlsLockedUntil = now + speed + 140;
        startProductCarousels();
      };

      prevButton?.addEventListener('click', (event) => onControlClick(event, -1));
      nextButton?.addEventListener('click', (event) => onControlClick(event, 1));
    };

    const initProductSwiper = (slider) => {
      if (!slider || slider.swiper || typeof window.Swiper !== 'function') return;

      const gapPx = getProductGapPx();

      slider.swiper = new window.Swiper(slider.carouselInner, {
        loop: slider.slideCount > getProductVisibleCount(slider.carouselEl),
        grabCursor: false,
        watchOverflow: true,
        speed: 560,
        resistanceRatio: 0.72,
        threshold: 6,
        followFinger: true,
        longSwipesMs: 240,
        longSwipesRatio: 0.35,
        shortSwipes: true,
        simulateTouch: false,
        touchStartPreventDefault: false,
        passiveListeners: true,
        slidesPerView: getProductVisibleCount(slider.carouselEl),
        spaceBetween: gapPx,
        breakpoints: getProductSwiperBreakpoints(slider.carouselEl),
        keyboard: {
          enabled: true,
          onlyInViewport: true
        },
        autoplay: {
          delay: PRODUCT_FLOW_INTERVAL_MS,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        },
        on: {
          init() {
            syncProductCardInteractivity();
          },
          slideChange() {
            primeSliderImages(slider.carouselInner, getProductVisibleCount(slider.carouselEl) + 1);
          },
          breakpoint() {
            syncProductCardInteractivity();
          },
          resize() {
            syncProductCardInteractivity();
          }
        }
      });

      if (!shouldRunProductCarouselAutoplay()) {
        slider.swiper.autoplay?.stop();
      }
    };

    const bindProductCarouselSwipe = (slider) => {
      let didMove = false;
      slider.swiper?.on('sliderMove', () => {
        didMove = true;
        slider.carouselEl?.classList.add('is-touch-dragging');
      });
      slider.swiper?.on('touchEnd', () => {
        if (didMove) {
          const transitionMs = Number(slider.swiper?.params?.speed) || 0;
          slider.suppressClickUntil = performance.now() + transitionMs + 180;
        } else {
          slider.carouselEl?.classList.remove('is-touch-dragging');
        }
        didMove = false;
      });
    };

    const bindProductCarouselTouchGuard = (slider) => {
      if (!slider?.carouselEl || slider.carouselEl.dataset.touchGuardBound === 'true') return;

      const dragThresholdPx = 8;
      let touchGuardPointerId = null;
      let touchGuardStartX = 0;
      let touchGuardStartY = 0;
      let touchGuardDidDrag = false;

      const clearTouchGuard = () => {
        if (touchGuardDidDrag) {
          slider.suppressClickUntil = Math.max(slider.suppressClickUntil, performance.now() + 260);
        }
        touchGuardPointerId = null;
        touchGuardDidDrag = false;
        window.setTimeout(() => {
          if (slider.suppressClickUntil > performance.now()) return;
          slider.carouselEl.classList.remove('is-touch-dragging');
        }, 90);
      };

      slider.carouselEl.addEventListener(
        'pointerdown',
        (event) => {
          if (!isProductTouchViewport() || event.pointerType === 'mouse') return;
          touchGuardPointerId = event.pointerId;
          touchGuardStartX = event.clientX;
          touchGuardStartY = event.clientY;
          touchGuardDidDrag = false;
          if (slider.suppressClickUntil <= performance.now()) {
            slider.suppressClickUntil = 0;
          }
        },
        { passive: true }
      );
      slider.carouselEl.addEventListener(
        'pointermove',
        (event) => {
          if (event.pointerId !== touchGuardPointerId || touchGuardDidDrag) return;
          const deltaX = event.clientX - touchGuardStartX;
          const deltaY = event.clientY - touchGuardStartY;
          if (Math.hypot(deltaX, deltaY) < dragThresholdPx) return;
          touchGuardDidDrag = true;
          slider.carouselEl.classList.add('is-touch-dragging');
          slider.suppressClickUntil = performance.now() + 260;
        },
        { passive: true }
      );
      slider.carouselEl.addEventListener('pointerup', clearTouchGuard, { passive: true });
      slider.carouselEl.addEventListener('pointercancel', clearTouchGuard, { passive: true });
      slider.carouselEl.dataset.touchGuardBound = 'true';
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
        event.preventDefault();
        moveProductCarousel(slider, event.key === 'ArrowRight' ? 1 : -1);
        startProductCarousels();
      });
    };

    const syncProductCarouselLayout = () => {
      if (!productCarouselsState.length) return;

      productCarouselsState.forEach((slider) => {
        initProductSwiper(slider);
        slider.swiper?.update();
        primeSliderImages(slider.carouselInner, getProductVisibleCount(slider.carouselEl) + 1);
      });

      syncProductCardInteractivity();
    };

    const moveProductCarousel = (slider, direction) => {
      if (!slider) return false;
      initProductSwiper(slider);
      if (!slider.swiper || slider.slideCount <= 1) return false;
      if (slider.slideCount <= getProductVisibleCount(slider.carouselEl)) return false;
      if (slider.swiper.animating) return false;
      if (direction < 0) {
        slider.swiper.slidePrev();
      } else {
        slider.swiper.slideNext();
      }
      return true;
    };

    const stopProductCarousels = () => {
      productCarouselsState.forEach((slider) => {
        slider.swiper?.autoplay?.stop();
      });
    };

    const startProductCarousels = () => {
      if (!shouldRunProductCarouselAutoplay()) {
        stopProductCarousels();
        return;
      }

      productCarouselsState.forEach((slider) => {
        if (!slider.swiper || slider.slideCount <= 1 || slider.isPausedByInteraction) return;
        slider.swiper.autoplay?.start();
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
      const name =
        cardEl.querySelector('.product-meta-row h3.card-title')?.textContent?.trim() ?? '';

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
    const PRODUCT_MODAL_TRANSITION_MS = 360;

    const getProductModalPanBounds = () => {
      if (!productFullscreenMediaEl) return { maxX: 0, maxY: 0 };
      const mediaRect = productFullscreenMediaEl.getBoundingClientRect();
      const maxX = Math.max((mediaRect.width * PRODUCT_MODAL_ZOOM_SCALE - mediaRect.width) / 2, 0);
      const maxY = Math.max(
        (mediaRect.height * PRODUCT_MODAL_ZOOM_SCALE - mediaRect.height) / 2,
        0
      );
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
        productFullscreenZoomEl.setAttribute(
          'aria-pressed',
          productModalImageZoomed ? 'true' : 'false'
        );
        productFullscreenZoomEl.setAttribute(
          'aria-label',
          productModalImageZoomed ? 'Uzaklaştır' : 'Yakınlaştır'
        );
        productFullscreenZoomEl.setAttribute(
          'title',
          productModalImageZoomed ? 'Uzaklaştır' : 'Yakınlaştır'
        );
        const zoomIconEl = productFullscreenZoomEl.querySelector('svg');
        if (zoomIconEl) {
          zoomIconEl.innerHTML = productModalImageZoomed
            ? '<circle class="control-icon-disc" cx="28" cy="28" r="26" /><g class="control-icon-mark" transform="translate(16 16)"><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /><path d="M7 10h6" /></g>'
            : '<circle class="control-icon-disc" cx="28" cy="28" r="26" /><g class="control-icon-mark" transform="translate(16 16)"><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /><path d="M10 7v6" /><path d="M7 10h6" /></g>';
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
      productFullscreenModalEl?.classList.toggle(
        'is-native-fullscreen',
        productModalNativeFullscreen
      );
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
      const shareText = encodeURIComponent(
        `${currentProductPreviewData.name || 'Ürün'} ${shareUrl}`
      );
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
      const carouselEl = cardEl.closest('.product-carousel');
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
      }, PRODUCT_MODAL_TRANSITION_MS);
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
          syncProductCardInteractivity();
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
          }, PRODUCT_MODAL_TRANSITION_MS);
          return;
        }
      }

      allowImmediateModalHide = false;
      window.requestAnimationFrame(() => {
        syncProductCarouselLayout();
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
      handleProductCardOpen(event, cardEl);
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
      if (
        targetEl.closest('.product-fullscreen-share') ||
        targetEl.closest('.product-fullscreen-share-cluster')
      ) {
        return;
      }
      if (targetEl.closest('.product-fullscreen-dismiss')) {
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
    syncProductCarouselLayout();
    productCarouselsState.forEach((slider) => {
      bindProductCarouselSwipe(slider);
      bindProductCarouselTouchGuard(slider);
      bindProductCarouselAccessibility(slider);
    });
    observeProductSectionImagePriming();
    if (productCarouselsState.length) {
      window.requestAnimationFrame(() => {
        syncProductCarouselLayout();
        syncProductCardInteractivity();
        startProductCarousels();
      });

      window.addEventListener(
        'load',
        () => {
          syncProductCarouselLayout();
          syncProductCardInteractivity();
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

    function performScrollEffects() {
      lastScrollY = window.scrollY;
      updateActiveSection();
      updateStatsTitleReveal();
      updateGhostHeadingPosition();
      updateSectionOrbParallax();
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
      scheduleTitleCircleAlignment();
      syncProductCarouselLayout();
      syncProductCardInteractivity();
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
    let userInteractedBeforeInitialHashAlign = false;
    let userInteractionVersion = 0;
    let navAnchorSettleToken = 0;
    const markUserInteractedBeforeInitialHashAlign = () => {
      userInteractedBeforeInitialHashAlign = true;
      userInteractionVersion += 1;
    };
    const cancelAnchorSettleForUserInput = () => {
      markUserInteractedBeforeInitialHashAlign();
      navAnchorSettleToken += 1;
    };
    window.addEventListener('touchstart', cancelAnchorSettleForUserInput, {
      passive: true,
      once: true
    });
    window.addEventListener('touchmove', cancelAnchorSettleForUserInput, {
      passive: true,
      once: true
    });
    window.addEventListener('wheel', cancelAnchorSettleForUserInput, {
      passive: true,
      once: true
    });
    window.addEventListener('pointerdown', cancelAnchorSettleForUserInput, {
      passive: true,
      once: true
    });
    window.addEventListener('keydown', cancelAnchorSettleForUserInput, {
      once: true
    });
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 2) {
          markUserInteractedBeforeInitialHashAlign();
        }
      },
      { passive: true, once: true }
    );
    const alignAnchorTarget = (target, isHomeTarget) => {
      if (!target) return true;
      refreshCollapsedNavOffset();
      syncNavOffset();
      const desiredTop = isHomeTarget
        ? 0
        : Math.max(Math.round(getDocumentTop(target) - getNavOffset()), 0);
      const delta = desiredTop - window.scrollY;
      if (Math.abs(delta) <= 1) return true;
      if (lenis?.scrollTo) {
        lenis.scrollTo(desiredTop, {
          immediate: true,
          force: true
        });
      } else {
        window.scrollTo({
          top: desiredTop,
          behavior: 'auto'
        });
      }
      return false;
    };
    const scheduleAnchorSettle = ({
      target,
      isHomeTarget,
      isMobileNavInteraction,
      durationSeconds
    }) => {
      const token = ++navAnchorSettleToken;
      const startDelayMs = Math.max(Math.round(durationSeconds * 1000) + 120, 240);
      const maxChecks = isMobileNavInteraction ? 14 : 10;
      let checks = 0;
      const runCheck = () => {
        if (token !== navAnchorSettleToken) return;
        checks += 1;
        const settled = alignAnchorTarget(target, isHomeTarget);
        updateActiveSection();
        if (settled && checks >= 2) return;
        if (checks >= maxChecks) return;
        window.setTimeout(runCheck, isMobileNavInteraction ? 110 : 90);
      };
      window.setTimeout(runCheck, startDelayMs);
    };
    clickableNavAnchors.forEach((anchor) => {
      anchor.addEventListener('click', async (event) => {
        const currentAnchor = event.currentTarget;
        if (!(currentAnchor instanceof HTMLAnchorElement)) return;

        const href = currentAnchor.getAttribute('href');
        if (!href || href.length < 2) return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        navAnchorSettleToken += 1;
        syncNavOffset();
        const isHomeTarget = href === '#anasayfa';
        const getLiveNavOffset = () =>
          Math.max(Math.round(navbarEl?.getBoundingClientRect().height || 0), 0);
        const targetViewportTop = isHomeTarget ? 0 : target.getBoundingClientRect().top;
        const currentVisibleNavOffset = getLiveNavOffset();
        const isCurrentTargetAligned = isHomeTarget
          ? Math.abs(window.scrollY) <= 6
          : Math.abs(targetViewportTop - currentVisibleNavOffset) <= 6;
        const isCurrentLinkActive =
          currentAnchor.classList.contains('is-active') || href === activeSectionHash;

        if (isCurrentLinkActive && isCurrentTargetAligned) {
          await closeNavMenuIfNeeded();
          return;
        }

        const isMobileNavInteraction = isMobileViewport();
        if (currentAnchor instanceof HTMLElement) {
          currentAnchor.blur();
        }

        const navClosePromise = closeNavMenuIfNeeded();
        refreshCollapsedNavOffset();
        syncNavOffset();
        const focusedEl = document.activeElement;
        if (focusedEl instanceof HTMLElement && navCollapseEl?.contains(focusedEl)) {
          focusedEl.blur();
        }

        const resolveTargetTop = () => {
          if (isHomeTarget) return 0;
          const targetDocumentTop = getDocumentTop(target);
          const targetOffset = getNavOffset();
          return Math.max(Math.round(targetDocumentTop - targetOffset), 0);
        };
        const nextTop = resolveTargetTop();

        activeSectionHash = href;
        setActiveNavLink(href);
        const duration = isMobileNavInteraction ? 1 : 1.05;
        if (lenis?.scrollTo) {
          lenis.scrollTo(nextTop, {
            duration,
            easing: (t) => 1 - Math.pow(1 - t, 3.2),
            force: true,
            immediate: false
          });
        } else {
          window.scrollTo({
            top: nextTop,
            behavior: 'smooth'
          });
        }
        window.history.replaceState(null, '', href);
        scheduleAnchorSettle({
          target,
          isHomeTarget,
          isMobileNavInteraction,
          durationSeconds: duration
        });
        navClosePromise.catch(() => {});
      });
    });
    const alignFromCurrentHash = async () => {
      const hash = window.location.hash;
      if (!hash || hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      const interactionVersionAtStart = userInteractionVersion;
      const scrollYAtStart = window.scrollY;
      const didScrollSinceStart = () => Math.abs(window.scrollY - scrollYAtStart) > 8;
      const isHomeTarget = hash === '#anasayfa';
      const isMobileNavInteraction = isMobileViewport();
      await closeNavMenuIfNeeded();
      if (didScrollSinceStart()) return;
      if (interactionVersionAtStart !== userInteractionVersion) return;
      refreshCollapsedNavOffset();
      syncNavOffset();
      if (isMobileNavInteraction) {
        await waitForStableNavbar();
        if (didScrollSinceStart()) return;
        if (interactionVersionAtStart !== userInteractionVersion) return;
      }
      await waitForPrecedingMediaStability(target);
      if (didScrollSinceStart()) return;
      if (interactionVersionAtStart !== userInteractionVersion) return;
      await waitForLayoutStability(target);
      if (didScrollSinceStart()) return;
      if (interactionVersionAtStart !== userInteractionVersion) return;
      const nextTop = isHomeTarget
        ? 0
        : Math.max(Math.round(getDocumentTop(target) - getNavOffset()), 0);
      const duration = isMobileNavInteraction ? 1 : 1.05;
      if (lenis?.scrollTo) {
        lenis.scrollTo(nextTop, {
          duration,
          easing: (t) => 1 - Math.pow(1 - t, 3.2),
          force: true,
          immediate: false
        });
      } else {
        window.scrollTo({
          top: nextTop,
          behavior: 'smooth'
        });
      }
      activeSectionHash = hash;
      setActiveNavLink(hash);
      scheduleAnchorSettle({
        target,
        isHomeTarget,
        isMobileNavInteraction,
        durationSeconds: duration
      });
    };
    window.addEventListener('hashchange', () => {
      alignFromCurrentHash().catch(() => {});
    });
    window.addEventListener(
      'load',
      () => {
        const hash = window.location.hash;
        if (!hash || hash === '#anasayfa') return;
        if (userInteractedBeforeInitialHashAlign) return;
        if (window.scrollY > 2) return;
        alignFromCurrentHash().catch(() => {});
      },
      { once: true }
    );

    navCollapseEl?.addEventListener('hidden.bs.collapse', () => {
      refreshCollapsedNavOffset();
      updateActiveSection();
    });
  });
})();
