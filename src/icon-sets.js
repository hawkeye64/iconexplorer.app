// IMPORTANT NOTE
// We need to import this file both in app and quasar.conf.js.
// Since quasar.conf.js runs on Node context and this file can't be transpiled before build, we need to make Node happy, and can't use ES modules and such.

const iconSets = [
  {
    label: '@quasar/extras',
    children: [
      { label: 'Material Icons (Google)', value: 'material-icons', packageName: '@quasar/extras' },
      { label: 'Material Icons Outlined (Google)', value: 'material-icons-outlined', packageName: '@quasar/extras' },
      { label: 'Material Icons Round (Google)', value: 'material-icons-round', packageName: '@quasar/extras' },
      { label: 'Material Icons Sharp (Google)', value: 'material-icons-sharp', packageName: '@quasar/extras' },
      { label: 'MDI v6 (Material Design Icons)', value: 'mdi-v6', packageName: '@quasar/extras' },
      { label: 'MDI v5 (Material Design Icons)', value: 'mdi-v5', packageName: '@quasar/extras' },
      { label: 'Fontawesome v5', value: 'fontawesome-v5', packageName: '@quasar/extras' },
      { label: 'Ionicons v6', value: 'ionicons-v6', packageName: '@quasar/extras' },
      { label: 'Ionicons v5', value: 'ionicons-v5', packageName: '@quasar/extras' },
      { label: 'Eva Icons', value: 'eva-icons', packageName: '@quasar/extras' },
      { label: 'Themify', value: 'themify', packageName: '@quasar/extras' },
      { label: 'Line Awesome', value: 'line-awesome', packageName: '@quasar/extras' },
      { label: 'Bootstrap Icons', value: 'bootstrap-icons', packageName: '@quasar/extras' }
    ]
  },
  {
    label: 'quasar-extras-svg-icons',
    children: [
      { label: 'Akar Icons', value: 'akar-icons', packageName: 'quasar-extras-svg-icons', status: 'v1.6.0' },
      { label: 'Ant Design Icons', value: 'ant-design-icons', packageName: 'quasar-extras-svg-icons', status: 'v1.4.0' },
      { label: 'Box Icons', value: 'box-icons', packageName: 'quasar-extras-svg-icons' },
      { label: 'Carbon Icons', value: 'carbon-icons', packageName: 'quasar-extras-svg-icons', status: 'v1.7.0' },
      { label: 'Carbon Pictograms', value: 'carbon-pictograms', packageName: 'quasar-extras-svg-icons', status: 'v1.7.0' },
      { label: 'Codicons', value: 'codicons', packageName: 'quasar-extras-svg-icons', status: 'v1.4.0' },
      { label: 'Cool Icons', value: 'cool-icons', packageName: 'quasar-extras-svg-icons', status: 'v1.3.0' },
      { label: 'Country Flag Icons', value: 'country-flag-icons', packageName: 'quasar-extras-svg-icons', status: 'v1.6.0' },
      { label: 'Entypo+ Icons', value: 'entypo-icons', packageName: 'quasar-extras-svg-icons', status: 'v1.4.0' },
      { label: 'Fluent Icons', value: 'fluentui-system-icons', packageName: 'quasar-extras-svg-icons' },
      { label: 'Health Icons', value: 'health-icons', packageName: 'quasar-extras-svg-icons', status: 'v1.7.0' },
      { label: 'Grid Icons', value: 'grid-icons', packageName: 'quasar-extras-svg-icons', status: 'v1.6.0' },
      { label: 'Hero Icons (outline)', value: 'hero-icons-outline', packageName: 'quasar-extras-svg-icons' },
      { label: 'Hero Icons (solid)', value: 'hero-icons-solid', packageName: 'quasar-extras-svg-icons' },
      { label: 'Icomoon Free Icons', value: 'icomoon-free-icons', packageName: 'quasar-extras-svg-icons', status: 'v1.3.0' },
      { label: 'Iconoir Icons', value: 'iconoir-icons', packageName: 'quasar-extras-svg-icons' },
      { label: 'Jam Icons', value: 'jam-icons', packageName: 'quasar-extras-svg-icons' },
      { label: 'Material Line Icons', value: 'material-line-icons', packageName: 'quasar-extras-svg-icons', status: 'v1.6.0' },
      { label: 'Octicons', value: 'oct-icons', packageName: 'quasar-extras-svg-icons' },
      { label: 'Pixelart Icons', value: 'pixelart-icons', packageName: 'quasar-extras-svg-icons' },
      { label: 'Prime Icons', value: 'prime-icons', packageName: 'quasar-extras-svg-icons' },
      { label: 'Radix-UI Icons', value: 'radix-ui-icons', packageName: 'quasar-extras-svg-icons', status: 'v1.5.0' },
      { label: 'Remix Icons', value: 'remix-icons', packageName: 'quasar-extras-svg-icons' },
      { label: 'Simple Icons', value: 'simple-icons', packageName: 'quasar-extras-svg-icons' },
      { label: 'System UIcons', value: 'system-uicons', packageName: 'quasar-extras-svg-icons', status: 'v1.5.0' },
      { label: 'Tabler Icons', value: 'tabler-icons', packageName: 'quasar-extras-svg-icons' },
      { label: 'Teeny Icons', value: 'teeny-icons', packageName: 'quasar-extras-svg-icons', status: 'v1.2.0' },
      { label: 'UIW Icons', value: 'uiw-icons', packageName: 'quasar-extras-svg-icons', status: 'v1.6.0' },
      { label: 'Unicons', value: 'unicons', packageName: 'quasar-extras-svg-icons', status: 'v1.1.0' },
      { label: 'Vaadin Icons', value: 'vaadin-icons', packageName: 'quasar-extras-svg-icons', status: 'v1.3.0' },
      { label: 'Weather Icons', value: 'weather-icons', packageName: 'quasar-extras-svg-icons', status: 'v1.6.0' },
      { label: 'Webfont Medical Icons', value: 'webfont-medical-icons', packageName: 'quasar-extras-svg-icons', status: 'v1.7.0' },
      { label: 'Zond Icons', value: 'zond-icons', packageName: 'quasar-extras-svg-icons' }
    ]
  }
];

module.exports = {
  iconSets,
  flattenedIconSets: Object.values(iconSets).flatMap(({ children }) => children)
}
