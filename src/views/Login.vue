<template>
  <div class="login">
      <div class="card-content d_flex d-f_column">
        <h1 class="card-title">Contacts manager</h1>
        <div class="input-field d_flex d-f_column">
          <label class="login__label" for="urlApi">Host</label>
          <input
              id="urlApi"
              name="urlApi"
              type="text"
              class="validate"
              v-model="urlApi"
          >
          <span class="bar"></span>
        </div>
        <div class="input-field d_flex d-f_column">
          <label class="login__label" for="email">Email</label>
          <input
              id="email"
              type="text"
              class="validate"
              v-model="email"
          >
          <span class="bar"></span>
        </div>
        <div class="input-field d_flex d-f_column">
          <label class="login__label" for="password">Password</label>
          <input
              id="password"
              type="password"
              class="validate"
              v-model="password"
          >
          <span class="bar"></span>
        </div>
        <div class="card-action">
          <div>
            <button
                class="btn"
                type="submit"
                @click="login"
            >
              Login
            </button>
          </div>
        </div>
      </div>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "Login",
  data: () => ({
    urlApi: '',
    email: '',
    password: '',
    errors: []
  }),
  mounted() {
    if (localStorage.getItem('token')) {
      this.$router.push('/home')
    }
  },
  methods: {
    login() {

      this.errors = []

      if (!this.email) {
        this.errors.push("Введите email")
      }

      if (!this.password) {
        this.errors.push("Введите пароль")
      }

      if (!this.errors.length) {
        let bodyFormData = new FormData()
        bodyFormData.append('Module', 'Core')
        bodyFormData.append('Method', 'Login')
        bodyFormData.append(
            'Parameters', `{"Login":"${this.email}","Password":"${this.password}","Pattern":""}`
        )
        axios({
          url: this.urlApi + '/?/Api/',
          method: 'POST',
          async: true,
          dataType: 'json',
          data: bodyFormData,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
            .then((res) => {
              localStorage.setItem('host', this.urlApi + '/?/Api/ ')
              localStorage.setItem('token', res.data.Result['AuthToken'])
              this.$router.push('/home')
            })

      }
    }
  }
}
</script>

<style scoped>

.card-content {
  height: 100vh;
  align-items: center;
  justify-content: center;
  position: relative;
}
.card-title {
  font-style: normal;
  font-weight: bold;
  font-size: 31px;
  line-height: 37px;
  margin-bottom: 53px;
  width: 263px;
  height: 34px;
  text-align: left;
}
.validate {
  display: block;
  width: 300px;
  border: none;
  border-bottom: 1px solid #ccc;
}
.validate:focus {
  outline: none;
}
.input-field {
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  color: #9aa0a6;
  letter-spacing: 0.4px;
  margin-bottom: 31px;
}
.login__label {
}
.validate:focus ~ .login__label, .validate:valid ~ .login__label {
  top: -15px;
  font-size: 14px;
  color: #636471;
}
.bar {
  position: relative;
  display: block;
  width: 263px;
}
.bar:before, .bar:after {
  content: "";
  height: 2px;
  width: 0;
  bottom: 0;
  position: absolute;
  background: #636471;
  transition: 0.2s ease all;
  -moz-transition: 0.2s ease all;
  -webkit-transition: 0.2s ease all;
}
.bar:before {
  left: 50%;
}
.validate:focus ~ .bar:before,
.validate:focus ~ .bar:after {
  width: 50%;
}
.bar:after {
  right: 50%;
}

.btn {
  background: #C4C4C4;
  border-radius: 5px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  letter-spacing: 0.75px;
  text-transform: uppercase;
  color: #FFFFFF;
  border: 0;
  border: none;
}

.btn, .validate {
  width: 263px;
  height: 34px;
}
</style>
