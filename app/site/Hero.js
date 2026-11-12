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

// Notes follow the prototype's wording.
const NOTES = {
  en: { cap: ['my everyday cap'], word: ['the word'], ring: 'ring ring ring', music: ['music', 'always'], see: ['that I might', 'C#'], pens: ['notes,', 'ideas,', 'plans'] },
  de: { cap: ['meine Alltags-Cap'], word: ['das Wort'], ring: 'ring ring ring', music: ['Musik,', 'immer'], see: ['that I might', 'C#'], pens: ['Notizen,', 'Ideen,', 'Pläne'] },
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
  const notes = NOTES[language];
  return (
    <div className={h.layer} data-hero="">
      <div className={h.box} data-hero-box="">
        {ITEMS.map((item, index) => {
          const asset = assets[item.asset || item.id];
          return (
            <div key={item.id} className={`${h.item} ${h[`i-${item.id}`]}`} data-hero-item={item.id}>
              <div className={h.itemIn} data-hero-item-in="">
                <img src={asset.src} width={asset.w} height={asset.h} alt={item.alt[language]} decoding="async" fetchPriority={index < 2 ? 'high' : 'auto'} draggable="false" />
              </div>
            </div>
          );
        })}

        <div className={h.sign} data-hero-sign="">
          <svg className={h.signMain} viewBox="0 0 1220 165" fill="none" role="img" aria-label="the making of Fai" {...fit}>
            {SIGNATURE.map((d) => <path key={d} d={d} pathLength="1" data-sign-b="" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />)}
          </svg>
          <svg className={h.signIntro} data-sign-intro="" viewBox="0 0 790 160" fill="none" role="img" aria-label="i am Fai" {...fit}>
            {SIGNATURE_INTRO.map((d) => <path key={d} d={d} pathLength="1" data-sign-a="" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />)}
          </svg>
        </div>

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
