const images = import.meta.glob('./*.png', { eager: true });

/**
 * Get all character logos from the public/images/characters folder.
 * @type {string[]} An array of character logos.
 */
const characterLogos = Object.keys(images).reduce((acc, path) => {
  const name = path.match(/character(\d+)\.png$/)?.[1];
  if (name) {
    acc[+name] = (images[path] as any).default;
  }
  return acc;
}, [] as string[]);

export default characterLogos;