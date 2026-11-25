// Shared animation timing so motion feels consistent across the site.
export const ease = [0.22, 1, 0.36, 1] as const;

export const dur = { fast: 0.25, base: 0.6, slow: 0.9 } as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: dur.base, ease } },
};

export const stagger = (step = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
});
