import { useState } from "react";

const MAX_CHARS = 2000;

export default function InputForm({ onSubmit, loading }) {
  const [text, setText] = useState("");
  const remaining = MAX_CHARS - text.length;
  const isEmpty = text.trim().length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEmpty && !loading) {
      onSubmit(text.trim());
    }
  };

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <div className="textarea-wrapper">
        <textarea
          className="textarea"
          placeholder="I keep thinking about…"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          rows={6}
          disabled={loading}
          aria-label="What's on your mind"
        />
        <span className={`char-count ${remaining < 80 ? "char-count--warn" : ""}`}>
          {remaining}
        </span>
      </div>

      <button
        type="submit"
        className="btn-primary btn-full"
        disabled={isEmpty || loading}
        aria-busy={loading}
      >
        {loading ? (
          <span className="loading-text">
            <span className="spinner" aria-hidden="true" />
            Organizing your thoughts…
          </span>
        ) : (
          "Find Clarity"
        )}
      </button>
    </form>
  );
}