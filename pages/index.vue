<template>
  <div class="container">
      <div class="row">
        <h3>All directories</h3>
        <div class="directory-box" v-if="directories">
          <div class="directory-single" v-for="directory in directories.data">
              <div class="card border-success mb-3" style="max-width: 18rem;">
                <div class="card-header">{{ directory.name }}</div>
                <div class="card-body text-success">
                  <h5 class="card-title">{{ directory.name }}</h5>
                  <p class="card-text"></p>
                </div>
              </div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        directories : null,
        loading : false
      }
    },
    methods : {
      fetchData(){
        var self = this;
        self.loading = true;
        this.$axios.get('/get-directories').then(( response ) => {
          self.directories = response.data;
          self.loading = false;
        }).then((error) => {
          self.loading = false;
        });
      }
    },
    mounted(){
      this.fetchData();
    }
  }
</script>