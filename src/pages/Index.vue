<template>
  <q-page>
    <q-dialog ref="dialogRef" v-model="showDialog">
      <q-card class="q-pa-md">

        <div class="row justify-center items-center" style="max-width: 400px; max-height: 300px; width: 100%; height: 100%;">
          <q-icon :name="currentPath" size="128px" class="q-pa-xs" :class="colorClasses" />
          <span class="full-width text-center" style="font-size: 28px;">{{ currentName }}</span>

          <div class="row">
            <div v-for="color in colors" :key="color" :class="colorClass(color)" style="width: 20px; height: 20px;" @click.stop="changeColor(color)" @mouseenter.stop="changeColor(color)"></div>
            <q-toggle v-model="inverted" label="Invert colors"/>
          </div>

          <q-btn-group push>
            <q-btn push :icon="mdiContentCopy" @click="onCopyName(currentPath, currentName)">
              <q-tooltip>Copy name to clipboard</q-tooltip>
            </q-btn>
            <q-btn push label="SVG" @click="onCopySvg(currentPath, currentName)">
              <q-tooltip>Copy SVG to clipboard</q-tooltip>
            </q-btn>
          </q-btn-group>

        </div>
      </q-card>
    </q-dialog>
    <div class="row justify-evenly items-center">
      <q-select
        v-model="icon"
        dense
        options-dense
        outlined clearable
        :options="iconSets"
        label="Select Icon set"
        style="width: 280px; margin: 2px;">
          <template v-slot:option="scope">
            <q-expansion-item
              expand-separator
              group="somegroup"
              :default-opened="hasChild(scope)"
               header-class="text-weight-bold"
              :label="scope.opt.label"
            >
              <template v-for="child in scope.opt.children" :key="child.label">
                <q-item
                  clickable
                  v-ripple
                  v-close-popup
                  @click="icon = child"
                  :class="{ 'bg-light-blue-1': icon === child }"
                >
                  <q-item-section>
                    <q-item-label v-html="child.label" class="q-ml-md" ></q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-expansion-item>
          </template>
      </q-select>
      <span>Totals: {{ filteredCount }}/{{ iconCount }}</span>
      <q-input borderless dense outlined debounce="300" clearable v-model="filter" placeholder="Search" style="margin: 2px;">
        <template v-slot:append>
          <q-icon v-if="!filter" :name="mdiCardSearchOutline" />
        </template>
      </q-input>
    </div>
    <div class="row justify-center">
      <q-intersection
        v-for="(path, name) in icons"
        :key="name"
        once
        class="intersetion-icon-box"
      >
        <div class="row justify-center icon-box" @click="onClick(path, name)">
          <q-icon :name="path" size="md" class="q-pa-xs column" />
          <span class="full-width text-center" style="font-size: 9px;">{{ name }}</span>
        </div>
      </q-intersection>
    </div>

    <div class="icons-footer" />

    <q-page-scroller expand position="bottom" :scroll-offset="150" :offset="[0, 0]">
      <div class="col cursor-pointer q-pa-sm text-center glass">
        <q-icon :name="mdiChevronUp" size="lg" />
      </div>
    </q-page-scroller>

  </q-page>
</template>

<script>
import { defineComponent, markRaw } from 'vue'
import { copyToClipboard } from 'quasar'
import { mdiCardSearchOutline, mdiChevronUp } from '@quasar/extras/mdi-v5'

