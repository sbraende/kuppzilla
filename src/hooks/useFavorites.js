import { useLocalStorage } from "./useLocalStorage";

/**
 * Custom hook for managing favorite products
 * @returns {Object} - { favoritesList, savedProductIds, toggleFavorite }
 */
export function useFavorites() {
  const [favoritesList, setFavoritesList] = useLocalStorage("favoritesList", []);

  const toggleFavorite = (product) => {
    setFavoritesList((prev) => {
      const isAlreadySaved = prev.some((item) => item.id === product.id);
      if (isAlreadySaved) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const savedProductIds = favoritesList.map((product) => product.id);

  return {
    favoritesList,
    savedProductIds,
    toggleFavorite,
  };
}
