<template>
  <v-container fluid class="gestantes-container">
    <v-row class="grid-row">
      <v-col class="grid-col" align="center">
        <div class="gestantes-title text-h3">Lista de Gestantes</div>

        <v-divider class="divider"></v-divider>

        <v-data-table
          :headers="headers"
          :items="gestantes"
          :items-per-page="10"
          class="elevation-1"
        >
        </v-data-table>
      </v-col>
    </v-row>
    <v-row class="grid-row">
      <v-col cols="12" color="black" width="300px"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { environment } from "../environment/environment";

export default {
  name: "Gestantes",
  data: () => ({
    role: "",
    jwt: "",
    /*
    gestante: {
      nombres: "",
      apellidos: "",
      estado: "",
      semanaGestacional: 0,
      fechaNacimientoxxxxx: "",
    },
    */
    gestantes: [],
    headers: [
      {
        text: "Nombres",
        align: "start",
        sortable: false,
        value: "nombres",
      },
      {
        text: "Estado",
        value: "estado",
      },
      {
        text: "Fecha de Nacimiento",
        value: "fechaNacimiento",
      },
      {
        text: "Semana de Gestacion",
        value: "semanaGestacional",
      },
    ],
  }),
  created() {
    this.getGestantes();
  },
  methods: {
    getGestantes: function () {
      //alert(environment.token);
      axios
        .get(`${environment.api}/gestantes`, {
          headers: {
            Authorization: "Bearer " + environment.token,
          },
        })
        .then((response) => {
          //TODO
          //GET ID
          console.log(response.data);
          //console.log(response.data[0].length)
          var i;

          for (i = 0; i < response.data.length; i++) {
            var gestanteActual = {
              nombres: "",
              apellidos: "",
              estado: "",
              fechaNacimiento: "",
              semanaGestacional: "",
            };
            gestanteActual.nombres =
              response.data[i].nombres +
              " " +
              response.data[i].apellidoPaterno +
              " " +
              response.data[i].apellidoMaterno;
            //gestanteActual.apellidos =
            gestanteActual.estado = response.data[i].estado;
            gestanteActual.fechaNacimiento = response.data[i].fechaNacimiento;
            gestanteActual.semanaGestacional =
              response.data[i].semanaGestacional;
            this.gestantes.push(gestanteActual);
            this.gestantes.push(gestanteActual);
            this.gestantes.push(gestanteActual);
            this.gestantes.push(gestanteActual);
            this.gestantes.push(gestanteActual);
          }
          /*  
          console.log(response.data);

          localStorage.setItem("token", response.data);
          this.jwt = VueJwtDecode.decode(localStorage.getItem("token"));
          localStorage.setItem("role", this.jwt.AUTHORITIES_KEY[0].authority);

          //alert(this.jwt.EntityID)
          //jwt.getItem("AUTHORITIES_KEY");
          */
          //this.$router.push("/");
        });
    },
  },
};
</script>

<style>
.gestantes-container grid-container {
  background: white;
}

.gestantes-title {
  text-align: left;
}
.divider {
  margin-top: 10px;
  margin-bottom: 15px;
}
</style>
