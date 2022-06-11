/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2014–2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@d3/logo
// > ISC License
// > Permission to use, copy, modify, and/or distribute this software for any
// > purpose with or without fee is hereby granted, provided that the above
// > copyright notice and this permission notice appear in all copies.>
//
// > THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// > WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// > MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// > ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// > WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// > ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// > OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

export const logo = ({
  svgId = 'logo',
  width = 600,
  height = width
} = {}) => {
  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-10, -10, 116, 111]);

  svg.html(`
  <path fill='#bbb' d='
    M0,0
    h7.75
    a45.5,45.5 0 1 1 0,91
    h-7.75
    v-20
    h7.75
    a25.5,25.5 0 1 0 0,-51
    h-7.75
    z
    m36.2510,0
    h32
    a27.75,27.75 0 0 1 21.331,45.5
    a27.75,27.75 0 0 1 -21.331,45.5
    h-32
    a53.6895,53.6895 0 0 0 18.7464,-20
    h13.2526
    a7.75,7.75 0 1 0 0,-15.5
    h-7.75
    a53.6895,53.6895 0 0 0 0,-20
    h7.75
    a7.75,7.75 0 1 0 0,-15.5
    h-13.2526
    a53.6895,53.6895 0 0 0 -18.7464,-20
    z
  '/>

  <g fill='none' stroke='currentColor' stroke-width='0.15' stroke-opacity='0.3'>
    <line x1='-100' x2='200' y1='0' y2='0'/>
    <line x1='-100' x2='200' y1='20' y2='20'/>
    <line x1='-100' x2='200' y1='35.5' y2='35.5'/>
    <line x1='-100' x2='200' y1='45.5' y2='45.5'/>
    <line x1='-100' x2='200' y1='55.5' y2='55.5'/>
    <line x1='-100' x2='200' y1='71' y2='71'/>
    <line x1='-100' x2='200' y1='91' y2='91'/>
    <line x1='0' x2='0' y1='-100' y2='200'/>
    <line x1='7.75' x2='7.75' y1='-100' y2='200'/>
    <line x1='60.5' x2='60.5' y1='-100' y2='200'/> <!-- XXX  -->
    <line x1='68.25' x2='68.25' y1='-100' y2='200'/>
    <line x1='96' x2='96' y1='-100' y2='200'/>
  </g>

  <g fill='blue'>
    <circle cx='7.75' cy='45.5' r='.5'/>
    <circle cx='68.25' cy='27.75' r='.5'/>
    <circle cx='68.25' cy='63.25' r='.5'/>
  </g>

  <g fill='red'>
    <!-- Intersecting horizontal lines with the r=53.6895 circle. -->
    <circle cx='36.2510' cy='0' r='.5'/>
    <circle cx='54.9974' cy='20' r='.5'/>
    <circle cx='60.5' cy='35.5' r='.5'/>
    <circle cx='60.5' cy='55.5' r='.5'/>
    <circle cx='54.9974' cy='71' r='.5'/>
    <circle cx='36.2510' cy='91' r='.5'/>

    <!-- Intersecting the two r=27.75 circles. -->
    <circle cx='89.5807' cy='45.5' r='.5'/>
  </g>

  <g fill='none' stroke='currentColor' stroke-width='0.15'>
    <circle cx='7.75' cy='45.5' r='25.5'/>
    <circle cx='7.75' cy='45.5' r='45.5'/>
    <!-- Radius is computed to intersect at the intended x=60.5. -->
    <circle cx='7.75' cy='45.5' r='53.6895'/>
    <circle cx='68.25' cy='27.75' r='7.75'/>
    <circle cx='68.25' cy='27.75' r='27.75'/>
    <circle cx='68.25' cy='63.25' r='7.75'/>
    <circle cx='68.25' cy='63.25' r='27.75'/>
  </g>`);

  return svg.node();
}

