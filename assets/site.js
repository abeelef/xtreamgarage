
        const heroVideo = document.querySelector('#inicio video');

        heroVideo?.addEventListener('loadedmetadata', () => {
            heroVideo.playbackRate = 0.8;
        });
    

        const openBtn = document.getElementById('open-sidebar');
        const closeBtn = document.getElementById('close-sidebar');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const toggleServices = document.getElementById('toggle-services');
        const servicesSubmenu = document.getElementById('services-submenu');
        const servicesChevron = document.getElementById('services-chevron');
        const sidebarLinks = document.querySelectorAll('.sidebar-link');

        function openMenu() {
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.remove('hidden');
            sidebar.setAttribute('aria-hidden', 'false');
            openBtn.setAttribute('aria-expanded', 'true');
            closeBtn.focus();
        }

        function closeMenu() {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
            sidebar.setAttribute('aria-hidden', 'true');
            openBtn.setAttribute('aria-expanded', 'false');
        }

        openBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);

        toggleServices.addEventListener('click', () => {
            servicesSubmenu.classList.toggle('hidden');
            servicesChevron.classList.toggle('rotate-180');
            toggleServices.setAttribute('aria-expanded', String(!servicesSubmenu.classList.contains('hidden')));
        });

        sidebarLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Header transparente en hero, oscuro al hacer scroll
        const mainHeader = document.getElementById('main-header');
        let headerIsScrolled = false;
        window.addEventListener('scroll', () => {
            const shouldUseSolidHeader = window.scrollY > 80;
            if (shouldUseSolidHeader === headerIsScrolled) return;
            headerIsScrolled = shouldUseSolidHeader;
            if (headerIsScrolled) {
                mainHeader.style.backgroundColor = 'rgba(11,11,11,0.92)';
                mainHeader.style.borderBottomColor = 'rgba(255,255,255,0.1)';
            } else {
                mainHeader.style.backgroundColor = 'transparent';
                mainHeader.style.borderBottomColor = 'transparent';
            }
        }, { passive: true });

        // LÓGICA DEL FORMULARIO Y MODAL
        let lastFocusedElement = null;

        function openFormModal(serviceName, basePrice) {
            lastFocusedElement = document.activeElement;
            document.getElementById('modal-service-title').innerText = window.t(serviceName);
            document.getElementById('modal-service-price').innerText = (basePrice === 'consultar' ? window.t('Presupuesto personalizado') : window.t('Desde') + ' ' + basePrice + ' €');
            document.getElementById('input-hidden-service').value = serviceName;
            document.getElementById('input-hidden-price').value = (basePrice === 'consultar' ? window.t('Presupuesto personalizado') : basePrice + ' €');

            const select = document.getElementById('service-select');
            const selectedOption = Array.from(select.options).find(option =>
                option.value.split('|')[0] === serviceName
            );
            if (selectedOption) {
                select.value = selectedOption.value;
            }

            const modal = document.getElementById('quote-modal');
            modal.classList.remove('hidden');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('overflow-hidden');
            modal.querySelector('button').focus();
        }

        function updateModalServiceFromSelect() {
            const select = document.getElementById('service-select');
            const [serviceName, basePrice] = select.value.split('|');
            document.getElementById('modal-service-title').innerText = window.t(serviceName);
            document.getElementById('modal-service-price').innerText = (basePrice === 'consultar' ? window.t('Presupuesto personalizado') : window.t('Desde') + ' ' + basePrice + ' €');
            document.getElementById('input-hidden-service').value = serviceName;
            document.getElementById('input-hidden-price').value = (basePrice === 'consultar' ? window.t('Presupuesto personalizado') : basePrice + ' €');
        }

        function closeFormModal() {
            const modal = document.getElementById('quote-modal');
            if (modal.classList.contains('hidden')) return;
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('overflow-hidden');
            if (lastFocusedElement && document.contains(lastFocusedElement)) {
                lastFocusedElement.focus();
            }
        }

        document.getElementById('quote-form').addEventListener('submit', function (e) {
            e.preventDefault();

            const nameVal = this.querySelector('[name="Nombre"]').value;
            const phoneVal = this.querySelector('[name="Telefono"]').value;
            const carVal = this.querySelector('[name="Vehiculo"]').value;
            const yearVal = this.querySelector('[name="Ano_Vehiculo"]').value;
            const userMsg = this.querySelector('[name="Mensaje"]').value;
            const selectedService = document.getElementById('input-hidden-service').value;
            const selectedPrice = document.getElementById('input-hidden-price').value;

            const message = `${window.t('SOLICITUD DE PRESUPUESTO - XTREAM DETAILING')}\n\n${window.t('Servicio')}: ${window.t(selectedService)} (${selectedPrice})\n${window.t('Nombre')}: ${nameVal}\n${window.t('Telefono')}: ${phoneVal}\n${window.t('Vehiculo')}: ${carVal} (${yearVal})\n${window.t('Observaciones')}: ${userMsg || window.t('Ninguna')}\n\n${window.t('(Si tienes foto del vehiculo, adjuntala a continuacion)')}`;

            const encoded = encodeURIComponent(message);
            const waNumber = '34637551480';

            window.open(`https://wa.me/${waNumber}?text=${encoded}`, '_blank');

            closeFormModal();
            this.reset();
        });

        // Cerrar modal con Escape
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeFormModal();
        });
        // Cerrar modal clicando fuera
        document.getElementById('quote-modal').addEventListener('click', function (e) {
            if (e.target === this) closeFormModal();
        });
    

        // ── TINTADO: selector de lámina ──────────────────────────────────────
        // ─────────────────────────────────────────────────────────────────────

        let tintadoTipoActivo = 'premium';

        function selectTintadoTab(tipo) {
            tintadoTipoActivo = tipo;

            // Actualizar estilos de tabs
            document.querySelectorAll('.tintado-tab').forEach(btn => {
                btn.classList.remove('active-tab');
                btn.setAttribute('aria-selected', 'false');
            });
            const activeTab = document.getElementById('tab-' + tipo);
            activeTab.classList.add('active-tab');
            activeTab.setAttribute('aria-selected', 'true');

            // Actualizar precios mostrados
            document.querySelectorAll('.tintado-precio').forEach(el => {
                const precio = el.dataset[tipo];
                el.textContent = precio + ' €';
            });
        }

        // Vincular botones "Pedir Cita" del tintado al modal con el tipo activo
        document.querySelectorAll('.tintado-cita').forEach(btn => {
            btn.addEventListener('click', function () {
                const size = this.dataset.size;
                const precioEl = this.closest('.space-y-3').querySelector('.tintado-precio');
                const precio = precioEl ? precioEl.dataset[tintadoTipoActivo] : '--';
                const tipoLabel = tintadoTipoActivo === 'premium' ? 'Lámina Premium' : 'Lámina Nanocerámica';
                openFormModal('Tintado de Lunas ' + tipoLabel + ' - ' + size, precio);
            });
        });
    
function openServicesMenu() {
    openMenu();
    servicesSubmenu.classList.remove('hidden');
    servicesChevron.classList.add('rotate-180');
    toggleServices.setAttribute('aria-expanded', 'true');
    servicesSubmenu.querySelector('a').focus();
}
