export type OmdbMovie = {
  Title: string;
  Year: string;
  imdbID: string;
  Poster?: string;
};

export type OmdbSearchResponse = {
  Search?: OmdbMovie[];
  totalResults?: string;
  Response: "True" | "False";
  Error?: string;
};

export type OmdbMovieDetails = {
  Title: string;
  Year: string;
  Genre?: string;
  Response: "True" | "False";
  Error?: string;
};

