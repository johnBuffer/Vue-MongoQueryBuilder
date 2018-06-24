<template>
  <div class='query-builder-container'>
    <div class='d-flex justify-content-center'>
      <div class='card'>
        <div class="card-header">Object Property</div>
        <div class="card-body">
          <objectExplorer v-bind:item='item' @schanged='updateValuePath'></objectExplorer>
        </div>
      </div>
      <div class='card'>
        <div class="card-header">Operator</div>
        <div class="card-body" id='operator-card'>
          <select class='custom-select operator-select' v-model='operator'>
            <option> = </option>
            <option> &gt </option>
            <option> &lt </option>
          </select>
        </div>
      </div>
      <div class='card'>
        <div class="card-header">Value</div>
        <div class="card-body">
         <input class='form-control' type='text' v-model='value' @keyup.enter='sendQuery'/>
       </div>
      </div>
    </div>
  </div>
</template>

<script>
  import objectExplorer from './object-explorer.vue'

  export default {
    name: 'query-builder',
    components: {
      objectExplorer,
    },
    props: ['item'],
    data () {
      return {
        operator: '',
        objectValuePath: '',
        value: ''
      }
    },

    methods: {
      update: function () {
        this.$emit('change', this.queryString)
      },

      updateValuePath: function (newPath) {
        this.objectValuePath = newPath
        this.update()
      },

      sendQuery: function () {
        this.$emit('sendQuery', this.queryString)
      }
    },

    computed: {
      queryString: function () {
        var string = '{}'

        if (this.objectValuePath.length > 0) {
          if (!isNaN(Number(this.value)))
            string = '{"'+this.objectValuePath+'":'+this.value+'}'
          else
            string = '{"'+this.objectValuePath+'":"'+this.value+'"}'
        }
        console.log(string)

        return string
      }
    },

    watch: {
      value: function () {
        this.update()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .query-builder-container {
    margin: 0;
    display: inline;
  }

  .sub-item-container {
    margin: 0;
    display: inline;
  }

  .card-header {
    padding: 2px;
  }

  .card-body {
    padding: 5px;
  }

  div .card {
    margin-left: 5px;
    margin-right: 5px;
  }

  .form-control {
    width: 150px;
  }

  .operator-select {
    margin-right: 5px;
    margin-left: 5px;
  }

  .card-deck .card {
    margin-left: 5px;
    margin-right: 5px;
  }

</style>
