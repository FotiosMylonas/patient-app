import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  function handleLogin() {
    navigate("/today");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 bg-bg-primary">
      {/* Top section — brand */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Logo mark */}
        <div className="w-16 h-16 mb-6 rounded-2xl bg-accent flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
          <span className="text-accent">Patient</span>
        </h1>
        <p className="text-text-secondary text-base sm:text-lg">
          Your care, in your pocket.
        </p>
      </div>

      {/* Bottom section — auth */}
      <div className="w-full max-w-sm space-y-3 pb-8">
        <button
          onClick={handleLogin}
          className="w-full bg-accent hover:bg-accent-hover transition-colors text-white font-medium py-3 rounded-button"
        >
          Continue with email
        </button>

        <button
          onClick={handleLogin}
          className="w-full bg-bg-secondary hover:bg-bg-tertiary transition-colors border border-border text-text-primary font-medium py-3 rounded-button flex items-center justify-center gap-2"
        >
          <span className="text-orange-400 font-bold">DigiD</span>
          <span className="text-text-secondary text-sm">Inloggen met DigiD</span>
        </button>

        <p className="text-xs text-text-secondary text-center pt-2">
          By continuing you agree to our Terms & Privacy.
        </p>
      </div>
    </div>
  );
}