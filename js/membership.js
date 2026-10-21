document.addEventListener("DOMContentLoaded", () => {
  if (typeof fitnessConfig === "undefined") return;

  const config = fitnessConfig;
  const booking = config.booking || {};
  const contact = config.contact || {};

  const modal = document.getElementById("inquiry-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const form = document.getElementById("inquiry-form");
  const formView = document.getElementById("inquiry-form-view");
  const successView = document.getElementById("inquiry-success");
  const formError = document.getElementById("form-error");
  const planSelect = document.getElementById("join-plan");
  const classSelect = document.getElementById("join-class");
  const dateInput = document.getElementById("join-date");
  if (!modal || !form) return;

  const fields = {
    name: document.getElementById("join-name"),
    phone: document.getElementById("join-phone"),
    email: document.getElementById("join-email"),
    plan: planSelect,
    class: classSelect,
    date: dateInput
  };

  function text(value, fallback = "") {
    if (typeof value === "number") return String(value);
    if (typeof value !== "string") return fallback;
    return value.trim() || fallback;
  }

  const brandName = text(config.brandName, "the studio");
  const whatsappNumber = text(contact.whatsapp).replace(/\D/g, "");
  const email = text(contact.email);
  const phone = text(contact.phone);
  const requireEmail = booking.requireEmail === true;
  const WEEK_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const plans = (Array.isArray(config.pricingPlans) ? config.pricingPlans : [])
    .filter(plan => plan && text(plan.name));
  const classNames = [...new Set((Array.isArray(config.schedule) ? config.schedule : [])
    .map(item => text(item && item.title))
    .filter(Boolean))];

  // Inquiry types - only offered when the related content exists
  const inquiryTypes = [
    booking.freeTrial !== false && { value: "trial", label: "Free Trial", dateLabel: "Preferred Trial Date", intro: "I would like to request a free trial." },
    plans.length > 0 && { value: "membership", label: "Membership", dateLabel: "Preferred Start Date", intro: "I am interested in a membership." },
    classNames.length > 0 && { value: "class", label: "Book a Class", dateLabel: "Preferred Class Date", intro: "I would like to book a class." }
  ].filter(Boolean);

  // Only keep methods that have the contact detail they need
  const methods = (Array.isArray(booking.methods) ? booking.methods : ["whatsapp"])
    .filter(method => (method === "whatsapp" && whatsappNumber) || (method === "email" && email));
  const methodLabels = { whatsapp: "WhatsApp", email: "Email" };

  let lastFocused = null;
  let preselectedClass = null; // { title, time } when opened from a timetable card

  // ---------- Setup ----------
  function radio(name, value, label, isDefault) {
    const input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.value = value;
    input.defaultChecked = isDefault; // survives form.reset()
    const wrapper = document.createElement("label");
    wrapper.className = "choice-option";
    wrapper.append(input, label);
    return wrapper;
  }

  function setup() {
    document.getElementById("inquiry-title").textContent = text(booking.modalTitle, `Join ${brandName}`);
    document.getElementById("inquiry-intro").textContent = text(booking.modalIntro, "Tell us what you're interested in and we'll get back to you to confirm the details.");
    document.getElementById("inquiry-submit").textContent = text(booking.submitLabel, "Send Inquiry");

    // Inquiry type options
    const typeOptions = document.getElementById("type-options");
    inquiryTypes.forEach((type, index) => typeOptions.append(radio("type", type.value, type.label, index === 0)));
    if (inquiryTypes.length < 2) document.getElementById("type-group").hidden = true;

    // Membership plans
    if (plans.length) {
      planSelect.append(new Option("Select a plan", ""));
      plans.forEach(plan => {
        const details = [text(plan.price), text(plan.billing)].filter(Boolean).join(" ");
        planSelect.append(new Option(details ? `${text(plan.name)} (${details})` : text(plan.name), text(plan.name)));
      });
      planSelect.append(new Option("Not sure yet - please advise", "Not sure yet"));
    } else {
      document.getElementById("plan-group").hidden = true;
    }

    // Classes / training types
    if (classNames.length) {
      classSelect.append(new Option("Select a class", ""));
      classNames.forEach(name => classSelect.append(new Option(name, name)));
      classSelect.append(new Option("Not sure yet - please advise", "Not sure yet"));
    } else {
      document.getElementById("class-group").hidden = true;
    }

    // Email requirement
    if (requireEmail) {
      fields.email.required = true;
      document.getElementById("email-optional").hidden = true;
      document.getElementById("email-required").hidden = false;
    }

    dateInput.min = todayISO();

    // Contact method choice is shown only when more than one is available
    const defaultMethod = methods.includes(booking.defaultMethod) ? booking.defaultMethod : methods[0];
    if (methods.length > 1) {
      const methodOptions = document.getElementById("method-options");
      methods.forEach(method => methodOptions.append(radio("method", method, methodLabels[method], method === defaultMethod)));
      document.getElementById("method-group").hidden = false;
    }

    form.addEventListener("change", e => {
      if (e.target.name === "method") updatePrivacyNote();
      if (e.target.name === "type") updateTypeUI();
    });
  }

  function todayISO() {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split("T")[0];
  }

  // Next date (from today) that falls on the given weekday name
  function nextDateFor(dayName) {
    const target = WEEK_DAYS.findIndex(day => day.toLowerCase() === text(dayName).toLowerCase());
    if (target === -1) return "";
    const date = new Date();
    date.setDate(date.getDate() + ((target - date.getDay() + 7) % 7));
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().split("T")[0];
  }

  function selectedValue(name, fallback) {
    const checked = form.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : fallback;
  }

  function currentType() {
    const value = selectedValue("type", inquiryTypes[0] && inquiryTypes[0].value);
    return inquiryTypes.find(type => type.value === value) || inquiryTypes[0];
  }

  function currentMethod() {
    return selectedValue("method", methods[0]);
  }

  // Adjusts labels and required fields for the chosen inquiry type
  function updateTypeUI() {
    const type = currentType();
    const value = type ? type.value : "";
    document.getElementById("date-label").textContent = type ? type.dateLabel : "Preferred Date";
    dateInput.required = value === "trial" || value === "class";
    planSelect.required = value === "membership";
    classSelect.required = value === "class";

    // Show the required marker only when the field is required
    [["plan-group", planSelect], ["class-group", classSelect], ["date-group", dateInput]].forEach(([groupId, input]) => {
      const label = document.querySelector(`#${groupId} label`);
      label.querySelectorAll(".required, .optional").forEach(node => node.remove());
      const marker = document.createElement("span");
      marker.className = input.required ? "required" : "optional";
      marker.textContent = input.required ? " *" : " (optional)";
      if (input.required) marker.setAttribute("aria-hidden", "true");
      label.append(marker);
    });
  }

  function updatePrivacyNote() {
    const note = document.getElementById("privacy-note");
    const method = currentMethod();
    if (!method) {
      note.hidden = true;
      return;
    }
    const service = method === "whatsapp" ? "WhatsApp" : "your email app";
    note.hidden = false;
    note.textContent = `Your details are not stored on this website. Submitting opens ${service} with your inquiry so you can review and send it to ${brandName}. WhatsApp and email are external services with their own privacy policies.`;
  }

  // ---------- Modal open / close ----------
  function openModal(options = {}) {
    lastFocused = document.activeElement;
    resetForm();

    const typeInput = form.querySelector(`input[name="type"][value="${options.type}"]`);
    if (typeInput) typeInput.checked = true;

    if (options.plan && [...planSelect.options].some(opt => opt.value === options.plan)) planSelect.value = options.plan;
    if (options.cls && [...classSelect.options].some(opt => opt.value === options.cls)) classSelect.value = options.cls;
    if (options.day) dateInput.value = nextDateFor(options.day);
    if (options.cls && options.time) preselectedClass = { title: options.cls, time: options.time };

    updateTypeUI();
    modal.classList.add("active");
    document.body.classList.add("modal-open");
    setTimeout(() => fields.name.focus(), 50);
  }

  function closeModal() {
    if (!modal.classList.contains("active")) return;
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function resetForm() {
    form.reset();
    preselectedClass = null;
    ["name", "phone", "email", "plan", "class", "date"].forEach(key => setFieldError(key, ""));
    formError.hidden = true;
    formView.hidden = false;
    successView.hidden = true;
    updateTypeUI();
    updatePrivacyNote();

    if (methods.length === 0) {
      const callText = phone ? ` Please call us on ${phone}.` : "";
      showFormError(`Online inquiries are not available right now.${callText}`);
    }
  }

  // Any element with data-open-inquiry opens the modal.
  // data-inquiry = trial | membership | class, data-plan / data-class / data-day preselect values.
  document.addEventListener("click", e => {
    const trigger = e.target.closest("[data-open-inquiry]");
    if (!trigger) return;
    e.preventDefault();
    openModal({
      type: trigger.dataset.inquiry,
      plan: trigger.dataset.plan,
      cls: trigger.dataset.class,
      day: trigger.dataset.day,
      time: trigger.dataset.time
    });
  });

  closeBtn.addEventListener("click", closeModal);
  document.getElementById("success-close-btn").addEventListener("click", closeModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });

  // Escape closes the modal; Tab stays inside it
  document.addEventListener("keydown", e => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") {
      closeModal();
      return;
    }
    if (e.key !== "Tab") return;

    const focusable = [...modal.querySelectorAll("button, input, select, textarea, a[href], [tabindex]:not([tabindex='-1'])")]
      .filter(node => !node.disabled && node.offsetParent !== null);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // ---------- Validation ----------
  function setFieldError(key, message) {
    const input = fields[key];
    const error = document.getElementById(`join-${key}-error`);
    if (!input) return;
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
    if (error) error.textContent = message;
  }

  function showFormError(message) {
    formError.textContent = message;
    formError.hidden = false;
  }

  function validate(values) {
    const errors = {};
    const phoneDigits = values.phone.replace(/[\s\-().]/g, "");

    if (values.name.length < 2) errors.name = "Please enter your full name.";
    if (!values.phone) errors.phone = "Please enter your phone number.";
    else if (!/^\+?\d{7,15}$/.test(phoneDigits)) errors.phone = "Please enter a valid phone number (7-15 digits, optional +country code).";
    if (requireEmail && !values.email) errors.email = "Please enter your email address.";
    else if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Please enter a valid email address.";
    if (planSelect.required && !values.plan) errors.plan = "Please choose a plan.";
    if (classSelect.required && !values.class) errors.class = "Please choose a class.";
    if (dateInput.required && !values.date) errors.date = "Please choose a preferred date.";
    else if (values.date && values.date < dateInput.min) errors.date = "Please choose today or a future date.";

    return errors;
  }

  function formatDate(isoDate) {
    const [year, month, day] = isoDate.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString(undefined, {
      weekday: "short", day: "numeric", month: "short", year: "numeric"
    });
  }

  // ---------- Submit via WhatsApp or email ----------
  form.addEventListener("submit", e => {
    e.preventDefault();
    formError.hidden = true;

    const values = {
      name: fields.name.value.trim(),
      phone: fields.phone.value.trim(),
      email: fields.email.value.trim(),
      plan: planSelect.value,
      class: classSelect.value,
      date: dateInput.value,
      message: document.getElementById("join-message").value.trim()
    };

    const errors = validate(values);
    const keys = ["name", "phone", "email", "plan", "class", "date"];
    keys.forEach(key => setFieldError(key, errors[key] || ""));
    const firstInvalid = keys.find(key => errors[key]);
    if (firstInvalid) {
      showFormError("Please correct the highlighted fields.");
      fields[firstInvalid].focus();
      return;
    }

    const method = currentMethod();
    if (!method) {
      const callText = phone ? ` Please call us on ${phone}.` : "";
      showFormError(`Online inquiries are not available right now.${callText}`);
      return;
    }

    const type = currentType();
    const classTime = preselectedClass && preselectedClass.title === values.class ? preselectedClass.time : "";
    const details = [
      type && `Inquiry: ${type.label}`,
      `Name: ${values.name}`,
      `Phone: ${values.phone}`,
      values.email && `Email: ${values.email}`,
      values.plan && `Plan: ${values.plan}`,
      values.class && `Class: ${values.class}${classTime ? ` (${classTime})` : ""}`,
      values.date && `${type ? type.dateLabel : "Preferred date"}: ${formatDate(values.date)}`,
      values.message && `Message: ${values.message}`
    ].filter(Boolean);
    const intro = type ? type.intro : "I have a question.";
    const message = `Hello ${brandName}, ${intro}\n\n${details.join("\n")}`;

    let url;
    if (method === "whatsapp") {
      url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener");
    } else {
      const subject = `${text(booking.emailSubject, "Inquiry")} - ${type ? type.label : "General"} - ${values.name}`;
      url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      window.location.href = url;
    }

    showSuccess(method, url);
  });

  function showSuccess(method, url) {
    const appName = method === "whatsapp" ? "WhatsApp" : "your email app";
    document.getElementById("success-text").textContent =
      `We've opened ${appName} with your inquiry. Please press send there to deliver it to ${brandName}.`;
    document.getElementById("success-note").textContent =
      `This is an inquiry only. No membership has been purchased and no class place is reserved until ${brandName} confirms with you.`;

    const fallback = document.getElementById("success-fallback");
    const link = document.createElement("a");
    link.href = url;
    link.textContent = method === "whatsapp" ? "Open WhatsApp again" : "Open email again";
    if (method === "whatsapp") {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    fallback.replaceChildren("Didn't open? ", link, phone ? ` or call ${phone}.` : "");

    form.reset();
    formView.hidden = true;
    successView.hidden = false;
    document.getElementById("success-title").focus();
  }

  setup();
  updateTypeUI();
  updatePrivacyNote();
});
