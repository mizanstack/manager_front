<template>
  <div class="tree-manage-area" :class="{'is_loading' : loading}">
    <div class="tree" v-if="treeMenu">
        <tree :menuNode="treeMenu.data"></tree>
    </div>
  </div><!--tree manage area-->
</template>
<script>
  import { EventBus } from '@/plugins/global'
  export default {
    data(){
      return {
        treeMenu : null,
        loading : false,
      }
    },
    methods : {
      fetchTreeMenu(){
        var self = this;
        self.loading = true;
        this.$axios.get('/nested-directories').then(( response ) => {
          self.treeMenu = response.data;
          self.loading = false;
        }).catch((error) => {
          self.loading = false;
        });
      },
    },
    mounted(){
      this.fetchTreeMenu();

      EventBus.$on('reloadTreeMenu', () => {
        this.fetchTreeMenu();
      })
    },
    computed : {
    }
  }
</script>