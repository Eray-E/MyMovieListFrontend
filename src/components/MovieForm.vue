<script setup lang="ts">
import { ref, watch } from "vue";
import { addMovie } from "@/services/movieService";
import { searchMovies, getMovieDetails } from "@/services/omdbService";
import type { Movie } from "@/types/Movie";
import type { OmdbMovie } from "@/types/omdb";

const emit = defineEmits<{ (e: "added"): void }>();

const title = ref("");
const genre = ref("");
const releaseYear = ref<number | null>(null);

const suggestions = ref<OmdbMovie[]>([]);
const isLoadingSuggestions = ref(false);

let debounceId: number | undefined;

watch(title, (val) => {
  // debounce, damit nicht bei jedem Buchstaben sofort ein Request rausgeht
  if (debounceId) window.clearTimeout(debounceId);

  debounceId = window.setTimeout(async () => {
    const q = val.trim();

    if (q.length < 3) {
      suggestions.value = [];
      return;
    }

    try {
      isLoadingSuggestions.value = true;
      const res = await searchMovies(q);
      suggestions.value = res.data.Search ?? [];
    } catch (e) {
      suggestions.value = [];
      console.error("OMDb search failed", e);
    } finally {
      isLoadingSuggestions.value = false;
    }
  }, 250);
});

const selectMovie = async (imdbId: string) => {
  try {
    const res = await getMovieDetails(imdbId);
    const m = res.data;


    title.value = m.Title ?? title.value;
    releaseYear.value = m.Year ? Number(m.Year) : releaseYear.value;
    genre.value = m.Genre ? m.Genre.split(",")[0].trim() : genre.value;

    suggestions.value = [];
  } catch (e) {
    console.error("OMDb detail failed", e);
  }
};

async function submit() {
  if (!title.value || !genre.value || !releaseYear.value) return;

  const movie: Movie = {
    title: title.value,
    genre: genre.value,
    releaseYear: releaseYear.value,
    status: "PLANNED",
    rating: null,
    favorite: false,
  };

  await addMovie(movie);
  emit("added");

  title.value = "";
  genre.value = "";
  releaseYear.value = null;
  suggestions.value = [];
}
</script>

<template>
  <div class="form">
    <div class="title-wrapper">
      <input
        v-model="title"
        class="table-input"
        placeholder="Title"
      />

      <ul v-if="suggestions.length" class="suggestions">
        <li
          v-for="movie in suggestions"
          :key="movie.imdbID"
          @click="selectMovie(movie.imdbID)"
        >
          {{ movie.Title }} ({{ movie.Year }})
        </li>
      </ul>
    </div>

    <input v-model="genre" class="table-input" placeholder="Genre" />

    <input
      v-model.number="releaseYear"
      class="table-input"
      placeholder="Year"
      type="number"
    />

    <button class="add-btn" @click="submit">
      Add Movie
    </button>
  </div>
</template>

<style scoped>
/* Layout der Eingabezeile */
.form {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1fr auto;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

/* Inputs wie Tabellenkopf */
.table-input {
  background-color: #262626;
  color: #9fd3c7;
  border: 1px solid #2f2f2f;
  padding: 0.45rem 0.6rem;
  font-size: 0.95rem;
}

/* Placeholder */
.table-input::placeholder {
  color: #7fb8ac;
}

/* Fokus */
.table-input:focus {
  outline: none;
  border-color: #9fd3c7;
  background-color: #2a2a2a;
}

/* Button im gleichen Stil */
.add-btn {
  background-color: #262626;
  color: #9fd3c7;
  border: 1px solid #2f2f2f;
  padding: 0.45rem 0.9rem;
  cursor: pointer;
  font-size: 0.95rem;
}

.add-btn:hover {
  background-color: #2f2f2f;
}

.title-wrapper {
  position: relative;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;

  background: #1f1f1f;
  border: 1px solid #2f2f2f;
  border-radius: 6px;

  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 10;
}

.suggestions li {
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  color: #9fd3c7;
}

.suggestions li:hover {
  background: #2f2f2f;
}

</style>
