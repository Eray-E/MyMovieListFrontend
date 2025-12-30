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
    <td class="fav-cell">
      <button
        class="star"
        :class="{ active: movie.favorite }"
        @click="toggleFavorite"
        title="Favorite"
      >
        {{ movie.favorite ? "★" : "☆" }}
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
    <td class="delete-cell">
      <button class="delete-btn" @click="remove" title="Delete movie">
        🗑
      </button>
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

.delete-btn {
  color: #777;
  font-size: 1.2rem;
  transition: color 0.2s, transform 0.2s;
}

.delete-btn:hover {
  color: #ff5f5f;           /* rot = Gefahr */
  transform: scale(1.2);
}

.star {
  color: #555;              /* sichtbarer als schwarz */
  font-size: 1.3rem;
  transition: color 0.2s, transform 0.2s;
}

.star:hover {
  color: #f5c542;           /* gold beim Hover */
  transform: scale(1.2);
}

.star.active {
  color: #f5c542;           /* dauerhaft gold */
  text-shadow: 0 0 6px rgba(245, 197, 66, 0.6);
}

.fav-cell,
.delete-cell {
  text-align: center;
}
</style>
