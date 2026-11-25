'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Mark } from './Marks';
import h from './hero.module.css';

// Flat-lay hero after revamp/hero.png. Every object is its own image, every
// note is live text and every stroke is an SVG path, so each piece can be
// positioned per breakpoint (see hero.module.css) and animated on its own.
// Coordination with the asset agent lives in revamp/HERO-ASSETS.md.

const ITEMS = [
  { id: 'cap', alt: { en: 'Black cap', de: 'Schwarze Cap' } },
  { id: 'notebook', alt: { en: 'Black notebook', de: 'Schwarzes Notizbuch' } },
  { id: 'ring', alt: { en: 'Ring', de: 'Ring' } },
  { id: 'ring-2', asset: 'ring', alt: { en: 'Second ring', de: 'Zweiter Ring' } },
  { id: 'earphones', alt: { en: 'Wired earphones', de: 'Kabelkopfhörer' } },
  { id: 'glasses', alt: { en: 'Glasses', de: 'Brille' } },
  { id: 'blue-pen', alt: { en: 'Blue pen', de: 'Blauer Stift' } },
  { id: 'black-pen', alt: { en: 'Black pen', de: 'Schwarzer Stift' } },
];
const PUZZLE_ITEMS = ['cap', 'notebook', 'ring', 'earphones', 'glasses', 'blue-pen'];
const PUZZLE_ICONS = { cap: '🎩', notebook: '📖', ring: '💍', earphones: '🎵', glasses: '👓', 'blue-pen': '🖊️' };

// Notes follow the prototype's wording.
const NOTES = {
  en: { cap: ['Cap On, Ace It'], word: ['the word'], ring: 'ring ring ring', music: ['music', 'always'], see: ['Mr. Snellen’s', 'Stand?'], pens: ['notes,', 'ideas,', 'plans'] },
  de: { cap: ['Cap On, Ace It'], word: ['das Wort'], ring: 'ring ring ring', music: ['Musik,', 'immer'], see: ['Mr. Snellen’s', 'Stand?'], pens: ['Notizen,', 'Ideen,', 'Pläne'] },
};
const HINT_COPY = {
  en: { title: 'Hint', clue: 'Ephesians 4:5' },
  de: { title: 'Hinweis', clue: 'Epheser 4:5' },
};
const PLAY_CLUE_COPY = { en: 'Play', de: 'Abspielen' };
const GAME_INSTRUCTIONS = {
  en: {
    title: 'How to play',
    steps: [
      'Guess the six-digit PIN.',
      "Green means the digit is in the correct position, yellow means it's in the wrong position, and gray means it's not in the code.",
      'Find clues hidden throughout the hero section.',
      'Have fun !',
    ],
  },
  de: {
    title: 'So funktioniert’s',
    steps: [
      'Errate den sechsstelligen PIN.',
      'Grün bedeutet, dass die Ziffer an der richtigen Stelle steht. Gelb bedeutet, dass sie an der falschen Stelle steht, und Grau bedeutet, dass sie nicht im PIN vorkommt.',
      'Finde die Hinweise, die im gesamten Hero-Bereich versteckt sind.',
      'Viel Spaß!',
    ],
  },
};

const fit = { preserveAspectRatio: 'xMidYMid meet' };

function Note({ className, lines, underline = 'doubleUnderline' }) {
  return (
    <p className={`${h.note} ${className}`} data-hero-note="">
      {lines.map((line) => <span key={line}>{line}</span>)}
      {underline && <Mark type={underline} className={h.noteUnderline} />}
    </p>
  );
}

