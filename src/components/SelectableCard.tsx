'use client';

// ─────────────────────────────────────────────────────────────────────
// SelectableCard — the ONE shared card-selection mechanism (§7 design
// consistency). Do not re-implement selected-card styling per page.
//
// Two halves:
//   • the CSS contract, in globals.css: `.card-interactive` +
//     `data-selected="true|false"` + the `.card-selected-mark` tick.
//     Anything that already owns its own React state (the checkout
//     plan pills, the glucose radio cards, the coach toggle) just
//     wears those and is done — it does NOT need this component.
//   • this component, for the many card grids that are rendered by
//     SERVER components and therefore have no state of their own:
//     /eos programmes, the KRAFT cards, the affiliate tier ladder,
//     the homepage and /pricing ladders.
//
// Accessibility note — why the card is not a role="radio":
// every one of these cards contains its own link or button (the CTA).
// Wrapping that in a fake radio/button widget hides the real control
// from assistive tech and produces nested-interactive markup. Instead
// the card is an inert container that *reflects* selection:
//   • pointer users click anywhere on the card → instant selection;
//   • keyboard users Tab to the CTA inside it → `onFocusCapture`
//     selects the same card, and the CTA shows the global
//     focus-visible ring. So the state is reachable and operable by
//     keyboard without inventing a widget role.
// The tick badge plus a visually-hidden "Selected" string carry the
// state to screen readers.
// ─────────────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Check } from 'lucide-react';

interface GroupContextValue {
  selected: string | null;
  select: (id: string) => void;
}

const GroupContext = createContext<GroupContextValue | null>(null);

export function SelectableCardGroup({
  className,
  style,
  defaultSelected = null,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  /** Card id highlighted on first paint — usually the featured tier. */
  defaultSelected?: string | null;
  children: ReactNode;
}) {
  const [selected, setSelected] = useState<string | null>(defaultSelected);
  return (
    <GroupContext.Provider value={{ selected, select: setSelected }}>
      <div className={className} style={style}>
        {children}
      </div>
    </GroupContext.Provider>
  );
}

export function SelectableCard({
  id,
  className = '',
  style,
  children,
}: {
  id: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ctx = useContext(GroupContext);
  const selected = ctx?.selected === id;

  return (
    <div
      className={`card-interactive ${className}`}
      style={style}
      data-selected={selected ? 'true' : 'false'}
      onClick={() => ctx?.select(id)}
      onFocusCapture={() => ctx?.select(id)}
    >
      <span className="card-selected-mark">
        <Check className="h-3.5 w-3.5" aria-hidden />
      </span>
      {selected && <span className="sr-only">Selected</span>}
      {children}
    </div>
  );
}
