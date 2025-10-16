import React, { useState, useEffect } from "react";
import "./App.css";
import { requestPermission } from "./firebaseConfig"; // 👈 Importa la función

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<{ id: number; text: string }[]>([]);

  // 🔔 Pedir permiso para notificaciones al iniciar
  useEffect(() => {
    requestPermission();
  }, []);

  // Cargar tareas almacenadas
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Guardar tareas cuando cambian
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: task }]);
    setTask("");
  };

  return (
    <div className="App">
      <h1>📋 Lista de tareas (offline-ready)</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Escribe una tarea..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button type="submit">Agregar</button>
      </form>

      <ul className="task-list">
        {tasks.map((t) => (
          <li key={t.id}>{t.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
