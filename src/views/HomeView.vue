<script setup lang="ts">
import { ref, onMounted,computed} from "vue";
import { getMovies } from "@/services/movieService";
import MovieForm from "@/components/MovieForm.vue";
import MovieRow from "@/components/MovieRow.vue";
import type { Movie } from "@/types/Movie";

const movies = ref<Movie[]>([]);
const sortBy = ref<"title" | "releaseYear" | "rating" | "favorite">("title");

async function loadMovies() {
  const response = await getMovies();
  movies.value = response.data;
}

const sortedMovies = computed(() => {
  return [...movies.value].sort((a, b) => {

    if (sortBy.value === "title") {
      return a.title.localeCompare(b.title);
    }

    if (sortBy.value === "releaseYear") {
      return b.releaseYear - a.releaseYear;
    }

    if (sortBy.value === "rating") {
      return (b.rating ?? 0) - (a.rating ?? 0);
    }

    if (sortBy.value === "favorite") {
      return Number(b.favorite) - Number(a.favorite);
    }

    return 0;
  });
});


onMounted(loadMovies);
</script>

<template>
  <div>
    <h2>My Movie Watchlist</h2>

    <!-- Formular -->
    <MovieForm @added="loadMovies" />

    <label>
      Sort by:
      <select v-model="sortBy">
        <option value="title">Title</option>
        <option value="releaseYear">Year</option>
        <option value="rating">Rating</option>
        <option value="favorite">Favorite</option>
      </select>
    </label>


    <table>
      <thead>
      <tr>
        <th>Fav</th>
        <th>Title</th>
        <th>Year</th>
        <th>Genre</th>
        <th>Status</th>
        <th>Rating</th>
        <th>Delete</th>
        <th></th>
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
</template>
