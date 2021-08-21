<template>
  <div class="container">

      <!--NESTED TOGGLE TREE MENU-->
      <tree-menu></tree-menu>


      <div class="row">
        <b-button v-b-toggle.sidebar-backdrop>Tree Menu</b-button>
        <div class="directory-area">
          <h3>All directories</h3>
          <div class="manager-action-key"  >
            <ul class="manager-action-icons" :class="{'is_loading' : loading}">
              <li @click="goHome()"><i style="font-size:40px;" class="icon-home"></i> Home</li>
              <li v-if="root == false" @click.prevent="backDirectory()"><i style="font-size:40px;" class="icon-arrow-left"></i> Back</li>
              <li @click="openOrCloseFolderActionArea()"><i class="icon-plus"></i><i class="icon-folder-close-alt"></i> Folder</li>
              <li @click="openOrCloseMediaActionArea()"><i class="icon-plus"></i><i class="icon-picture"></i> Media</li>
              <li @click="reloadDirectory()"><i style="font-size:40px;" class="icon-refresh"></i> Reload</li>
              <li><i class="icon-plus"></i> Sort</li>
            </ul>
          </div>

          <div class="manager-action-details">
            <div class="folder-add-area" v-if="folderActionArea">
              <input type="text" placeholder="Input Folder Name" v-model="folderNameText">

              <template v-if="updateFolderId">
                <button class="btn" @click="updateFolder()">{{ folderSaveButtonName }}</button>
              </template>
              <template v-if="!updateFolderId">
                <button class="btn" @click="saveFolder()">{{ folderSaveButtonName }}</button>
              </template>

              <button class="btn" @click="canceFolderActionArea()">Cancel</button>
            </div>
            <div class="media-action-area" v-if="mediaActionArea">
               <input type="file" @change="onFileChange($event)">

               <div class="file-errors">
                 <p v-for="error in fileErrors">{{ error[0] }}</p>
               </div>
            </div><!--end of media-action-area-->
          </div>


          <div class="directory-box">

            <template v-if="directories">
              <div class="directory-single"  v-for="directory in directories.data" >
                  <div class="card border-success mb-3">
                    <div class="card-header">{{ directory.name }}

                        <b-dropdown split
                                    split-variant="outline-success"
                                    variant="success"
                                    text="Action"
                                    class="m-2">
                          <b-dropdown-item href="#" @click.prevent="deleteFolder(directory.id)">Delete</b-dropdown-item>
                          <b-dropdown-item href="#" @click.prevent="renameFolder(directory.id, directory.name)">Rename</b-dropdown-item>
                        </b-dropdown>

                    </div>
                    <div class="card-body text-success" @click.prevent="openDirectory(directory.id)">
                      <h5 class="card-title">{{ directory.name }}</h5>
                      <p class="card-text"></p>
                    </div>
                  </div>
              </div><!--end of directory-single-->

            </template>  

            <template v-if="medias">    
              <div class="directory-single"  v-for="media in medias" >
                  <div class="card border-success mb-3">
                    <div class="card-header">{{ media.name }}

                        <b-dropdown split
                                    split-variant="outline-success"
                                    variant="success"
                                    text="Action"
                                    class="m-2">
                          <b-dropdown-item :href="media.media_src" download>Download</b-dropdown-item>
                          <b-dropdown-item href="#" @click.prevent="deleteMedia(media.id)">Delete</b-dropdown-item>
                          <b-dropdown-item href="#" @click.prevent="renameMedia(media.id, media.name)">Rename</b-dropdown-item>
                        </b-dropdown>

                    </div>
                    <div class="card-body text-success" @click.prevent="openMedia(media.id)">
                      <h5 class="card-title"><img :src="media.media_src" width="200"></h5>
                      <p class="card-text"></p>
                    </div>
                  </div>
              </div><!--end of directory-single-->

            </template>   

            <template v-if="directories">
              <h2 v-if="!directories.data.length" class="nofile-message">NO FILE FOUND</h2>
            </template>
          </div><!--end of directory-box-->
        </div><!--end of directory-area-->
      </div>
  </div>
