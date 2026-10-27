import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/categories", () => ({
  getCategories: vi
    .fn()
    .mockResolvedValue([
      { id: "c1", name: "Hasta Yatakları", slug: "hasta-yataklari" },
    ]),
}));

import Hero from "../Hero";

describe("Hero", () => {
  it("renders the primary CTA", async () => {
    const Component = await Hero();
    render(Component);
    expect(
      screen.getByRole("link", { name: (name) => name.includes("Modelleri İncele") })
    ).toBeInTheDocument();
  });
});