export default defineComponent({
  name: 'SvgIconViewer',

  data () {
    return {
      mdiCardSearchOutline,
      mdiChevronUp,
      icon: null,
      iconSets: [
        { label: '@quasar/extras', children: [
          { label: 'Material Icons (Google)', value: 'material-icons', packageName: '@quasar/extras' },
          { label: 'Material Icons Outlined (Google)', value: 'material-icons-outlined', packageName: '@quasar/extras' },
          { label: 'Material Icons Round (Google)', value: 'material-icons-round', packageName: '@quasar/extras' },
          { label: 'Material Icons Sharp (Google)', value: 'material-icons-sharp', packageName: '@quasar/extras' },
          { label: 'MDI v5 (Material Design Icons)', value: 'mdi-v5', packageName: '@quasar/extras' },
          { label: 'Fontawesome v5', value: 'fontawesome-v5', packageName: '@quasar/extras' },
          { label: 'Ionicons v5', value: 'ionicons-v5', packageName: '@quasar/extras' },
          { label: 'Eva Icons', value: 'eva-icons', packageName: '@quasar/extras' },
          { label: 'Themify', value: 'themify', packageName: '@quasar/extras' },
          { label: 'Line Awesome', value: 'line-awesome', packageName: '@quasar/extras' },
          { label: 'Bootstrap Icons', value: 'bootstrap-icons', packageName: '@quasar/extras' }
        ] },
        { label: 'quasar-extras-svg-icons', children: [
          { label: 'Fluent Icons', value: 'fluentui-system-icons', packageName: 'quasar-extras-svg-icons' },
          { label: 'Hero Icons (outline)', value: 'hero-icons-outline', packageName: 'quasar-extras-svg-icons' },
          { label: 'Hero Icons (solid)', value: 'hero-icons-solid', packageName: 'quasar-extras-svg-icons' },
          { label: 'Iconoir Icons', value: 'iconoir-icons', packageName: 'quasar-extras-svg-icons' },
          { label: 'Jam Icons', value: 'jam-icons', packageName: 'quasar-extras-svg-icons' },
          { label: 'Octicons', value: 'oct-icons', packageName: 'quasar-extras-svg-icons' },
          { label: 'Pixelart Icons', value: 'pixelart-icons', packageName: 'quasar-extras-svg-icons' },
          { label: 'Prime Icons', value: 'prime-icons', packageName: 'quasar-extras-svg-icons' },
          { label: 'Remix Icons', value: 'remix-icons', packageName: 'quasar-extras-svg-icons' },
          { label: 'Simple Icons', value: 'simple-icons', packageName: 'quasar-extras-svg-icons' },
          { label: 'Tabler Icons', value: 'tabler-icons', packageName: 'quasar-extras-svg-icons' },
          { label: 'Zond Icons', value: 'zond-icons', packageName: 'quasar-extras-svg-icons' }
        ] }
      ],
      importedIcons: null,
      filter: '',
      dialogRef: null,
      showDialog: false,
      currentPath: '',
      currentName: '',
      textColor: 'black',
      colors: [
        'black',
        'red', 'pink', 'purple', 'deep-purple', 'indigo',
        'blue', 'light-blue', 'cyan', 'teal', 'green',
        'light-green', 'lime', 'yellow', 'amber', 'orange',
        'deep-orange', 'brown', 'grey', 'blue-grey'
      ],
      inverted: false
    }
  },

  computed: {
    colorClasses () {
      let color = ''
      let bgColor = 'bg-white'
      if (this.inverted) {
        color += 'bg-' + this.textColor
        bgColor = 'text-white'
      }
      else {
        color += 'text-' + this.textColor
      }
      if (this.textColor !== 'black') color += '-8'
      return color + ' ' + bgColor
    },
    icons () {
      const vals = {}
      const filter = this.filter && this.importedIcons ? this.filter.toLowerCase() : ''
      Object.keys(this.importedIcons ? this.importedIcons : {}).forEach(name => {
        if (filter === '' || name.toLowerCase().indexOf(filter) > -1) {
          vals[ name ] = this.importedIcons[ name ]
        }
      })
      return vals
    },
    filteredCount () {
      return Object.keys(this.icons).length
    },
    iconCount () {
      return this.importedIcons ? Object.keys(this.importedIcons).length : 0
    }
  },

  watch: {
    icon (val) {
      if (!val) {
        this.importedIcons = null
        return
      }

      const now = new Date()
      if (val.packageName === '@quasar/extras') {
        import(
          /* webpackChunkName: "[request]" */
          /* webpackInclude: /index\.js$/ */
          '@quasar/extras/' + val.value
        ).then(async svgFile => {
          this.importedIcons = markRaw(svgFile)
          console.log(`${ val.value } Load (ms):`, new Date() - now)
          await this.$nextTick()
          console.log(`${ val.value } Render (ms):`, new Date() - now)
        })
      }
      else if (val.packageName === 'quasar-extras-svg-icons') {
        import(
          /* webpackChunkName: "[request]" */
          /* webpackInclude: /index\.js$/ */
          'quasar-extras-svg-icons/' + val.value
        ).then(async svgFile => {
          this.importedIcons = markRaw(svgFile)
          console.log(`${ val.value } Load (ms):`, new Date() - now)
          await this.$nextTick()
          console.log(`${ val.value } Render (ms):`, new Date() - now)
        })
      }
    }
  },

  methods: {
    colorClass (color) {
      let newColor = 'bg-' + color
      if (color !== 'black') newColor += '-8'
      if (this.textColor === color) {
        newColor += ' active-color'
      }
      return newColor
    },

    changeColor (color) {
      this.textColor = color
    },

    hasChild (scope) {
      return scope.opt.children.some(c => this.icon && c.value === this.icon.value)
    },

    onClick (path, name) {
      this.currentPath = path
      this.currentName = name
      this.showDialog = true
      // this.dialogRef.show()
    },

    onClickDialog (path, name) {
      copyToClipboard(name)
        .then(() => {
          this.$q.notify({
            message: `'${ name }' copied to clipboard`,
            icon: path,
            color: 'white',
            textColor: 'primary'
          })
          this.showDialog = false
        })
    },

    onCopyName (path, name) {
      copyToClipboard(name)
        .then(() => {
          this.$q.notify({
            message: `'${ name }' copied to clipboard`,
            icon: path,
            color: 'white',
            textColor: 'primary'
          })
          this.showDialog = false
        })
    },

    onCopySvg (path, name) {
      copyToClipboard(path)
        .then(() => {
          this.$q.notify({
            message: `'${ name }' SVG copied to clipboard`,
            icon: path,
            color: 'white',
            textColor: 'primary'
          })
          this.showDialog = false
        })
    }
  }
})
</script>

<style>
.active-color {
  border: 1px dashed white;
}
</style>