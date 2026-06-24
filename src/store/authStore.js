import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      /** Persiste usuario y token tras login/registro exitoso */
      setSession: ({ user, token }) => set({ user, token }),

      /** Limpia la sesión (logout) */
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'vertice-auth' },
  ),
)

/** Selector derivado — uso: const ok = useAuthStore(isAuthenticated) */
export const isAuthenticated = (s) => !!s.token
