// VARIABLES GLOBALES
let currentSlide = 0;
let slideInterval;
let reviews = [];
let isAutoSlide = true;
let notificationQueue = [];
// INITIALISATION
document.addEventListener('DOMContentLoaded', function() {
    console.log('Auto Moto Luxe Location - Initialisation...');
    
    // Initialiser les composants
    initNavigation();
    initSlider();
    initAccountModal();
    initReviewsSystem();
    initSmoothScroll();
    initImageLoading();
    initAnimations();
    
    // Afficher un message de bienvenue
    setTimeout(() => {
        const hour = new Date().getHours();
        let greeting = 'Bienvenue';
        if (hour < 12) greeting = 'Bonjour';
        else if (hour < 18) greeting = 'Bon après-midi';
        else greeting = 'Bonsoir';
        
        showNotification(`${greeting} sur Auto Moto Luxe Location ! `, 'info');
    }, 1500);
    
    // Initialiser le parallaxe du header
    initParallax();
});
// NAVIGATION
function initNavigation() {
    // Navigation sticky
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.sticky-nav');
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    });
    
    // Menu mobile
    initMobileMenu();
    
    // Logo cliquable pour retour à l'accueil
    const navLogo = document.querySelector('.nav-logo');
    if (navLogo) {
        navLogo.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // Fermer le menu mobile s'il est ouvert
            const navMenu = document.getElementById('navMenu');
            if (navMenu && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                if (mobileMenuBtn) {
                    mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                    mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            }
            showNotification('Retour à l\'accueil', 'info');
        });
        
        // Navigation au clavier
        navLogo.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navLogo.click();
            }
        });
    }
}

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
            
            // Ajouter/supprimer l'aria-expanded
            const isExpanded = navMenu.classList.contains('show');
            this.setAttribute('aria-expanded', isExpanded);
            
            // Animation du bouton
            if (navMenu.classList.contains('show')) {
                this.style.transform = 'rotate(90deg)';
            } else {
                this.style.transform = 'rotate(0deg)';
            }
        });
        
        // Fermer le menu en cliquant sur un lien
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.style.transform = 'rotate(0deg)';
            });
        });
        
        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navMenu.classList.remove('show');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.style.transform = 'rotate(0deg)';
            }
        });
        
        // Fermer avec la touche Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.style.transform = 'rotate(0deg)';
            }
        });
    }
}
// SLIDER HERO
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const slider = document.getElementById('heroSlider');
    
    if (slides.length === 0) return;
    
    function showSlide(index) {
        // Masquer toutes les slides
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
        });
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Afficher la slide active
        currentSlide = (index + slides.length) % slides.length;
        
        // Animation de transition
        slides[currentSlide].style.opacity = '0';
        slides[currentSlide].classList.add('active');
        
        // Animation d'entrée
        setTimeout(() => {
            slides[currentSlide].style.opacity = '1';
        }, 50);
        
        dots[currentSlide].classList.add('active');
        
        // Mettre à jour l'aria-label
        dots.forEach((dot, i) => {
            dot.setAttribute('aria-label', `Aller au slide ${i + 1}`);
        });
        dots[currentSlide].setAttribute('aria-current', 'true');
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    function startAutoSlide() {
        if (slideInterval) clearInterval(slideInterval);
        if (isAutoSlide) {
            slideInterval = setInterval(nextSlide, 6000);
        }
    }
    
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    // Événements pour les boutons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
        
        // Navigation au clavier
        prevBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                prevBtn.click();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
        
        nextBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                nextBtn.click();
            }
        });
    }
    
    // Événements pour les dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
        });
        
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dot.click();
            }
        });
    });
    
    // Pause au survol
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
        slider.addEventListener('focusin', stopAutoSlide);
        slider.addEventListener('focusout', startAutoSlide);
    }
    
    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        } else if (e.key === 'ArrowRight') {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        }
    });
    
    // Démarrer le slider automatique
    startAutoSlide();
}
// MODAL DE COMPTE
function initAccountModal() {
    const accountBtn = document.getElementById('accountBtn');
    const accountModal = document.getElementById('accountModal');
    
    if (accountBtn && accountModal) {
        accountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginForm();
        });
        
        accountBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                accountBtn.click();
            }
        });
    }
    
    // Fermer avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAccountModal();
        }
    });
    
    // Fermer en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
        if (accountModal && accountModal.classList.contains('show') && 
            !e.target.closest('.account-content') && 
            !e.target.closest('#accountBtn')) {
            closeAccountModal();
        }
    });
}

