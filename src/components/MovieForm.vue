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
    <input v-model="title" placeholder="Title" />
    <input v-model="genre" placeholder="Genre" />
    <input v-model.number="releaseYear" placeholder="Year" type="number" />

    <!-- WICHTIG: type="button" -->
    <button type="button" @click="submit">Add Movie</button>
  </div>
</template>
