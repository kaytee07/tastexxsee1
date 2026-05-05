export const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

export const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export const drawLine = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
};

export const viewportOnce = { once: true, margin: '-100px' };
