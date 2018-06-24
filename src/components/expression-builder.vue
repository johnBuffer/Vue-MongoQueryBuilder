<template>
  <transition name="slide-fade">
    <div class='d-flex justify-content-center'>
      <div class='card' @mouseenter='mouseEnter' @mouseleave='mouseLeave'>
        <div class='card-header d-flex justify-content-between'>
          <strong class='align-self-center'>Expression</strong>
          <button v-if='showRemove' type="button" class="btn btn-sm btn-danger" @click='removeThis'>
            <img src="../assets/trash.png">
          </button>
        </div>
        <div class='card-body d-flex justify-content-center'>
          <objectExplorer v-bind:item='item' @change='updateValuePath'></objectExplorer>

          <select class='custom-select operator-select' v-model='operator'>
            <option selected> = </option>
            <option> &gt </option>
            <option> &lt </option>
            <option> exists </option>
            <option v-if='subItemIsObject'> matches </option>
          </select>

          <input v-if='operator.length === 1' class='form-control' type='text' v-model='value' @keyup.enter='sendQuery'/>
          <group-builder v-if='operator === "matches"' :name='"innerGroup"' :item='subItem' @kill='resetOperator' @change='updateGroupQuery'></group-builder>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import objectExplorer from './object-explorer.vue'

  export default {
    name: 'expression-builder',
    components: {
      objectExplorer
    },
    props: ['item', 'name'],
    data () {
      return {
        value: '',
        operator: '=',
        objectValuePath: '',
        showRemove: false,
        groupQuery: ''
      }
    },

    methods: {
      update: function () {
        this.$emit('change', this.name, this.queryString)
      },

      updateValuePath: function (newPath) {
        this.objectValuePath = newPath
        this.update()
      },

      updateGroupQuery: function (name, string) {
        console.log('group changed ' + string)
        this.groupQuery = string
        this.$emit('change', this.name, this.queryString)
      },

      sendQuery: function () {
        this.$emit('sendQuery', this.queryString)
      },

      mouseEnter: function () {
        this.showRemove = true
      },

      mouseLeave: function () {
        this.showRemove = false
      },

      removeThis: function () {
        this.$emit('kill', this.name)
      },

      resetOperator: function () {
        this.operator = '='
      }
    },

    computed: {
      queryString: function () {
        var string = '"' + this.objectValuePath + '":'

        if (this.objectValuePath.length > 0) {
          if (this.operator === 'exists') {
            string += '{ "$exists": true }'
          } else if (this.operator === 'matches') {
            string += '{"$elemMatch": {' + this.groupQuery + '}}'
          } else if (!isNaN(Number(this.value))) {
            if (this.operator === '>') {
              string += '{"$gt":' + this.value + '}'
            } else if (this.operator === '<') {
              string += '{"$lt":' + this.value + '}'
            } else {
              string += this.value
            }
          } else {
            string = '"' + this.objectValuePath + '":"' + this.value + '"'
          }
        }

        return string
      },

      subItem: function () {
        var pathNames = this.objectValuePath.split('.')
        var currentObject = this.item
        for (var i = 0; i < pathNames.length; i++) {
          currentObject = currentObject[pathNames[i]]
        }

        console.log('SubItem: ' + currentObject)
        return currentObject
      },

      subItemIsObject: function () {
        if (this.subItem) {
          if (typeof this.subItem === 'object') {
            return true
          }
        }
        return false
      }
    },

    watch: {
      operator: function () {
        this.update()
      },

      value: function () {
        this.update()
      }
    },

    beforeCreate: function () {
      console.log('Expression builder beforeCreate')
      this.$options.components['groupBuilder'] = require('./group-builder.vue').default
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .sub-item-container {
    margin: 0;
    display: inline;
  }

  .operator-select {
    margin-right: 5px;
    margin-left: 5px;
  }

  .form-control {
    width: 150px;
    height: 28px;
  }

  .card-header {
    padding: 2px;
    padding-left: 5px;
    font-size: 12px;
    height: 27px;
  }

  .card-body {
    padding: 5px;
  }

  button {
    padding-top: 0;
    padding-left: 2px;
    padding-right: 2px;
  }

  img {
    width: 18px;
    height: 18px;
  }

  .card {
    margin: 5px;
    margin-top: 0;
  }

  select {
    padding: 4px;
    padding-right: 28px;
    font-size: 12px;
    height: 28px;
    text-align-last: center;
  }

  .slide-fade-enter-active {
    transition: all .15s ease;
  }

  .slide-fade-enter {
    transform: translateY(10px);
    opacity: 0;
  }

</style>
