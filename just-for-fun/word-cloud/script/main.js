/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/word-cloud

import {
  wordCloud
} from './chart.js';

// first simple example
wordCloud('Hello, World! This is a small cloud for your enjoyment', {
  id: 'word-cloud-1',
  width: 250,
  height: 100,
  size: () => .3 + Math.random(),
  rotate: () => (~~(Math.random() * 6) - 3) * 30
});


// second example
const source = await d3.text('./data/dream.txt', d3.autoType);

const stopwords = new Set("i,me,my,myself,we,us,our,ours,ourselves,you,your,yours,yourself,yourselves,he,him,his,himself,she,her,hers,herself,it,its,itself,they,them,their,theirs,themselves,what,which,who,whom,whose,this,that,these,those,am,is,are,was,were,be,been,being,have,has,had,having,do,does,did,doing,will,would,should,can,could,ought,i'm,you're,he's,she's,it's,we're,they're,i've,you've,we've,they've,i'd,you'd,he'd,she'd,we'd,they'd,i'll,you'll,he'll,she'll,we'll,they'll,isn't,aren't,wasn't,weren't,hasn't,haven't,hadn't,doesn't,don't,didn't,won't,wouldn't,shan't,shouldn't,can't,cannot,couldn't,mustn't,let's,that's,who's,what's,here's,there's,when's,where's,why's,how's,a,an,the,and,but,if,or,because,as,until,while,of,at,by,for,with,about,against,between,into,through,during,before,after,above,below,to,from,up,upon,down,in,out,on,off,over,under,again,further,then,once,here,there,when,where,why,how,all,any,both,each,few,more,most,other,some,such,no,nor,not,only,own,same,so,than,too,very,say,says,said,shall".split(','))

const words = source.split(/[\s.]+/g)
  .map(w => w.replace(/^[“‘"\-—()\[\]{}]+/g, ''))
  .map(w => w.replace(/[;:.!?()\[\]{},"'’”\-—]+$/g, ''))
  .map(w => w.replace(/['’]s$/g, ''))
  .map(w => w.substring(0, 30))
  .map(w => w.toLowerCase())
  .filter(w => w && !stopwords.has(w));

console.log(words.filter(w => /\W/.test(w)));

// optimization will be stopped after 8 sec
const optimizationTimeout = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve();
  }, 60000);
});

wordCloud(words, {
  id: 'word-cloud-2',
  width: 1200,
  height: 500,
  invalidation: optimizationTimeout // a promise to stop the simulation when the cell is re-run
})