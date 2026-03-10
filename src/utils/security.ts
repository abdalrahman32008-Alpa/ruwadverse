// Rate Limiter
export const rateLimiter = {
  attempts: 0,
  lastReset: Date.now(),
  check() {
    if (Date.now() - this.lastReset > 60000) {
      this.attempts = 0;
      this.lastReset = Date.now();
    }
    if (this.attempts >= 3) return false;
    this.attempts++;
    return true;
  }
};

// Input Validation
export const validateInput = {
  text: (text: string) => {
    // Basic HTML/Script injection prevention
    const regex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
    return !regex.test(text) && !text.includes('<') && !text.includes('>');
  },
  email: (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },
  phone: (phone: string) => {
    // Egyptian phone number format (01xxxxxxxxx)
    const regex = /^01[0125][0-9]{8}$/;
    return regex.test(phone);
  },
  password: (password: string) => {
    // At least 8 chars, 1 number, 1 uppercase
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }
};

// Session Timeout Logic (Helper)
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
export const WARNING_TIMEOUT_MS = 29 * 60 * 1000; // 29 minutes (1 min warning)
