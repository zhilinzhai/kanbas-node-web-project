import React, { useState } from "react";
import './Counter.css'; // Make sure to import the CSS file

export default function Counter() {
  const [count, setCount] = useState(7);
  return (
    <div id="wd-counter-use-state">
      <h2>Counter: {count}</h2>
      <div className="button-container">
        <button
          onClick={() => setCount(count + 1)}
          id="wd-counter-up-click"
          className="counter-button up"
        >
          Up
        </button>
        <button
          onClick={() => setCount(count - 1)}
          id="wd-counter-down-click"
          className="counter-button down"
        >
          Down
        </button>
      </div>
      <hr />
    </div>
  );
}
