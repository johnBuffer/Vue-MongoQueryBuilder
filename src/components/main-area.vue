<template>
  <div class="container" id="mainSearchPanel">
    <div class="col">
      <h1>Search in base</h1>

      <group-builder :item='objectModel' @sendQuery='sendPost'></group-builder>
      <div>{{ buildedSearch }}</div>

      <resultItem v-for='result in results' v-bind:item='result' v-bind:key='result._id'></resultItem>

      <transition name="slide-fade">
        <div class="alert alert-danger" role="alert" v-show='syntaxErrorInSearch'>
          <strong>Error :</strong> syntax error in query
        </div>
      </transition>

      <transition name="slide-fade">
        <div class="alert alert-warning" role="alert" v-show='searchHasNoResult'>No result</div>
      </transition>
      <transition name="slide-fade"><div class="loader" v-show='searchLock'></div></transition>
    </div>
  </div>
</template>

<script>
  import resultItem from './result-item.vue'
  import groupBuilder from './group-builder.vue'

  export default {
    name: 'test',
    components: {
      resultItem,
      groupBuilder
    },

    data () {
      return {
        results: [],
        searchString: '',
        objectModel: {},
        buildedSearch: '',
        searchToken: '',
        searchLock: false,
        searchComplete: false,
        searchHasNoResult: false,
        syntaxErrorInSearch: false
      }
    },

    methods: {
      sendPost: function (queryString) {
        this.results = []
        this.searchToken = ''
        this.searchComplete = false
        this.buildedSearch = queryString
        this.continueSearch(10)
      },

      continueSearch: function (count) {
        this.syntaxErrorInSearch = false

        if (this.searchLock || count < 1) {
          return
        }

        var jsonSearch = {}

        if (this.buildedSearch.length > 0) {
          try {
            jsonSearch = JSON.parse(this.buildedSearch)
          } catch (e) {
            this.searchHasNoResult = false
            this.syntaxErrorInSearch = true
            return // error in the above string (in this case, yes)!
          }
        }

        this.searchLock = true
        this.$http.post('http://127.0.0.1:3000/search2', {
          searchObject: jsonSearch,
          searchToken: this.searchToken
        }).then(response => {
          if (response.body.data[0] != null) {
            this.results.push(response.body.data[0])
            this.searchToken = response.body.token
            this.searchLock = false
            this.searchHasNoResult = false
            this.continueSearch(count - 1)
          } else {
            if (this.results.length === 0) {
              console.log('No result')
              this.searchHasNoResult = true
            } else {
              this.searchComplete = true
            }
            this.searchLock = false
          }
        }).catch(function () {
          this.searchLock = false
        })
      },

      checkScroll: function () {
        var d = document.documentElement
        var offset = d.scrollTop + window.innerHeight
        var height = d.offsetHeight

        if (offset > height - 100 && !this.searchComplete) {
          this.continueSearch(10)
        }
      },

      updateBuildedSearch: function (builded) {
        this.buildedSearch = builded
      },

      initObjectModel: function (modelArray) {
        this.objectModel = {}
        for (var i = 0; i < modelArray.length; i++) {
          var names = modelArray[i].name.split('.')
          var currentScope = this.objectModel
          for (var k = 0; k < names.length; k++) {
            var key = names[k]
            if (!(key in currentScope)) {
              if (k < names.length - 1) {
                currentScope[key] = {}
              } else {
                currentScope[key] = ''
              }
            }
            currentScope = currentScope[key]
          }
        }
      }
    },

    watch: {
      searchString: function () {
      }
    },

    created: function () {
      /* this.$http.get('http://localhost:3000/search').then(response => {
        // this.initObjectModel(response.body.data[0])
        this.objectModel = response.body.data[0]
      })
      window.addEventListener('scroll', this.checkScroll) */
      this.objectModel = {
        'example': {
          'child1': 'ok',
          'child2': {
            'sub1': {
              'subsub1': 0,
              'subsub2': 1
            },
            'sub2': 'lol'
          }
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  #mainSearchPanel {
    width: 100%;
    text-align: center;

    margin: 0 auto;
    margin-top: 50px;
  }

  .alert {
    margin-top: 20px;
  }

  .search-input {
    width: 100%;
    margin: 0 auto;
  }

  .card {
    margin: 0 auto; /* Added */
    float: none; /* Added */
    margin-top: 10px; /* Added */
  }

  .slide-fade-enter-active {
    transition: all .3s ease;
  }

  .slide-fade-leave-active {
    transition: all .3s ease;
  }

  .slide-fade-enter {
    transform: translateY(-50px);
    opacity: 0;
  }

  .slide-fade-leave-to {
    transform: translateY(50px);
    opacity: 0;
  }

  .loaderContainer {
    margin: 0 auto;
    text-align: center;
  }

  .loader {
    margin: 0 auto;
    margin-top: 20px;
    border: 10px solid #f3f3f3; /* Light grey */
    border-top: 10px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 80px;
    height: 80px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }

</style>
