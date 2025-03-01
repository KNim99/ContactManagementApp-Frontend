// Regular expressions for validation
const PATTERNS = {
  NAME: /^.{3,}$/,

  // RFC 5322 compliant email regex
  EMAIL:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,

  // International phone number format (more flexible)
  PHONE: /^(?:\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
};

// Validation messages
const MESSAGES = {
  NAME: {
    REQUIRED: "Name is required.",
    INVALID: "Name must be at least 3 characters long.",
  },
  EMAIL: {
    REQUIRED: "Email is required.",
    INVALID: "Please enter a valid email address.",
  },
  PHONE: {
    INVALID: "Please enter a valid phone number (e.g., 123-456-7890).",
  },
};

export const validateContact = (contact) => {
  const errors = {};

  // Name validation
  if (!contact.name.trim()) {
    errors.name = MESSAGES.NAME.REQUIRED;
  } else if (!PATTERNS.NAME.test(contact.name.trim())) {
    errors.name = MESSAGES.NAME.INVALID;
  }

  // Email validation
  if (!contact.email.trim()) {
    errors.email = MESSAGES.EMAIL.REQUIRED;
  } else if (!PATTERNS.EMAIL.test(contact.email.trim())) {
    errors.email = MESSAGES.EMAIL.INVALID;
  }

  // Phone validation (optional but must be valid if provided)
  if (contact.phone?.trim() && !PATTERNS.PHONE.test(contact.phone.trim())) {
    errors.phone = MESSAGES.PHONE.INVALID;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
