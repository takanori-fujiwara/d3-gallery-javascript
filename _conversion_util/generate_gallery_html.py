import json
import os


def _beautify(script):
    opts = jsbeautifier.default_options()
    opts.indent_size = 2

    return jsbeautifier.beautify(script, opts)


def gen_examples_html(category_key):
    nolicense = [
        'world-history-timeline', 'cancer-survival-rates', 'occlusion',
        'centerline-labeling', 'methods-of-comparison-compared', 'watercolor'
        'stern-brocot-tree', 'owls-to-the-max', 'spilhaus-shoreline-map'
    ]
    names_changed = {
        'calendar-view': 'calendar',
        'sortable-bar-chart': 'bar-chart-transitions',
        'tidy-tree': 'tree',
        'radial-tidy-tree': 'radial-tree',
        'cluster-dendrogram': 'cluster',
        'radial-dendrogram': 'radial-cluster',
        'sankey-diagram': 'sankey',
        'scatterplot-matrix': 'splom',
        'beeswarm-ii': 'beeswarm-mirrored',
        'line-chart-with-tooltip': 'line-with-tooltip'
    }

    title = category_key.replace('-', ' ')
    title = title.capitalize()

    html = f'''
  <div class='category'>
    <h2>{title}</h2>
    <div class='thumbnails'>'''

    counts = {'done': 0, 'todo': 0, 'pending': 0}
    for each_info in info[category_key]:
        name = each_info['path'].split('/')[-1]
        if name in names_changed:
            name = names_changed[name]

        title = each_info['title']

        if os.path.isdir(f'../{category_key}/{name}/'):
            thumbnail = name
            counts['done'] += 1
        elif name in nolicense:
            thumbnail = 'no-license'
            counts['pending'] += 1
        else:
            thumbnail = 'not-implemented'
            counts['todo'] += 1

        html += f'''
      <div class='thumbnail'>
        <a href='./{category_key}/{name}/'>
          <img src='./_thumbnails/{thumbnail}.png'>
          <p>{title}</p>
        </a>
      </div>
        '''
    html += '''
    </div>
  </div>'''

    print(counts)
    return html


with open('./files/gallery_info.json', 'r') as f:
    info = json.load(f)

html_head = '''<html>

<head>
  <title>D3 Gallery Vanilla JS</title>
  <meta charset='utf-8'>
  <link rel='stylesheet' type='text/css' href='./style.css'>
</head>

<body>
  <h1>D3 Gallery (Vanilla JavaScript Implementation) (<a href='https://observablehq.com/@d3/gallery'>original observable code</a>)</h1>
'''

html_tail = '''</body>
</html>'''

html = html_head
for category_key in info:
    html += gen_examples_html(category_key)
html += html_tail

with open('../index.html', 'w') as f:
    f.write(html)
