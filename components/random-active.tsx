'use client';

import { useState } from 'react';

const colors = ['#ff375f','#ff7a00','#d7a900','#30b965','#00a7a0','#0a84ff','#5e5ce6','#b64ed8','#e83e8c'];

export function useRandomActiveColor() {
  const [activeColor, setActiveColor] = useState(colors[0]);
  const randomize = () => setActiveColor(colors[Math.floor(Math.random() * colors.length)]);
  return { activeColor, randomize };
}

export { colors as musefoldActiveColors };
