import _ from 'lodash';
import modules from 'ui/modules';
const app = modules.get('app/thor/directives', []);
app.service('$colors', () => {
  const colors = {
    'green-darkest'    : '#3F6833',
    'green-darker'     : '#508642',
    'green-dark'       : '#629E51',
    'green'            : '#7EB26D',
    'green-light'      : '#9AC48A',
    'green-lighter'    : '#B7DBAB',
    'green-lightest'   : '#E0F9D7',

    'yellow-darkest'   : '#967302',
    'yellow-darker'    : '#CCA300',
    'yellow-dark'      : '#E5AC0E',
    'yellow'           : '#EAB839',
    'yellow-light'     : '#F2C96D',
    'yellow-lighter'   : '#F4D598',
    'yellow-lightest'  : '#FCEACA',

    'cyan-darkest'     : '#2F575E',
    'cyan-darker'      : '#447EBC',
    'cyan-dark'        : '#64B0C8',
    'cyan'             : '#6ED0E0',
    'cyan-light'       : '#65C5DB',
    'cyan-lighter'     : '#70DBED',
    'cyan-lightest'    : '#CFFAFF',

    'orange-darkest'   : '#99440A',
    'orange-darker'    : '#C15C17',
    'orange-dark'      : '#E0752D',
    'orange'           : '#EF843C',
    'orange-light'     : '#F9934E',
    'orange-lighter'   : '#F9BA8F',
    'orange-lightest'  : '#F9E2D2',

    'red-darkest'      : '#58140C',
    'red-darker'       : '#890F02',
    'red-dark'         : '#BF1B00',
    'red'              : '#E24D42',
    'red-light'        : '#EA6460',
    'red-lighter'      : '#F29191',
    'red-lightest'     : '#FCE2DE',

    'blue-darkest'     : '#052B51',
    'blue-darker'      : '#0A437C',
    'blue-dark'        : '#0A50A1',
    'blue'             : '#1F78C1',
    'blue-light'       : '#5195CE',
    'blue-lighter'     : '#82B5D8',
    'blue-lightest'    : '#BADFF4',

    'magenta-darkest'  : '#511749',
    'magenta-darker'   : '#6D1F62',
    'magenta-dark'     : '#962D82',
    'magenta'          : '#BA43A9',
    'magenta-light'    : '#D683CE',
    'magenta-lighter'  : '#E5A8E2',
    'magenta-lightest' : '#F9D9F9',

    'purple-darkest'   : '#3F2B5B',
    'purple-darker'    : '#584477',
    'purple-dark'      : '#614D93',
    'purple'           : '#705DA0',
    'purple-light'     : '#806EB7',
    'purple-lighter'   : '#AEA2E0',
    'purple-lightest'  : '#DEDAF7',

    'gray-darkest'     : '#000000',
    'gray-darker'      : '#333333',
    'gray-dark'        : '#666666',
    'gray'             : '#999999',
    'gray-light'       : '#CCCCCC',
    'gray-lighter'     : '#DDDDDD',
    'gray-lightest'    : '#EEEEEE'
  };

  const normal = [
    'green',
    'yellow',
    'cyan',
    'orange',
    'red',
    'blue',
    'magenta',
    'purple',
    'gray'
  ];

  const sufixes = [
    '-darkest',
    '-darker',
    '-dark',
    '',
    '-light',
    '-lighter',
    '-lightest'
  ];

  let names = normal.concat([]);

  sufixes.forEach((sufix) => {
    names = names.concat(normal.map((color) => color + sufix));
  });

  return {
    lookup: colors,
    names: names,
    pick: (avoid = []) => {
      let colors = _.difference(names, avoid);
      if (!colors.length) colors = names;
      return _.first(colors);
    }
  };
});

