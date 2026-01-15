import { mount } from "@vue/test-utils";
import HomeView from "@/views/HomeView.vue";
import * as movieService from "@/services/movieService";
import { describe, it, expect, vi } from "vitest";
import flushPromises from "flush-promises";

vi.mock("@/services/movieService");

describe("HomeView", () => {
  it("renders movies from API", async () => {
    vi.spyOn(movieService, "getMovies").mockResolvedValue({
      data: [
        {
          id: 1,
          title: "Inception",
          genre: "Sci-Fi",
          releaseYear: 2010,
          status: "COMPLETED",
          rating: 9,
          favorite: false,
        },
      ],
    } as any);

    const wrapper = mount(HomeView);

    //auf async Updates warten
    await flushPromises();

    expect(wrapper.text()).toContain("Inception");
    expect(wrapper.text()).toContain("2010");
  });

  it("sorts movies by rating", async () => {
    vi.spyOn(movieService, "getMovies").mockResolvedValue({
      data: [
        { id: 1, title: "Movie A", rating: 5, releaseYear: 2020, genre: "", status: "COMPLETED", favorite: false },
        { id: 2, title: "Movie B", rating: 9, releaseYear: 2021, genre: "", status: "COMPLETED", favorite: false },
      ],
    } as any);

    const wrapper = mount(HomeView);
    await flushPromises();


    await wrapper.find("select").setValue("rating");

    const rows = wrapper.findAll("tbody tr");


    const firstRow = rows.at(0);
    expect(firstRow).toBeDefined();


    expect(firstRow!.text()).toContain("Movie B");
  });

});
