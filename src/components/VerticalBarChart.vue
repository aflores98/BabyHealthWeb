<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: ["dataset", "dataLabels"],
  mounted() {
    this.renderChart(
      {
        /*
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ],
        */
        labels:this.dataLabels,
        datasets: [
          {
            label: "Cantidad de Alertas por Día",
            backgroundColor: "#ED8E4D",
            //data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
            data: this.dataset
          }
        ]
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
      },
    );
  },
};
</script>