/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2022 Matteo Abrate - IIT CNR
// Released under the MIT license.
// > MIT License
// > Permission is hereby granted, free of charge, to any person obtaining a copy
// > of this software and associated documentation files (the "Software"), to deal
// > in the Software without restriction, including without limitation the rights
// > to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// > copies of the Software, and to permit persons to whom the Software is
// > furnished to do so, subject to the following conditions:>
//
// > The above copyright notice and this permission notice shall be included in all
// > copies or substantial portions of the Software.>
//
// > THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// > IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// > FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// > AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// > LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// > OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// > SOFTWARE.

import {
  tangledTreeVisualization
} from './chart.js';

const data = [
  [{
    id: 'Chaos'
  }],
  [{
    id: 'Gaea',
    parents: ['Chaos']
  }, {
    id: 'Uranus'
  }],
  [{
      id: 'Oceanus',
      parents: ['Gaea', 'Uranus']
    },
    {
      id: 'Thethys',
      parents: ['Gaea', 'Uranus']
    },
    {
      id: 'Pontus'
    },
    {
      id: 'Rhea',
      parents: ['Gaea', 'Uranus']
    },
    {
      id: 'Cronus',
      parents: ['Gaea', 'Uranus']
    },
    {
      id: 'Coeus',
      parents: ['Gaea', 'Uranus']
    },
    {
      id: 'Phoebe',
      parents: ['Gaea', 'Uranus']
    },
    {
      id: 'Crius',
      parents: ['Gaea', 'Uranus']
    },
    {
      id: 'Hyperion',
      parents: ['Gaea', 'Uranus']
    },
    {
      id: 'Iapetus',
      parents: ['Gaea', 'Uranus']
    },
    {
      id: 'Thea',
      parents: ['Gaea', 'Uranus']
    },
    {
      id: 'Themis',
      parents: ['Gaea', 'Uranus']
    },
    {
      id: 'Mnemosyne',
      parents: ['Gaea', 'Uranus']
    }
  ],
  [{
      id: 'Doris',
      parents: ['Oceanus', 'Thethys']
    },
    {
      id: 'Neures',
      parents: ['Pontus', 'Gaea']
    },
    {
      id: 'Dionne'
    },
    {
      id: 'Demeter',
      parents: ['Rhea', 'Cronus']
    },
    {
      id: 'Hades',
      parents: ['Rhea', 'Cronus']
    },
    {
      id: 'Hera',
      parents: ['Rhea', 'Cronus']
    },
    {
      id: 'Alcmene'
    },
    {
      id: 'Zeus',
      parents: ['Rhea', 'Cronus']
    },
    {
      id: 'Eris'
    },
    {
      id: 'Leto',
      parents: ['Coeus', 'Phoebe']
    },
    {
      id: 'Amphitrite'
    },
    {
      id: 'Medusa'
    },
    {
      id: 'Poseidon',
      parents: ['Rhea', 'Cronus']
    },
    {
      id: 'Hestia',
      parents: ['Rhea', 'Cronus']
    }
  ],
  [{
      id: 'Thetis',
      parents: ['Doris', 'Neures']
    },
    {
      id: 'Peleus'
    },
    {
      id: 'Anchises'
    },
    {
      id: 'Adonis'
    },
    {
      id: 'Aphrodite',
      parents: ['Zeus', 'Dionne']
    },
    {
      id: 'Persephone',
      parents: ['Zeus', 'Demeter']
    },
    {
      id: 'Ares',
      parents: ['Zeus', 'Hera']
    },
    {
      id: 'Hephaestus',
      parents: ['Zeus', 'Hera']
    },
    {
      id: 'Hebe',
      parents: ['Zeus', 'Hera']
    },
    {
      id: 'Hercules',
      parents: ['Zeus', 'Alcmene']
    },
    {
      id: 'Megara'
    },
    {
      id: 'Deianira'
    },
    {
      id: 'Eileithya',
      parents: ['Zeus', 'Hera']
    },
    {
      id: 'Ate',
      parents: ['Zeus', 'Eris']
    },
    {
      id: 'Leda'
    },
    {
      id: 'Athena',
      parents: ['Zeus']
    },
    {
      id: 'Apollo',
      parents: ['Zeus', 'Leto']
    },
    {
      id: 'Artemis',
      parents: ['Zeus', 'Leto']
    },
    {
      id: 'Triton',
      parents: ['Poseidon', 'Amphitrite']
    },
    {
      id: 'Pegasus',
      parents: ['Poseidon', 'Medusa']
    },
    {
      id: 'Orion',
      parents: ['Poseidon']
    },
    {
      id: 'Polyphemus',
      parents: ['Poseidon']
    }
  ],
  [{
      id: 'Deidamia'
    },
    {
      id: 'Achilles',
      parents: ['Peleus', 'Thetis']
    },
    {
      id: 'Creusa'
    },
    {
      id: 'Aeneas',
      parents: ['Anchises', 'Aphrodite']
    },
    {
      id: 'Lavinia'
    },
    {
      id: 'Eros',
      parents: ['Hephaestus', 'Aphrodite']
    },
    {
      id: 'Helen',
      parents: ['Leda', 'Zeus']
    },
    {
      id: 'Menelaus'
    },
    {
      id: 'Polydueces',
      parents: ['Leda', 'Zeus']
    }
  ],
  [{
      id: 'Andromache'
    },
    {
      id: 'Neoptolemus',
      parents: ['Deidamia', 'Achilles']
    },
    {
      id: 'Aeneas(2)',
      parents: ['Creusa', 'Aeneas']
    },
    {
      id: 'Pompilius',
      parents: ['Creusa', 'Aeneas']
    },
    {
      id: 'Iulus',
      parents: ['Lavinia', 'Aeneas']
    },
    {
      id: 'Hermione',
      parents: ['Helen', 'Menelaus']
    }
  ]
];


const chart = tangledTreeVisualization(data);
d3.select('body').append('div').html(chart);
