import { create } from "zustand";

interface UIState {
    sidebarOpen: boolean;
    sidebarExpanded: boolean;
    terminalOpen: boolean;
    terminalOutput: string[];
    theme: "dark" | "light";
    mobileMenuOpen: boolean;
    
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebarExpanded: () => void;
    toggleTerminal: () => void;
    setTerminalOpen: (open: boolean) => void;
    appendOutput: (output: string) => void;
    clearOutput: () => void;
    setTheme: (theme: "dark" | "light") => void;
    toggleMobileMenu: () => void;
    setMobileMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()((set, get) => ({
    sidebarOpen: true,
    sidebarExpanded: true,
    terminalOpen: true,
    terminalOutput: [],
    theme: "dark",
    mobileMenuOpen: false,

    toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
    },

    setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
    },

    toggleSidebarExpanded: () => {
        set((state) => ({ sidebarExpanded: !state.sidebarExpanded }));
    },

    toggleTerminal: () => {
        set((state) => ({ terminalOpen: !state.terminalOpen }));
    },

    setTerminalOpen: (open: boolean) => {
        set({ terminalOpen: open });
    },

    appendOutput: (output: string) => {
        set((state) => ({
            terminalOutput: [...state.terminalOutput, output],
        }));
    },

    clearOutput: () => {
        set({ terminalOutput: [] });
    },

    setTheme: (theme: "dark" | "light") => {
        set({ theme });
    },

    toggleMobileMenu: () => {
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }));
    },

    setMobileMenuOpen: (open: boolean) => {
        set({ mobileMenuOpen: open });
    },
}));
