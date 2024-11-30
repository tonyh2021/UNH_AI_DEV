export const delayFunc = (delay: number): Promise<boolean> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, delay);
  });
};
