import os

from glob import glob

category_names = [
    'maps', 'analysis', 'hierarchies', 'areas', 'just-for-fun', 'animation',
    'annotation', 'bars', 'networks', 'radial', 'dots', 'lines', 'interaction'
]


def update_index_html():
    category_name = os.getcwd().split('/')[-2]
    page_name = os.getcwd().split('/')[-1]

    with open('index.html', 'r') as f:
        html_content = f.read()

    sub1 = html_content.split(' (<a href=')[0] + '</h1>\n'

    sub2 = f'''  <li><a href='https://github.com/takanori-fujiwara/d3-gallery-javascript/tree/main/{category_name}/{page_name}'>Source code</a></li>
      <li><a href='https://observablehq.com/@d3/{page_name}'>Original Observable version</a></li>
    '''

    sub3 = '''  <script src='./script/main.js' type='module'></script>
    </body>

    </html>
    '''

    with open('index.html', 'w') as f:
        f.write(sub1 + sub2 + sub3)


for category_name in category_names:
    os.chdir(f'./{category_name}')
    page_names = glob('*')
    for page_name in page_names:
        os.chdir(f'./{page_name}')
        update_index_html()
        os.chdir('../')
    os.chdir('../')