function DraggableItem({ item, asset, language, index, cursorRef, onEarphonesMoved }) {
  const itemRef = useRef(null);
  const imageRef = useRef(null);
  const dragRef = useRef(null);
  const alphaRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const pendingOffsetRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return undefined;

    const createAlphaOutline = () => {
      if (!image.naturalWidth || !image.naturalHeight) return;
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      const source = document.createElement('canvas');
      source.width = width;
      source.height = height;
      const sourceContext = source.getContext('2d', { willReadFrequently: true });
      if (!sourceContext) return;
      sourceContext.drawImage(image, 0, 0);
      const pixels = sourceContext.getImageData(0, 0, width, height).data;
      const alpha = new Uint8Array(width * height);
      for (let i = 0, pixel = 0; i < pixels.length; i += 4, pixel += 1) alpha[pixel] = pixels[i + 3];
      alphaRef.current = { width, height, data: alpha };

    };

    if (image.complete) createAlphaOutline();
    else image.addEventListener('load', createAlphaOutline);
    return () => image.removeEventListener('load', createAlphaOutline);
  }, [asset.src]);
  const rotation = (element) => {
    if (!element) return 0;
    const style = getComputedStyle(element);
    const ownRotation = style.rotate === 'none' ? 0 : Number.parseFloat(style.rotate) || 0;
    const transformRotation = style.transform === 'none'
      ? 0
      : Math.atan2(new DOMMatrixReadOnly(style.transform).b, new DOMMatrixReadOnly(style.transform).a) * (180 / Math.PI);
    return ownRotation + transformRotation;
  };
  const screenDeltaToLocal = (x, y, degrees = rotation(itemRef.current)) => {
    const radians = degrees * (Math.PI / 180);
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    return { x: x * cos + y * sin, y: -x * sin + y * cos };
  };

  const setOffset = (x, y) => {
    offsetRef.current = { x, y };
    pendingOffsetRef.current = { x, y };
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      const next = pendingOffsetRef.current;
      const element = itemRef.current;
      if (element) element.style.translate = `${next.x}px ${next.y}px`;
      frameRef.current = 0;
    });
  };

  const isActivePixel = (event) => {
    const mask = alphaRef.current;
    const element = itemRef.current;
    if (!mask || !element || !element.clientWidth || !element.clientHeight) return false;
    const x = Math.floor((event.nativeEvent.offsetX / element.clientWidth) * mask.width);
    const y = Math.floor((event.nativeEvent.offsetY / element.clientHeight) * mask.height);
    return x >= 0 && y >= 0 && x < mask.width && y < mask.height && mask.data[y * mask.width + x] > 24;
  };

  const updateActiveHover = (event) => {
    const element = itemRef.current;
    if (!element) return;
    if (event.pointerType === 'touch') {
      delete element.dataset.activeHover;
      hideCursor(cursorRef.current);
      return;
    }
    if (isActivePixel(event)) {
      element.dataset.activeHover = 'true';
      moveCursor(event, cursorRef.current, 'move');
    } else {
      delete element.dataset.activeHover;
      hideCursor(cursorRef.current);
    }
  };

  const moveCursor = (event, cursor, state) => {
    if (!cursor) return;
    cursor.dataset.state = state;
    const touchLift = event.pointerType === 'touch' ? -36 : 0;
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY + touchLift}px, 0) translate(-50%, -50%)`;
    cursor.dataset.visible = 'true';
  };

  const onPointerDown = (event) => {
    if (event.button !== 0) return;
    if (!isActivePixel(event)) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = 'true';
    moveCursor(event, cursorRef.current, 'moving');
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: offsetRef.current,
      rotation: rotation(itemRef.current) + rotation(itemRef.current?.querySelector('[data-hero-item-in]')),
      hasMoved: false,
    };
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag) { updateActiveHover(event); return; }
    if (drag.pointerId !== event.pointerId) return;
    if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 4) drag.hasMoved = true;
    moveCursor(event, cursorRef.current, 'moving');
    const movement = screenDeltaToLocal(event.clientX - drag.startX, event.clientY - drag.startY, drag.rotation);
    setOffset(
      drag.startOffset.x + movement.x,
      drag.startOffset.y + movement.y,
    );
  };

  const endDrag = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    const shouldOpenMusicClue = item.id === 'earphones' && dragRef.current.hasMoved;
    dragRef.current = null;
    delete event.currentTarget.dataset.dragging;
    hideCursor(cursorRef.current);
    updateActiveHover(event);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (shouldOpenMusicClue) onEarphonesMoved?.();
  };

  const onKeyDown = (event) => {
    const step = event.shiftKey ? 20 : 8;
    const directions = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    const movement = screenDeltaToLocal(direction[0], direction[1]);
    setOffset(offsetRef.current.x + movement.x, offsetRef.current.y + movement.y);
  };

  const hint = language === 'de' ? 'mit Ziehen oder Pfeiltasten verschieben' : 'drag or use arrow keys to move';

  return (
    <div
      ref={itemRef}
      className={`${h.item} ${h[`i-${item.id}`]}`}
      data-hero-item={item.id}
      role="group"
      tabIndex={0}
      aria-label={`${item.alt[language]}, ${hint}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerEnter={updateActiveHover}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
      onPointerLeave={() => {
        if (!dragRef.current) {
          delete itemRef.current.dataset.activeHover;
          hideCursor(cursorRef.current);
        }
      }}
      onKeyDown={onKeyDown}
    >
      <div className={h.itemIn} data-hero-item-in="">
        <img ref={imageRef} src={asset.src} width={asset.w} height={asset.h} alt="" decoding="async" fetchPriority={index < 2 ? 'high' : 'auto'} draggable="false" />
      </div>
    </div>
  );
}

