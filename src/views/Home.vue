<template>
  <v-container fluid class="dashboard-container">
    <v-row class="row-1">
      <v-col cols="4" class="column">
        <p class="caption">5 gestantes en alerta</p>

        <DoughnutChart :dataset="dataset" class="doughnut-chart" />

        <p class="caption">20 gestantes saludables</p>
      </v-col>

      <v-col cols="8" class="column" style="background: red">
        <v-data-table
          :headers="headers"
          :items="gestantes"
          :items-per-page="5"
          class="elevation-1"
        >
        </v-data-table>
      </v-col>
    </v-row>

    <v-row class="row-2">
      <v-col class="column" cols="5" style="background: yellow">
        <HorizontalBarChart />
      </v-col>

      <v-col class="column" cols="7">
          <!-----
        <v-card
          class="mx-auto text-center"
          color="green"
          dark
          style="width: 90%; height: 95%; margin-top: 10px"
        >
          <v-card-text>
            <div class="display-1 font-weight-thin">
              Cantidad de Alertas Diarias
            </div>
          </v-card-text>

          <v-card-text>
            <v-sheet color="rgba(0, 0, 0, .12)">
              <v-sparkline
                :value="alertasDiarias"
                :labels="alertasLabel"
                color="rgba(255, 255, 255, .7)"
                stroke-linecap="round"
                smooth
                height="100%"
              >
                <template v-slot:label="item"> {{ item.value }} </template>
              </v-sparkline>
            </v-sheet>
          </v-card-text>
        </v-card>
        --->
        
        <v-card
          class="mx-auto text-center"
          color="grey"
          dark
          style="width: 90%; height: 95%; margin-top: 10px"
        >
        <VerticalBarChart/>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DoughnutChart from "../components/DoughnutChart.vue";
import HorizontalBarChart from "../components/HorizontalBarChart.vue";
import VerticalBarChart from "../components/VerticalBarChart.vue";

export default {
  /*
    extends: Doughnut,
    mounted(){
        this.renderChart()
    }
    */
  data: function () {
    return {
      dataset: [10, 20],
      headers: [
        {
          text: "Nombres",
          align: "start",
          sortable: false,
          value: "nombres",
        },
        {
          text: "Intensidad Promedio",
          value: "intensidad",
        },
        {
          text: "Frecuencia Promedio",
          value: "frecuencia",
        },
        {
          text: "Fecha de último monitoreo",
          value: "fechaUltimoMonitoreo",
        },
      ],
      alertasDiarias: [1, 14, 20, 19, 15, 16, 20],
      alertasLabel: ["L", "M", "X", "J", "V", "S", "D"],
    };
  },
  components: {
    DoughnutChart,
    HorizontalBarChart,
    VerticalBarChart
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
  background-color: green;
  height: 50%;
}
.row-2 {
  background-color: purple;
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
  font-size: 10px;
  height: 7%;
  text-align: center;
  background: white;
}
</style>