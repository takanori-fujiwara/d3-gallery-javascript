// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  geotiffContours
} from './chart.js';

const tiff = await d3.buffer('./data/sfctmp.tiff')
  .then(buffer => GeoTIFF.fromArrayBuffer(buffer));

const chart = await geotiffContours(tiff);

d3.select('body').append(() => chart);