<script setup lang="ts">
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { ref, onMounted } from 'vue'

import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

interface Movie {
  title: string
  genre: string
  releaseYear: number
  watched: boolean
}

const dummymovies = [
  { id: 1, title: "Demon Slayer: Kimetsu no Yaiba Infinity Castle", releaseYear: 2025 , genre: "Anime/Action/Adventure/Fantasy" },
  { id: 2, title: "Chainsaw Man - The Movie: Reze Arc", releaseYear: 2025 , genre: "Anime/Action/Fantasy" },
  { id: 3, title: "Deadpool & Wolverine", releaseYear: 2024 , genre: "Action/Comedy" },
]

const movies = ref<Movie[]>([])

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
const endpoint = baseUrl + '/movies'

async function loadMovies () {
  try {
  console.log('baseUrl:', baseUrl)
  console.log('endpoint:', endpoint)
    const response: AxiosResponse<Movie[]> = await axios.get(endpoint)
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
        </tr>
      </thead>

      <tbody>
        <!-- v-for-Schleife -->
        <tr v-for="m in movies" :key="m.title">
          <td>{{ m.title }}</td>
          <td>{{ m.releaseYear }}</td>
          <td>{{ m.genre }}</td>
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