</template>
<script>
  export default {
    middleware: 'auth',
    data(){
      return {
        directories : null,
        loading : false,
        root : true,
        currentDirectory : null,
        folderActionArea : false,
        folderNameText : '',
        updateFolderId : null,

        medias : null,

        mediaActionArea : false,
        attachment : null,
        fileErrors : [],
      }
    },
    methods : {
      onFileChange(event){
          this.attachment = event.target.files[0];
          this.saveFile();
      },
      saveFile(){
            var self = this;
            var prepareData = new FormData();
            prepareData.append('attachment', this.attachment);
            prepareData.append('directory_id', this.currentDirectory ? this.currentDirectory.id : null);
            self.$axios.post('upload-files', prepareData).
            then((response) => {
              self.reloadDirectory();
              self.makeToast('success', 'Done', 'Succesfully Uploaded');
            }).catch((err) => {
                self.fileErrors = err.response.data.errors;
            });
        },
        downloadMedia(uri, name){
          var link = document.createElement("a");
          // If you don't know the name or want to use
          // the webserver default set name = ''
          link.setAttribute('download', 'download');
          link.href = uri;
          document.body.appendChild(link);
          link.click();
          link.remove();
        },
      fetchRootData(){
        // this is for fetch date directory
        var self = this;
        self.medias = null;
        self.loading = true;
        this.$axios.get('/get-directories').then(( response ) => {
          self.directories = response.data;
          self.currentDirectory = null;
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
          self.medias = response.data.medias;
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
          this.fetchRootData();
        }
      },
      backDirectory(){
        if(this.currentDirectory.parent_id){
          // has back
          this.openDirectory(this.currentDirectory.parent_id);
        } else {
          // go root directory
          this.fetchRootData();
        }
        this.closeAndResetFolderActionArea();
      },
      openOrCloseFolderActionArea(){
        this.folderActionArea = !this.folderActionArea;
        this.mediaActionArea = false;
      },
      openOrCloseMediaActionArea(){
        this.mediaActionArea = !this.mediaActionArea;
        this.folderActionArea = false;
      },
      canceFolderActionArea(){
        this.closeAndResetFolderActionArea();
      },
      saveFolder(){
        var self = this;
        this.$axios.post('/save-folder', {
          parentId : self.currentDirectory ? self.currentDirectory.id : null,
          name : self.folderNameText
        }).then(( response ) => {

          self.makeToast('success', 'Done', 'New Folder Created');
          self.reloadDirectory();
          self.closeAndResetFolderActionArea();
        }).catch((error) => {
        });
      },

      closeAndResetFolderActionArea(){
        this.folderActionArea = false;
        this.folderNameText = '';
        this.updateFolderId = null;
      },
      closeAndResetMediaActionArea(){
        this.MediaActionArea = false;
      },
      deleteFolder(id){
        var answer = window.confirm("Are you sure to delete this folder and this sub folders?");
        if (answer) {
          var self = this;
          this.$axios.post('/delete-folder/' + id).then(( response ) => {
            self.makeToast('success', 'Done', 'Folder deleted');
            self.reloadDirectory();
            self.closeAndResetFolderActionArea();
          }).catch((error) => {
          });
        }
        else {

          // some code
        }
      },
      deleteMedia(id){
        var answer = window.confirm("Are you sure to delete this?");
        if (answer) {
          var self = this;
          this.$axios.post('/delete-media/' + id).then(( response ) => {
            self.makeToast('success', 'Done', 'Deleted');
            self.reloadDirectory();
            self.closeAndResetFolderActionArea();
            self.closeAndResetMediaActionArea();
          }).catch((error) => {
          });
        }
        else {

          // some code
        }
      },
      renameFolder(id, folderName){
        this.updateFolderId = id;
        this.folderActionArea = true;
        this.folderNameText = folderName;
      },
      updateFolder(){
        if(!this.updateFolderId){
          alert('You can\'t update the folder');
          return;
        }
        var self = this;
        this.$axios.post('/update-folder/' + this.updateFolderId, {
          name : self.folderNameText,
        }).then(( response ) => {
          self.makeToast('success', 'Done', 'Folder name updated');
          self.closeAndResetFolderActionArea();
          self.reloadDirectory();
        }).catch((error) => {

        });
      },
      goHome(){
        this.closeAndResetFolderActionArea();
        this.closeAndResetMediaActionArea();
        this.resetAllData();
        this.fetchRootData();

      },
      resetAllData(){
        this.$data = {
          directories : null,
          loading : false,
          root : true,
          currentDirectory : null,
          folderActionArea : false,
          folderNameText : '',
        }
      },
      makeToast(variant, title, body) {
        this.$bvToast.toast(body, {
          title: `${title}`,
          variant: variant,
          solid: true
        })
      }
    },
    mounted(){
      this.fetchRootData();

      
    },
    computed : {
      folderSaveButtonName(){
        return this.updateFolderId ? 'Update' : 'Save';
      }
    }
  }
</script>