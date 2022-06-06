/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2012–2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@d3/star-map

const superscript = '⁰¹²³⁴⁵⁶⁷⁸⁹';

const letters = {
  alf: 'α',
  bet: 'β',
  gam: 'γ',
  del: 'δ',
  eps: 'ε',
  zet: 'ζ',
  eta: 'η',
  tet: 'θ',
  iot: 'ι',
  kap: 'κ',
  lam: 'λ',
  mu: 'μ',
  nu: 'ν',
  xi: 'ξ',
  omi: 'ο',
  pi: 'π',
  ro: 'ρ',
  sig: 'σ',
  tau: 'τ',
  ups: 'υ',
  phi: 'φ',
  chi: 'χ',
  psi: 'ψ',
  omg: 'ω'
};

const nominative = {
  And: 'Andromeda',
  Ant: 'Antlia',
  Aps: 'Apus',
  Aqr: 'Aquarius',
  Aql: 'Aquila',
  Ara: 'Ara',
  Ari: 'Aries',
  Aur: 'Auriga',
  Boo: 'Boötes',
  Cae: 'Caelum',
  Cam: 'Camelopardalis',
  Cnc: 'Cancer',
  CVn: 'Canes Venatici',
  CMa: 'Canis Major',
  CMi: 'Canis Minor',
  Cap: 'Capricornus',
  Car: 'Carina',
  Cas: 'Cassiopeia',
  Cen: 'Centaurus',
  Cep: 'Cepheus',
  Cet: 'Cetus',
  Cha: 'Chamaeleon',
  Cir: 'Circinus',
  Col: 'Columba',
  Com: 'Coma Berenices',
  CrA: 'Corona Austrina',
  CrB: 'Corona Borealis',
  Crv: 'Corvus',
  Crt: 'Crater',
  Cru: 'Crux',
  Cyg: 'Cygnus',
  Del: 'Delphinus',
  Dor: 'Dorado',
  Dra: 'Draco',
  Equ: 'Equuleus',
  Eri: 'Eridanus',
  For: 'Fornax',
  Gem: 'Gemini',
  Gru: 'Grus',
  Her: 'Hercules',
  Hor: 'Horologium',
  Hya: 'Hydra',
  Hyi: 'Hydrus',
  Ind: 'Indus',
  Lac: 'Lacerta',
  Leo: 'Leo',
  LMi: 'Leo Minor',
  Lep: 'Lepus',
  Lib: 'Libra',
  Lup: 'Lupus',
  Lyn: 'Lynx',
  Lyr: 'Lyra',
  Men: 'Mensa',
  Mic: 'Microscopium',
  Mon: 'Monoceros',
  Mus: 'Musca',
  Nor: 'Norma',
  Oct: 'Octans',
  Oph: 'Ophiuchus',
  Ori: 'Orion',
  Pav: 'Pavo',
  Peg: 'Pegasus',
  Per: 'Perseus',
  Phe: 'Phoenix',
  Pic: 'Pictor',
  Psc: 'Pisces',
  PsA: 'Piscis Austrinus',
  Pup: 'Puppis',
  Pyx: 'Pyxis',
  Ret: 'Reticulum',
  Sge: 'Sagitta',
  Sgr: 'Sagittarius',
  Sco: 'Scorpius',
  Scl: 'Sculptor',
  Sct: 'Scutum',
  Ser: 'Serpens',
  Sex: 'Sextans',
  Tau: 'Taurus',
  Tel: 'Telescopium',
  Tri: 'Triangulum',
  TrA: 'Triangulum Australe',
  Tuc: 'Tucana',
  UMa: 'Ursa Major',
  UMi: 'Ursa Minor',
  Vel: 'Vela',
  Vir: 'Virgo',
  Vol: 'Volans',
  Vul: 'Vulpecula'
};

const genitive = {
  And: 'Andromedae',
  Ant: 'Antliae',
  Aps: 'Apodis',
  Aqr: 'Aquarii',
  Aql: 'Aquilae',
  Ara: 'Arae',
  Ari: 'Arietis',
  Aur: 'Aurigae',
  Boo: 'Boötis',
  Cae: 'Caeli',
  Cam: 'Camelopardalis',
  Cnc: 'Cancri',
  CVn: 'Canum Venaticorum',
  CMa: 'Canis Majoris',
  CMi: 'Canis Minoris',
  Cap: 'Capricorni',
  Car: 'Carinae',
  Cas: 'Cassiopeiae',
  Cen: 'Centauri',
  Cep: 'Cephei',
  Cet: 'Ceti',
  Cha: 'Chamaeleontis',
  Cir: 'Circini',
  Col: 'Columbae',
  Com: 'Comae Berenices',
  CrA: 'Coronae Australis',
  CrB: 'Coronae Borealis',
  Crv: 'Corvi',
  Crt: 'Crateris',
  Cru: 'Crucis',
  Cyg: 'Cygni',
  Del: 'Delphini',
  Dor: 'Doradus',
  Dra: 'Draconis',
  Equ: 'Equulei',
  Eri: 'Eridani',
  For: 'Fornacis',
  Gem: 'Geminorum',
  Gru: 'Gruis',
  Her: 'Herculis',
  Hor: 'Horologii',
  Hya: 'Hydrae',
  Hyi: 'Hydri',
  Ind: 'Indi',
  Lac: 'Lacertae',
  Leo: 'Leonis',
  LMi: 'Leonis Minoris',
  Lep: 'Leporis',
  Lib: 'Librae',
  Lup: 'Lupi',
  Lyn: 'Lyncis',
  Lyr: 'Lyrae',
  Men: 'Mensae',
  Mic: 'Microscopii',
  Mon: 'Monocerotis',
  Mus: 'Muscae',
  Nor: 'Normae',
  Oct: 'Octantis',
  Oph: 'Ophiuchi',
  Ori: 'Orionis',
  Pav: 'Pavonis',
  Peg: 'Pegasi',
  Per: 'Persei',
  Phe: 'Phoenicis',
  Pic: 'Pictoris',
  Psc: 'Piscium',
  PsA: 'Piscis Austrini',
  Pup: 'Puppis',
  Pyx: 'Pyxidis',
  Ret: 'Reticuli',
  Sge: 'Sagittae',
  Sgr: 'Sagittarii',
  Sco: 'Scorpii',
  Scl: 'Sculptoris',
  Sct: 'Scuti',
  Ser: 'Serpentis',
  Sex: 'Sextantis',
  Tau: 'Tauri',
  Tel: 'Telescopii',
  Tri: 'Trianguli',
  TrA: 'Trianguli Australis',
  Tuc: 'Tucanae',
  UMa: 'Ursae Majoris',
  UMi: 'Ursae Minoris',
  Vel: 'Velorum',
  Vir: 'Virginis',
  Vol: 'Volantis',
  Vul: 'Vulpeculae'
};