function hideCursor(cursor) {
  if (cursor) delete cursor.dataset.visible;
}

// "the making of Fai" as monoline strokes, in writing order, so it can be
// written on. Stand-in lettering in the spirit of the prototype's signature;
// replace the path data with a trace of the real handwriting when it exists.
const SIGNATURE = [
  // the
  'M6 106 C 26 100, 48 72, 62 28 C 54 58, 50 84, 56 96 C 62 104, 74 92, 82 78 C 92 60, 104 34, 106 24 C 104 50, 98 80, 94 100 C 100 82, 112 66, 122 68 C 130 72, 122 92, 128 98 C 134 102, 142 96, 148 90 C 158 86, 168 76, 164 68 C 158 60, 144 74, 148 90 C 152 102, 172 98, 190 84',
  'M40 52 L 84 46',
  // making
  'M236 100 C 240 86, 246 72, 252 66 C 256 74, 252 90, 254 100 C 260 84, 272 66, 282 68 C 288 74, 282 90, 284 100 C 290 84, 302 66, 312 68 C 318 74, 312 92, 318 98 C 324 102, 332 94, 338 88 C 346 70, 370 62, 380 70 C 362 62, 342 78, 344 92 C 346 104, 368 94, 380 70 C 376 84, 376 98, 386 98 C 394 98, 402 90, 408 82 C 418 64, 428 38, 428 24 C 424 50, 418 80, 414 100 C 420 84, 434 70, 444 72 C 448 80, 432 86, 424 86 C 436 88, 440 98, 450 98 C 458 98, 466 90, 472 80 C 476 74, 480 68, 482 66 C 478 78, 476 94, 484 98 C 492 100, 500 90, 506 80 C 510 72, 514 68, 516 66 C 514 78, 512 90, 512 100 C 518 84, 530 66, 540 68 C 546 74, 540 92, 546 98 C 552 102, 562 94, 568 86 C 574 68, 600 62, 608 70 C 590 62, 572 78, 574 92 C 576 104, 598 92, 608 70 C 604 96, 600 128, 586 142 C 574 152, 562 140, 572 128 C 584 114, 616 104, 640 90',
  'M486 46 L 489 41',
  // of
  'M712 68 C 694 66, 684 86, 692 96 C 702 106, 722 92, 720 76 C 718 66, 708 66, 712 68 C 722 76, 734 74, 742 68 C 754 56, 764 34, 760 24 C 754 18, 748 40, 746 70 C 744 100, 742 128, 736 142 C 730 150, 724 138, 732 124 C 742 108, 762 98, 780 88',
  'M732 72 L 772 66',
  // Fai
  'M904 30 C 886 70, 860 118, 840 154',
  'M884 35 C 924 25, 972 17, 1014 13',
  'M864 87 C 894 81, 930 77, 960 77',
  'M1034 68 C 1012 56, 980 72, 976 90 C 973 103, 1004 96, 1030 72 C 1023 84, 1022 96, 1034 94 C 1046 91, 1058 74, 1068 64 C 1062 78, 1059 93, 1070 96 C 1098 101, 1154 84, 1216 95',
  'M1082 40 L 1086 34',
];

// The opening line, shown alone on first view and replaced on scroll.
const SIGNATURE_INTRO = [
  'M4 112 C 44 104, 84 80, 114 52 C 106 70, 100 92, 112 95 C 124 97, 138 88, 150 78',
  'M126 34 L 130 28',
  'M268 62 C 246 50, 210 66, 206 86 C 203 100, 236 92, 262 66 C 255 80, 254 93, 266 91 C 279 88, 287 68, 293 62 C 296 74, 293 86, 296 89 C 304 76, 318 62, 327 63 C 332 71, 327 84, 331 87 C 339 78, 353 64, 362 65 C 367 73, 363 83, 372 83 C 382 83, 394 78, 404 74',
  'M474 30 C 456 70, 430 118, 410 154',
  'M454 35 C 494 25, 542 17, 584 13',
  'M434 87 C 464 81, 500 77, 530 77',
  'M604 68 C 582 56, 550 72, 546 90 C 543 103, 574 96, 600 72 C 593 84, 592 96, 604 94 C 616 91, 628 74, 638 64 C 632 78, 629 93, 640 96 C 668 101, 724 84, 786 95',
  'M652 40 L 656 34',
];

