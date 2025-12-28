<script setup lang="ts">
import { getMovies } from "@/services/movieService";
import { ref, onMounted } from 'vue'

import type { Movie } from "@/types/Movie";


const movies = ref<Movie[]>([])

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
const endpoint = baseUrl + '/movies'

async function loadMovies () {
  try {
  console.log('baseUrl:', baseUrl)
  console.log('endpoint:', endpoint)
    const response = await getMovies();
    movies.value = response.data
    console.log('Movies vom Backend:', movies.value)
  } catch (error) {
    console.error('Fehler beim Laden:', error)
  }
}

onMounted(() => {
  loadMovies()
})


</script>

<template>
  <div>
    <h2> My Movie Watchlist</h2>

    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Year</th>
          <th>Genre</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        <!-- v-for-Schleife -->
        <tr v-for="m in movies" :key="m.title">
          <td>{{ m.title }}</td>
          <td>{{ m.releaseYear }}</td>
          <td>{{ m.genre }}</td>
          <td>{{ m.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border-bottom: 1px solid #ccc;
  padding: 6px;
  text-align: left;
}
thead {
  background-color: #1e1e1e;
}
</style>
