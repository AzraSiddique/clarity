import { useState } from "react";
import InputForm from "./components/InputForm";
import ResultCard from "./components/ResultCard";
import "./styles.css";

export default function App() {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [input, setInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (text) => {
    setInput(text);
    setStatus("loading");
    setResult(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 11000);

      const res = await fetch("/api/clarity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "CRISIS_DETECTED") {
          setStatus("crisis");
          return;
        }
        if (data.error === "RATE_LIMITED") {
          setErrorMsg("You've sent a few requests quickly. Please wait a moment and try again.");
          setStatus("error");
          return;
        }
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }

      if (data.error === "CRISIS_DETECTED") {
        setStatus("crisis");
        return;
      }

      setResult(data);
      setStatus("result");
    } catch (err) {
      if (err.name === "AbortError") {
        setErrorMsg("The request timed out. Please try again.");
      } else {
        setErrorMsg("A network error occurred. Please check your connection.");
      }
      setStatus("error");
    }
  };

  const handleRetry = () => { if (input) handleSubmit(input); };
  const handleRegenerate = () => { if (input) handleSubmit(input); };
  const handleReset = () => {
    setStatus("idle");
    setResult(null);
    setInput("");
    setErrorMsg("");
  };

  return (
    <div className="app">
      <main className="container">
        <header className="header">
          <div className="logo">✦</div>
          <h1 className="headline">Turn Overthinking Into<br />One Clear Step.</h1>
          <p className="subtext">Describe what's on your mind. Get clarity in seconds.</p>
        </header>

        {(status === "idle" || status === "loading") && (
          <InputForm onSubmit={handleSubmit} loading={status === "loading"} />
        )}

        {status === "result" && result && (
          <ResultCard result={result} onRegenerate={handleRegenerate} onNew={handleReset} />
        )}

        {status === "crisis" && (
          <div className="card crisis-card">
            <div className="crisis-icon">◎</div>
            <p className="crisis-message">
              We can't process this request. If you are in distress, please reach out to a trusted person or a local support service.
            </p>
            <button className="btn-secondary" onClick={handleReset}>Go back</button>
          </div>
        )}

        {status === "error" && (
          <div className="card error-card">
            <h2 className="error-title">We couldn't generate clarity.</h2>
            <p className="error-body">{errorMsg || "Your input is safe. Please try again."}</p>
            <div className="btn-row">
              <button className="btn-primary" onClick={handleRetry}>Retry</button>
              <button className="btn-secondary" onClick={handleReset}>Start over</button>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <span>We do not store your inputs.</span>
      </footer>
    </div>
  );
}