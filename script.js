// ============ AU CHARGEMENT DE LA PAGE ============
document.addEventListener('DOMContentLoaded', function() {

  // ---------- NAVIGATION : BURGER MOBILE ----------
  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('.nav-links');

  if (burger) {
    burger.addEventListener('click', function() {
      navLinks.classList.toggle('open');
    });
  }

  // ---------- FERMER LE MENU AU CLIC SUR UN LIEN ----------
  const allNavLinks = document.querySelectorAll('.nav-links a');
  allNavLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      if (navLinks) navLinks.classList.remove('open');
    });
  });

  // ---------- NAVIGATION : ACTIVE LINK AU SCROLL ----------
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(function(section) {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(function(item) {
      item.classList.remove('active');
      const href = item.getAttribute('href').substring(1);
      if (href === current) {
        item.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

  // ---------- SCROLL NAVBAR : AJOUTER UNE OMBRE ----------
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ---------- SMOOTH SCROLL POUR LES ANCRES ----------
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---------- ANIMATION DES BARRES DE COMPÉTENCES ----------
  const skillBars = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(function(bar) {
    observer.observe(bar);
  });

  // ---------- APPARITION DES CARTES AU SCROLL ----------
  const cards = document.querySelectorAll('.card, .veille-card, .certif-card');

  const cardObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(function(card) {
    cardObserver.observe(card);
  });

  // ---------- FORMULAIRE DE CONTACT ----------
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showFeedback('Merci de remplir tous les champs.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showFeedback('Adresse email invalide.', 'error');
        return;
      }

      const btn = form.querySelector('.submit-btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Envoi...';
      btn.disabled = true;

      // Simulation d'envoi (pas de vrai backend ici)
      setTimeout(function() {
        showFeedback('✅ Message envoyé ! Je vous répondrai rapidement.', 'success');
        form.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 1000);
    });
  }

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.style.color = type === 'success' ? '#5a8f6c' : '#d9534f';
    setTimeout(function() {
      feedback.textContent = '';
    }, 4000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ---------- GESTION DES 7 SEMAINES DE STAGE (LOCALSTORAGE) ----------
  const weeksContainer = document.getElementById('weeks-container');

  if (weeksContainer) {

    function escapeHtml(str) {
      return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
      });
    }

    // Si l'utilisateur a déjà sauvegardé des modifications, on les applique
    // par-dessus le contenu déjà écrit dans index.html (on n'écrase rien d'autre)
    const savedWeeks = localStorage.getItem('stage_weeks');
    if (savedWeeks) {
      try {
        const weeksData = JSON.parse(savedWeeks);
        document.querySelectorAll('.week-content').forEach(function(contentDiv) {
          const idx = contentDiv.dataset.week;
          if (weeksData[idx] !== undefined) {
            contentDiv.innerHTML = escapeHtml(weeksData[idx]);
          }
        });
      } catch (e) {
        // Données locales corrompues : on ignore et on garde le contenu du HTML
      }
    }

    // Sauvegarder l'état actuel de toutes les semaines dans localStorage
    function saveAllWeeks() {
      const weeksData = {};
      document.querySelectorAll('.week-content').forEach(function(contentDiv) {
        weeksData[contentDiv.dataset.week] = contentDiv.innerText;
      });
      localStorage.setItem('stage_weeks', JSON.stringify(weeksData));
    }

    // Activer les boutons Modifier/Sauvegarder déjà présents dans le HTML
    document.querySelectorAll('.edit-week-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const weekIndex = this.dataset.week;
        const contentDiv = document.querySelector(`.week-content[data-week="${weekIndex}"]`);
        const currentText = contentDiv.innerText;

        const textarea = document.createElement('textarea');
        textarea.value = currentText;
        textarea.style.width = '100%';
        textarea.style.padding = '0.4rem';
        textarea.style.marginTop = '0.5rem';
        textarea.style.border = '1px solid var(--gris-clair)';
        textarea.style.borderRadius = '8px';
        textarea.rows = 3;

        contentDiv.innerHTML = '';
        contentDiv.appendChild(textarea);
        textarea.focus();

        // Remplacer le bouton modifier par annuler temporairement
        btn.textContent = '❌ Annuler';
        btn.onclick = () => {
          contentDiv.innerHTML = escapeHtml(currentText);
          btn.textContent = '✏️ Modifier';
          btn.onclick = arguments.callee;
        };
      });
    });

    document.querySelectorAll('.save-week-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const weekIndex = this.dataset.week;
        const contentDiv = document.querySelector(`.week-content[data-week="${weekIndex}"]`);
        const textarea = contentDiv.querySelector('textarea');

        if (textarea) {
          const newText = textarea.value;
          contentDiv.innerHTML = escapeHtml(newText);
          saveAllWeeks();

          // Remettre le bouton modifier à l'état normal
          const editBtn = document.querySelector(`.edit-week-btn[data-week="${weekIndex}"]`);
          if (editBtn) {
            editBtn.textContent = '✏️ Modifier';
          }

          // Petit message visuel
          const originalText = btn.innerHTML;
          btn.innerHTML = '✅ Sauvegardé !';
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 1500);
        } else {
          // Si pas de textarea, on sauvegarde le texte actuel
          saveAllWeeks();
          btn.innerHTML = '✅ Sauvegardé !';
          setTimeout(() => {
            btn.innerHTML = '💾 Sauvegarder';
          }, 1500);
        }
      });
    });
  }

});
