// =================================================================
//  1. إعدادات تتبع إعلانات جوجل (Google Ads Tracking Settings)
// =================================================================

// ضع معرف إعلانات جوجل الخاص بك هنا بين علامتي الاقتباس (مثال: 'AW-17945698650')
const G_ID = 'AW-18128423919'; 

// ضع تسميات التحويل (Conversion Labels) الخاصة بحسابك هنا بين علامتي الاقتباس:
const CALL_LABEL = 'I6DECKKErc8cEO-Xp8RD'; // ملصق التحويل عند النقر على أزرار الاتصال الهاتفي
const WA_LABEL   = 'fAtpCMjkr88cEO-Xp8RD'; // ملصق التحويل عند النقر على أزرار تواصل واتساب المباشرة
const FORM_LABEL = 'zzIbCOX-hs8cEO-Xp8RD'; // ملصق التحويل عند ملء نموذج المعاينة وإرساله بنجاح


// =================================================================
//  2. تحميل وتهيئة كود جوجل تلقائياً لجميع الصفحات (Dynamic Init)
// =================================================================
if (G_ID) {
  const gTagScript = document.createElement('script');
  gTagScript.async = true;
  gTagScript.src = `https://www.googletagmanager.com/gtag/js?id=${G_ID}`;
  document.head.appendChild(gTagScript);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  
  gtag('js', new Date());
  gtag('config', G_ID);
}

function trackGoogleConversion(label, value = 1.0, currency = 'SAR') {
  if (typeof gtag === 'function' && G_ID && label) {
    gtag('event', 'conversion', {
      'send_to': `${G_ID}/${label}`,
      'value': value,
      'currency': currency
    });
  }
}

// =================================================================
//  3. رصد نقرات الاتصال والواتساب للرقم الإعلاني وتجاهل رقم المطور
// =================================================================
document.addEventListener('click', function(e) {
  const anchor = e.target.closest('a');
  if (!anchor) return;
  const href = anchor.getAttribute('href') || '';
  
  if (href.startsWith('tel:') && href.includes('0508930525')) {
    trackGoogleConversion(CALL_LABEL, 50.0);
  }
  
  if ((href.includes('wa.me') || href.includes('whatsapp')) && href.includes('0508930525')) {
    trackGoogleConversion(WA_LABEL, 40.0);
  }
}, true);

// =================================================================
//  4. رصد وإرسال نموذج البيانات وتحويل العميل للواتساب (Lead Form Submit)
// =================================================================
document.addEventListener('submit', function(e) {
  const leadForm = e.target.closest('#leadForm');
  if (!leadForm) return;
  
  e.preventDefault();
  
  const name = document.getElementById('clientName').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const district = document.getElementById('clientDistrict').value.trim();
  const service = document.getElementById('serviceType').value;
  
  trackGoogleConversion(FORM_LABEL, 60.0);
  
  const message = `مرحباً، أود طلب معاينة مجانية وتسعير من خلال الموقع الإلكتروني:\n\n` +
                  `👤 *الاسم الكريم:* ${name}\n` +
                  `📱 *رقم الجوال:* ${phone}\n` +
                  `📍 *الحي بالرياض:* ${district}\n` +
                  `🏗️ *الخدمة المطلوبة:* ${service}`;
  
  const whatsappUrl = `https://wa.me/966508930525?text=${encodeURIComponent(message)}`;
  
  setTimeout(() => {
    window.location.href = whatsappUrl;
  }, 300);
});

// =================================================================
//  5. التفاعل البرمجي (القائمة المنسدلة، شريط الإعلانات، التمرير)
// =================================================================
(function() {
  const nav = document.getElementById('nav');
  const scrollBtn = document.getElementById('scrollBtn');

  // رصد التمرير لتغيير شكل الهيدر وإظهار زر الصعود للأعلى
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (nav) {
      nav.classList.toggle('scrolled', y > 80);
    }
    if (scrollBtn) {
      scrollBtn.classList.toggle('show', y > 500);
    }
  });

  // تفعيل وإغلاق القائمة المنسدلة للخدمات بالضغط (Click Dropdown)
  const dropdown = document.querySelector('.dropdown');
  const dropbtn = document.querySelector('.dropbtn');

  if (dropdown && dropbtn) {
    dropbtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });

    // إغلاق المنيو المنسدل عند الضغط في أي مكان خارجي
    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  }

  // التحكم بظهور حركات الانتقال التدريجية (Intersection Observer)
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('vis'), i * 110);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  
  document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => io.observe(el));
})();

// إغلاق شريط الإعلانات الترويجي العلوي
function closePromo() {
  const promoBar = document.getElementById('promoBar');
  const nav = document.getElementById('nav');
  if (promoBar) promoBar.style.display = 'none';
  if (nav) nav.style.top = '0';
  document.body.classList.add('promo-hidden');
}

// التحكم بفتح وإغلاق قائمة الموبايل الجانبية
function toggleMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) mobileMenu.classList.toggle('open');
}

function closeMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) mobileMenu.classList.remove('open');
}
