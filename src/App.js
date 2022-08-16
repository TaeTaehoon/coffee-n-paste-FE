// App.js
import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import MainPage from "./pages/MainPage";
import PostingPage from "./pages/PostingPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/post/" element={<PostingPage />} />
      </Routes>
    </>
  );
}

export default App;
