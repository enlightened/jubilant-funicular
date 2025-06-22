"use client";

import { Suspense } from "react";
import GameClient from "./GameClient";

export default function GamePageWrapper(props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameClient {...props} />
    </Suspense>
  );
}
