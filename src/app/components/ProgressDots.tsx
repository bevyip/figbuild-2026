export default function ProgressDots({ total = 4, active = 0 }: { total?: number; active?: number }) {
  return (
    <div className="ob1-dots" aria-label={`Step ${active + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`ob1-dot${i === active ? " ob1-dot--active" : ""}`}
        />
      ))}
    </div>
  );
}
