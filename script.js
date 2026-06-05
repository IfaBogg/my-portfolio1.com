document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const menuOpen = document.getElementById('menu-open');
    const menuClose = document.getElementById('menu-close');
    const sidemenu = document.getElementById('sidemenu');
    const tabButtons = Array.from(document.querySelectorAll('.tab-links'));
    const form = document.forms['submit-to-google-sheet'];
    const msg = document.getElementById('msg');
    const scrollBtn = document.getElementById('scroll-top');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxyGygSp_ZEjzZPMD8n3abJ2f7rVPB2aS_KTWRXU_HOTEHcTQuJ7SilCUdhxmVjzPT7/exec';

    function setThemeIcon(isLight) {
        if (!themeToggle) return;
        themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
        themeToggle.classList.toggle('light', isLight);
        themeToggle.classList.toggle('dark', !isLight);
    }

    function applyTheme(isLight) {
        body.classList.toggle('light-theme', isLight);
        setThemeIcon(isLight);
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    }

    const storedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = storedTheme ? storedTheme === 'light' : prefersLight;
    applyTheme(initialTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            applyTheme(!body.classList.contains('light-theme'));
        });
    }

    if (menuOpen && sidemenu) {
        menuOpen.addEventListener('click', () => {
            sidemenu.classList.add('open');
        });
    }

    if (menuClose && sidemenu) {
        menuClose.addEventListener('click', () => {
            sidemenu.classList.remove('open');
        });
    }

    if (sidemenu) {
        document.addEventListener('click', (event) => {
            if (!sidemenu.classList.contains('open')) return;
            if (event.target === menuOpen) return;
            if (!sidemenu.contains(event.target)) {
                sidemenu.classList.remove('open');
            }
        });
    }

    function activateTab(tabName) {
        tabButtons.forEach((button) => {
            const isActive = button.dataset.tab === tabName;
            button.classList.toggle('active-link', isActive);
            button.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        const tabContents = document.querySelectorAll('.tab-contents');
        tabContents.forEach((section) => {
            section.classList.toggle('active-tab', section.id === tabName);
        });
    }

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            activateTab(button.dataset.tab);
        });
    });

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (msg) {
                msg.textContent = 'Sending message...';
            }

            try {
                const response = await fetch(scriptURL, {
                    method: 'POST',
                    body: new FormData(form),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                if (msg) {
                    msg.textContent = 'Message sent successfully';
                }
                form.reset();
            } catch (error) {
                if (msg) {
                    msg.textContent = 'Message failed to send. Please try again.';
                }
                console.error('Error!', error.message);
            } finally {
                if (msg) {
                    setTimeout(() => {
                        msg.textContent = '';
                    }, 5000);
                }
            }
        });
    }

    if (scrollBtn) {
        const toggleScroll = () => {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', toggleScroll, { passive: true });
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        toggleScroll();
    }
});
