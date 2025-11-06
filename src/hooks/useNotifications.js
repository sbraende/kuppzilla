import { useLocalStorage } from "./useLocalStorage";

/**
 * Custom hook for managing product notifications
 * @returns {Object} - { notificationIds, toggleNotification }
 */
export function useNotifications() {
  const [notificationIds, setNotificationIds] = useLocalStorage("notificationIds", []);

  const toggleNotification = (productId) => {
    setNotificationIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  return {
    notificationIds,
    toggleNotification,
  };
}
