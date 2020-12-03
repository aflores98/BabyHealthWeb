<template>
  <v-container fluid class="dashboard-container">
    <v-row class="row-1">
      <v-col cols="4" class="column">

        
        <div class="caption text-h5">{{ this.gestantesDataTable.length }} gestantes en alerta</div>

        <DoughnutChart
          v-if="dataset != null"
          :dataset="dataset"
          class="doughnut-chart"
        />

        <div class="caption text-h5">{{ this.gestantes.length - this.gestantesDataTable.length }} gestantes
          saludables</div>

      </v-col>

      <v-col cols="8" class="column">
        <v-data-table
          :headers="headers"
          :items="monitoreosAlerta"
          :items-per-page="5"
          class="elevation-1"
          
        >
        </v-data-table>
      </v-col>
    </v-row>

    <v-row class="row-2">
      <v-col class="column" cols="5">
        
        <HorizontalBarChart
          :dataset="this.frecuenciaGestantesBySemanaGestacion"
        />
      </v-col>

      <v-col class="column" cols="7">
  
          <VerticalBarChart
            v-if="this.dataGestantesCargada"
            :dataLabels="this.alertasLabel"
            :dataset="this.alertasDiarias"
          />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DoughnutChart from "../components/DoughnutChart.vue";
import HorizontalBarChart from "../components/HorizontalBarChart.vue";
import VerticalBarChart from "../components/VerticalBarChart.vue";
import { environment } from "../environment/environment";
import axios from "axios";
import moment from "moment";

