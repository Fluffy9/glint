"use client";

import {
  useCallback,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

export function useBoxDrag() {
  const [rx, setRx] = useState(-24);
  const [ry, setRy] = useState(-36);
  const drag = useRef<{ x: number; y: number; rx: number; ry: number } | null>(
    null,
  );

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      drag.current = { x: event.clientX, y: event.clientY, rx, ry };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [rx, ry],
  );

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = drag.current;
    if (!gesture) return;
    setRy(gesture.ry + (event.clientX - gesture.x) * 0.4);
    setRx(Math.max(-70, Math.min(10, gesture.rx - (event.clientY - gesture.y) * 0.3)));
  }, []);

  const onPointerUp = useCallback(() => {
    drag.current = null;
  }, []);

  return { rx, ry, onPointerDown, onPointerMove, onPointerUp };
}