function showLoginForm() {
    const accountModal = document.getElementById('accountModal');
    if (!accountModal) return;
    
    accountModal.innerHTML = `
        <div class="account-content">
            <div class="account-header">
                <div class="account-logo">
                    <i class="fas fa-sign-in-alt"></i>
                </div>
                <h3>Connexion</h3>
                <p>Accédez à votre compte</p>
                <button class="close-account" onclick="closeAccountModal()" aria-label="Fermer">&times;</button>
            </div>
            
            <form class="account-form" id="loginForm">
                <div class="form-group">
                    <label for="loginEmail">Adresse email *</label>
                    <div class="input-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <input type="email" id="loginEmail" placeholder="votre@email.com" required aria-required="true">
                </div>
                
                <div class="form-group">
                    <label for="loginPassword">Mot de passe *</label>
                    <div class="input-icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <input type="password" id="loginPassword" placeholder="••••••••" required aria-required="true">
                    <div class="password-toggle" id="toggleLoginPassword" role="button" tabindex="0" aria-label="Afficher/masquer le mot de passe">
                        <i class="fas fa-eye"></i>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-sign-in-alt"></i>
                        Se connecter
                    </button>
                </div>
            </form>
            
            <div class="account-footer">
                <p>Pas encore membre ? <a href="#" onclick="showRegistrationForm()" id="registerLink">Créer un compte</a></p>
                <p class="forgot-password"><a href="#" onclick="showForgotPassword()">Mot de passe oublié ?</a></p>
            </div>
        </div>
    `;
    
    accountModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Initialiser les événements
    initLoginForm();
    
    // Focus sur le premier champ
    setTimeout(() => {
        const emailInput = document.getElementById('loginEmail');
        if (emailInput) emailInput.focus();
    }, 100);
}

