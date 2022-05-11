// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright (ISC License)
// Copyright 2012–2020 Mike Bostock
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED 'AS IS' AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

import {
  vaccineChart
} from './chart.js';

import {
  legend
} from './legend.js';

const vaccineData = await fetch('./data/vaccines.json')
  .then(response => response.json())
  .then(data => {
    const names = ['Alaska', 'Ala.', 'Ark.', 'Ariz.', 'Calif.', 'Colo.', 'Conn.',
      'D.C.', 'Del.', 'Fla.', 'Ga.', 'Hawaii', 'Iowa', 'Idaho', 'Ill.', 'Ind.',
      'Kan.', 'Ky.', 'La.', 'Mass.', 'Md.', 'Maine', 'Mich.', 'Minn.', 'Mo.',
      'Miss.', 'Mont.', 'N.C.', 'N.D.', 'Neb.', 'N.H.', 'N.J.', 'N.M', 'Nev.',
      'N.Y.', 'Ohio', 'Okla.', 'Ore.', 'Pa.', 'R.I.', 'S.C.', 'S.D.', 'Tenn.',
      'Texas', 'Utah', 'Va.', 'Vt.', 'Wash.', 'Wis.', 'W.Va.', 'Wyo.'
    ];
    const values = [];
    const year0 = d3.min(data[0].data.values.data, d => d[0]);
    const year1 = d3.max(data[0].data.values.data, d => d[0]);
    const years = d3.range(year0, year1 + 1);
    for (const [year, i, value] of data[0].data.values.data) {
      if (value == null) continue;
      (values[i] || (values[i] = []))[year - year0] = value;
    }

    return {
      values,
      names,
      years,
      year: data[0].data.chart_options.vaccine_year
    };
  });


const chart = vaccineChart(vaccineData);

legend(
  chart.scales.color, {
    title: "Measles cases per 100,000 people",
    width: 360,
    marginLeft: 30
  })