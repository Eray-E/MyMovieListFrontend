import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

export const searchMovies = (query: string) =>
  api.get("/api/omdb/search", {
    params: { query },
  });

export const getMovieDetails = (imdbId: string) =>
  api.get("/api/omdb/detail", {
    params: { imdbId },
  });