function showRegistrationForm() {
    const accountModal = document.getElementById('accountModal');
    if (!accountModal) return;
    
    accountModal.innerHTML = `
        <div class="account-content">
            <div class="account-header">
                <div class="account-logo">
                    <i class="fas fa-user-plus"></i>
                </div>
                <h3>Créer un compte</h3>
                <p>Rejoignez notre communauté</p>
                <button class="close-account" onclick="closeAccountModal()" aria-label="Fermer">&times;</button>
            </div>
            
            <form class="account-form" id="registrationForm">
                <div class="form-group">
                    <label for="regName">Nom complet *</label>
                    <div class="input-icon">
                        <i class="fas fa-user"></i>
                    </div>
                    <input type="text" id="regName" placeholder="Votre nom complet" required aria-required="true">
                </div>
                
                <div class="form-group">
                    <label for="regEmail">Adresse email *</label>
                    <div class="input-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <input type="email" id="regEmail" placeholder="votre@email.com" required aria-required="true">
                </div>
                
                <div class="form-group">
                    <label for="regPassword">Mot de passe *</label>
                    <div class="input-icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <input type="password" id="regPassword" placeholder="••••••••" required aria-required="true">
                    <div class="password-toggle" id="toggleRegPassword" role="button" tabindex="0" aria-label="Afficher/masquer le mot de passe">
                        <i class="fas fa-eye"></i>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="regConfirmPassword">Confirmer le mot de passe *</label>
                    <div class="input-icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <input type="password" id="regConfirmPassword" placeholder="••••••••" required aria-required="true">
                    <div class="password-toggle" id="toggleRegConfirmPassword" role="button" tabindex="0" aria-label="Afficher/masquer le mot de passe">
                        <i class="fas fa-eye"></i>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-user-plus"></i>
                        Créer mon compte
                    </button>
                </div>
            </form>
            
            <div class="account-footer">
                <p>Déjà membre ? <a href="#" onclick="showLoginForm()" id="loginLink">Se connecter</a></p>
            </div>
        </div>
    `;
    
    // Focus sur le premier champ
    setTimeout(() => {
        const nameInput = document.getElementById('regName');
        if (nameInput) nameInput.focus();
    }, 100);
    
    // Événements
    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            
            // Validation
            if (password !== confirmPassword) {
                showNotification('Les mots de passe ne correspondent pas', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Le mot de passe doit contenir au moins 6 caractères', 'error');
                return;
            }
            
            // Simulation de création de compte
            const userData = {
                name: name,
                email: email,
                date: new Date().toISOString()
            };
            
            localStorage.setItem('aml_user', JSON.stringify(userData));
            localStorage.setItem('aml_user_email', email);
            
            showNotification(`Bienvenue ${name} ! Votre compte a été créé avec succès.`, 'success');
            closeAccountModal();
            
            // Mettre à jour le bouton de compte
            updateAccountButton();
        });
    }
    
    // Initialiser les toggles de mot de passe
    initPasswordToggles();
}

function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            // Simulation de connexion
            const savedEmail = localStorage.getItem('aml_user_email');
            
            if (savedEmail && savedEmail === email) {
                localStorage.setItem('aml_logged_in', 'true');
                showNotification(`Bienvenue de retour !`, 'success');
                closeAccountModal();
                updateAccountButton();
            } else {
                // Première connexion ou email non reconnu
                localStorage.setItem('aml_logged_in', 'true');
                localStorage.setItem('aml_user_email', email);
                showNotification(`Bienvenue ${email.split('@')[0]} !`, 'success');
                closeAccountModal();
                updateAccountButton();
            }
        });
    }
    
    // Toggle mot de passe
    const toggleBtn = document.getElementById('toggleLoginPassword');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const passwordInput = document.getElementById('loginPassword');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.setAttribute('aria-label', 'Masquer le mot de passe');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.setAttribute('aria-label', 'Afficher le mot de passe');
            }
        });
        
        toggleBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleBtn.click();
            }
        });
    }
    
    // Lien vers l'inscription
    const registerLink = document.getElementById('registerLink');
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            showRegistrationForm();
        });
    }
}

function initPasswordToggles() {
    // Toggle pour le mot de passe d'inscription
    const toggleRegBtn = document.getElementById('toggleRegPassword');
    if (toggleRegBtn) {
        toggleRegBtn.addEventListener('click', function() {
            const passwordInput = document.getElementById('regPassword');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.setAttribute('aria-label', 'Masquer le mot de passe');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.setAttribute('aria-label', 'Afficher le mot de passe');
            }
        });
    }
    
    // Toggle pour la confirmation du mot de passe
    const toggleRegConfirmBtn = document.getElementById('toggleRegConfirmPassword');
    if (toggleRegConfirmBtn) {
        toggleRegConfirmBtn.addEventListener('click', function() {
            const passwordInput = document.getElementById('regConfirmPassword');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.setAttribute('aria-label', 'Masquer le mot de passe');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.setAttribute('aria-label', 'Afficher le mot de passe');
            }
        });
    }
}

