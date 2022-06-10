// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  inlineChart
} from './chart.js';

const data = await d3.csv('https://gist.githubusercontent.com/HarryStevens/2ca674b53b0ea1ab806a3e704386c4c9/raw/3828df9890fbe0ff8b5259e2e3f9ebd1d38984bc/fruits.csv')
  .then(csv => {
    const dateStringToDate = s => {
      const mmddyy = s.split('/');
      return new Date(`20${mmddyy[2]}`, `${mmddyy[0]-1}`, `${mmddyy[1]}`);
    }

    return csv.flatMap(row => {
      const date = dateStringToDate(row['Date']);
      return [{
        date: date,
        fruit: 'Apples',
        value: parseFloat(row['Apples'])
      }, {
        date: date,
        fruit: 'Blueberries',
        value: parseFloat(row['Blueberries'])
      }, {
        date: date,
        fruit: 'Carrots',
        value: parseFloat(row['Carrots'])
      }];
    });
  });

const chart = inlineChart(data);

d3.select('body').append(() => chart);