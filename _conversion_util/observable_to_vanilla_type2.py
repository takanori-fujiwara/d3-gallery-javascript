#
# Note: This script is to help conversion from Observable to vanilla JS
# This is for the main coding style used in the d3 gallery (this does not
# support all the code used in the d3 gallery). Also, for some code, additional
# manual conversion might be needed (e.g., interactions, functions)
#

#
# Usage python3 observable_to_vanilla_type2.py [download_dir_path] [output_dir_path]
#

import json
import os
import shutil
import sys

import wget  # pip3 install wget
import jsbeautifier  # pip3 install jsbeautifier
import re


def _cw2ds(x):  # capwords to dash notation
    return re.sub(r'(?<=[a-z])[A-Z]|(?<!^)[A-Z](?=[a-z])', r"-\g<0>",
                  x).lower()


def _ds2cw(x):
    words = x.split('-')
    words = list(map(lambda w: w.capitalize(), words))
    words[0] = words[0].lower()

    return ''.join(words)


def load_info(dir_path):
    package_json_path = f'{dir_path}/package.json'
    package_json = None
    main_file_path = None

    info = {}
    # find 'name' and main file path
    with open(package_json_path, 'r') as f:
        package_json = json.load(f)
        info['name'] = package_json['name']
        main_file_name = package_json['main']
        main_file_path = f'{dir_path}/{main_file_name}'

    # extract functions from js script
    with open(main_file_path, 'r') as f:
        js_script = f.read()
        js_func_scripts = js_script.split('function _')[1:]

    # extract 'head'
    for f_script in js_func_scripts:
        head_mark = '# '
        if head_mark in f_script:
            info['head'] = f_script.split(head_mark)[1].split('\n')[0]
            js_func_scripts.remove(f_script)
            break

    # extract attached file name and path
    for f_script in js_func_scripts:
        file_attach_mark = 'const fileAttachments = new Map(['
        if file_attach_mark in f_script:
            file_attach_script = f_script.split(file_attach_mark)[1]
            file_attach_script = file_attach_script.split('[')[1].split(']')[0]
            file_name = file_attach_script.split(',')[0].replace('"',
                                                                 '').replace(
                                                                     "'", '')
            file_path = file_attach_script.split('{url: new URL(')[1].split(
                ',')[0].replace('"', '').replace("'", '')

            info['attached_file_name'] = file_name
            info['attached_file_path'] = f'{dir_path}/{file_path}'
            js_func_scripts.remove(f_script)
            break

    # extract var names of chart function and loaded data + attr for chart func
    var_name_chart_func = _ds2cw(info['name'].split('/')[-1])
    var_name_data = 'data'
    attr_desc = ''
    attr_desc += var_name_data

    info['var_name_chart_func'] = var_name_chart_func
    info['var_name_data'] = var_name_data

    # extract cotent of chart function
    info['attr_desc_chart_func'] = ''
    info['script_chart_func'] = ''
    for f_script in js_func_scripts:
        chart_func_mark = 'chart('
        if chart_func_mark in f_script:
            content = f_script.split(chart_func_mark)[1]
            attrs = content[:content.find(')')].split(',')
            content = content[content.find(')') + 1:]

            attr_desc += ',{'
            attr_desc += f'svgId = \'{_cw2ds(var_name_chart_func)}\','
            for attr in attrs:
                if attr == 'd3':
                    None
                elif attr == 'width':
                    attr_desc += 'width = 800,'
                elif attr == 'height':
                    attr_desc += 'height = 800,'
                else:
                    attr_desc += f'{attr} = _{attr},'
            attr_desc = attr_desc[:-1]  # remove last comma
            attr_desc += '} = {}'
            info['attr_desc_chart_func'] = attr_desc

            chart_func_script = f'function {var_name_chart_func}({attr_desc}) {content}'

            info['script_chart_func'] = chart_func_script
            js_func_scripts.remove(f_script)
            break

    # other function needed for main chart
    info['scripts_other_functions'] = js_func_scripts

    return info


def index_html(head, name):
    html = f'''
<html>

<head>
  <meta charset='utf-8'>
  <script src='./script/d3.min.js'></script>
  <link rel='stylesheet' type='text/css' href='./style/style.css'>
</head>

<body>
  <h1>{head} (<a href='https://observablehq.com/{name}'>original observable code</a>)</h1>
  <script src='./script/main.js' type='module'></script>
</body>

</html>
    '''

    return html


def _beautify(script):
    opts = jsbeautifier.default_options()
    opts.indent_size = 2

    return jsbeautifier.beautify(script, opts)


def simple_main_js(var_name_chart_func,
                   attr_desc_chart_func,
                   var_name_data,
                   attached_file_name,
                   d3_data_load_method='auto',
                   d3_data_load_metho_options=', d3.autoType'):
    if d3_data_load_method == 'auto':
        file_extension = 'json'
        if len(attached_file_name.split('.')) > 1:
            file_extension = attached_file_name.split('.')[1]
        d3_data_load_method = f'd3.{file_extension}'

    # use lower the first char to follow the naming convention
    _var_name_chart_func = var_name_chart_func[0].lower(
    ) + var_name_chart_func[1:]

    script = f'''
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {{
  {_var_name_chart_func}
}} from './chart.js';

const {var_name_data} = await {d3_data_load_method}('./data/{attached_file_name}' {d3_data_load_metho_options});

const chart = {_var_name_chart_func}(data);

d3.select('body').append(() => chart);
    '''

    return _beautify(script)


