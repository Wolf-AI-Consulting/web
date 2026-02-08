// cookie-banner.js - Gestión de Cookies RGPD Compliant para España

document.addEventListener('DOMContentLoaded', function() {
    console.log('Cookie Banner JS cargado');
    
    // Configuración
    const COOKIE_NAME = 'cookie_consent_es';
    const COOKIE_EXPIRY_DAYS = 365;
    const ANALYTICS_ID = 'G-KQLK53GRHL'; // TU ID DE ANALYTICS
    
    // Referencias a elementos
    const banner = document.getElementById('cookie-banner');
    const panel = document.getElementById('cookie-panel');
    const overlay = document.getElementById('cookie-overlay');
    
    // Estado inicial - MOVER getCookie ARRIBA O DEFINIR PRIMERO
    const consent = getCookie(COOKIE_NAME);
    
    // Solo mostrar banner si no hay decisión previa
    if (!consent) {
        setTimeout(() => {
            showBanner();
        }, 1000);
    } else if (consent === 'accepted') {
        // Si ya aceptó previamente, cargar Analytics automáticamente
        loadGoogleAnalytics();
    }
    
    // ========== EVENT LISTENERS ==========
    
    // Banner principal
    document.getElementById('accept-cookies')?.addEventListener('click', acceptAllCookies);
    document.getElementById('reject-cookies')?.addEventListener('click', rejectAllCookies);
    document.getElementById('configure-cookies')?.addEventListener('click', showCookiePanel);
    
    // Panel de configuración
    document.getElementById('save-preferences')?.addEventListener('click', savePreferences);
    document.getElementById('accept-all-panel')?.addEventListener('click', acceptAllCookies);
    document.getElementById('reject-all-panel')?.addEventListener('click', rejectAllCookies);
    document.getElementById('close-panel')?.addEventListener('click', hideCookiePanel);
    
    // Cerrar panel al hacer clic en overlay
    overlay?.addEventListener('click', hideCookiePanel);
    
    // ========== FUNCIONES AUXILIARES (MOVER ARRIBA) ==========
    
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        const cookieValue = encodeURIComponent(value);
        document.cookie = `${name}=${cookieValue};${expires};path=/;SameSite=Lax;Secure`;
        
        // Registrar para debug
        console.log(`Cookie establecida: ${name}=${value} (${days} días)`);
    }
    
    function getCookie(name) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');
        
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(nameEQ) === 0) {
                return decodeURIComponent(cookie.substring(nameEQ.length));
            }
        }
        return null;
    }
    
    // ========== FUNCIONES PRINCIPALES ==========
    
    function showBanner() {
        if (banner) {
            banner.style.display = 'block';
            // Desplazar un poco hacia arriba para mejor visibilidad
            window.scrollTo(0, Math.max(0, window.scrollY - 100));
        }
    }
    
    function hideBanner() {
        if (banner) banner.style.display = 'none';
    }
    
    function showCookiePanel() {
        hideBanner();
        if (panel) panel.style.display = 'block';
        if (overlay) overlay.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Bloquear scroll
    }
    
    function hideCookiePanel() {
        if (panel) panel.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restaurar scroll
    }
    
    function acceptAllCookies() {
        setCookie(COOKIE_NAME, 'accepted', COOKIE_EXPIRY_DAYS);
        hideBanner();
        hideCookiePanel();
        loadGoogleAnalytics();
        showConfirmationMessage('Cookies aceptadas correctamente');
    }
    
    function rejectAllCookies() {
        setCookie(COOKIE_NAME, 'rejected', COOKIE_EXPIRY_DAYS);
        hideBanner();
        hideCookiePanel();
        showConfirmationMessage('Cookies rechazadas. No se cargará Google Analytics.');
    }
    
    function savePreferences() {
        // En esta versión básica, guardar = aceptar todo
        // Para versión avanzada, leer checkboxes individuales
        acceptAllCookies();
    }
    
    // ========== GOOGLE ANALYTICS ==========
    
    function loadGoogleAnalytics() {
        console.log('Cargando Google Analytics...');
        
        // Configurar consentimiento
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted',
                'ad_storage': 'denied'
            });
        }
        
        // Cargar script de Google Analytics
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
        
        const script2 = document.createElement('script');
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Configurar con opciones RGPD
            gtag('config', '${ANALYTICS_ID}', {
                'anonymize_ip': true,
                'allow_google_signals': false,
                'allow_ad_personalization_signals': false,
                'cookie_prefix': 'ga_',
                'cookie_domain': 'auto',
                'cookie_flags': 'SameSite=None;Secure'
            });
        `;
        
        // Agregar al head
        document.head.appendChild(script1);
        document.head.appendChild(script2);
        
        // Registrar en consola para debug
        console.log('✅ Google Analytics configurado con consentimiento RGPD');
    }
    
    // ========== MENSAJES DE CONFIRMACIÓN ==========
    
    // Añadir estilos de animación una sola vez
    if (!document.getElementById('cookie-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'cookie-animation-styles';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-20px); }
                10% { opacity: 1; transform: translateY(0); }
                90% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    function showConfirmationMessage(text) {
        // Crear mensaje temporal
        const message = document.createElement('div');
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            z-index: 10002;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: fadeInOut 3s ease-in-out;
        `;
        
        document.body.appendChild(message);
        
        // Eliminar después de 3 segundos
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 3000);
    }
    
    // ========== FUNCIONES PÚBLICAS ==========
    
    window.CookieManager = {
        hasConsent: function() {
            return getCookie(COOKIE_NAME) === 'accepted';
        },
        showPreferences: function() {
            showCookiePanel();
        },
        revokeConsent: function() {
            setCookie(COOKIE_NAME, 'revoked', 1);
            showConfirmationMessage('Consentimiento revocado. Recarga la página para cambios.');
        }
    };
    
    // ========== BOTÓN "GESTIONAR COOKIES" EN FOOTER ==========
    
    setTimeout(() => {
        const footer = document.querySelector('footer');
        if (footer && !document.getElementById('manage-cookies-btn')) {
            const manageBtn = document.createElement('a');
            manageBtn.id = 'manage-cookies-btn';
            manageBtn.href = '#';
            manageBtn.textContent = 'Gestionar Cookies';
            manageBtn.style.cssText = 'margin-left: 15px; color: #666; text-decoration: underline; font-size: 14px; cursor: pointer;';
            manageBtn.onclick = function(e) {
                e.preventDefault();
                showCookiePanel();
            };
            
            // Buscar el contenedor correcto (en tu index.html es .footer-links)
            const footerLinks = footer.querySelector('.footer-links');
            if (footerLinks) {
                footerLinks.appendChild(document.createTextNode(' | '));
                footerLinks.appendChild(manageBtn);
            } else {
                // Fallback: añadir al footer
                footer.appendChild(document.createElement('br'));
                footer.appendChild(manageBtn);
            }
        }
    }, 1500);
});
