"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { barrio } from "../fonts";
import styles from "./game.module.css";

// Emoji sets for each theme
const EMOJIS = {
  flags: [
    "🇨🇦", "🇹🇷", "🇺🇸", "🇫🇷", "🇩🇪", "🇯🇵", "🇧🇷", "🇬🇧", "🇮🇹", "🇪🇸", "🇦🇺", "🇲🇽", "🇨🇳", "🇮🇳", "🇰🇷", "🇸🇪",
    "🇳🇱", "🇷🇺", "🇿🇦", "🇦🇷", "🇸🇦", "🇳🇬", "🇵🇱", "🇨🇭", "🇳🇴", "🇩🇰", "🇵🇹", "🇬🇷", "🇹🇭", "🇪🇬", "🇨🇱", "🇻🇳"
  ],
  food: [
    "🍕", "🍔", "🍟", "🌭", "🍿", "🥓", "🥚", "🍳", "🧀", "🥞", "🥨", "🥯", "🥐", "🍞", "🥖", "🥗",
    "🍝", "🍜", "🍲", "🍛", "🍣", "🍤", "🍙", "🍚", "🍘", "🍥", "🥮", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧"
  ],
  faces: [
    "😊", "😂", "😍", "😎", "😡", "😭", "😱", "😴", "😇", "😈", "😜", "🤓", "🥳", "😏", "😬", "😅",
    "😳", "🥺", "🤔", "😤", "😢", "😆", "😋", "😝", "🤩", "😐", "😪", "😷", "🤠", "😲", "😚", "😔"
  ]
};

const DIFFICULTY_GRID = {
  easy: 4,
  medium: 6,
  hard: 8
};

const THEME_LABELS = {
  flags: "Flags",
  food: "Food",
  faces: "Faces"
};

function shuffle(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function GameClient(props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = React.useMemo(() => searchParams.get("theme") || "flags", [searchParams]);
  const difficulty = React.useMemo(() => searchParams.get("difficulty") || "easy", [searchParams]);
  const gridSize = DIFFICULTY_GRID[difficulty];
  const numPairs = (gridSize * gridSize) / 2;
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [pairsFound, setPairsFound] = useState(0);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(true);
  const [showVictory, setShowVictory] = useState(false);
  const timerRef = useRef();

  // Initialize cards
  useEffect(() => {
    let emojiSet = EMOJIS[theme].slice(0, numPairs);
    let deck = shuffle([...emojiSet, ...emojiSet]).map((emoji, i) => ({
      id: i,
      emoji,
      flipped: false,
      matched: false
    }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setPairsFound(0);
    setTimer(0);
    setRunning(true);
  }, [theme, difficulty]);

  // Timer logic
  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [running]);

  // Card flip logic
  const handleCardClick = idx => {
    if (flipped.length === 2 || cards[idx].flipped || cards[idx].matched) return;
    const newFlipped = [...flipped, idx];
    const newCards = cards.map((card, i) =>
      i === idx ? { ...card, flipped: true } : card
    );
    setCards(newCards);
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      const [a, b] = newFlipped;
      if (newCards[a].emoji === newCards[b].emoji) {
        setTimeout(() => {
          setCards(cards =>
            cards.map((card, i) =>
              i === a || i === b ? { ...card, matched: true } : card
            )
          );
          setMatched(m => [...m, a, b]);
          setPairsFound(p => p + 1);
          setFlipped([]);
        }, 600);
      } else {
        setTimeout(() => {
          setCards(cards =>
            cards.map((card, i) =>
              i === a || i === b ? { ...card, flipped: false } : card
            )
          );
          setFlipped([]);
        }, 900);
      }
    }
  };

  // Stop timer if all pairs found
  useEffect(() => {
    if (pairsFound === numPairs) {
      setRunning(false);
      setTimeout(() => setShowVictory(true), 900);
    }
  }, [pairsFound, numPairs]);

  // Format timer
  const formatTime = t => {
    const m = String(Math.floor(t / 60)).padStart(2, "0");
    const s = String(t % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className={styles.gameBg}>
      <div className={styles.gameContainer}>
        <header className={styles.headerSection}>
          <h1 className={`${styles.title} ${barrio.className}`}>Memory Mania</h1>
        </header>
        <div className={styles.infoSection}>
          <h2 className={styles.infoTitle}>Game Info</h2>
          <div className={styles.infoGrid}>
            <div><strong>Duration:</strong> {formatTime(timer)}</div>
            <div><strong>Difficulty:</strong> {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</div>
            <div><strong>Theme:</strong> {THEME_LABELS[theme]}</div>
            <div><strong>Pairs Found:</strong> {pairsFound}</div>
          </div>
        </div>
        <button className={styles.backBtn} onClick={() => router.push("/")}>Back</button>
        <div
          className={styles.grid}
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`
          }}
        >
          {cards.map((card, idx) => (
            <div
              key={card.id}
              className={
                card.matched || card.flipped
                  ? styles.cardFlipped
                  : styles.card
              }
              onClick={() => handleCardClick(idx)}
              tabIndex={0}
              role="button"
              aria-label={card.flipped || card.matched ? card.emoji : "Hidden card"}
            >
              <span className={styles.emoji} style={{opacity: card.flipped || card.matched ? 1 : 0}}>{card.emoji}</span>
            </div>
          ))}
        </div>
        {showVictory && (
          <div className={styles.victoryOverlay}>
            <div className={styles.victoryBox}>
              <h2 className={styles.victoryTitle}>🎉 Victory!</h2>
              <div className={styles.victoryStats}>
                <div><strong>Duration:</strong> {formatTime(timer)}</div>
                <div><strong>Difficulty:</strong> {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</div>
                <div><strong>Theme:</strong> {THEME_LABELS[theme]}</div>
                <div><strong>Pairs Found:</strong> {pairsFound}</div>
              </div>
              <div className={styles.victoryBtns}>
                <button className={styles.restartBtn} onClick={() => {
                  setShowVictory(false);
                  let emojiSet = EMOJIS[theme].slice(0, numPairs);
                  let deck = shuffle([...emojiSet, ...emojiSet]).map((emoji, i) => ({
                    id: i,
                    emoji,
                    flipped: false,
                    matched: false
                  }));
                  setCards(deck);
                  setFlipped([]);
                  setMatched([]);
                  setPairsFound(0);
                  setTimer(0);
                  setRunning(true);
                }}>Restart</button>
                <button className={styles.menuBtn} onClick={() => router.push("/")}>Menu</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
