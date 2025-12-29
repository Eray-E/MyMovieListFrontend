export interface Movie {
  id?: number;
  title: string;
  genre: string;
  releaseYear: number;
  status: "PLANNED"| "COMPLETED" | "DROPPED";
  rating?: number | null;
  favorite: false;
}
