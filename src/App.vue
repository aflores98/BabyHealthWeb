<template>
  <v-app>
    <!--
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

-->

    <v-navigation-drawer
      app
      v-if="$route.path != '/login'"
      color="secondary"
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
    >
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item-avatar>

        <v-list-item-title>{{this.$store.getters.currentUserName}}</v-list-item-title>

        <v-btn icon @click.stop="mini = mini">
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.link"
          link
          style="margin-top:10px; margin-bottom:10px"
          @click="menuActionClick(item.action)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-dialog v-model="dialog" persistent max-width="290">
          
          <v-card>
            <v-card-title class="headline">
              ¿Desea cerrar sesión?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="logOut()">
                Aceptar
              </v-btn>
              <v-btn color="blue darken-1" text @click="dialog = false">
                Cancelar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { environment } from './environment/environment';

export default {
  name: "App",

  components: {
    // HelloWorld,
  },
  data: () => ({
    drawer: true,
    items: [
      { title: "Inicio", icon: "mdi-chart-line", link: "/" },
      { title: "Gestantes", icon: "mdi-human-pregnant", link: "/gestantes" },
      //{ title: "Configuración", icon: "mdi-account-cog" },
      { title: "Cerrar Sesión", icon: "mdi-exit-to-app", action: "logout" },
    ],
    dialog: false,
    mini: false,
    //
  }),
  methods: {
    menuActionClick(action) {
      if (action === "logout") {
        this.dialog = true;
        
      }
    },
    logOut(){
      this.dialog = false
      environment.token = ""
      localStorage.removeItem("token")
      this.$store.commit('handleCurrentSession',{
              value: false
          })
      this.$store.commit('setUserData',{ 
            name: "",
            role: "",
            entityId: "",
            })    
      this.$router.push("/login");
    }
  },
  created(){
    if ( this.$store.getters.loggedIn == false){
      this.$router.push("/login");
    }
  },
};
</script>

<style >
@import url("https://fonts.googleapis.com/css2?family=Berkshire+Swash&display=swap");
</style>