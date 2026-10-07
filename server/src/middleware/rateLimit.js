import rateLimit from "express-rate-limit";

// Brute-force protection on login endpoints. Keyed by IP; 10 attempts per
// 15 minutes is enough for a real user who mistypes a password a few times,
// tight enough to slow down credential-stuffing.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Try again in a few minutes." },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many account creation attempts. Try again later." },
});

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many messages sent. Try again later." },
});

const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many password changes. Try again later." },
});

export { loginLimiter, registerLimiter, contactLimiter, passwordChangeLimiter };
