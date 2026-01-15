import { mount } from "@vue/test-utils";
import MovieForm from "@/components/MovieForm.vue";
import * as movieService from "@/services/movieService";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/services/movieService");

describe("MovieForm", () => {
  it("emits added event when movie is submitted", async () => {

    vi.spyOn(movieService, "addMovie").mockResolvedValue({}as any);

    const wrapper = mount(MovieForm);

    await wrapper.find("input[placeholder='Title']").setValue("Parasite");
    await wrapper.find("input[placeholder='Genre']").setValue("Thriller/Comedy");
    await wrapper.find("input[type='number']").setValue(2019);

    await wrapper.find("button").trigger("click");


    expect(movieService.addMovie).toHaveBeenCalled();
    expect(wrapper.emitted()).toHaveProperty("added");
  });

  it("does not submit when title is empty", async () => {
    const wrapper = mount(MovieForm);

    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("added")).toBeUndefined();
  });

  it("clears inputs after submit", async () => {
    vi.spyOn(movieService, "addMovie").mockResolvedValue({}as any);

    const wrapper = mount(MovieForm);

    await wrapper.find("input[placeholder='Title']").setValue("Test");
    await wrapper.find("input[placeholder='Genre']").setValue("Drama");
    await wrapper.find("input[type='number']").setValue(2023);

    await wrapper.find("button").trigger("click");

    expect((wrapper.find("input[placeholder='Title']").element as HTMLInputElement).value).toBe("");
  });
});

