<template>
  <v-container fluid class="monitoreos-container">
    <v-row class="grid-row">
      <v-col class="grid-col" align="center" cols="6">
        <div class="monitoreos-title text-h3">Detalle de Monitoreo</div>
        <v-divider class="divider"></v-divider>

        <v-data-table
          :headers="headersContracciones"
          :items="contracciones"
          :items-per-page="20"
          class="elevation-1"
        >
        </v-data-table>
      </v-col>
      <v-col class="grid-col" align="center" cols="6">
        <v-data-table
          :headers="headersMovFetales"
          :items="movimientosFetales"
          :items-per-page="20"
          class="elevation-1 dt-contracciones"
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
    contracciones: [],
    movimientosFetales: [],
    headersContracciones: [
      {
        text: "Hora",
        align: "start",
        value: "hora",
      },
      {
        text: "Duración",
        value: "duracion",
      },
      {
        text: "Intervalo",
        value: "intervalo",
      },
    ],
    headersMovFetales: [
      {
        text: "Número",
        align: "start",
        value: "idMovimientoFetal",
      },
      {
        text: "Fecha",
        value: "fechaCreacion",
      },
    ],
  }),
  created() {
    this.getContracciones();
    this.getMovFetales();
  },

  methods: {
    getContracciones: function () {
      axios
        .get(
          `${environment.api}/monitoreos/${this.$store.getters.monitoreoSelectedRowId}/contracciones`,
          {
            headers: {
              Authorization: "Bearer " + environment.token,
            },
          }
        )
        .then((response) => {
          //TODO
          //GET ID
          console.log(response);
          console.log(response.data[1]);
          var i;

          for (i = 0; i < response.data.length; i++) {
            var contraccionActual = {
              hora: "",
              duracion: 0,
              intervalo: ""
            };

            //hora
            //duracion = fecha fin - fecha inicio
            //intervalo = fecha inicio 1 - fecha fin 0
            contraccionActual.hora = moment(response.data[i].fechaInicio, moment.ISO_8601).format("h:mm:ss A")
            
            var fechaFin = moment(response.data[i].fechaFin, moment.ISO_8601)
            var fechaInicio = moment(response.data[i].fechaInicio, moment.ISO_8601)
            var duracion = fechaFin.diff(fechaInicio)
            
            contraccionActual.duracion = duracion / 1000;
            contraccionActual.duracion += " s"

            
            if (i > 0){
              let fechaFinAnterior = moment(response.data[i-1].fechaFin, moment.ISO_8601)
              let fechaInicioActual = moment(response.data[i].fechaInicio, moment.ISO_8601)
              contraccionActual.intervalo = fechaInicioActual.diff(fechaFinAnterior) / 1000 + " s";
            }
            else{
              contraccionActual.intervalo = 0
            }

            this.contracciones.push(contraccionActual);
          }
          
        });
    },
    getMovFetales: function () {
      
      axios
        .get(
          `${environment.api}/monitoreos/${this.$store.getters.monitoreoSelectedRowId}/movimiento-fetal`,
          {
            headers: {
              Authorization: "Bearer " + environment.token,
            },
          }
        )
        .then((response) => {
          //TODO
          //GET ID
          console.log(response);
          console.log(response.data[1]);
          var i;
          for (i = 0; i < response.data.length; i++) {
            var movimientoFetalActual = {
              idMovimientoFetal: "",
              fechaCreacion: ""
            };

            console.log(response.data)
            movimientoFetalActual.idMovimientoFetal = response.data[i].idMovimientoFetal;
            movimientoFetalActual.idMovimientoFetal = i+1;
            movimientoFetalActual.fechaCreacion = moment(response.data[i].fechaCreacion, moment.ISO_8601).format("h:mm:ss A")
            
    
            this.movimientosFetales.push(movimientoFetalActual);
          }
        });
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

.dt-contracciones {
  background: black;
  margin-top: 80px;
}
</style>
