<template>
  <div v-if='item' class='object-explorer-container d-flex justify-content-center'>
    <select class='custom-select' v-model='selectedItem'>
      <option v-for='(prop, value) in item'> {{value}} </option>
    </select>
    <div v-if='subItem && isObject(subItem)' class='sub-item-container'>
      <object-explorer v-bind:item='subItem' v-on:change='childChanged'></object-explorer>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'object-explorer',
    props: ['item'],
    data () {
      return {
        selectedItem: '',
        subItem: this.item[0],
        id: ''
      }
    },

    methods: {
      isObject: function (item) {
        if (typeof item === 'object') {
          return true
        }
        return false
      },

      focusNext: function () {
      },

      childChanged: function (newValue) {
        if (newValue.length > 0) {
          this.$emit('change', this.selectedItem + '.' + newValue)
        } else {
          this.$emit('change', this.selectedItem)
        }
      },

      extractItem: function (item) {
        var isArray = Array.isArray(item)
        if (isArray) {
          if (this.isObject(item[0])) {
            this.subItem = item[0]
          } else {
            this.subItem = null
          }
        } else {
          this.subItem = item
        }
      },

      updateSubItem: function () {
        if (this.selectedItem.length > 0) {
          this.extractItem(this.item[this.selectedItem])
          console.log('Sub:' + JSON.stringify(this.subItem))
          this.$emit('change', this.selectedItem)
        } else {
          console.log('Reset subitem')
          this.subItem = null
        }
      }
    },

    computed: {
    },

    watch: {
      selectedItem: function () {
        this.updateSubItem()
        this.$emit('change', this.selectedItem)
      },

      item: function () {
        this.selectedItem = ''
        this.updateSubItem()
      }
    },

    created: function () {
      this.id = Math.random().toString(36).substr(2)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .object-explorer-container {
    margin: 0;
    display: inline;
  }

  .form-control {
    min-width: 150px;
    height: 28px;
    font-size: 12px;
  }

  .sub-item-container {
    margin: 0;
    display: inline;
  }

  select {
    padding: 4px;
    padding-right: 28px;
    font-size: 12px;
    height: 28px;
  }

</style>
