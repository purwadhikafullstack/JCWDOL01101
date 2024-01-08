import * as React from "react";
import { NavigationType, UNSAFE_NavigationContext } from "react-router-dom";
import { History, Update } from "history";
const useBackListener = (callback: (...args: any) => void) => {
  const navigator = React.useContext(UNSAFE_NavigationContext)
    .navigator as History;

  React.useEffect(() => {
    const listener = ({ location, action }: Update) => {
      if (action === NavigationType.Pop) {
        callback({ location, action });
      }
    };

    const unlisten = navigator.listen(listener);
    return unlisten;
  }, [callback, navigator]);
};
