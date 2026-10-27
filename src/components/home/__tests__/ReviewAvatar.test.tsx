import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ReviewAvatar from "../ReviewAvatar";

describe("ReviewAvatar", () => {
  it("renders an img tag with referrerPolicy='no-referrer' when src is provided", () => {
    const { container } = render(
      <ReviewAvatar
        src="https://lh3.googleusercontent.com/a-/test-photo"
        name="Zülfiye Şahin Arslan"
      />
    );

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://lh3.googleusercontent.com/a-/test-photo");
    expect(img).toHaveAttribute("referrerPolicy", "no-referrer");
  });

  it("gracefully falls back to initials badge when image fails to load", () => {
    const { container } = render(
      <ReviewAvatar
        src="https://lh3.googleusercontent.com/broken-url"
        name="Levent K"
      />
    );

    const img = container.querySelector("img")!;
    expect(img).toBeInTheDocument();
    fireEvent.error(img);

    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(screen.getByText("LK")).toBeInTheDocument();
  });

  it("renders initials badge immediately when src is missing", () => {
    const { container } = render(<ReviewAvatar name="Ayhan Hacıhasanoglu" />);

    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(screen.getByText("AH")).toBeInTheDocument();
  });
});
