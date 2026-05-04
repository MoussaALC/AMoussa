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
    // Contenu par défaut pour les 7 semaines
    const defaultWeeks = [
      "Découverte du service informatique, prise en main du parc et des équipements.",
      "Assistance utilisateurs : résolution de tickets (imprimantes, réseau, logiciels).",
      "Installation et configuration de postes (Windows/Linux).",
      "Inventaire du réseau : adressage IP, switchs, points d'accès.",
      "Mise en place de sauvegardes et vérification des procédures.",
      "Gestion des comptes utilisateurs et droits d'accès.",
      "Bilan du stage, rédaction du rapport, préparation soutenance."
    ];

    // Charger ou initialiser les données
    let savedWeeks = localStorage.getItem('stage_weeks');
    let weeksData = savedWeeks ? JSON.parse(savedWeeks) : [...defaultWeeks];

    // Sauvegarder dans localStorage
    function saveWeeks() {
      localStorage.setItem('stage_weeks', JSON.stringify(weeksData));
    }

    // Afficher les 7 cartes
    function renderWeeks() {
      weeksContainer.innerHTML = '';

      for (let i = 0; i < weeksData.length; i++) {
        const weekNum = i + 1;
        const card = document.createElement('div');
        card.className = 'week-card';

        card.innerHTML = `
          <div class="week-num">Semaine ${weekNum}</div>
          <div class="week-content" data-week="${i}">${escapeHtml(weeksData[i])}</div>
          <button class="edit-week-btn" data-week="${i}" style="margin-top: 0.8rem; background: none; border: 1px solid var(--gris-clair); padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.7rem; cursor: pointer;">✏️ Modifier</button>
          <button class="save-week-btn" data-week="${i}" style="margin-top: 0.8rem; margin-left: 0.5rem; background: var(--bleu-doux); color: white; border: none; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.7rem; cursor: pointer;">💾 Sauvegarder</button>
        `;

        weeksContainer.appendChild(card);
      }

      // Ajouter les événements
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
            weeksData[weekIndex] = newText;
            contentDiv.innerHTML = escapeHtml(newText);
            saveWeeks();

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
            weeksData[weekIndex] = contentDiv.innerText;
            saveWeeks();
            btn.innerHTML = '✅ Sauvegardé !';
            setTimeout(() => {
              btn.innerHTML = '💾 Sauvegarder';
            }, 1500);
          }
        });
      });
    }

    function escapeHtml(str) {
      return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
      });
    }

    renderWeeks();
  }

});
