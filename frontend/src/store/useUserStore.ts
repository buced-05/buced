import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

type State = {
  user: User | null;
  token: string | null;
};

type Actions = {
  setUser: (user: User, token: string) => void;
  clear: () => void;
};

const useUserStore = create<State & Actions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      clear: () => set({ user: null, token: null })
    }),
    { name: "bce-user" }
  )
);

export default useUserStore;

