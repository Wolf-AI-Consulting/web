// cookie-banner.js - Gestión de Cookies RGPD Compliant para España
// Versión compatible con configuración de consentimiento en <head>

document.addEventListener('DOMContentLoaded', function() {
    console.log('🍪 Cookie Banner JS cargado - Versión compatible');
    
    // ========== CONFIGURACIÓN ==========
    const COOKIE_NAME = 'wolfai_cookie_consent'; // Cambiado para coincidir con index.html
    const COOKIE_EXPIRY_DAYS = 365;
    const ANALYTICS_ID = 'G-KQLK53GRHL'; // TU ID DE ANALYTICS
    
    // Referencias a elementos
    const banner = document.getElementById('cookie-banner');
    const panel = document.getElementById('cookie-panel');
    const overlay = document.getElementById('cookie-overlay');
    
    // Estado inicial
    const consent = getCookie(COOKIE_NAME);
    console.log('Consentimiento actual:', consent || 'ninguno');
    
    // ========== INICIALIZACIÓN ==========
    
    // Solo mostrar banner si no hay decisión previa
    if (!consent) {
        console.log('🆕 Sin consentimiento previo, mostrando banner...');
        setTimeout(() => {
            showBanner();
        }, 1000);
    } else if (consent === 'accepted') {
        console.log('✅ Consentimiento previo aceptado, activando Analytics...');
        // Si ya aceptó previamente, activar Analytics automáticamente
        setTimeout(() => {
            loadGoogleAnalytics();
        }, 500);
    } else if (consent === 'rejected') {
        console.log('❌ Consentimiento previo rechazado, sin Analytics');
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
    
    // ========== FUNCIONES PRINCIPALES ==========
    
    function showBanner() {
        if (banner) {
            banner.style.display = 'block';
            // Pequeño delay para animación CSS
            setTimeout(() => {
                banner.classList.add('cookie-banner-visible');
            }, 10);
            console.log('👁️ Banner visible');
        }
    }
    
    function hideBanner() {
        if (banner) {
            banner.classList.remove('cookie-banner-visible');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
            console.log('🙈 Banner oculto');
        }
    }
    
    function showCookiePanel() {
        hideBanner();
        if (panel) panel.style.display = 'block';
        if (overlay) overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('⚙️ Panel de configuración abierto');
    }
    
    function hideCookiePanel() {
        if (panel) panel.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Si no hay consentimiento, volver a mostrar el banner
        if (!getCookie(COOKIE_NAME) && banner) {
            setTimeout(() => {
                banner.style.display = 'block';
                setTimeout(() => {
                    banner.classList.add('cookie-banner-visible');
                }, 10);
            }, 300);
        }
        console.log('🔒 Panel de configuración cerrado');
    }
    
    function acceptAllCookies() {
        console.log('✅ Usuario acepta todas las cookies');
        setCookie(COOKIE_NAME, 'accepted', COOKIE_EXPIRY_DAYS);
        hideBanner();
        hideCookiePanel();
        loadGoogleAnalytics();
        showConfirmationMessage('✅ Cookies aceptadas correctamente');
    }
    
    function rejectAllCookies() {
        console.log('❌ Usuario rechaza todas las cookies');
        setCookie(COOKIE_NAME, 'rejected', COOKIE_EXPIRY_DAYS);
        hideBanner();
        hideCookiePanel();
        showConfirmationMessage('Cookies rechazadas. No se cargará Google Analytics.');
    }
    
    function savePreferences() {
        console.log('💾 Guardando preferencias personalizadas');
        // En esta versión básica, guardar = aceptar todo
        // Para versión avanzada, leer checkboxes individuales
        acceptAllCookies();
    }
    
    // ========== GOOGLE ANALYTICS (VERSIÓN CORREGIDA) ==========
    
    function loadGoogleAnalytics() {
        console.log('📊 Activando Google Analytics con consentimiento...');
        
        // Verificar si gtag ya está definido (del <head>)
        if (typeof gtag !== 'undefined') {
            console.log('✅ gtag() disponible del <head>, actualizando consentimiento...');
            
            // 1. ACTUALIZAR CONSENTIMIENTO (esto permite el tracking)
            gtag('consent', 'update', {
                'analytics_storage': 'granted',
                'ad_storage': 'denied'
            });
            
            console.log('🔓 Consentimiento actualizado a "granted" para analytics_storage');
            
            // 2. Cargar el script de Google Analytics (solo si no está ya)
            if (!window.gaLoaded) {
                console.log('⬇️ Descargando script de Google Analytics...');
                const script = document.createElement('script');
                script.async = true;
                script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
                script.onload = () => {
                    console.log('✅ Script de GA cargado, configurando tracking...');
                    // Configurar el tracking ID con opciones RGPD
                    gtag('config', ANALYTICS_ID, {
                        'anonymize_ip': true,
                        'allow_google_signals': false,
                        'allow_ad_personalization_signals': false,
                        'cookie_flags': 'SameSite=Lax;Secure'
                    });
                    console.log('🎯 Google Analytics configurado y listo');
                };
                script.onerror = () => console.error('❌ Error cargando script de GA');
                document.head.appendChild(script);
                window.gaLoaded = true;
            } else {
                console.log('⚠️ Google Analytics ya estaba cargado');
            }
            
        } else {
            console.warn('⚠️ gtag() no encontrado, usando fallback completo...');
            // Fallback: cargar todo desde cero
            const script1 = document.createElement('script');
            script1.async = true;
            script1.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
            
            const script2 = document.createElement('script');
            script2.innerHTML = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                
                // Configurar consentimiento por defecto
                gtag('consent', 'default', {
                    'analytics_storage': 'granted',
                    'ad_storage': 'denied'
                });
                
                // Configurar con opciones RGPD
                gtag('config', '${ANALYTICS_ID}', {
                    'anonymize_ip': true,
                    'allow_google_signals': false,
                    'allow_ad_personalization_signals': false
                });
                
                console.log('✅ Google Analytics fallback cargado');
            `;
            
            document.head.appendChild(script1);
            document.head.appendChild(script2);
            window.gaLoaded = true;
        }
        
        console.log('✅ Google Analytics activado correctamente');
    }
    
    // ========== FUNCIONES AUXILIARES ==========
    
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        const cookieValue = encodeURIComponent(value);
        document.cookie = `${name}=${cookieValue};${expires};path=/;SameSite=Lax;Secure`;
        
        console.log(`🍪 Cookie establecida: ${name}=${value} (${days} días)`);
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
    
    function showConfirmationMessage(text) {
        // Crear mensaje temporal
        const message = document.createElement('div');
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-accent, #4CAF50);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10002;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: fadeInOut 3s ease-in-out;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 500;
        `;
        
        // Añadir animación CSS si no existe
        if (!document.getElementById('fade-animation')) {
            const style = document.createElement('style');
            style.id = 'fade-animation';
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
        
        document.body.appendChild(message);
        
        // Eliminar después de 3 segundos
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 3000);
        
        console.log('💬 Mensaje mostrado:', text);
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
    
    // ========== AÑADIR ENLACE "GESTIONAR COOKIES" AL FOOTER ==========
    
    setTimeout(() => {
        const footerLinks = document.querySelector('.footer-links');
        if (footerLinks && !document.getElementById('manage-cookies-link')) {
            console.log('➕ Añadiendo enlace "Gestionar Cookies" al footer');
            
            const manageLink = document.createElement('a');
            manageLink.id = 'manage-cookies-link';
            manageLink.href = '#';
            manageLink.textContent = 'Gestionar Cookies';
            manageLink.style.cssText = `
                margin-left: 15px; 
                color: var(--color-text-secondary, #666); 
                text-decoration: none; 
                font-size: 0.75rem;
                cursor: pointer;
                transition: color 0.2s ease;
            `;
            
            manageLink.onmouseover = function() {
                this.style.color = 'var(--color-accent, #5D5FEF)';
            };
            manageLink.onmouseout = function() {
                this.style.color = 'var(--color-text-secondary, #666)';
            };
            
            manageLink.onclick = function(e) {
                e.preventDefault();
                showCookiePanel();
            };
            
            // Añadir después del último enlace
            footerLinks.appendChild(document.createTextNode(''));
            footerLinks.appendChild(manageLink);
            
            console.log('✅ Enlace "Gestionar Cookies" añadido');
        } else if (document.getElementById('manage-cookies-link')) {
            console.log('ℹ️ Enlace "Gestionar Cookies" ya existe');
        }
    }, 2000);
    
    console.log('🎉 Sistema de cookies inicializado correctamente');
});

// Fallback si el DOM ya está cargado
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    setTimeout(() => {
        if (typeof CookieManager === 'undefined') {
            console.log('🚀 DOM ya cargado, ejecutando cookie-banner.js...');
            // Disparar el evento DOMContentLoaded manualmente
            document.dispatchEvent(new Event('DOMContentLoaded'));
        }
    }, 100);
}
