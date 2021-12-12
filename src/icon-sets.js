// IMPORTANT NOTE
// We need to import this file both in app and quasar.conf.js.
// Since quasar.conf.js runs on Node context and this file can't be transpiled before build, we need to make Node happy, and can't use ES modules and such.

const iconSets = [
  {
    label: '@quasar/extras',
    children: [
      { label: 'Material Icons (Google)', value: 'material-icons', packageName: '@quasar/extras', icons: true },
      { label: 'Material Icons Outlined (Google)', value: 'material-icons-outlined', packageName: '@quasar/extras', icons: true },
      { label: 'Material Icons Round (Google)', value: 'material-icons-round', packageName: '@quasar/extras', icons: true },
      { label: 'Material Icons Sharp (Google)', value: 'material-icons-sharp', packageName: '@quasar/extras', icons: true },
      { label: 'MDI v6 (Material Design Icons)', value: 'mdi-v6', packageName: '@quasar/extras', icons: true },
      { label: 'MDI v5 (Material Design Icons)', value: 'mdi-v5', packageName: '@quasar/extras' },
      { label: 'Fontawesome v5', value: 'fontawesome-v5', packageName: '@quasar/extras', icons: true },
      { label: 'Ionicons v6', value: 'ionicons-v6', packageName: '@quasar/extras', icons: true },
      { label: 'Ionicons v5', value: 'ionicons-v5', packageName: '@quasar/extras' },
      { label: 'Eva Icons', value: 'eva-icons', packageName: '@quasar/extras', icons: true },
      { label: 'Themify', value: 'themify', packageName: '@quasar/extras', icons: true },
      { label: 'Line Awesome', value: 'line-awesome', packageName: '@quasar/extras', icons: true },
      { label: 'Bootstrap Icons', value: 'bootstrap-icons', packageName: '@quasar/extras', icons: true }
    ]
  },
  {
    label: 'quasar-extras-svg-icons',
    children: [
      { label: 'Akar Icons', value: 'akar-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.6' },
      { label: 'Ant Design Icons', value: 'ant-design-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.4' },
      { label: 'Box Icons', value: 'box-icons', packageName: 'quasar-extras-svg-icons', icons: true },
      { label: 'Bytesize Icons', value: 'bytesize-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.10' },
      { label: 'Carbon Icons', value: 'carbon-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.7' },
      { label: 'Carbon Pictograms', value: 'carbon-pictograms', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.7' },
      { label: 'Codicons', value: 'codicons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.4' },
      { label: 'Cool Icons', value: 'cool-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.3' },
      { label: 'Country Flag Icons', value: 'country-flag-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.6' },
      { label: 'Drip Icons', value: 'drip-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.10' },
      { label: 'Entypo+ Icons', value: 'entypo-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.4' },
      { label: 'Evil Icons', value: 'evil-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.9' },
      { label: 'Feather Icons', value: 'feather-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.9' },
      { label: 'Fluent Icons', value: 'fluentui-system-icons', packageName: 'quasar-extras-svg-icons', icons: true },
      { label: 'Grid Icons', value: 'grid-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.6' },
      { label: 'Health Icons', value: 'health-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.7' },
      { label: 'Hero Icons', value: 'hero-icons', packageName: 'quasar-extras-svg-icons', icons: true },
      { label: 'Icomoon Free Icons', value: 'icomoon-free-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.3' },
      { label: 'Iconoir Icons', value: 'iconoir-icons', packageName: 'quasar-extras-svg-icons', icons: true },
      { label: 'Ikons', value: 'ikons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.10' },
      { label: 'Jam Icons', value: 'jam-icons', packageName: 'quasar-extras-svg-icons', icons: true },
      { label: 'Material Line Icons', value: 'material-line-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.6' },
      { label: 'Octicons (Primer)', value: 'oct-icons', packageName: 'quasar-extras-svg-icons', icons: true },
      { label: 'Open Iconic', value: 'open-iconic', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.9' },
      { label: 'Pixelart Icons', value: 'pixelart-icons', packageName: 'quasar-extras-svg-icons', icons: true },
      { label: 'Prime Icons', value: 'prime-icons', packageName: 'quasar-extras-svg-icons', icons: true },
      { label: 'Radix-UI Icons', value: 'radix-ui-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.5' },
      { label: 'Remix Icons', value: 'remix-icons', packageName: 'quasar-extras-svg-icons', icons: true },
      { label: 'Simple Icons', value: 'simple-icons', packageName: 'quasar-extras-svg-icons', icons: true },
      { label: 'Simple Line Icons', value: 'simple-line-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.9' },
      { label: 'System UIcons', value: 'system-uicons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.5' },
      { label: 'Tabler Icons', value: 'tabler-icons', packageName: 'quasar-extras-svg-icons', icons: true },
      { label: 'Teeny Icons', value: 'teeny-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.2' },
      { label: 'UIW Icons', value: 'uiw-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.6' },
      { label: 'Unicons', value: 'unicons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.1' },
      { label: 'Vaadin Icons', value: 'vaadin-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.3' },
      { label: 'Weather Icons', value: 'weather-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.6' },
      { label: 'Webfont Medical Icons', value: 'webfont-medical-icons', packageName: 'quasar-extras-svg-icons', icons: true, status: 'v1.7' },
      { label: 'Zond Icons', value: 'zond-icons', packageName: 'quasar-extras-svg-icons', icons: true }
    ]
  }
];

module.exports = {
  iconSets,
  flattenedIconSets: Object.values(iconSets).flatMap(({ children }) => children)
}
