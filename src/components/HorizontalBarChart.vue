<script>
import { HorizontalBar } from "vue-chartjs";

export default {
  extends: HorizontalBar,
  props: ["dataset"],
  mounted() {
    this.renderChart(
      {
        labels: [
          "40",
          "39",
          "38",
          "37",
          "36",
          "35",
          "34",
          "33",
          "32",
          "31",
          "30",
          "29",
          "28",
        ],
        datasets: [
          {
            label: "Cantidad de Gestantes por Semana de Gestación",
            backgroundColor: "#3B6FC4",
            //data: [40, 20, 12, 39, 10, 40, 39, 40, 40, 20, 12, 11]
            data: this.dataset,
          },
        ],
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 60,
        scales: {
          xAxes: [
            {
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
              },
            },
          ],
        },
      }
    );
  },
};
</script>