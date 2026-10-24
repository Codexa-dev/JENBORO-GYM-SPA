(function () {
  var $ = function (s) { return document.querySelector(s); };

  // Mobile menu
  var burger = $('#burger'), nav = $('#nav');
  function menu(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  burger.addEventListener('click', function () { menu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') menu(false); });

  // Reveal on scroll
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  // Back to top + footer year
  var top = $('#top');
  window.addEventListener('scroll', function () { top.classList.toggle('on', window.scrollY > 600); }, { passive: true });
  top.addEventListener('click', function () { window.scrollTo({ top: 0 }); });
  $('#yr').textContent = new Date().getFullYear();

  if ($('#lb')) {
  // Lightbox
  var lb = $('#lb'), lbimg = $('#lbimg'), imgs = Array.prototype.slice.call(document.querySelectorAll('.g img')), cur = 0, opener = null;
  function show(i) {
    cur = (i + imgs.length) % imgs.length;
    lbimg.src = imgs[cur].src;
    lbimg.alt = imgs[cur].alt;
  }
  function openLb(i, btn) { opener = btn; show(i); lb.hidden = false; lb.querySelector('.lc').focus(); }
  function closeLb() { lb.hidden = true; if (opener) opener.focus(); }
  imgs.forEach(function (im, i) { im.parentNode.addEventListener('click', function () { openLb(i, this); }); });
  lb.addEventListener('click', function (e) {
    var a = e.target.dataset.a;
    if (a === 'close' || e.target === lb) closeLb();
    else if (a === 'prev') show(cur - 1);
    else if (a === 'next') show(cur + 1);
  });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });

  }

  if ($('#form')) {
  // Contact form: validates, then opens the visitor's email app.
  // No submission service is connected, so nothing is sent from this page.
  var form = $('#form'), status = $('#status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, bad = [];
    ['name', 'phone', 'message'].forEach(function (n) {
      var ok = f[n].value.trim().length > 1;
      f[n].classList.toggle('bad', !ok);
      if (!ok) bad.push(f[n].labels[0].firstChild.textContent.replace(' *', ''));
    });
    if (f.email.value && !/^\S+@\S+\.\S+$/.test(f.email.value)) { bad.push('a valid Email Address'); f.email.classList.add('bad'); } else f.email.classList.remove('bad');
    if (bad.length) {
      status.className = 'err';
      status.textContent = 'Please complete: ' + bad.join(', ') + '.';
      return;
    }
    var body = 'Name: ' + f.name.value + '\nPhone: ' + f.phone.value + '\nEmail: ' + f.email.value + '\nService: ' + f.service.value + '\n\n' + f.message.value;
    status.className = 'ok';
    status.textContent = 'Your email app should open with your inquiry ready to send. This website has no online submission service connected yet, so nothing is sent until you send that email. You can also call +251 947 999 933.';
    window.location.href = 'mailto:jenborogymandspa@gmail.com?subject=' + encodeURIComponent('Website inquiry: ' + f.service.value) + '&body=' + encodeURIComponent(body);
  });
  }
})();
