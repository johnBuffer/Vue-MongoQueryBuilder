<template>
  <transition name="slide-fade">
    <div class="card" style="max-width: 1000px;">
      <div class="card-header d-flex justify-content-between bg-primary text-white">
        <h3 class="text-left">ID: {{ item._id }}</h3>
      </div>
      <div class="card-body">
        <a download="result.json" :href='downloadLink'>text file</a>
        <div class="card-deck">

          <div class="card" v-if='item.traffic_objects[0]'>
            <div class="card-header d-flex justify-content-between">
              <h4 class="lead align-self-center">Traffic objects</h4>
              <div class="badge badge-secondary align-self-center"> {{ item.traffic_objects[0].ObjectCount }} </div>
            </div>

            <div class="card-body">
              <div v-for='traffic_object in item.traffic_objects'>
                <strong>Traffic objects :</strong> {{ traffic_object.ObjectCount }}
                <div v-for='object in traffic_object.Objects'>
                  {{ object }}
                </div>
              </div>
            </div>
          </div>

          <div class="card" v-if='item.traffic_objects_extended[0]'>
            <div class="card-header d-flex justify-content-between">
              <h4 class="lead align-self-center">Traffic objects extended</h4>
              <div class="badge badge-secondary align-self-center"> {{ item.traffic_objects_extended[0].ObjectCount }} </div>
            </div>

            <div class="card-body">
              <div v-for='traffic_object in item.traffic_objects_extended'>
                <strong>Traffic objects :</strong> {{ traffic_object.ObjectCount }}
                <div v-for='object in traffic_object.Objects'>
                  {{ object }}
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header d-flex justify-content-between">
              <h4 class="text-left lead">Ego vehicle</h4>
            </div>

            <div class="card-body">
              <div v-for='ego in item.ego_vehicle'>
                {{ ego }}
              </div>
            </div>
          </div>

          {{ item }}

        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'resultItem',
    props: ['item'],
    data () {
      return {
        displayNotes: 0
      }
    },

    methods: {
    },

    computed: {
      downloadLink: function () {
        var string = 'data:application/octet-stream,'
        return string + encodeURIComponent(JSON.stringify(this.item, null, 2))
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .table-card-body {
    padding: 0;
  }

  .slide-fade-enter-active {
    transition: all .3s ease;
  }

  .slide-fade-leave-active {
    transition: all .3s ease;
  }

  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateY(-100px);
    opacity: 0;
  }

</style>