def _convert_script_other_functions(scripts_other_functions):
    script_other_functions = ''
    for script in scripts_other_functions:
        # change to arrow function
        script = 'const _' + script
        script = script[:script.find('(')] + ' = ' + script[script.find('('):]
        script = script[:script.find(')') +
                        1] + ' => ' + script[script.find(')') + 1:]
        script_other_functions += script

    return script_other_functions


def _convert_script_chart_func(var_name_chart_func, script_chart_func):
    # use lower the first char to follow the naming convention
    _var_name_chart_func = var_name_chart_func[0].lower(
    ) + var_name_chart_func[1:]
    script = script_chart_func.replace(var_name_chart_func,
                                       _var_name_chart_func)

    # change to arrow function
    script = script.replace('function', 'export const')
    script = script.replace(f'{_var_name_chart_func}(',
                            f'{_var_name_chart_func} = (')
    script = script.replace('} = {}) {', '} = {}) => {')

    # add svg id
    svg_id = _cw2ds(_var_name_chart_func)
    script = script.replace(
        f'export const {_var_name_chart_func} = (data, {{\n',
        f'export const {_var_name_chart_func} = (data, {{\n' +
        f'svgId = \'{svg_id}\',')

    # change d3 create to remove/append of svg
    script = script.replace(
        'const svg = d3.create("svg")',
        'const svg = d3.create("svg")\n    .attr(\'id\', svgId)\n    .attr(\'width\', width)\n    .attr(\'height\', height)'
    )

    # double quotes to single quotes
    script = script.replace('"', '\'')

    return script


def chart_js(page_name, var_name_chart_func, script_chart_func,
             scripts_other_functions):
    script_other_functions = _convert_script_other_functions(
        scripts_other_functions)
    script_chart = _convert_script_chart_func(var_name_chart_func,
                                              script_chart_func)
    script = f'''
/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/{page_name}

{script_other_functions}
{script_chart}
    '''

    # change margin.top, right, bottom, bottom
    script = script.replace('margin.top', 'marginTop')
    script = script.replace('margin.right', 'marginRight')
    script = script.replace('margin.bottom', 'marginBottom')
    script = script.replace('margin.left', 'marginLeft')

    opts = jsbeautifier.default_options()
    opts.indent_size = 2

    return _beautify(script)


if __name__ == '__main__':
    current_dir = os.getcwd()

    downloaded_dir_path = sys.argv[1]  # '/Users/xxxx/Downloads/slope-chart'
    output_dir_path = sys.argv[2]  # '/Users/xxxx/lines/slope-chart'

    info = load_info(downloaded_dir_path)

    # prepare directories

    script_dir_path = f'{output_dir_path}/script'
    style_dir_path = f'{output_dir_path}/style'
    data_dir_path = f'{output_dir_path}/data'

    os.makedirs(output_dir_path, exist_ok=True)
    os.makedirs(script_dir_path, exist_ok=True)
    os.makedirs(style_dir_path, exist_ok=True)
    os.makedirs(data_dir_path, exist_ok=True)

    # copy favicon.ico, d3.min.js, style.css
    shutil.copyfile(f'{current_dir}/files/favicon.ico',
                    f'{output_dir_path}/favicon.ico')
    shutil.copyfile(f'{current_dir}/files/d3.min.js',
                    f'{script_dir_path}/d3.min.js')
    shutil.copyfile(f'{current_dir}/files/style.css',
                    f'{style_dir_path}/style.css')
    # shutil.copyfile(f'{current_dir}/files/scrubber.js',
    #                 f'{script_dir_path}/scrubber.js')

    # copy data
    if 'attached_file_name' in info.keys():
        attached_file_name = info['attached_file_name']
        shutil.copyfile(info['attached_file_path'],
                        f'{data_dir_path}/{attached_file_name}')
    else:
        info['attached_file_name'] = ''

    # generate index.html
    with open(f'{output_dir_path}/index.html', 'w') as f:
        f.write(index_html(info['head'], info['name']))

    # generate main.js
    with open(f'{script_dir_path}/main.js', 'w') as f:
        f.write(
            simple_main_js(var_name_chart_func=info['var_name_chart_func'],
                           attr_desc_chart_func=info['attr_desc_chart_func'],
                           var_name_data=info['var_name_data'],
                           attached_file_name=info['attached_file_name']))

    # generate chart.js
    with open(f'{script_dir_path}/chart.js', 'w') as f:
        f.write(
            chart_js(page_name=info['name'],
                     var_name_chart_func=info['var_name_chart_func'],
                     script_chart_func=info['script_chart_func'],
                     scripts_other_functions=info['scripts_other_functions']))
