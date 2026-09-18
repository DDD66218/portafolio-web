import { createAvatar } from "./vendor/avatar.js";

const target = document.getElementById("avatar");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const size = 150;
const currentAnimation = "idle";

let definition;
let avatar;

const themeColors = (theme) =>
  theme === "dark"
    ? { body: "#ffffff", eyes: "#111111" }
    : { body: "#111111", eyes: "#ffffff" };

const angryColors = (theme) =>
  theme === "dark"
    ? { body: "#c96a3a", eyes: "#3a1500" }
    : { body: "#b4552a", eyes: "#4a1c00" };

function themeDefinition() {
  const theme = document.documentElement.dataset.theme || "light";
  const colors = themeColors(theme);
  const angry = angryColors(theme);
  return {
    ...definition,
    colors: {
      ...definition.colors,
      body: colors.body.toLowerCase(),
      eyes: colors.eyes.toLowerCase()
    },
    expressions: {
      ...definition.expressions,
      "angry-brows": {
        ...definition.expressions["angry-brows"],
        colors: {
          body: angry.body.toLowerCase(),
          eyes: angry.eyes.toLowerCase()
        }
      }
    }
  };
}

function mount() {
  if (!definition) return false;
  try {
    avatar = createAvatar(target, {
      definition: themeDefinition(),
      size,
      ...(reduce
        ? { defaultExpression: "neutral", autoplay: false }
        : { defaultAnimation: currentAnimation, autoplay: true })
    });
    return true;
  } catch (error) {
    console.error("No se pudo montar el avatar:", error);
    avatar = undefined;
    return false;
  }
}

try {
  const response = await fetch("./avatar.avatar.json");
  definition = await response.json();
} catch (error) {
  console.error("No se pudo cargar la definición del avatar:", error);
}

const mounted = mount();

if (mounted && !reduce) {
  const play = (animation) => avatar && avatar.play(animation);

  target.addEventListener("pointerenter", () => play("angry"));
  target.addEventListener("pointerleave", () => play("idle"));

  const observer = new IntersectionObserver(([entry]) => {
    if (!avatar) return;
    if (entry.isIntersecting) {
      play(currentAnimation);
    } else {
      avatar.pause();
    }
  }, { threshold: 0.2 });
  observer.observe(target);
}

document.addEventListener("themechange", () => {
  if (!avatar) return;
  if (reduce) {
    avatar.destroy();
    avatar = undefined;
    mount();
    return;
  }
  target.classList.add("theme-swap");
  setTimeout(() => {
    target.classList.remove("theme-swap");
    avatar.destroy();
    avatar = undefined;
    mount();
  }, 150);
});