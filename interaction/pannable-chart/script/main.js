// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  pannableChart
} from './chart.js';

const data = Object.assign((await d3.csv('./data/aapl.csv', d3.autoType)).map(({
  date,
  close
}) => ({
  date,
  value: close
})), {
  y: '$ Close'
})

const chart = pannableChart(data);

d3.select('body').append(() => chart);

chart.setScrollToEnd();