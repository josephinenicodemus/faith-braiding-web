/**
 * Faith African Hair Braiding — Main JavaScript
 * Handles navigation, lightbox, booking form, and UI interactions.
 */
(function () {
    "use strict";

    /* ------------------------------------------------------------------
       DOM References
       ------------------------------------------------------------------ */
    var siteHeader = document.getElementById("siteHeader");
    var menuToggle = document.getElementById("menuToggle");
    var mainNav = document.getElementById("mainNav");
    var bookingForm = document.getElementById("bookingForm");
    var lightbox = document.getElementById("lightbox");
    var lightboxImage = document.getElementById("lightboxImage");
    var lightboxClose = document.getElementById("lightboxClose");
    var currentYearEl = document.getElementById("currentYear");

    var navLinks = mainNav ? mainNav.querySelectorAll(".nav-link") : [];
    var galleryItems = document.querySelectorAll(".gallery-item");
    var sectionIds = ["home", "about", "services", "gallery", "why-us", "testimonials", "booking", "contact"];

    var lastFocusedElement = null;

    /* ------------------------------------------------------------------
       Utility Helpers
       ------------------------------------------------------------------ */
    function getHeaderOffset() {
        return siteHeader ? siteHeader.offsetHeight : 0;
    }

    function setBodyScrollLocked(locked) {
        document.body.style.overflow = locked ? "hidden" : "";
    }

    /* ------------------------------------------------------------------
       Current Year
       ------------------------------------------------------------------ */
    if (currentYearEl) {
        currentYearEl.textContent = String(new Date().getFullYear());
    }

    /* ------------------------------------------------------------------
       Mobile Menu
       ------------------------------------------------------------------ */
    function openMenu() {
        if (!mainNav || !menuToggle) return;

        mainNav.classList.add("is-open");
        menuToggle.classList.add("is-active");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close menu");
        setBodyScrollLocked(true);
    }

    function closeMenu() {
        if (!mainNav || !menuToggle) return;

        mainNav.classList.remove("is-open");
        menuToggle.classList.remove("is-active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
        setBodyScrollLocked(false);
    }

    function toggleMenu() {
        if (mainNav && mainNav.classList.contains("is-open")) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", function (event) {
            event.stopPropagation();
            toggleMenu();
        });
    }

    /* Close menu when a nav link is clicked */
    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            closeMenu();
        });
    });

    /* Close menu when clicking outside */
    document.addEventListener("click", function (event) {
        if (!mainNav || !menuToggle) return;

        var isOpen = mainNav.classList.contains("is-open");
        var clickedInsideNav = mainNav.contains(event.target);
        var clickedToggle = menuToggle.contains(event.target);

        if (isOpen && !clickedInsideNav && !clickedToggle) {
            closeMenu();
        }
    });

    /* ------------------------------------------------------------------
       Sticky Header & Active Nav on Scroll
       ------------------------------------------------------------------ */
    function updateHeaderState() {
        if (siteHeader) {
            if (window.scrollY > 10) {
                siteHeader.classList.add("is-scrolled");
            } else {
                siteHeader.classList.remove("is-scrolled");
            }
        }
    }

    function setActiveNavLink(id) {
        navLinks.forEach(function (link) {
            var href = link.getAttribute("href");
            if (href === "#" + id) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    function updateActiveSection() {
        var scrollPos = window.scrollY + getHeaderOffset() + 80;
        var activeId = "home";

        sectionIds.forEach(function (id) {
            var section = document.getElementById(id);
            if (section && section.offsetTop <= scrollPos) {
                activeId = id;
            }
        });

        setActiveNavLink(activeId);
    }

    function onScroll() {
        updateHeaderState();
        updateActiveSection();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* Smooth scroll for anchor links */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (event) {
            var targetId = anchor.getAttribute("href");

            if (!targetId || targetId === "#") return;

            var target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();

            var offsetTop = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset() + 1;

            window.scrollTo({
                top: offsetTop,
                behavior: "smooth"
            });
        });
    });

    /* ------------------------------------------------------------------
       Gallery Lightbox
       ------------------------------------------------------------------ */
    function openLightbox(imageSrc, imageAlt) {
        if (!lightbox || !lightboxImage) return;

        lastFocusedElement = document.activeElement;

        lightboxImage.src = imageSrc;
        lightboxImage.alt = imageAlt || "Braiding style preview";

        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        setBodyScrollLocked(true);

        if (lightboxClose) {
            lightboxClose.focus();
        }
    }

    function closeLightbox() {
        if (!lightbox || !lightboxImage) return;

        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        lightboxImage.src = "";

        if (!mainNav || !mainNav.classList.contains("is-open")) {
            setBodyScrollLocked(false);
        }

        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus();
        }
    }

    galleryItems.forEach(function (item) {
        item.addEventListener("click", function () {
            var imageSrc = item.getAttribute("data-image");
            var img = item.querySelector("img");
            var imageAlt = img ? img.getAttribute("alt") : "";

            if (imageSrc) {
                openLightbox(imageSrc, imageAlt);
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
    }

    /* ------------------------------------------------------------------
       Booking Form — WhatsApp Submission
       ------------------------------------------------------------------ */
    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!bookingForm.checkValidity()) {
                bookingForm.reportValidity();
                return;
            }

            var whatsappNumber = bookingForm.getAttribute("data-whatsapp") || "14132443858";

            var fullName = getFieldValue("fullName");
            var phoneNumber = getFieldValue("phoneNumber");
            var service = getFieldValue("service");
            var preferredDate = getFieldValue("preferredDate");
            var preferredTime = getFieldValue("preferredTime");
            var serviceType = getFieldValue("serviceType");
            var message = getFieldValue("message");

            var lines = [
                "Hello Faith African Hair Braiding,",
                "",
                "I would like to book an appointment.",
                "",
                "Name: " + fullName,
                "Phone: " + phoneNumber,
                "Service: " + service,
                "Date: " + formatDate(preferredDate),
                "Time: " + formatTime(preferredTime),
                "Appointment Type: " + serviceType
            ];

            if (message) {
                lines.push("");
                lines.push("Additional Message:");
                lines.push(message);
            }

            var whatsappMessage = encodeURIComponent(lines.join("\n"));
            var whatsappUrl = "https://wa.me/" + whatsappNumber + "?text=" + whatsappMessage;

            window.open(whatsappUrl, "_blank", "noopener");
        });
    }

    function getFieldValue(name) {
        var field = bookingForm ? bookingForm.elements[name] : null;
        return field ? String(field.value).trim() : "";
    }

    function formatDate(dateStr) {
        if (!dateStr) return "";
        try {
            var parts = dateStr.split("-");
            if (parts.length === 3) {
                return parts[1] + "/" + parts[2] + "/" + parts[0];
            }
        } catch (e) {
            /* fall through */
        }
        return dateStr;
    }

    function formatTime(timeStr) {
        if (!timeStr) return "";
        try {
            var parts = timeStr.split(":");
            var hours = parseInt(parts[0], 10);
            var minutes = parts[1] || "00";
            var period = hours >= 12 ? "PM" : "AM";
            var displayHours = hours % 12 || 12;
            return displayHours + ":" + minutes + " " + period;
        } catch (e) {
            /* fall through */
        }
        return timeStr;
    }

    /* Set minimum date to today */
    var preferredDateField = document.getElementById("preferredDate");
    if (preferredDateField) {
        var today = new Date();
        var yyyy = today.getFullYear();
        var mm = String(today.getMonth() + 1).padStart(2, "0");
        var dd = String(today.getDate()).padStart(2, "0");
        preferredDateField.setAttribute("min", yyyy + "-" + mm + "-" + dd);
    }

    /* ------------------------------------------------------------------
       Keyboard — ESC closes menu & lightbox
       ------------------------------------------------------------------ */
    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;

        if (lightbox && lightbox.classList.contains("is-open")) {
            closeLightbox();
            return;
        }

        if (mainNav && mainNav.classList.contains("is-open")) {
            closeMenu();
            if (menuToggle) {
                menuToggle.focus();
            }
        }
    });

})();
