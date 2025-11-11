import { useCallback } from "react";
import useUserStore from "../store/useUserStore";
import type { User } from "../types";

const useAuth = () => {
  const { user, token, setUser, clear } = useUserStore();

  const login = useCallback(
    (payload: { user: User; access: string }) => {
      setUser(payload.user, payload.access);
    },
    [setUser]
  );

  const logout = useCallback(() => {
    clear();
  }, [clear]);

  return { user, token, login, logout };
};

export default useAuth;

