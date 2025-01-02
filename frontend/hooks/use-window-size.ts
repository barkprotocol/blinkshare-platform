import debounce from "just-debounce-it";
import { useEffect, useState } from "react";

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

/**
 * @name useWindowSize
 * @description A React hook that listens to window size changes and returns the window's width and height.
 * @param debounceDelay The debounce delay in milliseconds.
 * @returns {WindowSize} An object containing the width and height of the window.
 */
export function useWindowSize(debounceDelay: number = 500): WindowSize {
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);

  // Debounce handler for resizing window
  const onWindowResize = debounce(() => {
    setWidth(Math.min(window.innerWidth, document.documentElement.clientWidth));
    setHeight(Math.min(window.innerHeight, document.documentElement.clientHeight));
  }, debounceDelay, true);

  useEffect(() => {
    // Set initial window size on mount
    onWindowResize();

    // Add event listener on mount
    window.addEventListener("resize", onWindowResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", onWindowResize);
  }, [debounceDelay]);

  return { width, height };
}
