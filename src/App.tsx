import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CarListPage from "./pages/CarListPage";
import CarDetailPage from "./pages/CarDetailPage";
import { getCars, type CarsData } from "./api";
import Header from "./components/Header";
import { ThemeProvider } from "./ThemeContext";

import "./App.css";

export default function App() {
  const [data, setData] = useState<CarsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCars()
      .then((d: CarsData) => setData(d))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <div className="page">
          <Header />
          <main className="content">
            {loading && <p className="note">Loading…</p>}
            {!loading && (error || !data) && (
              <p className="error">{error || "Failed to load data"}</p>
            )}
            {!loading && data && (
              <Routes>
                <Route path="/" element={<CarListPage data={data} />} />
                <Route path="/car/:id" element={<CarDetailPage data={data} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
