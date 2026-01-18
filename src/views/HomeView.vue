<script setup lang="ts">
import { ref, onMounted,computed} from "vue";
import { getMovies } from "@/services/movieService";
import MovieForm from "@/components/MovieForm.vue";
import MovieRow from "@/components/MovieRow.vue";
import type { Movie } from "@/types/Movie";

const movies = ref<Movie[]>([]);
const sortBy = ref<"title" | "releaseYear" | "rating" | "favorite">("title");

async function loadMovies() {
  try {
  const response = await getMovies();
  movies.value = response.data;
} catch (error) {
  console.error("Failed to load movies", error);
  }
}

const sortedMovies = computed(() => {
  return [...movies.value].sort((a, b) => {

    if (sortBy.value === "favorite") {
      return Number(b.favorite) - Number(a.favorite);
    }
    if (sortBy.value === "rating") {
      return (b.rating ?? 0) - (a.rating ?? 0);
    }
    if (sortBy.value === "releaseYear") {
      return b.releaseYear - a.releaseYear;
    }
    return a.title.localeCompare(b.title);
  });
});

onMounted(loadMovies);
</script>

<template>
  <div>
    <div class="page"></div>
    <div class="watchlist">
      <h1 class="title">My Movie Watchlist</h1>

    <div class="add-bar">
      <MovieForm @added="loadMovies" />
    </div>

      <div class="list-toolbar">
        <div class="sort-row">
          <span class="sort-label">Sort by</span>
          <select v-model="sortBy" class="table-input">
            <option value="title">Title</option>
            <option value="releaseYear">Year</option>
            <option value="rating">Rating</option>
            <option value="favorite">Favorite</option>
          </select>
        </div>

        <RouterLink to="/stats" class="stats-btn">
          📊 Stats
        </RouterLink>
      </div>

      <table>
        <thead>


      <!-- ⭐ NORMALE HEADER-ZEILE -->
      <tr>
        <th>Fav</th>
        <th>Title</th>
        <th>Year</th>
        <th>Genre</th>
        <th>Status</th>
        <th>Rating</th>
        <th>Delete</th>
      </tr>
      </thead>

      <tbody>
      <MovieRow
        v-for="m in sortedMovies"
        :key="m.id"
        :movie="m"
        @updated="loadMovies"
        @deleted="loadMovies"
      />
      </tbody>
    </table>
      </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  justify-content: center; /* bleibt mittig */
  align-items: flex-start;
  padding-top: 2rem;
}
.watchlist {
  width: 100%;
  max-width: 1000px;

  margin-left: 12rem;
}
.title{
  background-color: #262626;
  color: #9fd3c7;
  font-size: 1.8rem;
  font-weight: 500;
  text-align: center;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 6px;
}

.add-bar{
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: #262626;
  color: #9fd3c7;
  padding: 0.5rem;
}

td {
  padding: 0.5rem;
  border-bottom: 1px solid #2f2f2f;
}

.sort-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sort-label {
  color: #9fd3c7;
  font-size: 0.9rem;
}


.table-input {
  background-color: #262626;
  color: #9fd3c7;
  border: 1px solid #2f2f2f;
  padding: 0.45rem 0.6rem;
  font-size: 0.95rem;
  cursor: pointer;
}

.table-input:focus {
  outline: none;
  border-color: #9fd3c7;
  background-color: #2a2a2a;
}

.stats-btn {
  background: #262626;
  color: #9fd3c7;
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.stats-btn:hover {
  background: rgba(159, 211, 199, 0.12);
  color: #ffffff;
}

.list-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
}
</style>
