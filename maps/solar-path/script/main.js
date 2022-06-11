// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  solarPath
} from './chart.js';

import {
  scrubber
} from './scrubber.js';

const days = d3.utcDays(new Date(Date.UTC(2019, 0, 1)), new Date(Date.UTC(2020, 0, 1)));
const defaultLocation = Object.assign([-122.4194, 37.7749], {
  timeZone: 'America/Los_Angeles'
});

const formatLocation = ([x, y]) => [
  `${Math.abs(y).toFixed(4)}°${y > 0 ? 'N' : 'S'}`,
  `${Math.abs(x).toFixed(4)}°${x > 0 ? 'E' : 'W'}`
].join(', ');

const updateLocation = location => {
  const chart = solarPath({
    svgId: 'solar-path',
    location: location
  });

  const scrubberForm = scrubber(days, {
    chartUpdate: index => chart.update(days[index]),
    loop: true,
    format: date => date.toLocaleString('en', {
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    })
  });

  d3.select('#solar-path').remove();
  d3.select('#scrubber').remove();

  d3.select('body').append('div').attr('id', 'scrubber').style('clear', 'both').append(() => scrubberForm.node());
  d3.select('body').append(() => chart).style('margin-left', 100);
  button.text('Locate!');
  buttonMessage.text(formatLocation(location));
}

const buttonArea = d3.select('body').append('div').style('float', 'left');
const button = buttonArea.append('button').attr('type', 'button').style('float', 'left').text('Locate!');
const buttonMessage = buttonArea.append('div').style('float', 'left').style('margin-top', 2).style('margin-left', 5).text('');

// initial state
updateLocation(defaultLocation);

// when updated
button.on('click', async () => {
  button.text('Locating...');
  const loc = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({
        coords: {
          longitude,
          latitude
        }
      }) => resolve([longitude, latitude]),
      reject
    );
  });
  const location = Object.assign(loc, {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  updateLocation(location);
});