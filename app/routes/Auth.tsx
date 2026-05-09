import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const meta = () => [
  { title: "Resumind | Auth" },
  { name: "description", content: "Log into your account" },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = new URLSearchParams(location.search).get("next") || "/";
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next, { replace: true });
  }, [auth.isAuthenticated, navigate, next]);

  return (
    <main className="page-shell flex items-center justify-center">
      <div className="auth-panel">
        <section className="flex flex-col gap-8 bg-transparent rounded-[28px] p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-4xl font-bold">Welcome</h1>
            <h2 className="text-lg text-muted">
              Log in to continue your job journey
            </h2>
          </div>
          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse">
                <p>Signing you in...</p>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button className="auth-button" onClick={auth.signOut}>
                    <p>Log Out</p>
                  </button>
                ) : (
                  <button className="auth-button" onClick={auth.signIn}>
                    <p>Log In</p>
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
