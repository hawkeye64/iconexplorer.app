<template>
  <q-page>
    <q-dialog
      ref="dialogRef"
      v-model="showDialog"
    >
      <q-card class="q-pa-md">
        <div
          class="row justify-center items-center"
          style="max-width: 400px; max-height: 300px; width: 100%; height: 100%;"
        >
          <q-icon
            :name="currentPath"
            size="128px"
            class="q-pa-xs"
            :class="colorClasses"
          />
          <span
            class="full-width text-center"
            style="font-size: 28px;"
          >{{ currentName }}</span>

          <div class="row">
            <div
              v-for="color in colors"
              :key="color"
              :class="colorClass(color)"
              style="width: 20px; height: 20px;"
              @click.stop="changeColor(color)"
              @mouseenter.stop="changeColor(color)"
            />
            <q-toggle
              v-model="inverted"
              label="Invert colors"
            />
          </div>

          <q-btn-group push>
            <q-btn
              push
              icon="mdi-content-copy"
              @click="onCopyName(currentPath, currentName)"
            >
              <q-tooltip>Copy name to clipboard</q-tooltip>
            </q-btn>
            <q-btn
              push
              label="SVG"
              @click="onCopySvg(currentPath, currentName)"
            >
              <q-tooltip>Copy SVG to clipboard</q-tooltip>
            </q-btn>
          </q-btn-group>
        </div>
      </q-card>
    </q-dialog>
    <div :class="headerClasses">
      <q-select
        v-model="icon"
        dense
        options-dense
        outlined
        clearable
        :options="iconSets"
        label="Select Icon set"
        class="col-md-4 col-sm-12"
        style="max-width: 280px; width: 100%; margin: 2px;"
      >
        <template #option="scope">
          <q-expansion-item
            expand-separator
            group="somegroup"
            :default-opened="hasChild(scope)"
            header-class="text-weight-bold"
            :label="scope.opt.label"
          >
            <template
              v-for="child in scope.opt.children"
              :key="child.label"
            >
              <q-item
                v-ripple
                v-close-popup
                clickable
                :class="{ 'bg-light-blue-1': icon === child }"
                @click="icon = child"
              >
                <q-item-section>
                  <q-item-label
                    class="q-ml-md"
                  >
                    {{ child.label }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-expansion-item>
        </template>
      </q-select>

      <div class="row justify-center items-center col-md-4 col-sm-12">Totals: {{ filteredCount }}/{{ iconCount }}</div>

      <q-input
        v-model="filter"
        borderless
        dense
        outlined
        debounce="300"
        clearable
        placeholder="Search"
        class="col-md-4 col-sm-12"
        style="margin: 2px; max-width: 280px; width: 100%;"
      >
        <template #append>
          <q-icon
            v-if="!filter"
            name="mdi-card-search-outline"
          />
        </template>
      </q-input>
    </div>

    <q-separator class="q-mb-xs" />

    <div class="row justify-center">
      <q-intersection
        v-for="(path, name) in icons"
        :key="name"
        once
        class="intersetion-icon-box col-xl-1 col-lg-2 col-md-3 col-sm-4 col-xs-6"
        @click="onClick(path, name)"
      >
        <div class="intersetion-icon-box--inner row full-width justify-center items-center overflow-hidden ellipsis">
          <q-icon
            :name="path"
            size="60px"
            class="q-pa-xs row full-width justify-center items-center"
          />
          <div
            class="row full-width justify-center items-center ellipsis"
            style="font-size: 10px;"
          >
            {{ name }}
          </div>
          <q-tooltip
            :delay="1000"
            class="primary"
          >
            {{ name }}
          </q-tooltip>
        </div>
      </q-intersection>
    </div>

    <div class="icons-footer" />

    <q-page-scroller
      expand
      position="bottom"
      :scroll-offset="150"
      :offset="[0, 0]"
    >
      <div class="col cursor-pointer q-pa-sm text-center glass">
        <q-icon
          name="mdi-chevron-up"
          size="lg"
        />
      </div>
    </q-page-scroller>
  </q-page>
</template>

<script>
import { defineComponent, markRaw } from 'vue'
import { copyToClipboard } from 'quasar'
import { iconSets } from 'src/icon-sets'

export default defineComponent({
  name: 'SvgIconViewer',

  data () {
    return {
      icon: null,
      iconSets,
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
    headerClasses () {
      return (this.$q.screen.lt.sm ? 'column' : 'row')
        + ' justify-center items-center q-pa-xs'
    },
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
          /* webpackExclude: /(mdi-v4|ionicons-v4)/ */
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
    },

    showDialog (val) {
      if (!val) {
        this.textColor = 'black'
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
