"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [difficulty, setDifficulty] = useState("easy");
  const [theme, setTheme] = useState("flags");

  // Placeholder for navigation logic
  const handleStart = () => {
    // TODO: Navigate to game page with selected options
    alert(`Start game: ${difficulty}, ${theme}`);
  };

  return (
    <div className={styles.memoryBg}>
      <div className={styles.menuContainer}>
        <header className={styles.headerSection}>
          <h1 className={styles.title}>Memory Mania</h1>
          <p className={styles.subtitle}>Designed by: John Doe and Jane Doe</p>
        </header>

        <section className={styles.section}>
          <label className={styles.label}>Difficulty</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.menuBtn} ${difficulty === "easy" ? styles.selectedEasy : ""}`}
              onClick={() => setDifficulty("easy")}
              type="button"
            >
              Easy
            </button>
            <button
              className={`${styles.menuBtn} ${difficulty === "medium" ? styles.selected : ""}`}
              onClick={() => setDifficulty("medium")}
              type="button"
            >
              Medium
            </button>
            <button
              className={`${styles.menuBtn} ${difficulty === "hard" ? styles.selectedHard : ""}`}
              onClick={() => setDifficulty("hard")}
              type="button"
            >
              Hard
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <label className={styles.label}>Theme</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.menuBtn} ${theme === "flags" ? styles.selected : ""}`}
              onClick={() => setTheme("flags")}
              type="button"
            >
              Flags
            </button>
            <button
              className={`${styles.menuBtn} ${theme === "buildings" ? styles.selected : ""}`}
              onClick={() => setTheme("buildings")}
              type="button"
            >
              Buildings
            </button>
            <button
              className={`${styles.menuBtn} ${theme === "faces" ? styles.selected : ""}`}
              onClick={() => setTheme("faces")}
              type="button"
            >
              Faces
            </button>
          </div>
        </section>

        <button className={styles.startBtn} onClick={handleStart} type="button">
          Start
        </button>
      </div>
    </div>
  );
}
