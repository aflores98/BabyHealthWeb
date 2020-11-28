<template>
  <v-container fluid class="login-container">
    <v-row class="login-row">
      <v-col class="left-cover" cols="5" align="center">
        <img src="../assets/logo.png" alt="Baby Health" class="logo" />
        <p class="name">Baby Health</p>

        <v-form class="login-form">
          <v-text-field
            id="username"
            outlined
            label="Nombre de usuario"
            color="white"
            v-model="username"
          ></v-text-field>

          <v-text-field
            id="password"
            outlined
            type="password"
            label="Contraseña"
            color="white"
            v-model="password"
          >
          </v-text-field>
        </v-form>

        <v-btn elevation="5" large rounded color="accent" v-on:click="login"
          >Iniciar Sesión</v-btn
        >
      </v-col>

      <v-col cols="7" class="right-cover"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { environment } from "../environment/environment";
import VueJwtDecode from "vue-jwt-decode";

export default {
  name: "Login",
  data: () => ({
    username: "",
    password: "",
    role: "",
    jwt: "",
  }),
  created() {
    if ( this.$store.getters.loggedIn){
      this.$router.push("/");
    }
  },
  methods: {
    handleLogin() {
      console.log(this.username);
      console.log(this.password);
    },
    updateData: function(){

      console.log(localStorage.getItem("token"))
      console.log("entityId: "+ this.jwt.EntityID)
      console.log(this.$store.getters.entityId)
      console.log(this.$store.getters.currentUserName)
      environment.token = localStorage.getItem("token")
      

      if(this.$store.getters.entityId != null){
        axios.get(`${environment.api}/obstetras/${this.$store.getters.entityId}`,{
          headers: {
            Authorization: "Bearer " + environment.token,
          }
        })
        .then((response)=>{
          this.$store.commit('setUserName',{ 
            name: response.data.nombres + " " + response.data.apellidoPaterno + " " + response.data.apellidoMaterno
            })
          
        });
      }else{
        this.$store.commit('setUserName',{ 
            name: "Administrador"
            })
      }
    },
    login: function () {
      //alert("asdadas");
      axios
        .post(`${environment.api}/authentication`, {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            localStorage.setItem("token", response.data);
            this.jwt = VueJwtDecode.decode(localStorage.getItem("token"));
            //localStorage.setItem("role", this.jwt.AUTHORITIES_KEY[0].authority);

            //alert(this.jwt.EntityID)
            //jwt.getItem("AUTHORITIES_KEY");

            //Hay que obtener los datos del usuario
            this.$store.commit('setUserRole',{
              role: this.jwt.AUTHORITIES_KEY[0].authority,
            })
            this.$store.commit('setUserEntityId',{
              entityId: this.jwt.EntityID,
            })
            this.$store.commit('handleCurrentSession',{
              value: true
            })
            this.updateData()
            this.$router.push("/");
          }
        })
        .catch((error) => {
          console.err(error);
          alert("El usuario o contraseña ingresado no son correctos")
        });

      //TODO
      //No está obteniendose el entityId
      /*
      console.log("entityId: " + this.$store.getters.entityId )
        console.log("TOKEN: " +localStorage.getItem("token"))
      while(this.$store.getters.entityId == "" && localStorage.getItem("token") == null ){
        console.log("entityId: " + this.$store.getters.entityId )
        console.log("TOKEN: " +localStorage.getItem("token"))
      }
      alert("XDDDDDD")
      */

      
    },
  },
};
</script>

<style>
.login-container {
  height: 100vh;
}
.login-row {
  height: 100%;
}

.login-form {
  width: 70%;
}

.left-cover {
  background: rgb(26, 127, 180);
  background: linear-gradient(
    27deg,
    rgba(26, 127, 180, 1) 0%,
    rgba(0, 255, 226, 1) 100%
  );
  height: 100%;
}

.right-cover {
  background: url("../assets/pregnant-cover.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  height: 100%;
}

.logo {
  height: 25%;
  margin-top: 10%;
}

.name {
  font-size: 3rem;
  font-family: "Berkshire Swash", cursive;
  padding-bottom: 5%;
}
</style>
