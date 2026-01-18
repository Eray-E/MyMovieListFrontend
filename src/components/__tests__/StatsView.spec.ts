import { mount } from "@vue/test-utils";
import { describe, it, expect, vi} from "vitest";
import StatsView from "@/views/StatsView.vue";
import type { Movie } from "@/types/Movie";




vi.mock("vue-chartjs", () => ({
  Doughnut: {
    template: "<div class='mock-chart'></div>",
  },
}));

vi.mock("chart.js/auto", () => ({
  default: vi.fn(),
}));

// Router mocken
vi.mock("vue-router", () => ({
  useRoute: () => ({
    fullPath: "/stats",
  }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock Movies
const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Movie A",
    genre: "Action",
    releaseYear: 2020,
    status: "COMPLETED",
    rating: 8,
    favorite: true,
  },
  {
    id: 2,
    title: "Movie B",
    genre: "Drama",
    releaseYear: 2021,
    status: "PLANNED",
    rating: null,
    favorite: false,
  },
];

// API mocken
vi.mock("@/services/movieService", () => ({
  getMovies: vi.fn(() =>
    Promise.resolve({
      data: mockMovies,
    })
  ),
}));



const mountStatsView = async () => {
  const wrapper = mount(StatsView, {
    global: {
      stubs: {
        RouterLink: {
          template: "<a><slot /></a>",
        },
      },
    },
  });


  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();

  return wrapper;
};



describe("StatsView", () => {
  it("renders without crashing", async () => {
    const wrapper = await mountStatsView();
    expect(wrapper.exists()).toBe(true);
  });

  it("renders stats title", async () => {
    const wrapper = await mountStatsView();
    expect(wrapper.text()).toContain("Statistics");
  });

  it("calculates movie status counts correctly", async () => {
    const wrapper = await mountStatsView();
    const vm = wrapper.vm as any;

    expect(vm.completed).toBe(1);
    expect(vm.planned).toBe(1);
    expect(vm.dropped).toBe(0);
  });

  it("calculates completed percentage correctly", async () => {
    const wrapper = await mountStatsView();
    const vm = wrapper.vm as any;


    expect(vm.completedPercent).toBe("50%");
  });

  it("calculates favorite percentage correctly", async () => {
    const wrapper = await mountStatsView();
    const vm = wrapper.vm as any;


    expect(vm.favoritePercent).toBe("50%");
  });

  it("calculates average rating correctly", async () => {
    const wrapper = await mountStatsView();
    const vm = wrapper.vm as any;

    expect(vm.averageRating).toBe("8.0");
  });

  it("renders all three charts (mocked)", async () => {
    const wrapper = await mountStatsView();

    const charts = wrapper.findAll(".mock-chart");
    expect(charts.length).toBeGreaterThanOrEqual(3);
  });
});


