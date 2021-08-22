<template>
	<div>
        <div>
          <b-navbar toggleable="lg" type="dark" variant="info">
            <b-navbar-brand to="/">File Manager</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
              <b-navbar-nav>
                <b-nav-item to="/" href="#">Home</b-nav-item>
              </b-navbar-nav>

              <search-bar-manager></search-bar-manager>


                <b-navbar-nav class="ml-auto">
                  <template v-if="$auth.loggedIn">

                    <b-nav-item-dropdown right>
                      <template #button-content>
                        <em>User</em>
                      </template>
                      <b-dropdown-item href="#" @click.prevent="$auth.logout()">Sign Out</b-dropdown-item>
                    </b-nav-item-dropdown>
                  </template>

                  <template v-else>

                    <b-navbar-nav right>
                      <b-nav-item href="#" to="/auth/login">Login</b-nav-item>
                    </b-navbar-nav>
                  </template>

              </b-navbar-nav>

              <!-- Right aligned nav items -->
              <!-- <b-navbar-nav class="ml-auto">
                <b-nav-form>
                  <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
                  <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
                </b-nav-form>

                
                <b-nav-item-dropdown right>
                  <template #button-content>
                    <em>User</em>
                  </template>
                  <b-dropdown-item href="#">Profile</b-dropdown-item>
                  <b-dropdown-item href="#">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
              </b-navbar-nav> -->
            </b-collapse>
          </b-navbar>
        </div>


        
        <!-- Page Content-->
        <section class="wrapper">
			       <nuxt />
        </section>
        <!-- Footer-->
        <footer class="py-5 bg-dark">
            <div class="container-off"><p class="m-0 text-center text-white">Copyright &copy; Mizanur Rahman 2021</p></div>
        </footer>
        <!-- Bootstrap core JS-->
        <!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js"></script> -->
        <!-- Core theme JS-->
        <!-- <script src="js/scripts.js"></script> -->
	</div>
</template>
<script>
</script>