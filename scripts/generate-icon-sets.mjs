import { existsSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const packages = [
  {
    label: '@quasar/extras',
    packageName: '@quasar/extras',
    order: [
      'material-icons',
      'material-icons-outlined',
      'material-icons-round',
      'material-icons-sharp',
      'material-symbols-outlined',
      'material-symbols-rounded',
      'material-symbols-sharp',
      'mdi-v7',
      'mdi-v6',
      'fontawesome-v7',
      'fontawesome-v6',
      'fontawesome-v5',
      'ionicons-v8',
      'ionicons-v7',
      'ionicons-v6',
      'eva-icons',
      'themify',
      'line-awesome',
      'bootstrap-icons',
    ],
  },
  {
    label: 'quasar-extras-svg-icons',
    packageName: 'quasar-extras-svg-icons',
    maxVersionsPerFamily: 2,
  },
]

const labelOverrides = new Map([
  ['@quasar/extras:material-icons', 'Material Icons (Google)'],
  ['@quasar/extras:material-icons-outlined', 'Material Icons Outlined (Google)'],
  ['@quasar/extras:material-icons-round', 'Material Icons Round (Google)'],
  ['@quasar/extras:material-icons-sharp', 'Material Icons Sharp (Google)'],
  ['@quasar/extras:material-symbols-outlined', 'Material Symbols Outlined (Google)'],
  ['@quasar/extras:material-symbols-rounded', 'Material Symbols Rounded (Google)'],
  ['@quasar/extras:material-symbols-sharp', 'Material Symbols Sharp (Google)'],
  ['@quasar/extras:mdi-v6', 'MDI v6 (Material Design Icons)'],
  ['@quasar/extras:mdi-v7', 'MDI v7 (Material Design Icons)'],
  ['@quasar/extras:fontawesome-v5', 'Font Awesome v5'],
  ['@quasar/extras:fontawesome-v6', 'Font Awesome v6'],
  ['@quasar/extras:fontawesome-v7', 'Font Awesome v7'],
  ['quasar-extras-svg-icons:flatui-icons', 'Flat UI Icons'],
  ['quasar-extras-svg-icons:fluentui-system-icons', 'Fluent UI System Icons'],
  ['quasar-extras-svg-icons:glyphs-brands', 'Glyphs Brands'],
  ['quasar-extras-svg-icons:glyphs-core-icons', 'Glyphs Core Icons'],
  ['quasar-extras-svg-icons:icomoon-free-icons', 'IcoMoon Free Icons'],
  ['quasar-extras-svg-icons:iconpark-icons', 'IconPark Icons'],
  ['quasar-extras-svg-icons:oct-icons-v17', 'Octicons (Primer) v17'],
  ['quasar-extras-svg-icons:oct-icons-v18', 'Octicons (Primer) v18'],
  ['quasar-extras-svg-icons:oct-icons-v19', 'Octicons (Primer) v19'],
  ['quasar-extras-svg-icons:openmoji-icons-v16', 'OpenMoji Icons v16'],
  ['quasar-extras-svg-icons:openmoji-icons-v17', 'OpenMoji Icons v17'],
  ['quasar-extras-svg-icons:radix-ui-icons', 'Radix UI Icons'],
  ['quasar-extras-svg-icons:system-uicons', 'System UIcons'],
  ['quasar-extras-svg-icons:typ-icons', 'Typicons'],
  ['quasar-extras-svg-icons:uiw-icons', 'UIW Icons'],
])

const wordOverrides = new Map([
  ['akar', 'Akar'],
  ['ant', 'Ant'],
  ['box', 'Box'],
  ['brandico', 'Brandico'],
  ['bytesize', 'Bytesize'],
  ['carbon', 'Carbon'],
  ['codicons', 'Codicons'],
  ['coreui', 'CoreUI'],
  ['dashicons', 'Dashicons'],
  ['dev', 'Dev'],
  ['drip', 'Drip'],
  ['entypo', 'Entypo+'],
  ['eva', 'Eva'],
  ['evil', 'Evil'],
  ['fontawesome', 'Font Awesome'],
  ['fontisto', 'Fontisto'],
  ['gitlab', 'GitLab'],
  ['health', 'Health'],
  ['hero', 'Hero'],
  ['iconoir', 'Iconoir'],
  ['ikonate', 'Ikonate'],
  ['ikons', 'Ikons'],
  ['ionicons', 'Ionicons'],
  ['keyrune', 'Keyrune'],
  ['maki', 'Maki'],
  ['mdi', 'MDI'],
  ['openmoji', 'OpenMoji'],
  ['phosphor', 'Phosphor'],
  ['ui', 'UI'],
  ['uiw', 'UIW'],
])

function packagePath(packageName) {
  return resolve(rootDir, 'node_modules', ...packageName.split('/'))
}

function readIconSetFolders(packageName) {
  const baseDir = packagePath(packageName)

  if (existsSync(baseDir) === false) {
    throw new Error(`Missing package directory: ${baseDir}`)
  }

  return readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() || entry.isSymbolicLink())
    .map((entry) => entry.name)
    .filter(
      (name) =>
        existsSync(resolve(baseDir, name, 'icons.json')) &&
        existsSync(resolve(baseDir, name, 'index.mjs')),
    )
}

function getFamily(value) {
  return value.replace(/-v\d+$/, '')
}

function getVersion(value) {
  const match = value.match(/-v(\d+)$/)
  return match ? Number(match[1]) : null
}

