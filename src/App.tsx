import React from "react";
import Labs from "./Labs";
import Kanbas from "./Kanbas";
import {Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <div className="h-100">
        <Routes>
          <Route path="/" element={<Navigate to="/Labs" />} />
          <Route path="/Labs/*" element={<Labs />} />
          <Route path="/Kanbas/*" element={<Kanbas />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;