function showForgotPassword() {
    const accountModal = document.getElementById('accountModal');
    if (!accountModal) return;
    
    accountModal.innerHTML = `
        <div class="account-content">
            <div class="account-header">
                <div class="account-logo">
                    <i class="fas fa-key"></i>
                </div>
                <h3>Mot de passe oublié</h3>
                <p>Nous vous enverrons un lien de réinitialisation</p>
                <button class="close-account" onclick="closeAccountModal()" aria-label="Fermer">&times;</button>
            </div>
            
            <form class="account-form" id="forgotPasswordForm">
                <div class="form-group">
                    <label for="forgotEmail">Adresse email *</label>
                    <div class="input-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <input type="email" id="forgotEmail" placeholder="votre@email.com" required aria-required="true">
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-paper-plane"></i>
                        Envoyer le lien
                    </button>
                </div>
            </form>
            
            <div class="account-footer">
                <p><a href="#" onclick="showLoginForm()"><i class="fas fa-arrow-left"></i> Retour à la connexion</a></p>
            </div>
        </div>
    `;
    
    const form = document.getElementById('forgotPasswordForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('forgotEmail').value.trim();
            
            showNotification(`Un lien de réinitialisation a été envoyé à ${email} (simulation)`, 'success');
            setTimeout(() => {
                showLoginForm();
            }, 2000);
        });
    }
    
    // Focus sur le champ email
    setTimeout(() => {
        const emailInput = document.getElementById('forgotEmail');
        if (emailInput) emailInput.focus();
    }, 100);
}

function updateAccountButton() {
    const accountBtn = document.getElementById('accountBtn');
    const isLoggedIn = localStorage.getItem('aml_logged_in') === 'true';
    const userEmail = localStorage.getItem('aml_user_email');
    
    if (accountBtn) {
        if (isLoggedIn && userEmail) {
            const userName = userEmail.split('@')[0];
            accountBtn.innerHTML = `
                <i class="fas fa-user-check"></i>
                <span>${userName}</span>
            `;
            accountBtn.setAttribute('aria-label', `Compte de ${userName}`);
        } else {
            accountBtn.innerHTML = `
                <i class="fas fa-user"></i>
                <span>Mon Compte</span>
            `;
            accountBtn.setAttribute('aria-label', 'Mon compte');
        }
    }
}

function closeAccountModal() {
    const accountModal = document.getElementById('accountModal');
    if (accountModal) {
        accountModal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Focus retour sur le bouton de compte
        const accountBtn = document.getElementById('accountBtn');
        if (accountBtn) {
            setTimeout(() => accountBtn.focus(), 100);
        }
    }
}
// SYSTÈME D'AVIS
function initReviewsSystem() {
    const reviewForm = document.getElementById('reviewForm');
    
    if (!reviewForm) return;
    
    // Charger les avis depuis localStorage ou utiliser des avis par défaut
    loadReviews();
    
    // Initialiser le système de notation
    initStarRating();
    
    // Gérer la soumission du formulaire
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitReview();
    });
    
    // Initialiser le tri des avis
    initReviewSorting();
}

function loadReviews() {
    const reviewsContainer = document.getElementById('reviewsContainer');
    
    if (!reviewsContainer) return;
    
    // Avis par défaut
    const defaultReviews = [
        {
            id: 1,
            name: 'Youness alami',
            rating: 5,
            text: 'Expérience exceptionnelle ! La Ferrari était en parfait état et le service client impeccable. Je recommande vivement !',
            vehicle: 'Ferrari F8 Tributo',
            date: '15 Novembre 2024'
        },
        {
            id: 2,
            name: 'Maria Morabit',
            rating: 4,
            text: 'Très satisfaite de ma location. La Porsche 911 était magnifique et le processus de location très fluide.',
            vehicle: 'Porsche 911 Turbo S',
            date: '10 Novembre 2025'
        },
        {
            id: 3,
            name: 'Karim Alami',
            rating: 5,
            text: 'Service professionnel et véhicules de qualité. La Ducati Panigale V4 était un rêve devenu réalité !',
            vehicle: 'Ducati Panigale V4',
            date: '5 Novembre 2025'
        },
        {
            id: 4,
            name: 'Sophia Ibrahimi',
            rating: 5,
            text: 'Location parfaite pour notre mariage. La Lamborghini a fait sensation ! Merci pour le service exceptionnel.',
            vehicle: 'Lamborghini Huracán',
            date: '28 Octobre 2023'
        }
    ];
    
    // Charger depuis localStorage ou utiliser les avis par défaut
    const savedReviews = localStorage.getItem('aml_reviews');
    reviews = savedReviews ? JSON.parse(savedReviews) : defaultReviews;
    
    // Afficher les avis
    displayReviews();
}

