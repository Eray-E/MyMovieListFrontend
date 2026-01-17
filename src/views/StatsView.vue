<script setup lang="ts">
import {ref, onMounted, computed} from "vue";
import { getMovies } from "@/services/movieService";
import type { Movie } from "@/types/Movie";
import { Doughnut } from "vue-chartjs";
import {Chart as ChartJS, ArcElement, Tooltip, Legend,} from "chart.js";
import { useRoute } from "vue-router";
import { watch } from "vue";


const centerTextPlugin = {
  id: "centerText",
  beforeDraw(chart: any) {
    const text = chart.options?.plugins?.centerText?.text;
    if (!text) return;

    const { ctx, width, height } = chart;
    ctx.save();

    const displayValue =
      typeof text.value === "string"
        ? text.value
        : text.value.value;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "bold 28px Inter";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(displayValue, width / 2, height / 2 - 8);

    ctx.font = "12px Inter";
    ctx.fillStyle = "#9fd3c7";
    ctx.fillText(text.label, width / 2, height / 2 + 18);

    ctx.restore();
  },
};

const completedPercent = computed(() => {
  if (!movies.value.length) return "0%";
  return Math.round((completed.value / movies.value.length) * 100) + "%";
});

const favoritePercent = computed(() => {
  if (!movies.value.length) return "0%";
  return Math.round((favoriteCount.value / movies.value.length) * 100) + "%";
});


ChartJS.register(ArcElement, Tooltip, Legend,centerTextPlugin);




const movies = ref<Movie[]>([]);
const route = useRoute();
const loadMovies = async () => {
  const res = await getMovies();
  movies.value = res.data;
};

onMounted(async () => {
  const res = await getMovies();
  movies.value = res.data;
});

onMounted(loadMovies);

watch(
  () => route.fullPath,
  () => {
    loadMovies();
  }
);
const averageRating = computed(() => {
  if (ratedMovies.value.length === 0) return "0";

  const sum = ratedMovies.value.reduce(
    (acc, m) => acc + Number(m.rating),
    0
  );

  return (sum / ratedMovies.value.length).toFixed(1);
});


/* Statistiken  */
const completed = computed(
  () => movies.value.filter(m => m.status === "COMPLETED").length
);
const planned = computed(
  () => movies.value.filter(m => m.status === "PLANNED").length
);
const dropped = computed(
  () => movies.value.filter(m => m.status === "DROPPED").length
);


const ratingCounts = computed(() => {
  const counts = Array(10).fill(0);


  movies.value.forEach(movie => {
    if (movie.rating && movie.rating >= 1 && movie.rating <= 10) {
      counts[movie.rating - 1]++;
    }
  });


  return counts;
});


/* Kreisdiagramm-Status Daten*/
const chartData = computed(() => ({
  labels: ["Completed", "Planned", "Dropped"],
  datasets: [
    {
      data: [completed.value, planned.value, dropped.value],
      backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
      borderWidth: 0,
    },
  ],
}));


const chartOptions = {
  responsive: true,
  cutout: "70%",
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: { color: "#9fd3c7" },
    },
    centerText: {
      text: {
        value: completedPercent,
        label: "COMPLETED",
      },
    },
  },
};

const favoriteChartOptions = {
  responsive: true,
  cutout: "70%",
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: { color: "#9fd3c7" },
    },
    centerText: {
      text: {
        value: favoritePercent,
        label: "FAVORITE",
      },
    },
  },
};

const ratingChartOptions = {
  responsive: true,
  cutout: "70%",
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        color: "#9fd3c7",
      },
    },
    centerText: {
      text: {
        value: averageRating,
        label: "AVG",
      },
    },
  },
} as const;


/* Favorite Kreisdiagramm */
const FavchartData = computed(() => ({
  labels: ["Favorite", "Not Favorite"],
  datasets: [
    {
      data: [favoriteCount.value, nonFavoriteCount.value],
      backgroundColor: ["#f5c542", "#444"],
    },
  ],
}));


