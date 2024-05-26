const images = import.meta.glob('./*.png', { eager: true });

/**
 * Get all character logos from the public/images/characters folder.
 * @type {string[]} An array of character logos.
 */
const characterLogos = Object.keys(images).reduce((acc, path) => {
  const name = path.match(/character(\d+)\.png$/)?.[1];
  if (name) {
    // Remove `/public/` from the path
    const imagePath = images[path] as any;
    acc[+name] = imagePath.default.replace('/public/', '/');
  }
  return acc;
}, [] as string[]);

export default characterLogos;