function displayReviews() {
    const reviewsContainer = document.getElementById('reviewsContainer');
    
    if (!reviewsContainer || reviews.length === 0) {
        reviewsContainer.innerHTML = `
            <div class="no-reviews">
                <i class="fas fa-comment-alt"></i>
                <h4>Soyez le premier à laisser un avis !</h4>
                <p>Votre expérience nous intéresse</p>
            </div>
        `;
        return;
    }
    
    reviewsContainer.innerHTML = reviews.map(review => `
        <div class="review-card" data-rating="${review.rating}" data-date="${review.date}">
            <div class="review-header">
                <div class="review-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="review-info">
                    <h4>${review.name}</h4>
                    <div class="review-stars">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    </div>
                </div>
            </div>
            <p class="review-text">${review.text}</p>
            ${review.vehicle ? `<span class="review-vehicle"><i class="fas fa-car"></i> ${review.vehicle}</span>` : ''}
            <div class="review-footer">
                <span class="review-date">${review.date}</span>
                <span class="review-rating">${review.rating}/5</span>
            </div>
        </div>
    `).join('');
}

function initReviewSorting() {
    const sortSelect = document.getElementById('reviewSort');
    
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        sortReviews(this.value);
    });
}

function sortReviews(criteria) {
    switch(criteria) {
        case 'rating-desc':
            reviews.sort((a, b) => b.rating - a.rating);
            break;
        case 'rating-asc':
            reviews.sort((a, b) => a.rating - b.rating);
            break;
        case 'recent':
        default:
            // Pour les avis par défaut sans date réelle, on garde l'ordre
            reviews.sort((a, b) => b.id - a.id);
    }
    
    displayReviews();
    showNotification(`Avis triés par ${getSortLabel(criteria)}`, 'info');
}

function getSortLabel(criteria) {
    switch(criteria) {
        case 'rating-desc': return 'meilleures notes';
        case 'rating-asc': return 'moins bonnes notes';
        default: return 'plus récents';
    }
}

