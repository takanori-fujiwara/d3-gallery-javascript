export const context2d = (width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width = width + 'px';
  const context = canvas.getContext('2d');
  context.scale(devicePixelRatio, devicePixelRatio);
  return context;
}