export default function Hero({ language = 'en', assets }) {
  const cursorRef = useRef(null);
  const puzzleInputsRef = useRef([]);
  const hintDialogRef = useRef(null);
  const musicDialogRef = useRef(null);
  const instructionsDialogRef = useRef(null);
  const openMusicClue = useCallback(() => musicDialogRef.current?.showModal(), []);
  const [puzzleValues, setPuzzleValues] = useState(() => PUZZLE_ITEMS.map(() => ''));
  const [puzzleStatuses, setPuzzleStatuses] = useState(() => PUZZLE_ITEMS.map(() => ''));
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const puzzleComplete = puzzleValues.every((value) => value.trim() !== '');
  const notes = NOTES[language];
  const hintCopy = HINT_COPY[language] || HINT_COPY.en;
  const gameInstructions = GAME_INSTRUCTIONS[language] || GAME_INSTRUCTIONS.en;

  useEffect(() => {
    if (!puzzleComplete) {
      setPuzzleStatuses(PUZZLE_ITEMS.map(() => ''));
      setPuzzleSolved(false);
      return undefined;
    }

    const controller = new AbortController();
    let outcome = 'error';
    fetch('/api/puzzle/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: puzzleValues }),
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Validation failed'))))
      .then(({ statuses, solved }) => {
        if (Array.isArray(statuses) && statuses.length === PUZZLE_ITEMS.length) {
          outcome = solved ? 'solved' : 'incorrect';
          setPuzzleStatuses(statuses);
          setPuzzleSolved(Boolean(solved));
        }
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          outcome = 'cancelled';
          return;
        }

        setPuzzleStatuses(PUZZLE_ITEMS.map(() => ''));
        setPuzzleSolved(false);
      })
      .finally(() => {
        window.umami?.track('puzzle_submission_attempt', { outcome, language });
      });

    return () => controller.abort();
  }, [puzzleComplete, puzzleValues, language]);

  return (
    <div className={h.layer} data-hero="">
      <div className={h.box} data-hero-box="">
        {ITEMS.map((item, index) => {
          const asset = assets[item.asset || item.id];
          return <DraggableItem key={item.id} item={item} asset={asset} language={language} index={index} cursorRef={cursorRef} onEarphonesMoved={openMusicClue} />;
        })}
        <span className={h.capNumber} data-hero-cap-number="" aria-hidden="true">8</span>
        <button className={h.bookHint} data-hero-hint="" type="button" data-analytics-click="puzzle_hint" onClick={() => hintDialogRef.current?.showModal()} aria-haspopup="dialog">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 18h6m-5 3h4m-2-19a7 7 0 0 0-4 12.7c.6.4 1 1 1 1.8h6c0-.8.4-1.4 1-1.8A7 7 0 0 0 12 2Z" /></svg>
          <span>Hint</span>
        </button>

        <div ref={cursorRef} className={h.customCursor} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18M12 3 9 6m3-3 3 3M21 12l-3-3m3 3-3 3M12 21l-3-3m3 3 3-3M3 12l3-3m-3 3 3 3" /></svg>
        </div>

        <h1 className={h.sign} id="site-title" tabIndex={-1} data-hero-sign="">
          <span className={h.srOnly}>The making of Fai</span>
          <svg className={h.signMain} viewBox="0 0 1220 165" fill="none" aria-hidden="true" {...fit}>
            {SIGNATURE.map((d) => <path key={d} d={d} pathLength="1" data-sign-b="" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />)}
          </svg>
          <svg className={h.signIntro} data-sign-intro="" viewBox="0 0 790 160" fill="none" aria-hidden="true" {...fit}>
            {SIGNATURE_INTRO.map((d) => <path key={d} d={d} pathLength="1" data-sign-a="" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />)}
          </svg>
        </h1>

        <div className={h.puzzle} data-hero-puzzle="" role="group" aria-label={language === 'de' ? 'Zahlenrätsel' : 'Number puzzle'}>
          {PUZZLE_ITEMS.map((id, index) => {
            const item = ITEMS.find((entry) => entry.id === id);
            const value = puzzleValues[index];
            const status = puzzleStatuses[index];
            return (
              <div className={h.puzzleSlot} key={id}>
                <input
                  ref={(element) => { puzzleInputsRef.current[index] = element; }}
                  className={h.puzzleInput}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  autoComplete="off"
                  aria-label={`${language === 'de' ? 'Zahl für' : 'Number for'} ${item.alt[language]}`}
                  aria-invalid={puzzleComplete && status !== 'correct'}
                  data-validation={status || undefined}
                  value={value}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    if (!/^\d?$/.test(nextValue)) return;
                    setPuzzleValues((previous) => previous.map((entry, currentIndex) => currentIndex === index ? nextValue : entry));
                    if (event.target.value) puzzleInputsRef.current[index + 1]?.focus();
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Backspace' && !event.currentTarget.value) puzzleInputsRef.current[index - 1]?.focus();
                  }}
                />
                <span className={h.puzzleIcon} aria-hidden="true">{PUZZLE_ICONS[id]}</span>
              </div>
            );
          })}
          <button
            className={h.puzzleQuestion}
            data-solved={puzzleSolved}
            data-analytics-click="puzzle_instructions"
            type="button"
            aria-label={gameInstructions.title}
            onClick={() => instructionsDialogRef.current?.showModal()}
          >
            <span className={h.questionMark}>?</span>
            <svg className={h.checkMark} viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m5 17 8 8L27 8" /></svg>
          </button>
        </div>

        <dialog
          ref={hintDialogRef}
          className={h.hintDialog}
          aria-labelledby="hero-hint-title"
          onClick={(event) => { if (event.target === event.currentTarget) hintDialogRef.current?.close(); }}
        >
          <button className={h.hintClose} type="button" aria-label={language === 'de' ? 'Schließen' : 'Close'} onClick={() => hintDialogRef.current?.close()}>×</button>
          <p className={h.hintTitle} id="hero-hint-title">{hintCopy.title}</p>
          <p className={h.hintClue}>{hintCopy.clue}</p>
        </dialog>

        <dialog
          ref={musicDialogRef}
          className={`${h.hintDialog} ${h.musicDialog}`}
          aria-labelledby="hero-music-title"
          onClose={(event) => {
            const player = event.currentTarget.querySelector('audio');
            player?.pause();
            if (player) player.currentTime = 0;
          }}
          onClick={(event) => { if (event.target === event.currentTarget) musicDialogRef.current?.close(); }}
        >
          <button className={h.hintClose} type="button" aria-label={language === 'de' ? 'Schließen' : 'Close'} onClick={() => musicDialogRef.current?.close()}>×</button>
          <p className={h.hintTitle} id="hero-music-title">{PLAY_CLUE_COPY[language] || PLAY_CLUE_COPY.en}</p>
          <audio className={h.cluePlayer} controls preload="none" aria-label={PLAY_CLUE_COPY[language] || PLAY_CLUE_COPY.en}>
            <source src="/rv/hero/play-clue.mp3" type="audio/mpeg" />
          </audio>
        </dialog>

        <dialog
          ref={instructionsDialogRef}
          className={`${h.hintDialog} ${h.instructionsDialog}`}
          aria-labelledby="hero-instructions-title"
          onClick={(event) => { if (event.target === event.currentTarget) instructionsDialogRef.current?.close(); }}
        >
          <button className={h.hintClose} type="button" aria-label={language === 'de' ? 'Schließen' : 'Close'} onClick={() => instructionsDialogRef.current?.close()}>×</button>
          <p className={h.hintTitle} id="hero-instructions-title">{gameInstructions.title}</p>
          <ol className={h.instructionList}>
            {gameInstructions.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </dialog>

        <div className={h.notes} data-hero-notes="">
          <Note className={h.nCap} lines={notes.cap} />
          <Mark type="arrow" className={`${h.doodle} ${h.aCap}`} {...fit} />
          <Mark type="sparks" className={`${h.doodle} ${h.sparksCap}`} {...fit} />

          <Note className={h.nWord} lines={notes.word} />
          <Mark type="arrow" className={`${h.doodle} ${h.aWord}`} {...fit} />

          <p className={`${h.note} ${h.nRing}`} data-hero-note=""><span>{notes.ring}</span><Mark type="circle" className={h.ringLoop} /></p>
          <Mark type="arrowDown" className={`${h.doodle} ${h.aRing}`} {...fit} />
          <Mark type="sparks" className={`${h.doodle} ${h.sparksRing}`} {...fit} />

          <Note className={h.nMusic} lines={notes.music} underline="underline" />
          <Mark type="arrow" className={`${h.doodle} ${h.aMusic}`} {...fit} />
          <Mark type="flower" className={`${h.doodle} ${h.flower}`} {...fit} />

          <Note className={h.nSee} lines={notes.see} />
          <Mark type="arrow" className={`${h.doodle} ${h.aSee}`} {...fit} />

          <Note className={h.nPens} lines={notes.pens} />
          <Mark type="arrow" className={`${h.doodle} ${h.aPens}`} {...fit} />

          <Mark type="star" className={`${h.doodle} ${h.starA}`} {...fit} />
          <Mark type="star" className={`${h.doodle} ${h.starB}`} {...fit} />
          <Mark type="cherries" className={`${h.doodle} ${h.cherries}`} {...fit} />
          <Mark type="hatch" className={`${h.doodle} ${h.hatch}`} {...fit} />
        </div>
      </div>
    </div>
  );
}
