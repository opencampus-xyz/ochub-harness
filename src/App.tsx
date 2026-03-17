import { useState } from "react";
import { useOCAuth, LoginCallBack } from "@opencampus/ocid-connect-js";

function Navbar() {
  const { authState, ocAuth } = useOCAuth();
  const isAuthenticated = authState?.isAuthenticated ?? false;
  const userInfo = authState?.OCId;

  const handleLogin = async () => {
    try {
      await ocAuth.signInWithRedirect({ state: "opencampus" });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await ocAuth.logout(window.location.origin);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isWidget = window.location.pathname === "/widget";

  return (
    <header className="sticky top-0 z-30 bg-[linear-gradient(95deg,#01ECBF_-75%,#131BEA_40%)]">
      <div className="mx-auto flex h-14 max-w-xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-white">OCHub Harness</h1>
          <nav className="flex gap-2 text-sm">
            <a
              href="/"
              className={`px-2 py-1 rounded ${!isWidget ? "bg-white/20 text-white" : "text-white/70 hover:text-white"}`}
            >
              App
            </a>
            <a
              href="/widget"
              className={`px-2 py-1 rounded ${isWidget ? "bg-white/20 text-white" : "text-white/70 hover:text-white"}`}
            >
              Widget
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {userInfo && (
                <span className="text-sm text-white/90">{userInfo}</span>
              )}
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded text-sm font-medium text-white transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="px-3 py-1.5 bg-white hover:bg-white/90 rounded text-sm font-medium text-[#131BEA] transition-colors cursor-pointer"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

const WIDGET_SIZES = [
  { label: "Card (2:1)", aspect: "2/1", width: "100%" },
  { label: "Banner (6:1)", aspect: "6/1", width: "100%" },
  { label: "Square (1:1)", aspect: "1/1", width: "50%" },
];
function WidgetPage() {
  const [sizeIndex, setSizeIndex] = useState(0);
  const size = WIDGET_SIZES[sizeIndex];

  return (
    <div className="flex flex-col min-h-screen bg-[#F6FBFF]">
      <Navbar />
      <div className="pt-6 max-w-xl mx-auto w-full px-4">
        <div className="mb-4 flex items-center gap-2">
          <label htmlFor="widget-size" className="text-sm text-gray-600">
            Size:
          </label>
          <select
            id="widget-size"
            value={sizeIndex}
            onChange={(e) => setSizeIndex(Number(e.target.value))}
            className="px-2 py-1 rounded border border-gray-300 text-sm bg-white"
          >
            {WIDGET_SIZES.map((s, i) => (
              <option key={s.label} value={i}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div
          className="overflow-hidden rounded-2xl bg-white shadow-md"
          style={{ width: size.width }}
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#131BEA]">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white text-sm font-bold">
                A
              </div>
              <span className="font-semibold text-white">Mini App</span>
            </div>
            <a
              href="/app/"
              className="rounded-lg bg-white px-4 py-1.5 text-sm font-semibold text-[#131BEA]"
            >
              Launch
            </a>
          </div>

          {/* Widget iframe */}
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: size.aspect }}
          >
            <iframe
              src="/app/widget"
              title="Mini App"
              allow="clipboard-write"
              className="absolute inset-0 w-full h-full border-0"
            />
            <div className="absolute inset-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { isInitialized } = useOCAuth();

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#F6FBFF]">
        <div className="spinner"></div>
        <p className="text-slate-900 font-medium">Initializing...</p>
      </div>
    );
  }

  if (window.location.pathname === "/redirect") {
    return (
      <LoginCallBack
        successCallback={() => {
          window.location.href = "/";
        }}
        errorCallback={(error: Error) => {
          console.error("Login error:", error);
        }}
        customErrorComponent={
          <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#F6FBFF]">
            <h2 className="text-xl text-red-600">Error during login</h2>
            <p className="text-gray-500">Please try again.</p>
          </div>
        }
        customLoadingComponent={
          <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#F6FBFF]">
            <div className="spinner"></div>
            <p className="text-slate-900 font-medium">Completing login...</p>
          </div>
        }
      />
    );
  }

  if (window.location.pathname === "/widget") {
    return <WidgetPage />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F6FBFF]">
      <Navbar />
      <iframe
        src="/app/"
        title="Mini App"
        allow="clipboard-write"
        className="flex-1 w-full max-w-xl mx-auto"
      />
    </div>
  );
}

export default App;
