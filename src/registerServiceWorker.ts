export function registerSW() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => console.log("SW registrado:", reg))
        .catch((err) => console.error("Error al registrar SW:", err));
    });
  }
}
