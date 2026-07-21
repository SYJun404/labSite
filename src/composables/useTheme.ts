import { ref, type Ref } from "vue";

type Theme = "light" | "dark";

const STORAGE_KEY = "ipll-theme";

function getInitialTheme(): Theme {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    // Fall back to the visitor's OS preference on first visit.
    const prefersLight = window.matchMedia?.(
        "(prefers-color-scheme: light)",
    ).matches;
    return prefersLight ? "light" : "dark";
}

function applyToDom(t: Theme): void {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("light", t === "light");
}

// Module-level singleton so every component shares the same reactive theme state.
const theme: Ref<Theme> = ref(getInitialTheme());
applyToDom(theme.value);

function setTheme(t: Theme): void {
    applyToDom(t);
    theme.value = t;
    if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, t);
    }
}

export function useTheme() {
    function toggleTheme(): void {
        setTheme(theme.value === "dark" ? "light" : "dark");
    }
    return { theme, toggleTheme, setTheme };
}
