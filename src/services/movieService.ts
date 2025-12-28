import axios from "axios";
import type { Movie } from "@/types/Movie";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL
});

export const getMovies = () => api.get<Movie[]>("/movies");

export const addMovie = (movie: Movie) =>
  api.post<Movie>("/movies", movie);

export const deleteMovie = (id: number) =>
  api.delete(`/movies/${id}`);

export const updateMovie = (id: number, movie: Movie) =>
  api.put<Movie>(`/movies/${id}`, movie);