export default {
  data: function () {
    return {
      dataset: null,
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
          text: "Duración Promedio",
          value: "duracionPromedio",
        },
        {
          text: "Frecuencia Promedio",
          value: "frecuenciaPromedio",
        },
        {
          text: "Fecha de último monitoreo",
          value: "fecha",
        },
      ],
      frecuenciaGestantesBySemanaGestacion: [1, 4, 2, 3, 0, 0, 1, 0, 3, 5],
      alertasDiarias: [5, 10, 5, 2, 1, 7, 6, 3, 1, 1],
      alertasLabel: [],
      gestantes: [],
      gestantesLaborParto: [],
      gestantesEmergencia: [],
      monitoreosAlerta: [],
      dataGestantesCargada: false,
    };
  },
  components: {
    DoughnutChart,
    HorizontalBarChart,
    VerticalBarChart,
  },
  methods: {
    getGestantes: function () {
      //alert(environment.token);
      var requestUrl =
        this.$store.getters.entityId == null
          ? `${environment.api}/gestantes`
          : `${environment.api}/obstetras/${this.$store.getters.entityId}/gestantes`;

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
            gestanteActual1.fechaNacimiento = moment(
              response.data.fechaNacimiento,
              moment.ISO_8601
            ).format("YYYY MM DD");
            gestanteActual1.semanaGestacional = response.data.semanaGestacional;
            gestanteActual1.estado = response.data.estado;
            this.gestantes.push(gestanteActual1);

            //ITERAR POR ESTADO Y AGREGAR A LA LISTA
            switch (response.data.estado) {
              case "ESTABLE":
                break;
              default:
                this.gestantesEmergencia.push(gestanteActual2);
                break;
            }
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
              gestanteActual2.fechaNacimiento = moment(
                response.data[i].fechaNacimiento,
                moment.ISO_8601
              ).format("DD/MM/YYYY");

              let fechaInicioGestacion = moment(
                response.data[i].fechaInicioGestacion,
                moment.ISO_8601
              );

              gestanteActual2.semanaGestacional = moment().diff(
                fechaInicioGestacion,
                "weeks"
              );

              //aumentar el dataset
              if (
                gestanteActual2.semanaGestacional > 37 &&
                gestanteActual2.semanaGestacional <= 40
              )
                this.frecuenciaGestantesBySemanaGestacion[
                  gestanteActual2.semanaGestacional - 38
                ] =
                  this.frecuenciaGestantesBySemanaGestacion[
                    gestanteActual2.semanaGestacional - 38
                  ] + 1;
              gestanteActual2.estado = response.data[i].estado;

              this.gestantes.push(gestanteActual2);

              switch (response.data[i].estado) {
                case "ESTABLE":
                  break;
                default:
                  this.gestantesEmergencia.push(gestanteActual2);
                  break;
              }
            }
          }

          this.updateDataset();
          this.getLastMonitoreoByEveryGestante();
          this.getAlertasByEveryGestante();
        });
    },
    updateDataset: function () {
      //this.dataset = [this.gestantes.length, 1];
      this.dataset = [
        this.gestantesEstables,
        this.gestantes.length - this.gestantesEstables,
      ];
      console.log("asdaksjdkasdlakdjaksldjaksd");
      console.log(this.gestantesEmergencia);
    },
    getLastMonitoreoByEveryGestante: function () {
      let promises = [];
      let responses = [];
      let arrayGestantes = this.gestantesDataTable;

      let names = {};

      console.log("juanelv");
      console.log(names);

      for (var i = 0; i < arrayGestantes.length; i++) {
        promises.push(
          axios
            .get(
              `${environment.api}/gestantes/${arrayGestantes[i].id}/monitoreos/last`,
              {
                headers: {
                  Authorization: "Bearer " + environment.token,
                },
              }
            )
            .then((response) => {
              console.log("GAAAAAAAAAAAAAAAAA");
              console.log(response);
              responses.push(response.data);
              console.log("what happen");
              console.log(responses);
            })
        );
      }
      console.log(this.monitoreosAlerta);
      Promise.all(promises).then(() => {
        for (var i = 0; i < responses.length; i++) {
          var monitoreoActual = {
            nombres: "",
            idMonitoreo: "",
            fecha: "",
            hora: "",
            duracionPromedio: 0,
            frecuenciaPromedio: 0,
            tiempoEcPromedio: 0,
            cantidadMovFetales: 0,
            estado: "",
            gestante: "",
          };

          if (responses[i] == "") continue;

          monitoreoActual.idMonitoreo = responses[i].idMonitoreo;
          monitoreoActual.estado = responses[i].estadoGestante;
          monitoreoActual.gestante = responses[i].gestante;

          for (var x = 0; x < arrayGestantes.length; x++) {
            /*
            names[arrayGestantes.id] = arrayGestantes[j].nombres;
            console.log(arrayGestantes[j].nombres);
            console.log(names[arrayGestantes.id]);
            */
            if (monitoreoActual.gestante == arrayGestantes[x].id) {
              monitoreoActual.nombres = arrayGestantes[x].nombres;
              console.log("Nombresss" + monitoreoActual.nombres);
            }
          }

          monitoreoActual.fecha = moment(
            responses[i].fechaInicio,
            moment.ISO_8601
          ).format("DD/MM/YYYY");
          monitoreoActual.hora = moment(
            responses[i].fechaInicio,
            moment.ISO_8601
          ).format("hh:mm:ss A");

          //monitoreoActual.duracionPromedio = responses[i].duracionPromedio;
          monitoreoActual.duracionPromedio = Math.trunc(
            responses[i].duracionPromedio
          );

          monitoreoActual.frecuenciaPromedio = responses[i].frecuenciaPromedio;
          monitoreoActual.tiempoEcPromedio = responses[i].tiempoEcPromedio;
          monitoreoActual.duracionPromedio = responses[i].duracionPromedio;
          monitoreoActual.cantidadMovFetales = responses[i].cantidadMovFetales;

          this.monitoreosAlerta.push(monitoreoActual);
          console.log(responses[i]);
          console.log(monitoreoActual);
        }
      });
    },
    getAlertasByEveryGestante: function () {
      //listar todas las alertas de las gestantes e ir aumentando por fechas
      let promises = [];
      let responses = [];
      let arrayGestantes = this.gestantes;

      for (var i = 0; i < this.gestantes.length; i++) {
        promises.push(
          axios
            .get(`${environment.api}/alertas/${arrayGestantes[i].id}`, {
              headers: {
                Authorization: "Bearer " + environment.token,
              },
            })
            .then((response) => {
              responses.push(response.data);
            })
        );
      }

      Promise.all(promises).then(() => {
        for (var i = 0; i < responses.length; i++) {
          for (var j = 0; j < responses[i].length; j++) {
            console.log("lololololol");
            console.log(responses);

            //if (responses[i] == "") continue;

            //si la diferencia entre dias es menor a 10, añadir

            //let fechaCreacion = moment(responses[i][j].fechaCreacion, moment.ISO_8601)
            //alert(fechaCreacion)

            let daysDifference = moment().diff(
              responses[i][j].fechaCreacion,
              "days"
            );

            if (daysDifference <= 20) {
              this.alertasDiarias[10*2 - daysDifference] =
                this.alertasDiarias[10*2 - daysDifference] + 1;
              
            } else {
              continue;
            }
          }
        }

        this.dataGestantesCargada = true;
        console.log("XDDDDDDDDDD")
        console.log(this.alertasDiarias)
      });
    },
  },
  created() {
    this.getGestantes();
    //this.gestantesEstables()
    //this.updateDataset()

    for (var i = 10; i > 0; i--) {
      this.alertasLabel.push(moment().subtract(i, "days").format("DD/MM"));
    }

    console.log("cuack");
    console.log(this.alertasLabel);
    
  },
  computed: {
    gestantesDataTable: function () {
      return this.gestantesLaborParto.concat(this.gestantesEmergencia);
      //return this.gestantesLaborParto
    },
    gestantesEstables: function () {
      let cantGestantesEstables = 0;

      for (var i = 0; i < this.gestantes.length; i++) {
        if (this.gestantes[i].estado == "ESTABLE") {
          cantGestantesEstables++;
        }
      }

      return cantGestantesEstables;
    },
    getGestantesLength: function () {
      return this.gestantes.length;
    },
  },
  watch: {
    gestantes: function () {
      //this.updateDataset()
    },
  },
};
</script>

<style>
.dashboard-container {
  height: 100vh;
  padding: 0;
  margin: 0;
  width: 100%;
}

.row-1 {
  height: 50%;
}
.row-2 {
  height: 50%;
}

.doughnutchart-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.doughnut-chart {
  height: 80%;
}

.column {
  height: 100%;
  width: 100%;
}

.caption {
  /*
  font-size: 10px;
  height: 7%;
  */
  text-align: center;
}
</style>