const formatTitle = ({
  id,
  constellation,
  greek_letter
}) => `HR${id}${constellation === null ? ``
: greek_letter === null ? `
${nominative[constellation]}` : `
${greek_letter
.replace(/[a-z]+/g, w => letters[w])
.replace(/\d/g, c => superscript[c])} ${genitive[constellation]}`}`;

export const starMap = (data, {
  svgId = 'star-map',
  width = 954 + 28,
  height = width
} = {}) => {
  const cx = width / 2;
  const cy = height / 2;
  const scale = (width - 120) * 0.5;

  const projection = d3.geoStereographic()
    .reflectY(true)
    .scale(scale)
    .clipExtent([
      [0, 0],
      [width, height]
    ])
    .rotate([0, -90])
    .translate([width / 2, height / 2])
    .precision(0.1);

  const xAxis = g => g
    .call(g => g.append('g')
      .attr('stroke', 'currentColor')
      .selectAll('line')
      .data(d3.range(0, 1440, 5)) // every 5 minutes
      .join('line')
      .datum(d => [
        projection([d / 4, 0]),
        projection([d / 4, d % 60 ? -1 : -2])
      ])
      .attr('x1', ([
        [x1]
      ]) => x1)
      .attr('x2', ([, [x2]]) => x2)
      .attr('y1', ([
        [, y1]
      ]) => y1)
      .attr('y2', ([, [, y2]]) => y2))
    .call(g => g.append('g')
      .selectAll('text')
      .data(d3.range(0, 1440, 60)) // every hour
      .join('text')
      .attr('dy', '0.35em')
      .text(d => `${d / 60}h`)
      .attr('font-size', d => d % 360 ? null : 14)
      .attr('font-weight', d => d % 360 ? null : 'bold')
      .datum(d => projection([d / 4, -4]))
      .attr('x', ([x]) => x)
      .attr('y', ([, y]) => y));

  const yAxis = g => g
    .call(g => g.append('g')
      .selectAll('text')
      .data(d3.range(10, 91, 10)) // every 10°
      .join('text')
      .attr('dy', '0.35em')
      .text(d => `${d}°`)
      .datum(d => projection([0, d]))
      .attr('x', ([x]) => x)
      .attr('y', ([, y]) => y));

  const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('text-anchor', 'middle')
    .attr('fill', 'currentColor')
    .style('margin', '0 -14px')
    .style('color', 'white')
    .style('background', 'radial-gradient(#081f2b 0%, #061616 100%)')
    .style('display', 'block');

  const path = d3.geoPath(projection);

  const graticule = d3.geoGraticule().stepMinor([15, 10])();
  svg.append('path')
    .attr('d', path(graticule))
    .attr('fill', 'none')
    .attr('stroke', 'currentColor')
    .attr('stroke-opacity', 0.2);

  const outline = d3.geoCircle().radius(90).center([0, 90])();
  svg.append('path')
    .attr('d', path(outline))
    .attr('fill', 'none')
    .attr('stroke', 'currentColor');

  svg.append('g')
    .call(xAxis);
  svg.append('g')
    .call(yAxis);

  const radius = d3.scaleLinear([6, -1], [0, 8]);
  svg.append('g')
    .attr('stroke', 'black')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('r', d => radius(d.magnitude))
    .attr('transform', d => `translate(${projection(d)})`);

  const focusDeclination = svg.append('circle')
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('fill', 'none')
    .attr('stroke', 'yellow');
  const focusRightAscension = svg.append('line')
    .attr('x1', cx)
    .attr('y1', cy)
    .attr('x2', cx)
    .attr('y2', cy)
    .attr('stroke', 'yellow');
  const mouseovered = (event, d) => {
    const [px, py] = projection(d);
    const dx = px - cx;
    const dy = py - cy;
    const a = Math.atan2(dy, dx);
    focusDeclination.attr('r', Math.hypot(dx, dy));
    focusRightAscension.attr('x2', cx + 1e3 * Math.cos(a)).attr('y2', cy + 1e3 * Math.sin(a));
  }
  const mouseouted = (event, d) => {
    focusDeclination.attr('r', null);
    focusRightAscension.attr('x2', cx).attr('y2', cy);
  }

  const voronoi = d3.Delaunay.from(data.map(projection)).voronoi([0, 0, width, height]);

  svg.append('g')
    .attr('pointer-events', 'all')
    .attr('fill', 'none')
    .selectAll('path')
    .data(data)
    .join('path')
    .on('mouseover', mouseovered)
    .on('mouseout', mouseouted)
    .attr('d', (d, i) => voronoi.renderCell(i))
    .append('title')
    .text(formatTitle);

  return svg.node();
}