export const playLogo = ({
  svgId = 'play-logo',
  width = 600,
  height = width,
  duration = 10
} = {}) => {
  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-10, -10, 116, 111]);

  svg.html(`<svg viewBox='-10 -10 116 111'>
    <defs>
      <path id='dee' d='M0,0h7.75a45.5,45.5 0 1 1 0,91h-7.75v-20h7.75a25.5,25.5 0 1 0 0,-51h-7.75z'/>
      <path id='three' d='M36.2510,0h32a27.75,27.75 0 0 1 21.331,45.5a27.75,27.75 0 0 1 -21.331,45.5h-32a53.6895,53.6895 0 0 0 18.7464,-20h13.2526a7.75,7.75 0 1 0 0,-15.5h-7.75a53.6895,53.6895 0 0 0 0,-20h7.75a7.75,7.75 0 1 0 0,-15.5h-13.2526a53.6895,53.6895 0 0 0 -18.7464,-20z'/>
      <clipPath id='clip-three'>
        <use xlink:href='${new URL('#three', location)}'/>
      </clipPath>
    </defs>
    <g fill='#ccc'>
      <use xlink:href='${new URL('#dee', location)}'/>
      <use xlink:href='${new URL('#three', location)}'/>
    </g>
    <g fill='none' stroke='currentColor' stroke-width='20'>
      <path id='stroke1' stroke-dasharray='0,10000' d='M0,10h7.75a35.5,35.5 0 1 1 0,71h-7.75'/>
      <path id='stroke2' stroke-dasharray='0,10000' clip-path='url(${new URL('#clip-three', location)})' d='M36.2510,10h32a17.75,17.75 0 0 1 0,35.5h-7.75h7.75a17.75,17.75 0 0 1 0,35.5h-32'/>
    </g>`);

  const genUpdate = () => {
    let i = 0;
    const n = 240;
    const update = () => {
      if (i < n) {
        const stroke1 = document.querySelector('#stroke1');
        const stroke2 = document.querySelector('#stroke2');
        const length1 = stroke1.getTotalLength();
        const length2 = stroke2.getTotalLength();
        const length = length1 + length2;

        const t = (i + 1) / n;
        stroke1.setAttribute('stroke-dasharray', `${t * length},${length1}`);
        stroke2.setAttribute('stroke-dasharray', `${Math.max(0, t * length - length1)},${length2}`);

        i++;
      }
    }
    return update;
  }

  const update = genUpdate();
  return Object.assign(svg.node(), {
    async play() {
      for (let i = 0, n = 240; i < n; ++i) {
        const transition = svg.transition()
          .duration(duration)
          .ease(d3.easeLinear);

        const stroke1 = document.querySelector('#stroke1');
        const stroke2 = document.querySelector('#stroke2');
        const length1 = stroke1.getTotalLength();
        const length2 = stroke2.getTotalLength();
        const length = length1 + length2;

        const t = (i + 1) / n;
        stroke1.setAttribute('stroke-dasharray', `${t * length},${length1}`);
        stroke2.setAttribute('stroke-dasharray', `${Math.max(0, t * length - length1)},${length2}`);

        await transition.end();
      }
    }
  });
}

export const colorLogo = ({
  svgId = 'play-logo',
  width = 600,
  height = width,
  color = {
    a0: '#f9a03c',
    a1: "#f7974e",
    b0: '#f26d58',
    b1: '#f9a03c',
    c0: '#b84e51',
    c1: '#f68e48'
  }
} = {}) => {
  const svg = d3.create('svg').attr('version', 1.1).attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-10, -10, 116, 111]);

  const htmlText = color => `
  <clipPath id='clip'>
    <path d='M0,0h7.75a45.5,45.5 0 1 1 0,91h-7.75v-20h7.75a25.5,25.5 0 1 0 0,-51h-7.75zm36.2510,0h32a27.75,27.75 0 0 1 21.331,45.5a27.75,27.75 0 0 1 -21.331,45.5h-32a53.6895,53.6895 0 0 0 18.7464,-20h13.2526a7.75,7.75 0 1 0 0,-15.5h-7.75a53.6895,53.6895 0 0 0 0,-20h7.75a7.75,7.75 0 1 0 0,-15.5h-13.2526a53.6895,53.6895 0 0 0 -18.7464,-20z'/>
  </clipPath>
  <linearGradient id='gradient-1' gradientUnits='userSpaceOnUse' x1='7' y1='64' x2='50' y2='107'>
    <stop offset='0' stop-color='${color.a0}'/>
    <stop offset='1' stop-color='${color.a1}'/>
  </linearGradient>
  <linearGradient id='gradient-2' gradientUnits='userSpaceOnUse' x1='2' y1='-2' x2='87' y2='84'>
    <stop offset='0' stop-color='${color.b0}'/>
    <stop offset='1' stop-color='${color.b1}'/>
  </linearGradient>
  <linearGradient id='gradient-3' gradientUnits='userSpaceOnUse' x1='45' y1='-10' x2='108' y2='53'>
    <stop offset='0' stop-color='${color.c0}'/>
    <stop offset='1' stop-color='${color.c1}'/>
  </linearGradient>
  <g clip-path='url(${new URL('#clip', location)})'>
    <path d='M-100,-102m-28,0v300h300z' fill='url(${new URL('#gradient-1', location)})'/>
    <path d='M-100,-102m28,0h300v300z' fill='url(${new URL('#gradient-3', location)})'/>
    <path d='M-100,-102l300,300' fill='none' stroke='url(${new URL('#gradient-2', location)})' stroke-width='40'/>
  </g>`;

  svg.html(htmlText(color));

  return Object.assign(svg.node(), {
    update(newColor) {
      svg.html(htmlText(newColor));
    }
  });
}