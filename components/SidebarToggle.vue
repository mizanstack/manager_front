<template>
  <div>
    <!-- <b-button v-b-toggle.sidebar-backdrop>Tree Menu</b-button> -->
    <button @click.prevent="toggleVisiblity()">MENU</button>
    <b-sidebar id="sidebar-backdrop"
      title="Menu"
      :visible="visiblity"
      shadow
      >
      <div class="px-3 py-2">
        <tree-menu></tree-menu>
      </div>
    </b-sidebar>
  </div>
</template>
<script>
  import { EventBus } from '@/plugins/global'
  export default {
    data(){
      return {
        visiblity : false,
      }
    },
    methods : {
      toggleVisiblity(){
        this.visiblity = !this.visiblity;
      }
    },
    mounted(){
      var self = this;
      EventBus.$on('hideSidebar', () => {
        self.visiblity = false;
      })
    }
  }
</script>
