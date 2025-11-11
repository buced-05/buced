import { useEffect, useMemo, useState } from "react";
import useUserStore from "../store/useUserStore";
import type { Notification } from "../types";

const useNotifications = () => {
  const { token } = useUserStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!token) {
      setNotifications([]);
      return;
    }

    const url =
      window.location.protocol === "https:"
        ? `wss://${window.location.host}/ws/notifications/?token=${token}`
        : `ws://${window.location.host.replace(/:\d+$/, ":8000")}/ws/notifications/?token=${token}`;

    const socket = new WebSocket(url);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data?.id) {
        setNotifications((current) => [data as Notification, ...current]);
      }
    };

    socket.onclose = () => {
      console.info("Notification socket closed");
    };

    return () => {
      socket.close();
    };
  }, [token]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read_at).length,
    [notifications]
  );

  return { notifications, unreadCount, setNotifications };
};

export default useNotifications;

