/* =========================================================
   Faith African Hair Braiding
   Main JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const header = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const navLinks = document.querySelectorAll(".nav-link");
    const bookingForm = document.getElementById("bookingForm");
    const currentYear = document.getElementById("currentYear");

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxClose = document.getElementById("lightboxClose");
    const galleryItems = document.querySelectorAll(".gallery-item");

    /* -----------------------------
       Current Year
    ----------------------------- */
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* -----------------------------
       Header Scroll State
    ----------------------------- */
    const updateHeaderState = () => {
        if (!header) return;

        if (window.scrollY > 20) {
            header.classList.add("is-scrolled");
        } else {
            header.classList.remove("is-scrolled");
        }
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    /* -----------------------------
       Mobile Navigation
    ----------------------------- */
    const openMenu = () => {
        body.classList.add("nav-open");

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "Close menu");
        }
    };

    const closeMenu = () => {
        body.classList.remove("nav-open");

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open menu");
        }
    };

    const toggleMenu = () => {
        if (body.classList.contains("nav-open")) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    if (menuToggle) {
        menuToggle.addEventListener("click", toggleMenu);
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    document.addEventListener("click", (event) => {
        const clickedInsideNav = mainNav && mainNav.contains(event.target);
        const clickedMenuButton = menuToggle && menuToggle.contains(event.target);

        if (!clickedInsideNav && !clickedMenuButton && body.classList.contains("nav-open")) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            closeLightbox();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth >= 920) {
            closeMenu();
        }
    });

    /* -----------------------------
       Active Navigation on Scroll
    ----------------------------- */
    const sections = Array.from(document.querySelectorAll("main section[id]"));

    const setActiveLink = (sectionId) => {
        navLinks.forEach((link) => {
            const href = link.getAttribute("href");

            if (href === `#${sectionId}`) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    };

    if ("IntersectionObserver" in window && sections.length > 0) {
        const observerOptions = {
            root: null,
            threshold: 0.28,
            rootMargin: "-80px 0px -45% 0px"
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id);
                }
            });
        }, observerOptions);

        sections.forEach((section) => sectionObserver.observe(section));
    }

    /* -----------------------------
       Gallery Lightbox
    ----------------------------- */
    function openLightbox(imageSource, imageAlt) {
        if (!lightbox || !lightboxImage) return;

        lightboxImage.src = imageSource;
        lightboxImage.alt = imageAlt || "Braiding style preview";
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        body.style.overflow = "hidden";

        if (lightboxClose) {
            lightboxClose.focus();
        }
    }

    function closeLightbox() {
        if (!lightbox || !lightboxImage) return;

        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        lightboxImage.src = "";
        body.style.overflow = body.classList.contains("nav-open") ? "hidden" : "";
    }

    galleryItems.forEach((item) => {
        item.addEventListener("click", () => {
            const imageSource = item.getAttribute("data-image");
            const image = item.querySelector("img");
            const imageAlt = image ? image.getAttribute("alt") : "Braiding style preview";

            if (imageSource) {
                openLightbox(imageSource, imageAlt);
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
    }

    /* -----------------------------
       Booking Form Date Restriction
    ----------------------------- */
    const preferredDateInput = document.getElementById("preferredDate");

    if (preferredDateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");

        preferredDateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    /* -----------------------------
       WhatsApp Booking Form
    ----------------------------- */
    const sanitizeValue = (value) => {
        return String(value || "").trim();
    };

    const buildWhatsAppMessage = (form) => {
        const formData = new FormData(form);

        const fullName = sanitizeValue(formData.get("fullName"));
        const phoneNumber = sanitizeValue(formData.get("phoneNumber"));
        const service = sanitizeValue(formData.get("service"));
        const preferredDate = sanitizeValue(formData.get("preferredDate"));
        const preferredTime = sanitizeValue(formData.get("preferredTime"));
        const serviceType = sanitizeValue(formData.get("serviceType"));
        const message = sanitizeValue(formData.get("message"));

        return [
            "Hello Faith African Hair Braiding,",
            "",
            "I would like to request an appointment.",
            "",
            `Full Name: ${fullName}`,
            `Phone Number: ${phoneNumber}`,
            `Preferred Service: ${service}`,
            `Preferred Date: ${preferredDate}`,
            `Preferred Time: ${preferredTime}`,
            `Appointment Type: ${serviceType}`,
            `Additional Message: ${message || "N/A"}`,
            "",
            "Please confirm availability. Thank you."
        ].join("\n");
    };

    if (bookingForm) {
        bookingForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!bookingForm.checkValidity()) {
                bookingForm.reportValidity();
                return;
            }

            const whatsappNumber = bookingForm.getAttribute("data-whatsapp") || "14132443858";
            const message = buildWhatsAppMessage(bookingForm);
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        });
    }

    /* -----------------------------
       Smooth Anchor Fallback
    ----------------------------- */
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const targetId = anchor.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const targetElement = document.querySelector(targetId);

            if (!targetElement) return;

            event.preventDefault();

            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            closeMenu();
        });
    });
});