function submitReview() {
    const nameInput = document.getElementById('reviewName');
    const ratingInput = document.getElementById('rating');
    const textInput = document.getElementById('reviewText');
    const vehicleInput = document.getElementById('reviewVehicle');
    
    if (!nameInput || !ratingInput || !textInput) return;
    
    const name = nameInput.value.trim();
    const rating = parseInt(ratingInput.value);
    const text = textInput.value.trim();
    const vehicle = vehicleInput ? vehicleInput.value.trim() : '';
    
    // Validation
    if (!name || !rating || !text) {
        showNotification('Veuillez remplir tous les champs obligatoires (*)', 'error');
        return;
    }
    
    if (rating < 1 || rating > 5) {
        showNotification('Veuillez sélectionner une note valide', 'error');
        return;
    }
    
    // Créer le nouvel avis
    const newReview = {
        id: Date.now(),
        name: name,
        rating: rating,
        text: text,
        vehicle: vehicle || null,
        date: new Date().toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    };
    
    // Ajouter l'avis à la liste
    reviews.unshift(newReview); // Ajouter au début pour les plus récents
    
    // Limiter à 20 avis maximum
    if (reviews.length > 20) {
        reviews.pop();
    }
    
    // Sauvegarder dans localStorage
    localStorage.setItem('aml_reviews', JSON.stringify(reviews));
    
    // Réafficher les avis
    displayReviews();
    
    // Réinitialiser le formulaire
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) reviewForm.reset();
    
    const stars = document.querySelectorAll('.stars i');
    stars.forEach(star => {
        star.classList.remove('fas', 'active');
        star.classList.add('far');
    });
    
    if (document.getElementById('ratingValue')) {
        document.getElementById('ratingValue').textContent = '0';
    }
    
    if (ratingInput) ratingInput.value = '0';
    
    // Afficher une notification
    showNotification('Merci pour votre avis ! Il a été publié avec succès.', 'success');
    
    // Scroll vers les avis
    const reviewsSection = document.getElementById('reviews');
    if (reviewsSection) {
        reviewsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function initStarRating() {
    const stars = document.querySelectorAll('.stars i');
    const ratingValue = document.getElementById('ratingValue');
    const ratingInput = document.getElementById('rating');
    
    if (!stars.length) return;
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value'));
            updateStarRating(value);
        });
        
        star.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const value = parseInt(this.getAttribute('data-value'));
                updateStarRating(value);
            }
        });
        
        // Effet au survol
        star.addEventListener('mouseover', function() {
            const hoverValue = parseInt(this.getAttribute('data-value'));
            previewStarRating(hoverValue);
        });
    });
    
    // Réinitialiser la prévisualisation quand on quitte
    const starContainer = document.querySelector('.stars');
    if (starContainer) {
        starContainer.addEventListener('mouseleave', function() {
            const currentValue = ratingInput ? parseInt(ratingInput.value) : 0;
            updateStarRating(currentValue, false);
        });
    }
}

function updateStarRating(value, showNotification = true) {
    const stars = document.querySelectorAll('.stars i');
    const ratingValue = document.getElementById('ratingValue');
    const ratingInput = document.getElementById('rating');
    
    // Mettre à jour l'affichage
    stars.forEach((s, index) => {
        if (index < value) {
            s.classList.remove('far');
            s.classList.add('fas', 'active');
        } else {
            s.classList.remove('fas', 'active');
            s.classList.add('far');
        }
    });
    
    // Mettre à jour la valeur
    if (ratingValue) ratingValue.textContent = value;
    if (ratingInput) ratingInput.value = value;
    
    if (showNotification && value > 0) {
        // Afficher un petit feedback
        setTimeout(() => {
            const ratingText = document.querySelector('.rating-text');
            if (ratingText) {
                ratingText.style.color = 'var(--accent)';
                ratingText.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    ratingText.style.color = '';
                    ratingText.style.transform = '';
                }, 300);
            }
        }, 100);
    }
}

function previewStarRating(value) {
    const stars = document.querySelectorAll('.stars i');
    
    stars.forEach((s, index) => {
        if (index < value) {
            s.classList.remove('far');
            s.classList.add('fas', 'preview');
        } else {
            s.classList.remove('fas', 'preview');
            s.classList.add('far');
        }
    });
}

// ====================
// SMOOTH SCROLL
// ====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignorer les liens vides
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            
            const targetId = href;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.sticky-nav').offsetHeight;
                const headerHeight = document.querySelector('.fixed-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - headerHeight + 50;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Mettre à jour l'URL sans rechargement
                history.pushState(null, null, href);
                
                // Fermer le menu mobile si ouvert
                const navMenu = document.getElementById('navMenu');
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                if (navMenu && navMenu.classList.contains('show')) {
                    navMenu.classList.remove('show');
                    if (mobileMenuBtn) {
                        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                        mobileMenuBtn.style.transform = 'rotate(0deg)';
                    }
                }
            }
        });
    });
}

// ====================
// IMAGE LOADING
// ====================
function initImageLoading() {
    // Lazy loading pour les images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Précharger les images du slider
    preloadSliderImages();
}

