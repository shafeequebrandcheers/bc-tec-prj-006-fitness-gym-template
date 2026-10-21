document.addEventListener("DOMContentLoaded", () => {
  if (typeof fitnessConfig === "undefined") return;

  const config = fitnessConfig;
  const presets = typeof businessPresets !== "undefined" ? businessPresets : {};
  const contact = config.contact || {};
  const booking = config.booking || {};
  const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // ---------- Helpers ----------

  // Returns a trimmed string, or the fallback for empty / non-text values
  function text(value, fallback = "") {
    if (typeof value === "number") return String(value);
    if (typeof value !== "string") return fallback;
    return value.trim() || fallback;
  }

  // Returns only arrays of objects; anything else becomes []
  function list(value) {
    return Array.isArray(value) ? value.filter(item => item && typeof item === "object") : [];
  }

  // Allows relative paths and http(s)/mailto/tel links only
  function safeUrl(value) {
    const url = text(value);
    if (!url) return "";
    const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(url);
    return !hasScheme || /^(https?:|mailto:|tel:)/i.test(url) ? url : "";
  }

  // Creates an element safely - all content is set as text, never as HTML
  function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => {
      if (value === undefined || value === null || value === false || value === "") return;
      if (key === "className") node.className = value;
      else if (key === "text") node.textContent = value;
      else if (key === "dataset") Object.assign(node.dataset, value);
      else node.setAttribute(key, value === true ? "" : value);
    });
    [].concat(children).forEach(child => {
      if (child === null || child === undefined || child === false || child === "") return;
      node.append(child instanceof Node ? child : String(child));
    });
    return node;
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  // Hides a section and every nav link pointing to it
  function hideSection(id) {
    const section = document.getElementById(id);
    if (section) section.hidden = true;
    document.querySelectorAll(`[data-nav="${id}"]`).forEach(link => {
      const item = link.closest("li") || link;
      item.hidden = true;
    });
  }

  // Image with a fallback placeholder when the URL is empty or fails to load
  function imageOrPlaceholder(src, alt, className, placeholder) {
    const url = safeUrl(src);
    if (!url) return placeholder();
    const img = el("img", { src: url, alt, className, loading: "lazy" });
    img.addEventListener("error", () => img.replaceWith(placeholder()), { once: true });
    return img;
  }

  function initials(name) {
    return name
      .replace(/^(dr|mr|mrs|ms|coach)\.?\s+/i, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0].toUpperCase())
      .join("");
  }

  // "07:00 AM" -> minutes since midnight (unknown formats sort last)
  function timeToMinutes(value) {
    const match = text(value).match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
    if (!match) return 24 * 60;
    let hours = Number(match[1]);
    const period = (match[3] || "").toLowerCase();
    if (period === "pm" && hours < 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;
    return hours * 60 + Number(match[2] || 0);
  }

  // Matches a businessType value to a preset key, including its aliases
  function resolveType(value) {
    const type = typeof value === "string" ? value.trim().toLowerCase() : "";
    if (!type) return "";
    if (presets[type]) return type;
    return Object.keys(presets).find(key => (presets[key].aliases || []).includes(type)) || "";
  }

  const businessKey = resolveType(config.businessType) || (presets.gym ? "gym" : Object.keys(presets)[0] || "");
  const preset = presets[businessKey] || {};
  const teamLabel = text(preset.teamLabel, "Trainers");
  const teamSingular = teamLabel.replace(/s$/i, "");

  // ---------- 1. Theme ----------
  function applyTheme() {
    const root = document.documentElement;
    const theme = config.theme || {};
    root.dataset.theme = resolveType(theme.preset) || businessKey;

    const colorVars = {
      primary: "--color-primary",
      primaryDark: "--color-primary-dark",
      background: "--color-bg",
      surface: "--color-surface",
      text: "--color-text",
      textMuted: "--color-text-muted",
      border: "--color-border"
    };
    const colors = theme.colors || {};
    Object.entries(colorVars).forEach(([key, cssVar]) => {
      const value = text(colors[key]);
      if (value && CSS.supports("color", value)) root.style.setProperty(cssVar, value);
    });

    const headingFont = text(theme.headingFont);
    const bodyFont = text(theme.bodyFont);
    if (headingFont) root.style.setProperty("--font-heading", headingFont);
    if (bodyFont) root.style.setProperty("--font-body", bodyFont);
  }

  // ---------- 2. Branding ----------
  function renderBranding() {
    const brandName = text(config.brandName, "Our Studio");
    const tagline = text(config.tagline);

    document.title = tagline ? `${brandName} - ${tagline}` : brandName;
    const metaDescription = document.getElementById("meta-description");
    if (metaDescription) metaDescription.setAttribute("content", text(config.description, tagline));

    setText("brand-name", brandName);
    const logoMark = document.getElementById("brand-logo-mark");
    if (logoMark) {
      const logoUrl = safeUrl(config.logo);
      logoMark.replaceChildren(logoUrl ? el("img", { src: logoUrl, alt: "" }) : text(preset.icon, "★"));
    }

    const ctaLabel = text(booking.ctaLabel, "Join Now");
    document.querySelectorAll("[data-cta-label]").forEach(btn => { btn.textContent = ctaLabel; });
    document.querySelectorAll("[data-team-label]").forEach(node => { node.textContent = teamLabel; });

    setText("footer-brand", brandName);
    setText("footer-tagline", tagline);
    setText("footer-copyright", `© ${new Date().getFullYear()} ${brandName}. Powered by Brandcheers.`);
  }

  // ---------- 3. Hero ----------
  function renderHero(schedule, trainers) {
    const hero = config.hero || {};
    setText("hero-badge", text(preset.label, "Fitness Studio"));
    setText("hero-title", text(hero.headline, text(config.tagline, text(config.brandName))));
    setText("hero-text", text(hero.description, text(config.description)));

    const heroSection = document.getElementById("home");
    const media = document.getElementById("hero-media");
    const imageUrl = safeUrl(hero.image);
    const videoUrl = safeUrl(hero.video);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function showPlaceholder() {
      heroSection.classList.remove("has-media");
      media.replaceChildren(el("div", { className: "hero-placeholder", text: text(preset.icon, "★") }));
      updateSecondaryButton();
    }

    function updateSecondaryButton() {
      const secondary = heroSection.querySelector(".hero-secondary");
      if (secondary) secondary.classList.toggle("btn-on-dark", heroSection.classList.contains("has-media"));
    }

    if (videoUrl && !reduceMotion) {
      // Muted, looping background video; poster image shows while loading
      const video = el("video", { autoplay: true, muted: true, loop: true, playsinline: true, preload: "metadata", poster: imageUrl });
      video.muted = true;
      video.append(el("source", { src: videoUrl }));
      video.addEventListener("error", showPlaceholder, true);
      media.replaceChildren(video);
      heroSection.classList.add("has-media");
    } else if (imageUrl) {
      const img = el("img", { src: imageUrl, alt: "" });
      img.addEventListener("error", showPlaceholder, { once: true });
      media.replaceChildren(img);
      heroSection.classList.add("has-media");
    } else {
      showPlaceholder();
    }
    updateSecondaryButton();

    // Stats are derived from the configured data only - never invented
    const stats = [];
    if (schedule.length) stats.push([String(schedule.length), "Classes each week"]);
    const days = new Set(schedule.map(item => item.day)).size;
    if (days) stats.push([String(days), `Day${days === 1 ? "" : "s"} a week`]);
    if (trainers.length) stats.push([String(trainers.length), teamLabel]);

    const statsList = document.getElementById("hero-stats");
    stats.forEach(([value, label]) => {
      statsList.append(el("li", {}, [el("strong", { text: value }), el("span", { text: label })]));
    });
  }

  // ---------- 4. Class Schedule & Filters ----------
  function normalizeSchedule() {
    return list(config.schedule)
      .map(item => ({
        day: WEEK_DAYS.find(day => day.toLowerCase() === text(item.day).toLowerCase()) || text(item.day),
        time: text(item.time),
        title: text(item.title),
        category: text(item.category),
        duration: text(item.duration),
        instructor: text(item.instructor),
        level: text(item.level),
        spots: typeof item.spots === "number" && item.spots >= 0 ? item.spots : null
      }))
      .filter(item => item.day && item.title && item.time)
      .sort((a, b) => {
        const dayA = WEEK_DAYS.indexOf(a.day);
        const dayB = WEEK_DAYS.indexOf(b.day);
        return (dayA === -1 ? 99 : dayA) - (dayB === -1 ? 99 : dayB) || timeToMinutes(a.time) - timeToMinutes(b.time);
      });
  }

  function renderSchedule(schedule) {
    const sections = config.sections || {};
    setText("classes-title", text(sections.classesTitle, text(preset.classesTitle, "Class Schedule")));
    setText("classes-subtitle", text(sections.classesSubtitle, text(preset.classesSubtitle)));
    if (schedule.length === 0) return hideSection("classes");

    const listContainer = document.getElementById("schedule-list");
    const dayFilters = document.getElementById("day-filters");
    const categorySelect = document.getElementById("category-filter");
    const instructorSelect = document.getElementById("instructor-filter");
    const resetBtn = document.getElementById("reset-filters");
    const count = document.getElementById("schedule-count");
    const classCta = text(booking.classCtaLabel, "Book");
    const filters = { day: "All", category: "All", instructor: "All" };

    const days = [...new Set(schedule.map(item => item.day))];
    const categories = [...new Set(schedule.map(item => item.category).filter(Boolean))];
    const instructors = [...new Set(schedule.map(item => item.instructor).filter(Boolean))].sort();

    setText("instructor-filter-label", teamSingular);

    // Day buttons
    ["All", ...days].forEach(day => {
      const btn = el("button", {
        type: "button",
        className: "day-btn",
        "aria-pressed": day === "All" ? "true" : "false",
        text: day === "All" ? "All Days" : day
      });
      btn.addEventListener("click", () => {
        filters.day = day;
        update();
      });
      btn.dataset.day = day;
      dayFilters.append(btn);
    });

    // Dropdown filters are only shown when there is something to choose
    function fillSelect(select, values, allLabel, fieldId) {
      if (values.length < 2) {
        document.getElementById(fieldId).hidden = true;
        return;
      }
      select.append(new Option(allLabel, "All"));
      values.forEach(value => select.append(new Option(value, value)));
    }
    fillSelect(categorySelect, categories, "All classes", "category-field");
    fillSelect(instructorSelect, instructors, `All ${teamLabel.toLowerCase()}`, "instructor-field");

    categorySelect.addEventListener("change", () => { filters.category = categorySelect.value; update(); });
    instructorSelect.addEventListener("change", () => { filters.instructor = instructorSelect.value; update(); });
    resetBtn.addEventListener("click", resetFilters);

    function resetFilters() {
      filters.day = "All";
      filters.category = "All";
      filters.instructor = "All";
      categorySelect.value = "All";
      instructorSelect.value = "All";
      update();
    }

    function spotsLabel(spots) {
      if (spots === null) return null;
      if (spots === 0) return el("span", { className: "class-spots is-full", text: "Class full" });
      return el("span", {
        className: `class-spots${spots <= 3 ? " is-low" : ""}`,
        text: `${spots} spot${spots === 1 ? "" : "s"} left`
      });
    }

    function classCard(item) {
      const isFull = item.spots === 0;
      const label = isFull ? "Join Waitlist" : classCta;
      return el("article", { className: "class-card" }, [
        el("div", { className: "class-time" }, [
          el("strong", { text: item.time }),
          item.duration ? el("span", { text: item.duration }) : null
        ]),
        el("div", { className: "class-info" }, [
          el("h4", { text: item.title }),
          el("div", { className: "class-meta" }, [
            item.category ? el("span", { className: "chip class-category", text: item.category }) : null,
            item.instructor ? el("span", { text: `with ${item.instructor}` }) : null,
            item.level ? el("span", { text: item.level }) : null
          ])
        ]),
        el("div", { className: "class-action" }, [
          spotsLabel(item.spots),
          el("button", {
            type: "button",
            className: isFull ? "btn btn-outline btn-sm" : "btn btn-sm",
            "aria-label": `${label}: ${item.title}, ${item.day} ${item.time}`,
            dataset: { openInquiry: "", inquiry: "class", class: item.title, day: item.day, time: item.time },
            text: label
          })
        ])
      ]);
    }

    function update() {
      dayFilters.querySelectorAll(".day-btn").forEach(btn => {
        btn.setAttribute("aria-pressed", String(btn.dataset.day === filters.day));
      });

      const visible = schedule.filter(item =>
        (filters.day === "All" || item.day === filters.day) &&
        (filters.category === "All" || item.category === filters.category) &&
        (filters.instructor === "All" || item.instructor === filters.instructor)
      );

      const isFiltered = filters.day !== "All" || filters.category !== "All" || filters.instructor !== "All";
      resetBtn.hidden = !isFiltered;
      count.textContent = `Showing ${visible.length} class${visible.length === 1 ? "" : "es"}`;

      if (visible.length === 0) {
        const clearBtn = el("button", { type: "button", className: "btn btn-outline btn-sm", text: "Clear filters" });
        clearBtn.addEventListener("click", resetFilters);
        listContainer.replaceChildren(el("div", { className: "empty-state" }, [
          el("p", { text: "No classes match these filters. Try another day or clear the filters." }),
          clearBtn
        ]));
        return;
      }

      // Group the visible classes by day, keeping weekly order
      const groups = [];
      visible.forEach(item => {
        const group = groups.find(g => g.day === item.day);
        if (group) group.items.push(item);
        else groups.push({ day: item.day, items: [item] });
      });

      listContainer.replaceChildren(...groups.map(group =>
        el("div", { className: "schedule-day" }, [
          el("h3", { text: group.day }),
          el("div", { className: "class-list" }, group.items.map(classCard))
        ])
      ));
    }

    update();
  }

  // ---------- 5. Trainers ----------
  function renderTrainers(trainers) {
    const sections = config.sections || {};
    setText("trainers-title", text(sections.trainersTitle, text(preset.trainersTitle, "Our Trainers")));
    setText("trainers-subtitle", text(sections.trainersSubtitle, text(preset.trainersSubtitle)));

    const grid = document.getElementById("trainers-grid");
    if (!grid || trainers.length === 0) return hideSection("trainers");

    trainers.forEach(person => {
      const name = text(person.name);
      const specialties = (Array.isArray(person.specialties) ? person.specialties : []).map(s => text(s)).filter(Boolean);
      const details = [
        ["Qualifications", text(person.qualifications)],
        ["Experience", text(person.experience)]
      ].filter(([, value]) => value);

      grid.append(el("article", { className: "trainer-card" }, [
        imageOrPlaceholder(person.image, name, "trainer-photo", () =>
          el("div", { className: "trainer-avatar", "aria-hidden": "true", text: initials(name) || "★" })
        ),
        el("div", { className: "trainer-body" }, [
          el("h3", { text: name }),
          text(person.role) ? el("p", { className: "trainer-role", text: text(person.role) }) : null,
          specialties.length
            ? el("ul", { className: "trainer-specialties", "aria-label": "Specialties" },
                specialties.map(s => el("li", { className: "chip", text: s })))
            : null,
          details.length
            ? el("dl", { className: "trainer-details" }, details.map(([label, value]) =>
                el("div", {}, [el("dt", { text: `${label}: ` }), el("dd", { text: value })])
              ))
            : null,
          text(person.bio) ? el("p", { className: "trainer-bio", text: text(person.bio) }) : null
        ])
      ]));
    });
  }

  // ---------- 6. Membership Plans ----------
  function renderPricing() {
    const sections = config.sections || {};
    setText("membership-title", text(sections.membershipTitle, text(preset.membershipTitle, "Membership Plans")));
    setText("membership-subtitle", text(sections.membershipSubtitle, text(preset.membershipSubtitle)));
    setText("pricing-note", text(booking.pricingNote));

    const plans = list(config.pricingPlans).filter(plan => text(plan.name) && text(plan.price));
    const grid = document.getElementById("pricing-grid");
    if (!grid || plans.length === 0) return hideSection("membership");

    const defaultCta = text(booking.planCtaLabel, "Choose Plan");

    plans.forEach(plan => {
      const name = text(plan.name);
      const features = (Array.isArray(plan.features) ? plan.features : []).map(f => text(f)).filter(Boolean);
      const highlighted = plan.highlighted === true;
      const label = text(plan.ctaLabel, defaultCta);

      grid.append(el("article", { className: `pricing-card${highlighted ? " is-highlighted" : ""}` }, [
        text(plan.badge) ? el("span", { className: "pricing-badge", text: text(plan.badge) }) : null,
        el("h3", { text: name }),
        el("p", { className: "pricing-price" }, [
          el("strong", { text: text(plan.price) }),
          text(plan.billing) ? el("span", { text: text(plan.billing) }) : null
        ]),
        features.length ? el("ul", { className: "pricing-features" }, features.map(f => el("li", { text: f }))) : el("div", { className: "pricing-features" }),
        el("button", {
          type: "button",
          className: highlighted ? "btn btn-lg btn-block" : "btn btn-outline btn-lg btn-block",
          "aria-label": `${label}: ${name}`,
          dataset: { openInquiry: "", inquiry: "membership", plan: name },
          text: label
        })
      ]));
    });
  }

  // ---------- 7. About & Facilities ----------
  function renderAbout() {
    const about = config.about || {};
    setText("about-title", text(about.title, `About ${text(config.brandName, "Us")}`));
    setText("about-subtitle", text(about.subtitle));
    setText("about-p1", text(about.paragraph1, text(config.description)));
    setText("about-p2", text(about.paragraph2));

    ["about-subtitle", "about-p1", "about-p2"].forEach(id => {
      const node = document.getElementById(id);
      if (node && !node.textContent) node.hidden = true;
    });

    const differentiators = document.getElementById("differentiators");
    list(about.differentiators).filter(item => text(item.title)).forEach(item => {
      differentiators.append(el("li", { className: "differentiator" }, [
        el("span", { className: "differentiator-icon", "aria-hidden": "true", text: text(item.icon, "✓") }),
        el("div", {}, [
          el("h3", { text: text(item.title) }),
          text(item.text) ? el("p", { text: text(item.text) }) : null
        ])
      ]));
    });

    const media = document.getElementById("about-media");
    if (media) {
      media.append(imageOrPlaceholder(about.image, text(about.title, "About us"), "about-image", () =>
        el("div", { className: "media-placeholder", role: "img", "aria-label": text(config.brandName, "Our studio") }, [
          el("span", { className: "media-placeholder-icon", "aria-hidden": "true", text: text(preset.icon, "★") }),
          el("span", { text: text(config.brandName) })
        ])
      ));
    }

    const facilities = list(config.facilities).filter(item => text(item.label));
    const facilitiesList = document.getElementById("facilities-list");
    if (facilitiesList && facilities.length) {
      facilities.forEach(item => {
        facilitiesList.append(el("li", { className: "facility-item" }, [
          el("span", { className: "facility-icon", "aria-hidden": "true", text: text(item.icon, "✓") }),
          text(item.label)
        ]));
      });
      document.getElementById("facilities").hidden = false;
    }
  }

  // ---------- 8. Testimonials (only when genuine content exists) ----------
  function renderTestimonials() {
    const testimonials = list(config.testimonials).filter(t => text(t.quote) && text(t.name));
    const grid = document.getElementById("testimonials-grid");
    if (!grid || testimonials.length === 0) return hideSection("testimonials");

    testimonials.forEach(t => {
      const imageUrl = safeUrl(t.image);
      grid.append(el("figure", { className: "testimonial-card" }, [
        el("blockquote", {}, [el("p", { text: `"${text(t.quote)}"` })]),
        el("figcaption", { className: "testimonial-author" }, [
          imageUrl ? el("img", { src: imageUrl, alt: "", loading: "lazy" }) : null,
          el("div", {}, [
            el("strong", { text: text(t.name) }),
            text(t.detail) ? el("span", { text: text(t.detail) }) : null
          ])
        ])
      ]));
    });
    document.getElementById("testimonials").hidden = false;
  }

  // ---------- 9. FAQ Accordion ----------
  function renderFaqs() {
    const faqs = list(config.faqs).filter(faq => text(faq.question) && text(faq.answer));
    const faqList = document.getElementById("faq-list");
    if (!faqList || faqs.length === 0) return hideSection("faq");

    faqs.forEach((faq, index) => {
      const questionId = `faq-question-${index}`;
      const answerId = `faq-answer-${index}`;

      const button = el("button", {
        type: "button",
        className: "faq-question",
        id: questionId,
        "aria-expanded": "false",
        "aria-controls": answerId
      }, [el("span", { text: text(faq.question) }), el("span", { className: "faq-icon", "aria-hidden": "true" })]);

      const answer = el("div", { className: "faq-answer", id: answerId, role: "region", "aria-labelledby": questionId }, [
        el("p", { text: text(faq.answer) })
      ]);
      answer.hidden = true;

      button.addEventListener("click", () => {
        const isOpen = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!isOpen));
        answer.hidden = isOpen;
      });

      faqList.append(el("div", { className: "faq-item" }, [el("h3", {}, [button]), answer]));
    });
  }

  // ---------- 10. Footer: Contact, Hours & Social ----------
  function renderContact() {
    const phone = text(contact.phone);
    const whatsapp = text(contact.whatsapp).replace(/\D/g, "");
    const email = text(contact.email);
    const address = text(contact.address);
    const mapLink = safeUrl(contact.mapLink);

    const items = [
      phone && { icon: "📞", label: "Phone", value: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` },
      whatsapp && { icon: "💬", label: "WhatsApp", value: "Chat with us", href: `https://wa.me/${whatsapp}`, external: true },
      email && { icon: "✉️", label: "Email", value: email, href: `mailto:${email}` },
      address && { icon: "📍", label: "Address", value: address },
      mapLink && { icon: "🗺️", label: "Directions", value: "View on map", href: mapLink, external: true }
    ].filter(Boolean);

    const footerContact = document.getElementById("footer-contact");
    items.forEach(item => {
      const valueNode = item.href
        ? el("a", {
            href: item.href,
            text: item.value,
            target: item.external ? "_blank" : null,
            rel: item.external ? "noopener noreferrer" : null
          })
        : item.value;
      footerContact.append(el("li", { className: "footer-contact-item" }, [
        el("span", { "aria-hidden": "true", text: item.icon }),
        el("span", {}, [el("span", { className: "visually-hidden", text: `${item.label}: ` }), valueNode])
      ]));
    });

    // Social links
    const socials = list(config.social).filter(s => text(s.platform) && safeUrl(s.url));
    const footerSocial = document.getElementById("footer-social");
    socials.forEach(s => {
      footerSocial.append(el("li", {}, [el("a", {
        href: safeUrl(s.url),
        target: "_blank",
        rel: "noopener noreferrer",
        text: text(s.platform)
      })]));
    });

    // Opening hours
    const hours = list(config.operatingHours).filter(row => text(row.day));
    const footerHours = document.getElementById("footer-hours");
    hours.forEach(row => {
      const value = row.closed ? "Closed" : text(row.hours, "Contact us");
      footerHours.append(el("li", {}, [el("strong", { text: `${text(row.day)}: ` }), value]));
    });
  }

  // ---------- 11. Mobile Navigation ----------
  function initNavigation() {
    const toggle = document.getElementById("mobileToggle");
    const navLinks = document.getElementById("navLinks");
    if (!toggle || !navLinks) return;

    function setMenu(open) {
      navLinks.classList.toggle("active", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    toggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("active")));

    // Close the menu when a link or button inside it is used
    navLinks.querySelectorAll("a, button").forEach(item => {
      item.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        setMenu(false);
        toggle.focus();
      }
    });

    // Reset when resizing back to desktop
    window.matchMedia("(min-width: 961px)").addEventListener("change", e => {
      if (e.matches) setMenu(false);
    });
  }

  const schedule = normalizeSchedule();
  const trainers = list(config.trainers).filter(person => text(person.name));

  applyTheme();
  renderBranding();
  renderHero(schedule, trainers);
  renderSchedule(schedule);
  renderTrainers(trainers);
  renderPricing();
  renderAbout();
  renderTestimonials();
  renderFaqs();
  renderContact();
  initNavigation();
});