/*  Rating Kreisdiagram */
const ratingChartData = computed(() => ({
  labels: ["1","2","3","4","5","6","7","8","9","10"],
  datasets: [
    {
      data: ratingCounts.value,
      backgroundColor: [
        "#5c6bc0",
        "#7986cb",
        "#64b5f6",
        "#4dd0e1",
        "#4db6ac",
        "#81c784",
        "#aed581",
        "#ffd54f",
        "#ffb74d",
        "#ff7043",
      ],
      borderWidth: 0,
    },
  ],
}));


/*  FAVORITE BERECHNUNG */
const favoriteCount = computed(
  () => movies.value.filter(m => m.favorite).length
);


const nonFavoriteCount = computed(
  () => movies.value.length - favoriteCount.value
);


const ratedMovies = computed(() =>
  movies.value.filter(m => Number(m.rating) > 0)
);


</script>

<template>
  <div class="stats-page">
    <RouterLink to="/" class="back-btn">
      ← Back to Watchlist
    </RouterLink>

    <h1 class="title">
      📊 MyMovielist Statistics
    </h1>

    <div class="charts">
      <div class="chart-card">
        <h3>Status Distribution</h3>
        <Doughnut :key="completedPercent" :data="chartData" :options="chartOptions" />
      </div>

      <div class="chart-card">
        <h3>Favorites</h3>
        <Doughnut :key="favoritePercent" :data="FavchartData" :options="favoriteChartOptions" />
      </div>

      <div class="chart-card">
        <h3>Ratings</h3>
        <Doughnut :key="averageRating" :data="ratingChartData" :options="ratingChartOptions" />
      </div>
    </div>

    <div class="stat-badges">
      <div class="badge total">
        🎬 <strong>{{ movies.length }}</strong>
        <span>Total Movies</span>
      </div>

      <div class="badge completed">
        ✅ <strong>{{ completed }}</strong>
        <span>Completed</span>
      </div>

      <div class="badge favorite">
        ⭐ <strong>{{ favoriteCount }}</strong>
        <span>Favorites</span>
      </div>

      <div class="badge rating">
        📊 <strong>{{ averageRating }}</strong>
        <span>Avg Rating</span>
      </div>
    </div>
  </div>

</template>

<style scoped>
.stats-page {
  max-width: 700px;
  margin: 2rem auto;
  text-align: center;
}

.title {
  width: 100%;
  text-align: center;
  margin-bottom: 2.5rem;
  transform: translateX(60px);

  color: #9fd3c7;
  font-weight: 600;
  letter-spacing: 0.4px;


  text-shadow:
    0 0 6px rgba(159, 211, 199, 0.25),
    0 0 12px rgba(159, 211, 199, 0.15);
}

.chart-card {
  background: #1f1f1f;
  padding: 2rem;
  border-radius: 14px;
  max-width: 420px;
  width: 100%;
  text-align: center;
}

.stats-page {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding-top: 2rem;

}

.charts {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 3rem;
  align-items: start;

  transform: translateX(15px);
}

.chart-card:first-child {
  justify-self: start;
}

.chart-card:last-child {
  justify-self: end;
}

.back-btn {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;

  background: #262626;
  color: #9fd3c7;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 500;

  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}

.back-btn:hover {
  background: rgba(159, 211, 199, 0.12);
  color: #ffffff;
}

.stat-badges {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1.5rem;
  margin-top: 3rem;

  padding-left: 7rem;
}

.badge {
  background: #1f1f1f;
  border-radius: 16px;
  padding: 1.4rem 1.2rem;

  text-align: center;
  color: #9fd3c7;

  box-shadow: 0 8px 22px rgba(0,0,0,0.45);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}


.badge:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.6);
}


.badge strong {
  display: block;
  font-size: 1.8rem;
  color: #ffffff;
}


.badge.completed strong {
  color: #4caf50;
}

.badge.favorite strong {
  color: #f5c542;
}

.badge.rating strong {
  color: #ff7043;
}

.badge.total strong {
  color: #64b5f6;
}
</style>
