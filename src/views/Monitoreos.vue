<template>
  <v-container fluid class="monitoreos-container">
    <v-row class="grid-row">
      <v-col class="grid-col" align="center">
        <div class="monitoreos-title text-h3">Lista de Monitoreos</div>
        <v-divider class="divider"></v-divider>
        <v-data-table
          :headers="headers"
          :items="monitoreos"
          :items-per-page="20"
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
  name: "Monitoreos",
  data: () => ({
    monitoreos: [],
    headers: [
      {
        text: "Frecuencia de Contracciones",
        align: "start",
        value: "frecuenciaPromedio",
      },
      {
        text: "Duración Promedio",
        value: "duracionPromedio",
      },
      {
        text: "Intervalo Promedio",
        value: "tiempoEcPromedio",
      },
      {
        text: "Movimientos Fetales",
        value: "cantidadMovFetales",
      },
      {
        text: "Fecha",
        value: "fecha",
      },
      {
        text: "Hora",
        value: "hora",
      },
    ],
  }),
  created() {
    this.getMonitoreos();
  },
  methods: {
    getMonitoreos: function () {
      axios
        .get(`${environment.api}/gestantes/${this.$store.getters.gestantesSelectedRowId}/monitoreos`, {
          headers: {
            Authorization: "Bearer " + environment.token,
          },
        })
        .then((response) => {
          //TODO
          //GET ID
          console.log(response);
          console.log(response.data[1]);
          var i;
          for (i = 0; i < response.data.length; i++) {
            var monitoreoActual = {
              idMonitoreo: "",
              fecha: "",
              hora: "",
              duracionPromedio: 0,
              frecuenciaPromedio: 0,
              tiempoEcPromedio: 0,
              cantidadMovFetales: 0,
              estado: "",
            };

            monitoreoActual.idMonitoreo = response.data[i].idMonitoreo;
            monitoreoActual.estado = response.data[i].estado;
            
            monitoreoActual.fecha = moment(response.data[i].fechaInicio, moment.ISO_8601).format('DD/MM/YYYY')
            monitoreoActual.hora = moment(response.data[i].fechaInicio, moment.ISO_8601).format('hh:mm:ss A')

            //monitoreoActual.duracionPromedio = response.data[i].duracionPromedio;
            monitoreoActual.duracionPromedio = Math.trunc(
              response.data[i].duracionPromedio
            );
            monitoreoActual.duracionPromedio = (Math.floor(response.data[i].duracionPromedio * 100) / 100).toFixed(2)
            monitoreoActual.duracionPromedio += " min"
            monitoreoActual.frecuenciaPromedio =
              response.data[i].frecuenciaPromedio;
            monitoreoActual.tiempoEcPromedio =
              response.data[i].tiempoEcPromedio;
            monitoreoActual.cantidadMovFetales =
              response.data[i].cantidadMovFetales;

            this.monitoreos.push(monitoreoActual);
          }
        });
    
    },
    handleRowClick: function (rowData) {
      console.log(rowData);
      //alert(rowData.idMonitoreo)
      this.$store.commit("setMonitoreoSelectedRowId", {
        monitoreoSelectedRowId: rowData.idMonitoreo,
      });

      this.$router.push("/monitoreo-detalle");
    },
  },
};
</script>

<style>
.monitoreos-container grid-container {
  background: white;
}

.monitoreos-title {
  text-align: left;
  margin-bottom: 15px;
}
</style>
