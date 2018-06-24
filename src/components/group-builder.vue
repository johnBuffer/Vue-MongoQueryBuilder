<template>
  <transition name="slide-fade">
    <div class='d-flex justify-content-center'>
      <div class='card' @mouseenter='mouseEnter' @mouseleave='mouseLeave'>
        <div class='card-header bg-primary text-white d-flex justify-content-between group-header'>

          <div class='align-self-center'>
            <strong>Group</strong>
            <select class='custom-select' v-model='type'>
              <option selected> AND  </option>
              <option> OR </option>
            </select>
          </div>

          <div class='align-self-center'>
            <button type="button" class="btn btn-secondary btn-sm" @click='addSubElem("EXPR")'>&#10010 Expression</button>
            <button type="button" class="btn btn-secondary btn-sm" @click='addSubElem("GROUP")'>&#10010 Group</button>
            <!-- {{ queryString }} -->
          </div>


          <button v-if='name && showRemove' type="button" class="btn btn-sm btn-danger" @click='removeThis'>
              <img src="../assets/trash.png">
          </button>
          <div v-if='name && !showRemove' class='blank-div'></div>
          <span v-if='!name' class='align-self-center'>
            ROOT
          </span>

        </div>

        <div v-if='subElem.length>0' class='card-body d-flex flex-column'>
          <draggable v-model='subElem'>
            <div class='subElemContainer' v-for='elem in subElem' v-bind:key='elem.name'>
              <expression-builder v-if='elem.type=="EXPR"' :item='item' :name='elem.name' @kill='remove' @change='updateQuery' @sendQuery='sendQuery'></expression-builder>
              <group-builder v-if='elem.type=="GROUP"' :item='item' :name='elem.name' @kill='remove' @change='updateQuery' @sendQuery='sendQuery'></group-builder>
            </div>
          </draggable>
        </div>

        <div v-if='!name' class='card-footer d-flex justify-content-center'>
          <button class='btn btn-success' @click='sendQuery'>Generate JSON</button>
        </div>

      </div>
    </div>
  </transition>
</template>

<script>
  import expressionBuilder from './expression-builder.vue'
  import draggable from 'vuedraggable'

  export default {
    name: 'group-builder',
    components: {
      expressionBuilder,
      draggable
    },
    props: ['item', 'name'],
    data () {
      return {
        subElem: [],
        type: 'AND',
        subType: '',
        showRemove: false
      }
    },

    methods: {
      addSubElem: function (elemType) {
        var subElem = {
          type: elemType,
          name: this.randomName(),
          query: ''
        }

        this.subElem.push(subElem)
      },

      updateQuery: function (name, string) {
        console.log('update: ' + string)
        for (var i = 0; i < this.subElem.length; i++) {
          if (this.subElem[i].name === name) {
            this.subElem[i].query = string
            this.$emit('change', this.name, this.queryString)
            break
          }
        }
      },

      remove: function (name) {
        console.log('Request kill for ' + name)
        for (var i = 0; i < this.subElem.length; i++) {
          if (this.subElem[i].name === name) {
            this.subElem.splice(i, 1)
            break
          }
        }
      },

      removeThis: function () {
        this.$emit('kill', this.name)
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

      randomName: function () {
        var hash = Math.random().toString(36).substr(2)
        return hash
      }
    },

    computed: {
      queryString: function () {
        var string = '"$and":['

        if (this.type === 'OR') {
          string = '"$or":['
        }

        var size = this.subElem.length
        for (var i = 0; i < size; i++) {
          string += '{' + this.subElem[i].query + '}'
          if (i < size - 1) {
            string += ','
          }
        }

        string += ']'

        if (!this.name) {
          string = '{' + string + '}'
        }

        return string
      }
    },

    watch: {
      type: function () {
        console.log('type changed')
        this.$emit('change', this.name, this.queryString)
      },

      item: function () {
        console.log('group item changed')
        this.subElem = []
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  strong {
    font-size: 14px;
  }

  .group-header {
    background-color: rgb(63, 80, 106)!important;
  }

  .card {
    min-width: 500px;
    margin-bottom: 5px;
  }

  .card-header {
    padding: 2px;
    padding-left: 8px;
    padding-right: 5px;

    font-size: 12px;
    height: 27px;
  }

  .card-footer {
    padding: 5px;
    font-size: 12px;
  }

  .card-body {
    padding: 0;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
  }

  .btn-secondary {
    padding: 0;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 12px;
  }

  .blank-div {
    width: 24px;
  }

  .btn-danger {
    padding-top: 0;
    padding-left: 1px;
    padding-right: 1px;
    padding-bottom: 2px;
  }

  .btn-success {
    padding-left: 20px;
    padding-right: 20px;
  }

  img {
    width: 18px;
    height: 18px;
  }

  select {
    padding: 4px;
    padding-right: 28px;
    font-size: 10px;
    height: 24px;
  }

  .slide-fade-enter-active {
    transition: all .15s ease;
  }

  .slide-fade-enter {
    transform: translateY(10px);
    opacity: 0;
  }
</style>
