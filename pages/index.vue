<template>
  <div class="container">
      <div class="row">
        <div class="directory-area">
          <h3>All directories</h3>

          <div class="manager-action-key">
            <ul class="manager-action-icons">
              <li @click="goHome()"><i style="font-size:40px;" class="icon-home"></i> Home</li>
              <li @click="openOrCloseFolderAction()"><i class="icon-plus"></i><i class="icon-folder-close-alt"></i> Folder</li>
              <li><i class="icon-plus"></i><i class="icon-picture"></i> Media</li>
              <li><i class="icon-plus"></i> Sort</li>
            </ul>
          </div>

          <div class="manager-action-details">
            <div class="folder-add-area" v-if="folderAction">
              <input type="text" placeholder="Input Folder Name" v-model="folderActionName">
              <button class="btn" @click="saveFolder()">Save</button>
              <button class="btn" @click="openOrCloseFolderAction()">Cancel</button>
            </div>
          </div>



          <div class="directory-box">

            <div class="directory-single" v-if="root == false" @click.prevent="backDirectory()">
                <div class="card border-success mb-3">
                  <div class="card-header">&nbsp;</div>
                  <div class="card-body text-success">
                    <h5 class="card-title"><i class="icon-arrow-left"></i> Back</h5>
                    <p class="card-text"></p>
                  </div>
                </div>
            </div><!--end of directory-box-->

            <template v-if="directories">
              <div class="directory-single"  v-for="directory in directories.data" >
                  <div class="card border-success mb-3">
                    <div class="card-header">{{ directory.name }}

                        <b-dropdown id="dropdown-left" text="" variant="warning" class="directory-action m-2">
                          <b-dropdown-item href="#" @click.prevent="deleteFolder(directory.id)">Delete</b-dropdown-item>
                          <b-dropdown-item href="#" @click.prevent="renameFolder(directory.id)">Rename</b-dropdown-item>
                        </b-dropdown>

                    </div>
                    <div class="card-body text-success" @click.prevent="openDirectory(directory.id)">
                      <h5 class="card-title">{{ directory.name }}</h5>
                      <p class="card-text"></p>
                    </div>
                  </div>
              </div><!--end of directory-single-->
            </template>
          </div><!--end of directory-box-->
        </div><!--end of directory-area-->
      </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        directories : null,
        loading : false,
        root : true,
        currentDirectory : null,
        folderAction : false,
        folderActionName : '',
      }
    },
    methods : {
      fetchData(){
        // this is for fetch date directory
        var self = this;
        self.loading = true;
        this.$axios.get('/get-directories').then(( response ) => {
          self.directories = response.data;
          self.loading = false;
          self.root = true;
        }).catch((error) => {
          self.loading = false;
          self.root = true;
        });
      },
      openDirectory(id){
        // this is for open directory
        var self = this;
        self.loading = true;
        this.$axios.get('/open-directory/' + id).then(( response ) => {
          self.directories = response.data;
          self.currentDirectory = response.data.current_directory;
          self.loading = false;
          self.root = false;
        }).catch((error) => {
          self.currentDirectory = null;
          self.loading = false;
        });
      },
      reloadDirectory(){
        if(this.currentDirectory){
          this.openDirectory(this.currentDirectory.id);
        } else{
          this.fetchData();
        }
      },
      backDirectory(){
        if(this.currentDirectory.parent_id){
          // has back
          this.openDirectory(this.currentDirectory.parent_id);
        } else {
          // go root directory
          this.fetchData();
        }
      },
      openOrCloseFolderAction(){
        this.folderAction = !this.folderAction;
      },
      saveFolder(){
        var self = this;
        this.$axios.post('/save-folder', {
          parentId : self.currentDirectory ? self.currentDirectory.id : null,
          name : self.folderActionName
        }).then(( response ) => {
          self.reloadDirectory();
          self.closeAndResetFolderAction();
        }).catch((error) => {
        });
      },
      closeAndResetFolderAction(){
        this.folderAction = false;
        this.folderActionName = '';
      },
      deleteFolder(id){
        var answer = window.confirm("Are you sure to delete this folder and this sub folders?");
        if (answer) {
            //some code
        }
        else {
            //some code
        }
      },
      renameFolder(id){

      },
      goHome(){
        this.closeAndResetFolderAction();
        this.resetAllData();
        this.fetchData();

      },
      resetAllData(){
        this.$data = {
          directories : null,
          loading : false,
          root : true,
          currentDirectory : null,
          folderAction : false,
          folderActionName : '',
        }
      }
    },
    mounted(){
      this.fetchData();
    },
  }
</script>