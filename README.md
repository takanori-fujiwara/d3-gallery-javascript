# d3-gallery-javascript
This repository aims to covert all observable examples (https://observablehq.com/@d3/gallery) to JavaScript code to make them runnable with vanilla JavaScript.

## Note
So far, several examples categorized in "Bars" are implemented. More examples will be implemented gradually.
Also, only the examples with with license declaration will be implemented. 

## How to try example code
* Run some http server and load each directory's index.html
  - For example, with Python, move to one example directory then:

    `python3 -m http.server`

    Then, access http://localhost:8000/ with your browser.

## Motivation
One of biggest strengths of D3 is in its example gallery.
This gallery makes (or used to make) trying various visualizations with D3 easier.
However, in my opinion, integrating D3 into Observable (although Observable is a great interactive environment) makes using D3 examples directly in JavaScript code (much more) difficult. (I generally agree with [this post](https://talk.observablehq.com/t/i-want-to-learn-d3-i-don-t-want-to-learn-observable-is-that-ok). Unlike Python in Jupyter Notebook, we cannot make runnable code by copying-and-pasting from Observable code.)

While there is an example of how to convert Observable code to vanilla JavaScript, at least for me (as a researcher studying visualization several years), the conversion is still time-consuming.
Also, there is a way to embed Observable code, but, this might be not preferable in some situations (e.g., to avoid additional dependency to Observable).
This repository is trying to lower the bar to try/learn D3 for beginners and avoid wasting time to convert the gallery code for research projects, etc.
