import { render, screen, fireEvent } from"@testing-library/react";
import { describe, it, expect, beforeEach } from"vitest";
import React from"react";
import FavoriteButton from"../FavoriteButton";
import { FavoritesProvider } from"@/context/FavoritesContext";

describe("FavoriteButton Component", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined" && localStorage && typeof localStorage.clear === "function") {
      localStorage.clear();
    }
  });

  it("renders inactive state by default", () => {
    render(
      <FavoritesProvider>
        <FavoriteButton productId="p-123" />
      </FavoritesProvider>
    );

    const button = screen.getByRole("button", { name: /favorilere ekle/i });
    expect(button).toBeInTheDocument();
  });

  it("toggles favorite state on click", () => {
    render(
      <FavoritesProvider>
        <FavoriteButton productId="p-123" showText />
      </FavoritesProvider>
    );

    const button = screen.getByRole("button", { name: /favorilere ekle/i });
    expect(screen.getByText("FAVORİLERE EKLE")).toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.getByRole("button", { name: /favorilerden çıkar/i })).toBeInTheDocument();
    expect(screen.getByText("FAVORİLERİNİZDE")).toBeInTheDocument();
  });
});
