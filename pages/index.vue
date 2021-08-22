<template>
  <div>
    <sidebar-toggle></sidebar-toggle>
    <div class="container">

        <!--NESTED TOGGLE TREE MENU-->
        <div class="row">
          
          <div class="directory-area">
            <h3>FILE MANAGER SYSTEM</h3>
            <div class="manager-action-key">
              <ul class="manager-action-icons" :class="{'is_loading' : loading}">

                <li @click="goHome()" class="bigger-action-icon"><i class="icon-home"></i> Home</li>

                <li class="bigger-action-icon" v-if="root == false" @click.prevent="backDirectory()"><i class="icon-arrow-left"></i> Back</li>

                <li class="bigger-action-icon" :class="{'disable-icon' : !forwardDirectoryId}"  @click.prevent="forwardDirectory()"><i class="icon-arrow-right"></i> Forward</li>

                <li :class="{'disable-icon' : !hasNewFolder}" @click="openOrCloseFolderActionArea()"><i class="icon-plus"></i><i class="icon-folder-close-alt"></i> Folder</li>

                <li :class="{'disable-icon' : !hasNewMedia}" @click="openOrCloseMediaActionArea()" ><i class="icon-plus"></i><i class="icon-picture"></i> Media</li>

                <li class="bigger-action-icon" @click="reloadDirectory()"><i class="icon-refresh"></i> Reload</li>

                <li class="disable-icon bigger-action-icon" @click="pasteOperation()" :class="{'paste-active' : hasPaste}"><i class="icon-paste"></i> Paste</li>

                <li class="bigger-action-icon" @click="makeSort()"><i :class="{'icon-sort-by-attributes' : sortBy == 'asc', 'icon-sort-by-attributes-alt' : sortBy == 'desc'}"></i> Sort</li>
              </ul>
            </div>


            <div class="current-directory-meta">
                <p v-if="currentDirectory">Current Directory: {{ currentDirectory.name }}</p>
                <p v-if="searchMode">Search Result: {{ searchKeyword }} <i class="icon-remove remove-search-icon" @click="reloadDirectory()"></i></p>
            </div>

            <div class="manager-action-details" v-if="hasAnyAction">
              <div class="folder-add-area" v-if="folderActionArea">
                <input type="text" @keydown.enter.exact.prevent @keyup.enter.exact="saveOrUpdateFolder()" placeholder="Input Folder Name" v-model="folderNameText">

                <template v-if="updateFolderId">
                  <button class="btn" @click="updateFolder()">{{ folderSaveButtonName }}</button>
                </template>
                <template v-if="!updateFolderId">
                  <button class="btn" @click="saveFolder()">{{ folderSaveButtonName }}</button>
                </template>

                <button class="btn" @click="canceFolderActionArea()">Cancel</button>
              </div>
              <div class="media-action-area" v-if="mediaActionArea">
                <!-- FILE UPLOAD AREA-->
                 <input type="file" id="file_upload_field" @change="onFileChange($event)" multiple>

                 <div class="upload-progress" v-if="fileErrors.length">
                   <div class="upload-name-single" v-for="fileInfo in fileErrors">{{ fileInfo.name }} {{ fileInfo.status }} {{ fileInfo.errors }}</div>
                 </div>

                 <!-- <div class="file-errors">
                   <p v-for="error in fileErrors">{{ error[0] }}</p>
                 </div> -->
              </div><!--end of media-action-area-->
            </div>


            <div class="directory-box">
              <div class="row">
                <template v-if="directories">
                  <div class="directory-single col-sm-2 col-md-3 col-lg-3"  v-for="directory in directories.data" >
                      <div class="card border-success mb-3">
                        <div class="card-header">{{ directory.name }}

                            <b-dropdown 
                                        size="sm"
                                        variant="outline-success"
                                        text=""
                                        class="float-right">
                              <b-dropdown-item href="#" @click.prevent="openDirectory(directory.id)">Open</b-dropdown-item>
                              <b-dropdown-item href="#" @click.prevent="copyFolder(directory.id)">Copy</b-dropdown-item>
                              <b-dropdown-item href="#" @click.prevent="cutFolder(directory.id)">Cut</b-dropdown-item>
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
                  <div class="directory-single col-sm-2 col-md-3 col-lg-3" v-for="media in medias" >
                      <div class="card border-success mb-3">
                        <div class="card-header">{{ media.name }}

                            <b-dropdown size="sm"
                                        variant="outline-success"
                                        text=""
                                        class="float-right">
                              <b-dropdown-item :href="media.media_src" @click.prevent="downloadMedia(media.media_src, media.attachment)">Download</b-dropdown-item>
                              <b-dropdown-item href="#" @click.prevent="copyMedia(media.id)">Copy</b-dropdown-item>
                              <b-dropdown-item href="#" @click.prevent="cutMedia(media.id)">Cut</b-dropdown-item>
                              <b-dropdown-item href="#" @click.prevent="deleteMedia(media.id)">Delete</b-dropdown-item>
                            </b-dropdown>

                        </div>
                        <div class="card-body text-success" @click.prevent="openMedia(media)">
                          <h5 class="card-title">
                            <img v-if="media.type == 'image'" :src="media.media_src" width="200">
                            <h2 class="media-extention-show" v-if="media.type == 'other'">{{media.ext}}</h2>
                          </h5>
                          <p class="card-text"></p>
                        </div>
                      </div>
                  </div><!--end of directory-single-->

                </template>   
              </div><!--end of row-->
              
            </div><!--end of directory-box-->
          </div><!--end of directory-area-->

          <template v-if="directories">
            <div class="pagination-wrapper">
              <pagination v-if="directories.meta" :pageData="directories.meta"></pagination> 
            </div>
          </template>

          <template v-if="!hasAnyData">
            <h2 class="nofile-message">NO FILE FOUND</h2>
          </template>

        </div>

        <div class="row">
          <div class="help-info">
            <template v-if="hasExtraInfo">
              <p>* This is a root drive. You can't upload file here. You can create folder</p>
              <p>* You can create folder into any drive</p>
            </template>
          </div>
        </div>


    </div>
  </div>  
