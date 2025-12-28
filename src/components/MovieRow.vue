<script setup lang="ts">
import type { Movie } from "@/types/Movie";
import { updateMovie, deleteMovie } from "@/services/movieService";
import { MOVIE_STATUS } from "@/constants/status";

const props = defineProps<{
  movie: Movie;
}>();

const emit = defineEmits<{
  (e: "updated"): void;
  (e: "deleted"): void;
}>();

async function onStatusChange(event: Event) {
  const target = event.target as HTMLSelectElement;

  await updateMovie(props.movie.id!, {
    ...props.movie,
    status: target.value as Movie["status"],
  });

  emit("updated");
}

async function onRatingChange(event: Event) {
  const target = event.target as HTMLSelectElement;

  await updateMovie(props.movie.id!, {
    ...props.movie,
    rating: Number(target.value),
  });

  emit("updated");
}

async function remove() {
  if (!props.movie.id) return;
  await deleteMovie(props.movie.id);
  emit("deleted");
}

async function toggleFavorite() {
  await updateMovie(props.movie.id!, {
    ...props.movie,
    favorite: !props.movie.favorite,
  });

  emit("updated");
}

</script>

<template>
  <tr>
    <!-- FAV ⭐ -->
    <td>
      <button @click="toggleFavorite" class="star">
        <span v-if="movie.favorite">⭐</span>
        <span v-else>☆</span>
      </button>
    </td>

    <!-- TITLE -->
    <td>{{ movie.title }}</td>

    <!-- YEAR -->
    <td>{{ movie.releaseYear }}</td>

    <!-- GENRE -->
    <td>{{ movie.genre }}</td>

    <!-- STATUS -->
    <td>
      <select :value="movie.status" @change="onStatusChange">
        <option v-for="s in MOVIE_STATUS" :key="s.value" :value="s.value">
          {{ s.label }}
        </option>
      </select>
    </td>

    <!-- RATING -->
    <td>
      <select :value="movie.rating ?? ''" @change="onRatingChange">
        <option value="">-</option>
        <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
      </select>
    </td>

    <!-- DELETE -->
    <td>
      <button @click="remove">🗑</button>
    </td>
  </tr>
</template>


<style scoped>
select {
  background: #1e1e1e;
  color: #fff;
  border: 1px solid #333;
  padding: 0.25rem;
}

button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
}

button:hover {
  color: #ff5f5f;
}

.star {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.star:hover {
  transform: scale(1.1);
}
</style>
