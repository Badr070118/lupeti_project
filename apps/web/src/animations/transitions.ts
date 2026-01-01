export const springTransition = {
  type: 'spring',
  stiffness: 260,
  damping: 25,
};

export const hoverTransition = {
  duration: 0.3,
  ease: 'easeOut' as const,
};

export const fadeTransition = {
  duration: 0.5,
  ease: 'easeInOut' as const,
};
