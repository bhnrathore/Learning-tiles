import { Sparkles } from 'lucide-react';

export function PatternReveal({
  correctIndices,
  checked,
}: {
  correctIndices: number[];
  checked: boolean;
}) {
  const count = correctIndices.length;
  return (
    <section
      className={`mosaic-section ${count === 12 ? 'mosaic-solved' : ''}`}
      aria-label="Garden mosaic"
    >
      <div className="section-label">
        <span>
          <Sparkles size={16} /> Your mosaic
        </span>
        <span>
          {count}
          <span className="muted"> / 12</span>
        </span>
      </div>
      <div
        className="mosaic"
        role="img"
        aria-label={`${count} of 12 garden picture pieces revealed`}
      >
        {Array.from({ length: 12 }, (_, index) => {
          const revealed = checked && correctIndices.includes(index);
          return (
            <div
              key={index}
              className={`mosaic-cell ${revealed ? 'revealed' : ''}`}
              style={
                revealed
                  ? {
                      backgroundPosition: `${((index % 4) * 100) / 3}% ${Math.floor(index / 4) * 50}%`,
                    }
                  : undefined
              }
            >
              <span />
            </div>
          );
        })}
      </div>
      <div className="mosaic-caption">
        <span className="status-dot" />
        {count === 12
          ? 'A garden, made by you.'
          : checked
            ? `${12 - count} more pieces to discover`
            : 'The little garden'}
      </div>
    </section>
  );
}
