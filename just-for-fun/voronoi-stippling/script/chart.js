/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018–2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@mbostock/voronoi-stippling
// > ISC License
// > Permission to use, copy, modify, and/or distribute this software for any
// > purpose with or without fee is hereby granted, provided that the above
// > copyright notice and this permission notice appear in all copies.>
//
// > THE SOFTWARE IS PROVIDED 'AS IS' AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// > WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// > MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// > ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// > WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// > ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// > OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

export const voronoiStippling = (image, {
  script = './script/worker-script.js',
  width = 600,
  invalidation = new Promise((resolve, reject) => { // when this promise resolves, stop the simulation
    setTimeout(() => {
      resolve();
    }, 8000)
  }) // optimization will be stopped after 8 sec
} = {}) => {
  const height = Math.round(width * image.height / image.width);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  context.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);

  const {
    data: rgba
  } = context.getImageData(0, 0, width, height);

  const n = Math.round(width * height / 40);
  const data = new Float64Array(width * height);
  for (let i = 0, n = rgba.length / 4; i < n; ++i) {
    data[i] = Math.max(0, 1 - rgba[i * 4] / 254)
  };
  data.width = width;
  data.height = height;

  const worker = new Worker(script);

  const messaged = ({
    data: points
  }) => {
    context.fillStyle = '#fff';
    context.fillRect(0, 0, width, height);
    context.beginPath();
    for (let i = 0, n = points.length; i < n; i += 2) {
      const x = points[i];
      const y = points[i + 1];
      context.moveTo(x + 1.5, y);
      context.arc(x, y, 1.5, 0, 2 * Math.PI);
    }
    context.fillStyle = '#000';
    context.fill();
  }

  invalidation.then(() => worker.terminate());
  worker.addEventListener('message', messaged);
  worker.postMessage({
    data,
    width,
    height,
    n
  });

  return context.canvas;
}