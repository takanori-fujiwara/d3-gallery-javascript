/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original Source Copyright https://github.com/mbostock/solar-calculator/
// Copyright 2014-2017 Mike Bostock
//
// Permission to use, copy, modify, and/or distribute this software for any purpose
// with or without fee is hereby granted, provided that the above copyright notice
// and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
// OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
// TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
// THIS SOFTWARE.

const epoch = Date.UTC(2000, 0, 1, 12); // J2000.0

export const century = date => (date - epoch) / 315576e7;

const radians = degrees => Math.PI * degrees / 180;
const degrees = radians => 180 * radians / Math.PI;

// Given t in J2000.0 centuries, returns the sun’s mean longitude in degrees.
// https://en.wikipedia.org/wiki/Mean_longitude
const meanLongitude = t => {
  const l = (280.46646 + t * (36000.76983 + t * 0.0003032)) % 360;
  return l < 0 ? l + 360 : l;
}

// Given t in J2000.0 centuries, returns the sun’s mean anomaly in degrees.
// https://en.wikipedia.org/wiki/Mean_anomaly
const meanAnomaly = t => 357.52911 + t * (35999.05029 - 0.0001537 * t);

// Given t in J2000.0 centuries, returns the obliquity of the Earth’s ecliptic in degrees.
const obliquityOfEcliptic = t => {
  const e0 = 23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60;
  const omega = 125.04 - 1934.136 * t;
  return e0 + 0.00256 * Math.cos(radians(omega));
}

// Given t in J2000.0 centuries, returns eccentricity.
// https://en.wikipedia.org/wiki/Orbital_eccentricity
const orbitEccentricity = t => 0.016708634 - t * (0.000042037 + 0.0000001267 * t);

// Given t in J2000.0 centuries, returns the equation of time in minutes.
// https://en.wikipedia.org/wiki/Equation_of_time
export const equationOfTime = t => {
  const epsilon = obliquityOfEcliptic(t);
  const l0 = meanLongitude(t);
  const e = orbitEccentricity(t);
  const m = meanAnomaly(t);
  const y = Math.pow(Math.tan(radians(epsilon) / 2), 2);
  const sin2l0 = Math.sin(2 * radians(l0));
  const sinm = Math.sin(radians(m));
  const cos2l0 = Math.cos(2 * radians(l0));
  const sin4l0 = Math.sin(4 * radians(l0));
  const sin2m = Math.sin(2 * radians(m));
  const Etime = y * sin2l0 - 2 * e * sinm + 4 * e * y * sinm * cos2l0 - 0.5 * y * y * sin4l0 - 1.25 * e * e * sin2m;

  return degrees(Etime) * 4;
}

// Given t in J2000.0 centuries, returns the sun’s equation of the center in degrees.
// https://en.wikipedia.org/wiki/Equation_of_the_center
const equationOfCenter = t => {
  const m = radians(meanAnomaly(t));
  return Math.sin(m) * (1.914602 - t * (0.004817 + 0.000014 * t)) + Math.sin(m * 2) * (0.019993 - 0.000101 * t) + Math.sin(m * 3) * 0.000289;
}

// Given t in J2000.0 centuries, returns the sun’s true longitude in degrees.
// https://en.wikipedia.org/wiki/True_longitude
const trueLongitude = t => meanLongitude(t) + equationOfCenter(t);

// Given t in J2000.0 centuries, returns the sun’s apparent longitude in degrees.
// https://en.wikipedia.org/wiki/Apparent_longitude
const apparentLongitude = t =>
  trueLongitude(t) - 0.00569 - 0.00478 * Math.sin(radians(125.04 - 1934.136 * t));

// Given t in J2000.0 centuries, returns the solar declination in degrees.
// https://en.wikipedia.org/wiki/Position_of_the_Sun#Declination_of_the_Sun_as_seen_from_Earth
export const declination = t =>
  degrees(Math.asin(Math.sin(radians(obliquityOfEcliptic(t))) * Math.sin(radians(apparentLongitude(t)))));