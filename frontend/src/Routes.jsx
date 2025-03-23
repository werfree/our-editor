import React from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import Home from "./screen/Home";
import Editor from "./screen/Editor";
import { createTheme, ThemeProvider } from "@material-ui/core";

export default function Parent() {
  return (
    <div className="flex h-screen bg-[#1E1E1E] ">
      <BrowserRouter>
        <Routes>
          {/* Corrected syntax for React Router v6 */}
          <Route path="/" element={<Home />} />

          {/* Corrected Redirect using Navigate inside a Route */}
          <Route path="/editor" element={<Navigate to="/" replace />} />

          <Route path="/editor/:editorId" element={<Editor />} />

          {/* Optional: 404 fallback route */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
