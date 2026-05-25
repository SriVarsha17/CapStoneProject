import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router";
import { useAuth } from "../store/AuthStore";

function RootLayout() {
  const checkAuthFromCookie = useAuth((state) => state.checkAuthFromCookie);
  const loading = useAuth((state) => state.loading);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const runAuthCheck = async () => {
      await checkAuthFromCookie();
      setIsAuthChecked(true);
    };

    runAuthCheck();
  }, [checkAuthFromCookie]);

  if (!isAuthChecked || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Checking authentication...</p>
      </div>
    );
  }


  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <main className="grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default RootLayout;