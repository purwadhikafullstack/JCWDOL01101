import { useEffect, RefObject } from "react";

type AnyEvent = MouseEvent | TouchEvent;

function useOutsideClick<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: AnyEvent) => void
) {
  useEffect(() => {
    const handleClickOutside = (event: AnyEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ref, handler]);
}

export default useOutsideClick;
