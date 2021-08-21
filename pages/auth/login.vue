<template>
	<!--Begin content wrapper-->
    <div class="content-wrapper">
        <div class="account-page login text-center">
            <div class="container">
              <div class="row justify-content-md-center">
                <div class="col col-lg-8">
                    <div class="account-title">
                        <h4 class="heading-light">Log In File Manager</h4>
                        <p class="help-info"">Email: <span>mizan.stack@gmail.com</span> pass: <span>1234</span> <button class="btn btn-warning help-login-fill" @click.prevent="fillCredential()">Fill</button></p>


                    </div>
                    <div class="account-content">
                        <p class="form_error_msg" v-if="formErrors.root">{{ formErrors.root }}</p>
                        <form @submit.prevent="userLogin">
                            <div class="form-group email" :class="{'has-error' : formErrors.email}">
                                <p class="form_error_msg" v-if="formErrors.email">{{ formErrors.email[0] }}</p>
                                <input type="text" class="form-control" placeholder="Email Address" v-model="login.email">
                            </div>
                            <div class="form-group password" :class="{'has-error' : formErrors.password}">
                                <p class="form_error_msg" v-if="formErrors.password">{{ formErrors.password[0] }}</p>
                                <input type="password" class="form-control" placeholder="Password" v-model="login.password">
                            </div>

                            <div class="buttons-set">
                                <button type="submit" title="Log In" class="btn btn-primary">{{ buttonName }}</button>
                            </div>
                        </form>
                    </div>
                </div>
              </div>
            </div>
        </div>
    </div>
    <!--End content wrapper-->
</template>
<script>
export default {
  middleware: 'auth',
  auth : 'guest',
  data() {
    return {
      login: {
        email: process.env.NODE_ENV == 'production' ? '' : 'mizan.stack@gmail.com',
        password: process.env.NODE_ENV == 'production' ? '' : '1234',
      },
      formErrors : [],
      buttonName : 'Log In'
    }
  },
  methods: {
    async userLogin() {
      try {
        this.buttonName = 'Log In...'
        let response = await this.$auth.loginWith('local', { data: this.login })
      } catch (err) {
        this.buttonName = 'Log In'
        this.formErrors = err.response.data.errors;
      }
    },
    fillCredential(){
      this.login = {
        email : 'mizan.stack@gmail.com',
        password: '1234'
      }
    }
  },
}
</script>