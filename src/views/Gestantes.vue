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
          @click:row="handleRowClick"
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
import moment from 'moment';

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
    console.log("entityId: " + this.$store.getters.entityId )
      console.log("TOKEN: " +localStorage.getItem("token"))
    this.getGestantes();
  },
  methods: {
    getGestantes: function () {
      //alert(environment.token);
      var requestUrl =
        this.$store.getters.entityId == null
          ? `${environment.api}/gestantes`
          : `${environment.api}/obstetras/${this.$store.getters.entityId}/gestantes`;
      alert(requestUrl);

      axios
        .get(requestUrl, {
          headers: {
            Authorization: "Bearer " + environment.token,
          },
        })
        .then((response) => {
          console.log(response);
          var i;

          if (!Array.isArray(response.data)) {
            var gestanteActual1 = {
              id: "",
              nombres: "",
              apellidos: "",
              estado: "",
              fechaNacimiento: "",
              semanaGestacional: "",
            };

            gestanteActual1.id = response.data.id;
            gestanteActual1.nombres =
              response.data.nombres +
              " " +
              response.data.apellidoPaterno +
              " " +
              response.data.apellidoMaterno;
            gestanteActual1.estado = response.data.estado;
            gestanteActual1.fechaNacimiento = moment(response.data.fechaNacimiento, moment.ISO_8601).format('YYYY MM DD')
            gestanteActual1.semanaGestacional = response.data.semanaGestacional;
            this.gestantes.push(gestanteActual1);
          } else {
            for (i = 0; i < response.data.length; i++) {
              var gestanteActual2 = {
                id: "",
                nombres: "",
                apellidos: "",
                estado: "",
                fechaNacimiento: "",
                semanaGestacional: "",
              };

              console.log(response.data[i]);
              gestanteActual2.nombres =
                response.data[i].nombres +
                " " +
                response.data[i].apellidoPaterno +
                " " +
                response.data[i].apellidoMaterno;
              gestanteActual2.id = response.data[i].id;
              gestanteActual2.estado = response.data[i].estado;
              gestanteActual2.fechaNacimiento = moment(response.data[i].fechaNacimiento, moment.ISO_8601).format('DD/MM/YYYY')
              gestanteActual2.semanaGestacional =
                response.data[i].semanaGestacional;
              this.gestantes.push(gestanteActual2);
            }
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
    handleRowClick: function (rowData) {
      console.log(rowData);
      this.$store.commit("setGestanteTableRowSelected", {
        gestantesSelectedRowId: rowData.id,
      });

      this.$router.push("/monitoreos");
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