function compareIconSetNames(a, b) {
  const familyCompare = getFamily(a).localeCompare(getFamily(b))

  if (familyCompare !== 0) {
    return familyCompare
  }

  const aVersion = getVersion(a)
  const bVersion = getVersion(b)

  if (aVersion !== null && bVersion !== null) {
    return bVersion - aVersion
  }

  if (aVersion !== null) {
    return -1
  }

  if (bVersion !== null) {
    return 1
  }

  return a.localeCompare(b)
}

function sortIconSets(names, preferredOrder = []) {
  if (preferredOrder.length === 0) {
    return [...names].sort(compareIconSetNames)
  }

  const preferred = new Map(preferredOrder.map((name, index) => [name, index]))

  return [...names].sort((a, b) => {
    const aIndex = preferred.get(a)
    const bIndex = preferred.get(b)

    if (aIndex !== undefined && bIndex !== undefined) {
      return aIndex - bIndex
    }

    if (aIndex !== undefined) {
      return -1
    }

    if (bIndex !== undefined) {
      return 1
    }

    return compareIconSetNames(a, b)
  })
}

function filterToLatestVersions(names, maxVersionsPerFamily) {
  if (typeof maxVersionsPerFamily !== 'number') {
    return names
  }

  const groups = new Map()

  for (const name of names) {
    const family = getFamily(name)

    if (groups.has(family) === false) {
      groups.set(family, [])
    }

    groups.get(family).push(name)
  }

  return [...groups.values()].flatMap((group) =>
    [...group].sort(compareIconSetNames).slice(0, maxVersionsPerFamily),
  )
}

function titleCaseWord(word) {
  const override = wordOverrides.get(word)

  if (override) {
    return override
  }

  return word.charAt(0).toUpperCase() + word.slice(1)
}

function getLabel(packageName, value) {
  const override = labelOverrides.get(`${packageName}:${value}`)

  if (override) {
    return override
  }

  const version = getVersion(value)
  const base = getFamily(value)
  const label = base.split('-').map(titleCaseWord).join(' ')

  return version === null ? label : `${label} v${version}`
}

function createIconSet(packageName, value) {
  return {
    label: getLabel(packageName, value),
    value,
    packageName,
    icons: true,
  }
}

function generateIconSets() {
  return packages.map((pkg) => {
    const folders = readIconSetFolders(pkg.packageName)
    const visibleFolders = filterToLatestVersions(folders, pkg.maxVersionsPerFamily)
    const sorted = sortIconSets(visibleFolders, pkg.order)

    return {
      label: pkg.label,
      children: sorted.map((value) => createIconSet(pkg.packageName, value)),
    }
  })
}

function formatString(value) {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

function formatIconSet(iconSet, indent) {
  const pad = ' '.repeat(indent)

  return [
    `${pad}{`,
    `${pad}  label: ${formatString(iconSet.label)},`,
    `${pad}  value: ${formatString(iconSet.value)},`,
    `${pad}  packageName: ${formatString(iconSet.packageName)},`,
    `${pad}  icons: true,`,
    `${pad}},`,
  ].join('\n')
}

function formatIconSetGroup(group, indent) {
  const pad = ' '.repeat(indent)
  const children = group.children.map((iconSet) => formatIconSet(iconSet, indent + 4)).join('\n')

  return [
    `${pad}{`,
    `${pad}  label: ${formatString(group.label)},`,
    `${pad}  children: [`,
    children,
    `${pad}  ],`,
    `${pad}},`,
  ].join('\n')
}

function writeIconSetsFile(iconSets) {
  const output = `// This file is generated by scripts/generate-icon-sets.mjs.
// Run \`pnpm generate:icon-sets\` after updating icon packages.

export type IconSetPackage = '@quasar/extras' | 'quasar-extras-svg-icons'

export type IconSet = {
  label: string
  value: string
  packageName: IconSetPackage
  icons: true
  status?: string
}

export type IconSetGroup = {
  label: IconSetPackage
  children: IconSet[]
}

export const iconSets: IconSetGroup[] = [
${iconSets.map((group) => formatIconSetGroup(group, 2)).join('\n')}
]

export const flattenedIconSets = iconSets.flatMap(({ children }) => children)
`

  writeFileSync(resolve(rootDir, 'src/icon-sets.ts'), output)
}

function formatGlobEntries(iconSets, packageName, extension) {
  return iconSets
    .find((group) => group.label === packageName)
    .children.map(
      (iconSet) => `  '../../node_modules/${packageName}/${iconSet.value}/${extension}',`,
    )
    .join('\n')
}

function writeIconModulesFile(iconSets) {
  const output = `// This file is generated by scripts/generate-icon-sets.mjs.
// Run \`pnpm generate:icon-sets\` after updating icon packages.

export const extrasJson = import.meta.glob([
${formatGlobEntries(iconSets, '@quasar/extras', 'icons.json')}
])

export const extrasModules = import.meta.glob([
${formatGlobEntries(iconSets, '@quasar/extras', 'index.mjs')}
])

export const quasarExtrasSvgIconsJson = import.meta.glob([
${formatGlobEntries(iconSets, 'quasar-extras-svg-icons', 'icons.json')}
])

export const quasarExtrasSvgIconsModules = import.meta.glob([
${formatGlobEntries(iconSets, 'quasar-extras-svg-icons', 'index.mjs')}
])
`

  writeFileSync(resolve(rootDir, 'src/assets/icon-modules.ts'), output)
}

const iconSets = generateIconSets()

writeIconSetsFile(iconSets)
writeIconModulesFile(iconSets)
