export default function ResultCard({ result, onRegenerate, onNew }) {
  const { summary, nextStep, reframe } = result;

  return (
    <div className="card result-card">
      <div className="result-section">
        <span className="result-label">Summary</span>
        <p className="result-text">{summary}</p>
      </div>

      <div className="result-divider" />

      <div className="result-section">
        <span className="result-label">Next Step</span>
        <p className="result-text result-text--next">{nextStep}</p>
      </div>

      {reframe && (
        <>
          <div className="result-divider" />
          <div className="result-section">
            <span className="result-label">Reframe</span>
            <p className="result-text result-text--reframe">{reframe}</p>
          </div>
        </>
      )}

      <div className="result-actions">
        <button className="btn-secondary" onClick={onRegenerate}>↻ Regenerate</button>
        <button className="btn-ghost" onClick={onNew}>New thought</button>
      </div>
    </div>
  );
}