</template>
<script>
  import { EventBus } from '@/plugins/global'
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

        forwardDirectoryId : null,

        sortBy : 'desc',

        medias : null,

        mediaActionArea : false,
        fileErrors : [],

        uploadFiles : null,
        uploadFileQueue : 0,

        copyMoveOperationName : null, // folder/media
        copyMoveOperationType : null, // copy/cut

        copyOrCutId : null,

        currentPage : 1,
        searchKeyword : '',
        searchMode : false,

        
      }
    },
    methods : {
      searchFetchData(page=1){
        var self = this;
        self.medias = null;
        self.loading = true;
        this.$axios.get('/get-search-data?sort=' + self.sortBy + '&page=' + page + '&search=' + self.searchKeyword).then(( response ) => {
          self.directories = response.data;
          self.currentDirectory = null;
          self.loading = false;
          self.root = true;
        }).catch((error) => {
          self.loading = false;
          self.root = true;
        });
      },
      resetSearch(){
        this.searchKeyword = '';
        this.searchMode = false;
        EventBus.$emit('reset-search');
      },
      pageClicked(page){
          this.searchFetchData(page);
      },


      copyMedia(id){

        this.resetCopyMoveOperation();
        this.copyMoveOperationName = 'media';
        this.copyMoveOperationType = 'copy';
        this.copyOrCutId = id;
      },
      cutMedia(id){
        this.resetCopyMoveOperation();
        this.copyMoveOperationName = 'media';
        this.copyMoveOperationType = 'cut';
        this.copyOrCutId = id;
      },
      pasteOperation(){
        var self = this;
        if(!self.hasPaste){ self.makeToast('warning', 'Error', 'Nothing to paste'); return; }

        self.loading = true;

        var copyOrCutUrl = '';
        if(self.currentDirectoryId && self.hasPaste){
          // sub directroy
           copyOrCutUrl = self.copyMoveOperationType + '-' + self.copyMoveOperationName + '/'+ self.copyOrCutId +'/' + self.currentDirectoryId;
        } else {
          // root directory
           copyOrCutUrl = self.copyMoveOperationType + '-' + self.copyMoveOperationName + '/'+ self.copyOrCutId;
        }

        self.$axios.get(copyOrCutUrl).then(( response ) => {
          self.resetCopyMoveOperation();
          self.loading = false;
          self.makeToast('success', 'Done', 'Pasted Succesfully');
          self.reloadDirectory();
        }).catch((error) => {
          self.makeToast('warning', 'error', error.response.data.message);
          self.loading = false;
        });
      },
      copyFolder(id){
        this.resetCopyMoveOperation();
        this.copyOrCutId = id;
        this.copyMoveOperationName = 'folder';
        this.copyMoveOperationType = 'copy';
      },
      
      cutFolder(id){
        this.resetCopyMoveOperation();
        this.copyOrCutId = id;
        this.copyMoveOperationName = 'folder';
        this.copyMoveOperationType = 'cut';
      },
      resetCopyMoveOperation(){
        this.copyMoveOperationName = null;
        this.copyMoveOperationType = null;
        this.copyOrCutId = null;
      },
      onFileChange(event){
          this.uploadFiles = null;
          this.uploadFiles = event.target.files;
          this.fileErrors = [];
          this.prepareFileError();
          this.queueUpload();
      },
      prepareFileError(){
        for(let i=0; i < this.uploadFiles.length; i++){
          this.fileErrors.push({ name : this.uploadFiles[i].name, status : '', errors : '' });
        }
      },
      setFileError(index, status, errorsArray = []){
        this.fileErrors[index].status = status;
        this.fileErrors[index].errors = errorsArray.join(', ');
      },
      queueUpload(){
        this.saveFile(this.uploadFiles[this.uploadFileQueue]);
      },
      saveOrUpdateFolder(){
        if(this.updateFolderId){
          this.updateFolder();
        } else {
          this.saveFolder();
        }
      },
      makeSort(){
        this.sortBy = this.sortBy == 'desc' ? 'asc' : 'desc';
        this.reloadDirectory();
      },
      saveFile(targetFile){


            var self = this;

            if(self.uploadFiles.length <= self.uploadFileQueue){
              self.makeToast('success', 'Done', 'Upload Operation Complete');
              self.resetUploadSystem();
              return;
            }

            self.setFileError(self.uploadFileQueue, 'uploading...');

            // self.uploadFiles[self.uploadFileQueue].queueStatus = 'uploading...';
            
            var prepareData = new FormData();

            prepareData.append('attachment', targetFile);
            prepareData.append('directory_id', this.currentDirectory ? this.currentDirectory.id : '');

            self.$axios.post('upload-files', prepareData).
            then((response) => {
              self.reloadDirectory();
              // self.makeToast('success', 'Done', 'Succesfully Uploaded');
              // self.uploadFiles[self.uploadFileQueue].queueStatus = 'uploaded';

              self.setFileError(self.uploadFileQueue, 'uploaded');
              self.uploadFileQueue = self.uploadFileQueue + 1;
              setTimeout(()=> {
                this.queueUpload();
              }, 2000);
              
            }).catch((err) => {
                // self.fileErrors = err.response.data.errors;

                self.setFileError(self.uploadFileQueue, 'error..', err.response.data.errors.attachment);
                // self.uploadFiles[self.uploadFileQueue].queueStatus = err.response.data.errors.attachment[0];
                self.uploadFileQueue = self.uploadFileQueue + 1;
                setTimeout(()=> {
                  this.queueUpload();
                }, 2000);
                
            });
        },
        resetUploadSystem(){
          // this.uploadFiles = null;
          this.uploadFileQueue = 0;
          document.getElementById('file_upload_field').value='';
        },
        downloadMedia(uri, name){
          var link = document.createElement("a");
          link.setAttribute('target', '_blank');
          link.setAttribute('download', name);
          link.href = uri;
          // console.log(link);
          // return;
          document.body.appendChild(link);
          link.click();
          link.remove();
        },
      fetchRootData(){
        // this is for fetch date directory
        var self = this;
        self.medias = null;
        self.loading = true;
        this.$axios.get('/get-directories?sort=' + self.sortBy).then(( response ) => {
          self.directories = response.data;
          self.currentDirectory = null;
          self.loading = false;
          self.root = true;
        }).catch((error) => {
          self.loading = false;
          self.root = true;
        });
      },
      openMedia(media){
        
      },
      openDirectory(id){
        // this is for open directory
        var self = this;
        self.resetSearch();
        self.loading = true;
        this.$axios.get('/open-directory/' + id + '?sort=' + self.sortBy).then(( response ) => {
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
        this.resetSearch();
        if(this.currentDirectory){
          this.openDirectory(this.currentDirectory.id);
        } else{
          this.fetchRootData();
        }
        EventBus.$emit('reloadTreeMenu');
      },
      backDirectory(){
        this.resetSearch();
        this.forwardDirectoryId = this.currentDirectory.id;
        if(this.currentDirectory.parent_id){
          // has back
          this.openDirectory(this.currentDirectory.parent_id);
        } else {
          // go root directory
          this.fetchRootData();
        }
        this.closeAndResetFolderActionArea();
      },
      forwardDirectory(){
        this.resetSearch();
        if(!this.forwardDirectoryId){
          return;
        }
        this.openDirectory(this.forwardDirectoryId);
        this.forwardDirectoryId = null;
      },
      openOrCloseFolderActionArea(){
        if(!this.hasNewFolder) return;
        this.folderActionArea = !this.folderActionArea;
        this.mediaActionArea = false;
      },
      openOrCloseMediaActionArea(){

        if(!this.currentDirectory){
          this.makeToast('warning', 'Error', 'You can not upload media from root directory. Upload to inner folder');
          this.mediaActionArea = false;
          this.folderActionArea = false;
          return;
        }
        this.mediaActionArea = !this.mediaActionArea;
        this.folderActionArea = false;
      },
      canceFolderActionArea(){
        this.closeAndResetFolderActionArea();
      },
      
      saveFolder(){
        var self = this;
        if(self.folderNameText == ''){
          self.makeToast('warning', 'Error', 'Folder name empty!');
          return;
        }
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
        var self = this;
        if(self.folderNameText == ''){
          self.makeToast('warning', 'Error', 'Folder name empty!');
          return;
        }

        if(!this.updateFolderId){
          self.makeToast('warning', 'Error', 'You can\'t update the folder');
          return;
        }
        self.$axios.post('/update-folder/' + self.updateFolderId, {
          name : self.folderNameText,
        }).then(( response ) => {
          self.makeToast('success', 'Done', 'Folder name updated');
          self.closeAndResetFolderActionArea();
          self.reloadDirectory();
        }).catch((error) => {

        });
      },
      goHome(){
        this.resetSearch();
        this.closeAndResetFolderActionArea();
        this.closeAndResetMediaActionArea();
        this.resetAllData();
        this.fetchRootData();
        this.fileErrors = [];
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
      },
      
    },
    mounted(){
      this.fetchRootData();

      EventBus.$on('hit-search', (keyword)=> {
        this.searchMode = true;
        this.searchKeyword = keyword;
        this.searchFetchData();
      })

      EventBus.$on('selectTree', (directoryId) => {

        this.openDirectory(directoryId);
      });

      EventBus.$on('hit-pagination', (page) => {
        this.pageClicked(page);
      });
    },
    computed : {
      folderSaveButtonName(){
        return this.updateFolderId ? 'Update' : 'Save';
      },
      hasAnyData(){
        if(this.directories && this.directories.data.length){
          return true;
        }
        if(this.medias && this.medias.length){
          return true;
        }
        return false;
      },
      hasAnyAction(){
        if(this.mediaActionArea){
          return true;
        }
        if(this.folderActionArea){
          return true;
        }
        return false;
      },
      hasPaste(){
        return this.copyOrCutId ? true : false;
      },
      currentDirectoryId(){
        return this.currentDirectory ? this.currentDirectory.id : null;
      },
      hasNewFolder(){
        if(this.searchMode){
          return false;
        }
        return true;
      },
      hasNewMedia(){
        if(this.currentDirectory){
          return true;
        }
        if(this.searchMode){
          return false;
        }
        return false;
      },
      hasExtraInfo(){
        if(!this.currentDirectoryId && !this.searchMode){
          return true;
        }
        return false;
      }
    }
  }
</script>