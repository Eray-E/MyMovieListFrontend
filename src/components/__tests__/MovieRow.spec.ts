import HomeView from "@/views/HomeView.vue";
import flushPromises from "flush-promises";
import {describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MovieRow from "@/components/MovieRow.vue";
import * as movieService from "@/services/movieService";
import {getMovies} from "@/services/movieService";



vi.mock("@/services/movieService", () => ({
  deleteMovie: vi.fn(),
  updateMovie: vi.fn(),
  getMovies: vi.fn(),
}));


describe("MovieRow", () => {
  it("toggles favorite and emits updated", async () => {
    vi.spyOn(movieService, "updateMovie").mockResolvedValue({} as any);

    const wrapper = mount(MovieRow, {
      props: {
        movie: {
          id: 1,
          title: "Interstellar",
          genre: "Sci-Fi/Adventure",
          releaseYear: 2014,
          status: "COMPLETED",
          rating: 9,
          favorite: false,
        },
      },
    });

    await wrapper.find("button.star").trigger("click");

    expect(movieService.updateMovie).toHaveBeenCalled();
    expect(wrapper.emitted()).toHaveProperty("updated");
  });

  it("Behandelt API-Fehler", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    vi.spyOn(movieService, "getMovies")
      .mockRejectedValue(new Error("API error"));

    const wrapper = mount(HomeView);

    await wrapper.vm.$nextTick();

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("deletes movie and emits deleted", async () => {
    vi.spyOn(movieService, "deleteMovie").mockResolvedValue({} as any);



    const deleteSpy = vi
      .spyOn(movieService, "deleteMovie")
      .mockResolvedValue({} as any);

    const wrapper = mount(MovieRow, {
      props: {
        movie: {
          id: 1,
          title: "The Dark Knight",
          genre: "Action/Crime",
          releaseYear: 2008,
          status: "COMPLETED",
          rating: 8,
          favorite: false,
        },
      },
    });

    await wrapper.find('[data-testid="delete-btn"]').trigger("click");

    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  it("updates status when changed", async () => {
    vi.spyOn(movieService, "updateMovie").mockResolvedValue({} as any);

    const wrapper = mount(MovieRow, {
      props: {
        movie: {
          id: 1,
          title: "Demon Slayer: Kimetsu No Yaiba - The Movie: Infinity Castle",
          genre: "Animation/Action",
          releaseYear: 2025,
          status: "PLANNED",
          rating: 10,
          favorite: true,
        },
      },
    });

    await wrapper.find("select").setValue("COMPLETED");

    expect(movieService.updateMovie).toHaveBeenCalled();
  });

});