function preloadSliderImages() {
    const slides = document.querySelectorAll('.slide');
    
    slides.forEach((slide, index) => {
        const bgImage = slide.style.backgroundImage;
        if (bgImage) {
            const url = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
            
            // Créer une image pour précharger
            const img = new Image();
            img.src = url;
            img.onload = () => {
                slide.classList.remove('loading');
                console.log(`Image ${index + 1} préchargée: ${url}`);
            };
            img.onerror = () => {
                console.error(`Impossible de charger l'image: ${url}`);
                slide.classList.remove('loading');
                slide.style.backgroundImage = 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)';
            };
            
            // Ajouter une classe de chargement
            slide.classList.add('loading');
        }
    });
}

// ====================
// ANIMATIONS
// ====================
function initAnimations() {
    // Animation des statistiques
    animateStats();
    
    // Observer pour les animations au scroll
    initScrollAnimations();
}

function animateStats() {
    const statItems = document.querySelectorAll('.stat-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberElement = entry.target.querySelector('.number');
                if (numberElement && !numberElement.classList.contains('animated')) {
                    const finalValue = numberElement.textContent;
                    if (finalValue.includes('+')) {
                        const value = parseInt(finalValue);
                        animateCounter(numberElement, value);
                    }
                    numberElement.classList.add('animated');
                }
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });
    
    statItems.forEach(item => observer.observe(item));
}

function animateCounter(element, finalValue) {
    let current = 0;
    const increment = finalValue / 100;
    const duration = 2000; // 2 secondes
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= finalValue) {
            element.textContent = finalValue + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, stepTime);
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .review-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    animatedElements.forEach(element => observer.observe(element));
}

// ====================
// PARALLAX
// ====================
function initParallax() {
    const header = document.querySelector('.fixed-header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            header.style.transform = `translateY(${rate}px)`;
        });
    }
}

// ====================
// NOTIFICATIONS
// ====================
function showNotification(message, type = 'info') {
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    
    const icons = {
        success: { icon: 'check-circle', color: 'var(--success)' },
        error: { icon: 'exclamation-circle', color: 'var(--error)' },
        warning: { icon: 'exclamation-triangle', color: 'var(--warning)' },
        info: { icon: 'info-circle', color: 'var(--accent)' }
    };
    
    const config = icons[type] || icons.info;
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${config.icon}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close" aria-label="Fermer la notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Style la notification selon le type
    notification.style.borderLeftColor = config.color;
    
    // Ajouter au conteneur
    const container = document.getElementById('notificationContainer') || document.body;
    container.appendChild(notification);
    
    // Afficher la notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Fermer la notification
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeNotification(notification);
        });
        
        closeBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeNotification(notification);
            }
        });
    }
    
    // Retirer automatiquement après 5 secondes
    setTimeout(() => {
        closeNotification(notification);
    }, 4000);
    
    return notification;
}

function closeNotification(notification) {
    if (!notification) return;
    
    notification.classList.remove('show');
    notification.style.transform = 'translateX(120%)';
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 400);
}

// ====================
// FONCTIONS GLOBALES
// ====================
// Exposer les fonctions nécessaires globalement
window.showNotification = showNotification;
window.showLoginForm = showLoginForm;
window.showRegistrationForm = showRegistrationForm;
window.showForgotPassword = showForgotPassword;
window.closeAccountModal = closeAccountModal;
window.updateStarRating = updateStarRating;

// Initialiser le bouton de compte au chargement
window.addEventListener('load', () => {
    updateAccountButton();
});

// ====================
// PERFORMANCE
// ====================
// Délayer le chargement des ressources non critiques
window.addEventListener('load', () => {
    // Charger les polices web supplémentaires si nécessaire
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap';
    link.media = 'print';
    link.onload = () => {
        link.media = 'all';
    };
    document.head.appendChild(link);
});

// Gérer les erreurs de chargement d'images
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        console.error(`Image non chargée: ${e.target.src}`);
        e.target.style.display = 'none';
    }
}, true);