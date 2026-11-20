import { Leaf, TrainFront } from 'lucide-react';
import type { Visual } from '../game';

export function Picture({ name }: { name: string }) {
  const props = { size: 44, strokeWidth: 1.7, 'aria-hidden': true as const };
  if (name === 'train')
    return <TrainFront {...props} className="picture blue" />;
  return (
    <svg
      viewBox="0 0 64 64"
      className={`picture picture-${name}`}
      fill="none"
      aria-hidden="true"
    >
      {name === 'lotus' && (
        <>
          <ellipse cx="32" cy="53" rx="25" ry="6" fill="#8eb59b" />
          <path
            d="M32 46C14 47 7 32 9 23c17 2 22 12 23 23Zm0 0c18 1 25-14 23-23-17 2-22 12-23 23Z"
            fill="#dc9baf"
          />
          <path d="M32 46C14 34 22 15 32 7c10 8 18 27 0 39Z" fill="#c97796" />
          <path
            d="M32 46C12 47 8 40 4 33c14-2 23 3 28 13Zm0 0c20 1 24-6 28-13-14-2-23 3-28 13Z"
            fill="#edbbc7"
          />
        </>
      )}
      {name === 'peacock' && (
        <>
          <path
            d="M31 48C-9 37 2 5 17 20 10-2 37 0 32 19 41-4 64 7 46 25c24-9 24 20-15 23Z"
            fill="#63a288"
          />
          {[
            ['13', '28'],
            ['23', '16'],
            ['43', '17'],
            ['51', '31'],
          ].map(([cx, cy]) => (
            <g key={cx}>
              <ellipse cx={cx} cy={cy} rx="4" ry="5" fill="#e9c669" />
              <circle cx={cx} cy={cy} r="2" fill="#347d91" />
            </g>
          ))}
          <path
            d="M20 46c1-10 15-3 15-14V22c0-7 12-7 12 0l-4 3v13c0 15-13 22-23 8Z"
            fill="#427f9c"
          />
          <path d="m45 21 9 3-10 3Z" fill="#d5a547" />
          <circle cx="43" cy="21" r="1.5" fill="#fff" />
          <path
            d="M29 52v9m7-11v11M39 15l-2-6m6 6 1-7"
            stroke="#427f9c"
            strokeWidth="2"
          />
        </>
      )}
      {name === 'banyan' && (
        <>
          <path d="M29 25v32h9V25" fill="#a27c54" />
          <path
            d="M12 24v27m8-24v18m27-23v26m7-22v29"
            stroke="#aa8c63"
            strokeWidth="2"
          />
          <path
            d="M4 28C-1 16 11 8 21 13 24-3 46-1 48 13c14-2 20 13 11 20-6 6-16 5-23 0-13 9-30 6-32-5Z"
            fill="#78a16e"
          />
          <path
            d="M10 58h43"
            stroke="#78a16e"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
      {name === 'india-gate' && (
        <>
          <path d="M11 56V19h42v37H39V37a7 7 0 0 0-14 0v19Z" fill="#c49b71" />
          <path
            d="M7 56h50M8 19h48M13 13h38V7H13Zm2 9v32m34-32v32M20 13v6m24-6v6"
            stroke="#a47a57"
            strokeWidth="3"
          />
          <path d="M25 25h14M21 10h22" stroke="#ead0a6" strokeWidth="2" />
        </>
      )}
      {name === 'diya' && (
        <>
          <path d="M10 35h44c-3 15-12 21-22 21S13 50 10 35Z" fill="#db7754" />
          <path d="M32 6c-12 15-10 23 0 25 10-2 12-10 0-25Z" fill="#edb93f" />
          <path
            d="M19 41h26M24 47h16"
            stroke="#fae9ba"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
      {name === 'kite' && (
        <>
          <path d="m32 4 22 26-22 24L10 30Z" fill="#edb93f" />
          <path d="m32 4 22 26H32Z" fill="#ed7b69" />
          <path d="m10 30 22 24V30Z" fill="#298878" />
          <path
            d="M32 4v50m-22-24h44M32 54c-10 9 10 4 1 10"
            stroke="#375d51"
            strokeWidth="1.7"
          />
        </>
      )}
      {name === 'tabla' && (
        <>
          <path
            d="m8 25 4 29c4 5 17 5 21 0l3-29M37 32l2 23c4 4 13 4 17 0l3-23"
            fill="#daa45f"
            stroke="#7c5b40"
            strokeWidth="2"
          />
          <ellipse
            cx="22"
            cy="25"
            rx="14"
            ry="7"
            fill="#fff6d9"
            stroke="#7c5b40"
            strokeWidth="2"
          />
          <ellipse
            cx="48"
            cy="32"
            rx="11"
            ry="6"
            fill="#fff6d9"
            stroke="#7c5b40"
            strokeWidth="2"
          />
          <ellipse cx="22" cy="25" rx="5" ry="3" fill="#43544a" />
          <ellipse cx="48" cy="32" rx="4" ry="2.5" fill="#43544a" />
          <path
            d="m15 34 2 19m11-19-2 19m18-13 1 14m6-14-1 14"
            stroke="#fff6d9"
            strokeWidth="2"
          />
        </>
      )}
      {name === 'mango' && (
        <>
          <path
            d="M30 14C8 14 10 35 17 48c7 14 27 9 32-6C55 25 46 12 30 14Z"
            fill="#efb939"
          />
          <path d="M31 17C30 7 37 4 43 4" stroke="#647d47" strokeWidth="3" />
          <path d="M33 12C41 1 55 9 54 15c-10 5-15 2-21-3Z" fill="#6b9958" />
          <path
            d="M22 25c-5 7-3 14-1 17"
            stroke="#ffdf77"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      )}
      {name === 'elephant' && (
        <>
          <path
            d="M8 28c0-17 33-20 41-8 9 0 12 5 12 12v13c0 11-13 11-13 1v-5l-4 1v14H34V43H22v13H12V40Z"
            fill="#8b9fac"
          />
          <path d="M39 22c-16-9-21 20-6 20 9 0 13-13 6-20Z" fill="#b4c3cb" />
          <circle cx="51" cy="27" r="2" fill="#30463f" />
          <path d="M8 29 3 35" stroke="#647c89" strokeWidth="3" />
        </>
      )}
      {name === 'taj' && (
        <>
          <path
            d="M8 54h48M11 52V19m42 33V19M8 21h6m36 0h6M18 52V31h28v21"
            stroke="#639a9a"
            strokeWidth="3"
          />
          <path
            d="M20 30c-2-9 12-14 12-21 0 7 14 12 12 21Z"
            fill="#b4d9d4"
            stroke="#639a9a"
            strokeWidth="2"
          />
          <path d="M27 52V42a5 5 0 0 1 10 0v10" fill="#639a9a" />
          <path d="M32 9V4" stroke="#639a9a" strokeWidth="2" />
        </>
      )}
      {name === 'wheel' && (
        <>
          <circle cx="23" cy="29" r="18" stroke="#ac7948" strokeWidth="3" />
          <path
            d="M23 11v36M5 29h36M10 16l26 26m0-26L10 42M23 29l32 11-4 12H14l9-23Zm16 11h20"
            stroke="#ac7948"
            strokeWidth="2.5"
          />
        </>
      )}
      {![
        'lotus',
        'peacock',
        'banyan',
        'india-gate',
        'diya',
        'kite',
        'tabla',
        'mango',
        'elephant',
        'taj',
        'wheel',
      ].includes(name) && <Leaf x="10" y="10" width="44" height="44" />}
    </svg>
  );
}

export function LearningVisual({ visual }: { visual: Visual }) {
  if (visual.kind === 'dots')
    return (
      <span
        className="dot-group"
        style={{
          gridTemplateColumns: `repeat(${visual.value <= 3 ? visual.value : visual.value <= 6 ? 3 : 4}, 1fr)`,
        }}
        aria-hidden="true"
      >
        {Array.from({ length: visual.value }, (_, index) => (
          <span className="count-dot" key={index} />
        ))}
      </span>
    );
  if (visual.kind === 'picture') return <Picture name={visual.value} />;
  return (
    <span
      className={`visual-text ${visual.value.length > 10 ? 'long-text' : visual.value.length > 3 ? 'medium-text' : ''}`}
      aria-hidden="true"
    >
      {visual.value}
    </span>
  );
}
