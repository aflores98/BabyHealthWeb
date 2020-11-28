<script>
import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  props: ["dataset"],
  mounted() {
    this.renderChart(
      {
        labels: ["Saludables", "Alerta"],
        datasets: [
          {
            backgroundColor: ["#45A051", "#C52B1B", "#00D8FF"],
            //data: [80, 20],
            data: this.dataset,
          },
        ],
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 60,
      }
    );
  },
};
</script>