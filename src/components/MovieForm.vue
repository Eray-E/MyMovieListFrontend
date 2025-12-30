<script setup lang="ts">
import { ref } from "vue";
import { addMovie } from "@/services/movieService";
import type { Movie } from "@/types/Movie";

const emit = defineEmits<{
  (e: "added"): void;
}>();

const title = ref("");
const genre = ref("");
const releaseYear = ref<number | null>(null);

async function submit() {
  console.log("Add Movie clicked");
  if (!title.value || !genre.value || !releaseYear.value) {
    console.log("Form incomplete");
    return;
  }

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

  // reset
  title.value = "";
  genre.value = "";
  releaseYear.value = null;
}
</script>

<template>
  <div class="form">
    <input v-model="title" class="table-input" placeholder="Title" />
    <input v-model="genre" class="table-input" placeholder="Genre" />
    <input
      v-model.number="releaseYear"
      class="table-input"
      placeholder="Year"
      type="number"
      min="1888"
      max="2100"
    />

    <button type="button" class="add-btn" @click="submit">
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

</style>
