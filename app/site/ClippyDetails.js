'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ClippyStage from './ClippyStage';
import { fontVars } from './fonts';
import SiteHeader from './SiteHeader';
import s from './clippyDetails.module.css';

const text = {
  en: {
    home: '/',
    back: 'Selected works', status: 'Personal project',
    projectAim: 'Exploring agentic workflows and AI tool calling. The goal: at least the breadth of Grok Bot, specialized for personal needs and use cases, on a budget.',
    intro: 'A personal AI companion that lives on your desktop.', prompt: 'Say hello. He is already here.',
    behaviorsTitle: 'More than a mascot', behaviorsIntro: 'Clippy’s behavior engine turns app events and context into a considered response. Try a few situations.',
    hello: 'Say hello', ask: 'Ask something', leave: 'Leave him alone', move: 'Shake the window',
    behaviorNotes: ['A greeting event requests a wave.', 'A request in progress selects a thinking activity.', 'A long idle period moves through sleepy behavior.', 'A shake event requests a dizzy reaction.'],
    environmentTitle: 'Aware of his surroundings', environmentIntro: 'A small desktop simulation. Change the inputs and see which local behavior rule wins.',
    battery: 'Battery', brightness: 'Built-in display brightness', power: 'External power connected', apply: 'Apply environment', idle: 'Simulate long idle', shake: 'Shake window', simulated: 'Simulation only · nothing here reads your actual device state.',
    trace: 'Behavior trace', traceEmpty: 'Change an input, then apply it to see the selected behavior.',
    actionTitle: 'An assistant that takes action', actionIntro: 'Clippy can use tools and route work to specialist agents. These short scenarios use invented data; they do not call real tools.',
    run: 'Run this example', daily: 'Daily brief', reminder: 'Reminder', files: 'Find a file', sample: 'SIMULATED EXAMPLE',
    scenarioNames: ['Daily brief', 'Reminder', 'Find a file'],
    memoryTitle: 'How memory actually works', memoryIntro: 'Clippy does not automatically turn every chat into a memory. The code separates policy checks, a durable ingestion queue, scoped graph retrieval, and short-lived conversation context.',
    memoryModes: ['Explicit memory', 'Automatic learning'],
    memoryModeText: [
      'A user-submitted memory can enter the queue even when automatic learning is off. Sensitive sources are still rejected, secrets are redacted, and excluded terms still apply.',
      'Conversation, agent, tool, and project events enter the queue only when auto-learning is enabled and that source type is allowed. Auto-learning defaults to off.',
    ],
    memoryScopeTitle: 'Scope being explored', memoryScopes: ['Personal · user', 'Project · project:clippy', 'Agent · agent:<id>'],
    memoryPipelineLabel: 'CODE PATH WALKTHROUGH · NO LIVE OR PERSONAL MEMORY',
    memoryFlow: [
      ['01 · Check', 'Reject non-normal sensitivity; redact credential-like strings; enforce excluded terms and source policy.'],
      ['02 · Queue', 'SQLite tracks the ingestion job, its status, policy, and source provenance.'],
      ['03 · Ingest', 'When enabled and fully configured, a worker sends the episode to Graphiti on Neo4j with a scope-specific group_id.'],
      ['04 · Retrieve', 'Search is restricted to allowed scopes. Results include validity and provenance, then are bounded before entering request context.'],
      ['05 · Forget', 'Deleting an episode also removes its local source-provenance record.'],
    ],
    memoryStores: ['Conversation context', 'SQLite metadata', 'Graphiti + Neo4j'],
    memoryStoreDetails: ['Current conversation held in process memory', 'Policies · ingestion jobs · provenance', 'Optional extracted entities and relationships'],
    memoryFootnote: 'Graph ingestion requires the memory feature, Neo4j, and LLM/embedding configuration. This is a walkthrough of the implementation, not a live connection.',
    underTitle: 'Under the hood', underIntro: 'Explore the systems behind the character. Each part solves a different problem.',
    architecture: ['Behavior engine', 'AI core & agents', 'Long-term memory', 'Animation system'],
    architectureText: [
      'Coordinates app, environment, and interaction events. Priorities, cooldowns, and variation selection determine a behavior plan; animationForIntent maps that plan to a scene.',
      'A Python Core uses Pydantic AI tools and specialist agents. Tasks and permission decisions are explicit, so sensitive actions can wait for approval.',
      'Graphiti with Neo4j is the optional long-term memory layer. SQLite stores operational records; conversation context stays separate. Memory ingestion depends on local configuration.',
      'Source clips become transparent frames, then paged PixiJS atlases. The manifest carries frame timing and playback mode; the desktop renderer loads only the selected animation.',
    ],
    architectureStack: ['TypeScript · XState · event catalog', 'Python · Pydantic AI · typed tools', 'Graphiti · Neo4j · SQLite', 'FFmpeg · SAM 2.1 · PixiJS'],
    diagramLabel: 'A request moves through the system', diagram: ['Conversation', 'Behavior + AI Core', 'Agent / tools', 'Result + approval'],
    makingTitle: 'The making of Clippy', makingIntro: 'A character is a design problem and a systems problem. These sheets capture the visual exploration behind the desktop companion.',
    makingCaptions: ['Character directions', 'Expressions and poses', 'The desktop character'],
    nextTitle: 'What’s next', nextIntro: 'Clippy is still in development. The next work is about making the useful parts feel more natural, while keeping awareness and actions under clear user control.',
    nextItems: ['More natural voice interaction', 'More capable specialist agents', 'Careful, opt-in desktop awareness'],
  },
  de: {
    home: '/de',
    back: 'Ausgewählte Arbeiten', status: 'Persönliches Projekt',
    projectAim: 'Ein Projekt, um agentische Workflows und den Aufruf von KI-Tools zu erkunden. Das Ziel: mindestens die Funktionsbreite eines Grok Bots, zugeschnitten auf persönliche Bedürfnisse und Anwendungsfälle – mit kleinem Budget.',
    intro: 'Ein persönlicher KI-Begleiter auf deinem Desktop.', prompt: 'Sag hallo. Er ist schon da.',
    behaviorsTitle: 'Mehr als ein Maskottchen', behaviorsIntro: 'Clippys Verhaltens-Engine leitet aus App-Ereignissen und Kontext passende Reaktionen ab. Probiere ein paar Situationen aus.',
    hello: 'Hallo sagen', ask: 'Etwas fragen', leave: 'Ihn in Ruhe lassen', move: 'Fenster schütteln',
    behaviorNotes: ['Ein Begrüßungsereignis löst eine Winkanimation aus.', 'Während einer Anfrage zeigt Clippy eine Denkanimation.', 'Bei längerer Inaktivität wird Clippy müde.', 'Ein Schütteln löst eine benommene Reaktion aus.'],
    environmentTitle: 'Er nimmt seine Umgebung wahr', environmentIntro: 'Eine kleine Desktop-Simulation. Ändere die Eingaben und sieh, welche lokale Verhaltensregel greift.',
    battery: 'Akku', brightness: 'Helligkeit des eingebauten Displays', power: 'Mit dem Stromnetz verbunden', apply: 'Änderungen anwenden', idle: 'Lange Inaktivität simulieren', shake: 'Fenster schütteln', simulated: 'Nur eine Simulation · hier wird kein echter Gerätestatus ausgelesen.',
    trace: 'Verhaltensablauf', traceEmpty: 'Ändere eine Eingabe und wende sie an, um das ausgewählte Verhalten zu sehen.',
    actionTitle: 'Ein Assistent, der Aufgaben übernimmt', actionIntro: 'Clippy kann Werkzeuge nutzen und Aufgaben an spezialisierte Agenten weitergeben. Diese kurzen Beispiele verwenden Beispieldaten; echte Werkzeuge werden dabei nicht aufgerufen.',
    run: 'Beispiel starten', daily: 'Tagesüberblick', reminder: 'Erinnerung', files: 'Datei finden', sample: 'SIMULIERTES BEISPIEL',
    scenarioNames: ['Tagesüberblick', 'Erinnerung', 'Datei finden'],
    memoryTitle: 'So funktioniert Clippys Gedächtnis', memoryIntro: 'Clippy macht nicht automatisch aus jedem Chat eine Erinnerung. Der Code trennt Richtlinien, eine dauerhafte Verarbeitungswarteschlange, zugriffsbeschränkte Graphsuche und kurzlebigen Gesprächskontext.',
    memoryModes: ['Explizite Erinnerung', 'Automatisches Lernen'],
    memoryModeText: [
      'Eine von dir ausdrücklich eingereichte Erinnerung kann auch bei deaktiviertem automatischem Lernen in die Warteschlange gelangen. Sensible Quellen werden abgewiesen, Geheimnisse unkenntlich gemacht und ausgeschlossene Begriffe weiterhin geprüft.',
      'Gesprächs-, Agenten-, Tool- und Projekt-Ereignisse gelangen nur in die Warteschlange, wenn automatisches Lernen aktiviert und der Quelltyp erlaubt ist. Standardmäßig ist es deaktiviert.',
    ],
    memoryScopeTitle: 'Beispielhafte Speicherbereiche', memoryScopes: ['Persönlich · user', 'Projekt · project:clippy', 'Agent · agent:<id>'],
    memoryPipelineLabel: 'CODEPFAD · KEINE ECHTEN ODER PERSÖNLICHEN ERINNERUNGEN',
    memoryFlow: [
      ['01 · Prüfen', 'Einträge mit einer anderen als der normalen Sensibilitätsstufe werden abgewiesen; Zugangsdaten werden unkenntlich gemacht; Ausschlussbegriffe und Quellenregeln werden geprüft.'],
      ['02 · Warteschlange', 'SQLite speichert den Verarbeitungsauftrag, seinen Status, die Richtlinie und die Herkunft der Daten.'],
      ['03 · Verarbeiten', 'Wenn aktiviert und vollständig konfiguriert, übergibt ein Hintergrundprozess den Eintrag mit einer bereichsspezifischen group_id an Graphiti auf Neo4j.'],
      ['04 · Abrufen', 'Die Suche ist auf erlaubte Speicherbereiche beschränkt. Ergebnisse enthalten Gültigkeits- und Herkunftsangaben; ihre Anzahl wird vor dem Einfügen in den Gesprächskontext begrenzt.'],
      ['05 · Vergessen', 'Beim Löschen eines Eintrags wird auch der lokale Herkunftsnachweis gelöscht.'],
    ],
    memoryStores: ['Gesprächskontext', 'SQLite-Metadaten', 'Graphiti + Neo4j'],
    memoryStoreDetails: ['Aktueller Gesprächsverlauf im Arbeitsspeicher', 'Richtlinien · Aufträge · Herkunftsnachweise', 'Optionale extrahierte Entitäten und Beziehungen'],
    memoryFootnote: 'Die Graphspeicherung benötigt die aktivierte Memory-Funktion, Neo4j sowie eine LLM- und Embedding-Konfiguration. Dies zeigt den Implementierungspfad, keine aktive Verbindung.',
    underTitle: 'Ein Blick unter die Haube', underIntro: 'Entdecke die Systeme hinter der Figur. Jedes löst ein anderes Problem.',
    architecture: ['Verhaltens-Engine', 'KI-Kern & Agenten', 'Langzeitgedächtnis', 'Animationssystem'],
    architectureText: [
      'Koordiniert App-, Umgebungs- und Interaktionsereignisse. Prioritäten, Sperrzeiten und ausgewählte Variationen bestimmen den Verhaltensplan. Die Funktion animationForIntent ordnet ihm eine Animation zu.',
      'Der Python-Kern nutzt Pydantic AI, typisierte Werkzeuge und spezialisierte Agenten. Aufgaben und Freigaben sind klar definiert; sensible Aktionen können auf Zustimmung warten.',
      'Graphiti mit Neo4j ist die optionale Langzeitgedächtnis-Schicht. SQLite speichert operative Daten; der Gesprächskontext bleibt getrennt. Die Aufnahme von Erinnerungen hängt von der lokalen Konfiguration ab.',
      'Aus Quellclips entstehen transparente Frames und daraus mehrseitige PixiJS-Atlanten. Das Manifest enthält Frame-Timing und Wiedergabemodus; der Desktop-Renderer lädt nur die ausgewählte Animation.',
    ],
    architectureStack: ['TypeScript · XState · Ereigniskatalog', 'Python · Pydantic AI · typisierte Tools', 'Graphiti · Neo4j · SQLite', 'FFmpeg · SAM 2.1 · PixiJS'],
    diagramLabel: 'Eine Anfrage durchläuft das System', diagram: ['Gespräch', 'Verhaltenslogik + KI-Kern', 'Agent / Werkzeuge', 'Ergebnis + Freigabe'],
    makingTitle: 'Wie Clippy entstanden ist', makingIntro: 'Eine Figur ist eine Design- und Systemaufgabe. Diese Übersichtsblätter zeigen die visuelle Entwicklung des Desktop-Begleiters.',
    makingCaptions: ['Figurenrichtungen', 'Ausdrücke und Posen', 'Die Desktop-Figur'],
    nextTitle: 'Wie es weitergeht', nextIntro: 'Clippy ist noch in der Entwicklung. Als Nächstes sollen sich die nützlichen Funktionen natürlicher anfühlen, während Wahrnehmung und Aktionen klar unter deiner Kontrolle bleiben.',
    nextItems: ['Natürlichere Sprachinteraktion', 'Leistungsfähigere Spezialagenten', 'Desktop-Wahrnehmung nur nach deiner Zustimmung'],
  },
};

const scenarioData = {
  en: [
    { title: 'Give me my daily brief.', nodes: ['You ask for a brief', 'Clippy checks sample schedule + tasks', 'A concise summary is prepared'], result: 'Two sample events today, one task due. This is invented demo data.' },
    { title: 'Remind me to call Mum at 6.', nodes: ['You request a reminder', 'Reminder tool prepares it', 'Clippy asks before saving'], result: 'A 6:00 PM reminder is ready for your review. Nothing was saved.' },
    { title: 'Find my project notes.', nodes: ['You ask to find a file', 'A file-search tool is selected', 'A sample result is returned'], result: 'Sample result: clippy-project-notes.md. No real files were searched.' },
  ],
  de: [
    { title: 'Gib mir meinen Tagesüberblick.', nodes: ['Du fragst nach einem Überblick', 'Clippy prüft Beispieltermine + Aufgaben', 'Eine kurze Zusammenfassung entsteht'], result: 'Heute zwei Beispieltermine und eine fällige Aufgabe. Die Daten sind erfunden.' },
    { title: 'Erinnere mich daran, Mama um 18 Uhr anzurufen.', nodes: ['Du bittest um eine Erinnerung', 'Das Erinnerungswerkzeug bereitet sie vor', 'Clippy fragt vor dem Speichern nach'], result: 'Eine Erinnerung für 18 Uhr wartet auf deine Prüfung. Nichts wurde gespeichert.' },
    { title: 'Finde meine Projektnotizen.', nodes: ['Du suchst eine Datei', 'Clippy wählt das Dateisuchwerkzeug aus', 'Ein Beispieldateitreffer erscheint'], result: 'Beispieltreffer: clippy-project-notes.md. Es wurden keine echten Dateien durchsucht.' },
  ],
};

const idleTrace = { en: 'The idle timer crossed the sleeping threshold.', de: 'Der Inaktivitätstimer hat die Schwelle zum Schlafmodus erreicht.' };
const animationLabels = {
  en: { waving: 'waving', thinking: 'thinking', reading: 'reading', sleeping: 'sleeping', sleepy: 'sleepy', excited: 'excited', dizzy: 'dizzy' },
  de: { waving: 'winken', thinking: 'nachdenken', reading: 'lesen', sleeping: 'schlafen', sleepy: 'müde', excited: 'aufgeregt', dizzy: 'schwindelig' },
};

export default function ClippyDetails({ language = 'en' }) {
  const t = text[language];
  const [signal, setSignal] = useState(null);
  const signalCount = useRef(0);
  const [trace, setTrace] = useState(null);
  const [battery, setBattery] = useState(72);
  const [brightness, setBrightness] = useState(52);
  const [power, setPower] = useState(false);
  const [scenario, setScenario] = useState(0);
  const [memoryMode, setMemoryMode] = useState(0);
  const [memoryScope, setMemoryScope] = useState(0);
  const [architecture, setArchitecture] = useState(0);
  const [ran, setRan] = useState(false);
  const scenarioTimer = useRef(null);
  const scenarios = scenarioData[language];
  const say = (animation, event, decision) => {
    signalCount.current += 1;
    setSignal({ animation, sequence: signalCount.current });
    setTrace({ event, decision, animation });
  };

  const applyEnvironment = () => {
    if (battery <= 25 && brightness <= 30) {
      say('sleepy', `battery ${battery}% · brightness ${brightness}%`, language === 'de' ? 'Energiesparverhalten → müde' : 'low-energy behavior → sleepy');
    } else if (brightness >= 70 && power) {
      say('excited', 'bright built-in display + external power', language === 'de' ? 'Energiesignal → kurze Animation „aufgeregt“' : 'energetic cue → brief excited animation');
    } else {
      say('thinking', `brightness changed to ${brightness}%`, language === 'de' ? 'Umgebungsänderung → neugierige Reaktion' : 'environment change → curious reaction');
    }
  };

  const runScenario = () => {
    if (scenario < 0) return;
    setRan(true);
    say('thinking', `scenario.${['daily-brief', 'reminder', 'file-search'][scenario]}`, language === 'de' ? 'Anfrage → ausgewählte Werkzeuge → Beispieldaten' : 'request → selected tools → sample result');
    clearTimeout(scenarioTimer.current);
    scenarioTimer.current = setTimeout(() => say('reading', 'task.completed', language === 'de' ? 'Ergebnis vorbereitet → Leseaktivität' : 'result prepared → reading activity'), 900);
  };

  useEffect(() => () => clearTimeout(scenarioTimer.current), []);

  return (
    <main className={`${s.root} ${fontVars}`} lang={language}>
      <SiteHeader language={language} currentPage="project" />

      <section className={s.hero}>
        <div className={s.heroCopy}>
          <span className={s.projectTag}>{t.status}</span>
          <h1>Clippy</h1>
          <p className={s.heroIntro}>{t.intro}</p>
          <p className={s.projectAim}>{t.projectAim}</p>
          <p className={`${s.hand} ${s.heroPrompt}`}>{t.prompt}</p>
        </div>
        <div className={s.heroMascot}>
          <ClippyStage language={language} large controls={false} interactive={false} trigger={signal} />
          <span className={s.heroCaption}>Tauri · React · PixiJS · Python</span>
        </div>
        <a className={s.scrollHint} href="#behavior">{language === 'de' ? 'Entdecken' : 'Explore'}<span aria-hidden="true"> →</span></a>
      </section>

      <section className={s.section} id="behavior">
        <header className={s.sectionHead}>
          <p className={`${s.hand} ${s.sectionKicker}`}>01 / {language === 'de' ? 'Verhalten' : 'Behavior'}</p>
          <h2>{t.behaviorsTitle}</h2>
          <p>{t.behaviorsIntro}</p>
        </header>
        <div className={s.behaviorPlayground}>
          <div className={s.behaviorCompanion}>
            <ClippyStage language={language} large controls={false} interactive={false} trigger={signal} />
            <p className={s.behaviorScene} aria-live="polite">{trace ? `${language === 'de' ? 'Szene' : 'Scene'} · ${animationLabels[language][trace.animation] || trace.animation}` : (language === 'de' ? 'Wähle eine Situation' : 'Choose a situation')}</p>
          </div>
          <div className={s.behaviorGrid}>
          {[
            { animation: 'waving', event: 'interaction.greeting.started', label: t.hello, note: t.behaviorNotes[0] },
            { animation: 'thinking', event: 'conversation.sending', label: t.ask, note: t.behaviorNotes[1] },
            { animation: 'sleeping', event: 'idle.sleeping-threshold', label: t.leave, note: t.behaviorNotes[2] },
            { animation: 'dizzy', event: 'window.shaken', label: t.move, note: t.behaviorNotes[3] },
          ].map((item, index) => (
            <button className={s.behaviorCard} type="button" key={item.event} onClick={() => say(item.animation, item.event, language === 'de' ? ['Begrüßung → winken', 'Anfrage → nachdenken', 'Inaktivität → schlafen', 'Fensterbewegung → Schwindelreaktion'][index] : `behavior.${['greeting', 'conversation.thinking', 'sleep.sleeping', 'window.shake'][index]} → ${item.animation}`)}>
              <span className={`${s.hand} ${s.cardNumber}`}>0{index + 1}</span>
              <strong>{item.label}</strong>
              <span>{item.note}</span>
              <span className={s.tryLabel}>{language === 'de' ? 'Ausprobieren →' : 'Try it →'}</span>
            </button>
          ))}
          </div>
        </div>
        {trace && <div className={s.trace} aria-live="polite"><span className={s.traceLabel}>{t.trace}</span><code>{trace.event}</code><span>→ {trace.decision}</span></div>}
      </section>

      <section className={`${s.section} ${s.desktopSection}`}>
        <header className={s.sectionHead}>
          <p className={`${s.hand} ${s.sectionKicker}`}>02 / {language === 'de' ? 'Umgebung' : 'Environment'}</p>
          <h2>{t.environmentTitle}</h2>
          <p>{t.environmentIntro}</p>
        </header>
        <div className={s.desktopDemo}>
          <div className={s.desktopMock}>
            <div className={s.desktopBar}><span /><span /><span /><b>{language === 'de' ? 'Clippy · lokale Signale' : 'Clippy · local signals'}</b></div>
            <div className={s.desktopBody}>
              <div className={s.desktopMenu}>{(language === 'de' ? ['Heute', 'Aufgaben', 'Gedächtnis', 'Einstellungen'] : ['Today', 'Tasks', 'Memory', 'Settings']).map((item) => <span key={item}>{item}</span>)}</div>
              <div className={s.desktopPanel}>
                <p className={s.panelLabel}>{language === 'de' ? 'LOKALE WAHRNEHMUNG' : 'LOCAL AWARENESS'}</p>
                <label className={s.rangeLabel}>{t.battery}<output>{battery}%</output><input type="range" min="0" max="100" value={battery} onChange={(e) => setBattery(Number(e.target.value))} /></label>
                <label className={s.rangeLabel}>{t.brightness}<output>{brightness}%</output><input type="range" min="0" max="100" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} /></label>
                <label className={s.toggleLine}><input type="checkbox" checked={power} onChange={(e) => setPower(e.target.checked)} />{t.power}</label>
                <button type="button" className={s.actionButton} onClick={applyEnvironment}>{t.apply}</button>
                <div className={s.simActions}>
                  <button type="button" onClick={() => say('sleeping', 'idle.timer.elapsed', idleTrace[language])}>{t.idle}</button>
                  <button type="button" onClick={() => say('dizzy', 'window.shaken', language === 'de' ? 'Fensterbewegung → Schwindelreaktion' : 'window shake → dizzy reaction')}>{t.shake}</button>
                </div>
                <p className={s.sampleNote}>{t.simulated}</p>
              </div>
            </div>
          </div>
          <aside className={s.tracePanel}>
            <ClippyStage language={language} large controls={false} interactive={false} trigger={signal} />
            <div className={s.traceCopy}>
              <p className={s.panelLabel}>{t.trace}</p>
              {trace ? <><code>{trace.event}</code><strong>{trace.decision}</strong><span>{language === 'de' ? 'Szene' : 'Scene'}: {animationLabels[language][trace.animation] || trace.animation}</span></> : <p>{t.traceEmpty}</p>}
            </div>
          </aside>
        </div>
      </section>

      <section className={s.section}>
        <header className={s.sectionHead}>
          <p className={`${s.hand} ${s.sectionKicker}`}>03 / {language === 'de' ? 'Aktionen' : 'Actions'}</p>
          <h2>{t.actionTitle}</h2>
          <p>{t.actionIntro}</p>
        </header>
        <div className={s.taskDemo}>
          <div className={s.taskPicker} role="group" aria-label={t.actionTitle}>
            {t.scenarioNames.map((name, index) => <button key={name} type="button" aria-pressed={scenario === index} data-on={scenario === index} onClick={() => { setScenario(index); setRan(false); }}>{name}</button>)}
          </div>
          <div className={s.taskCard}>
            <div className={s.taskPrompt}><span>{t.sample}</span><h3>{scenario >= 0 ? scenarios[scenario].title : t.daily}</h3><button type="button" className={s.actionButton} onClick={runScenario} disabled={scenario < 0}>{t.run}</button></div>
            <div className={s.flow}>
              {(scenario >= 0 ? scenarios[scenario].nodes : scenarios[0].nodes).map((node, index) => <div className={s.flowStep} data-complete={ran ? 'true' : 'false'} key={node}><span>0{index + 1}</span><p>{node}</p></div>)}
            </div>
            {ran && (
              <div className={s.taskOutcome}>
                <ClippyStage language={language} large controls={false} interactive={false} trigger={signal} />
                <p className={s.taskResult} aria-live="polite">{scenarios[scenario].result}</p>
              </div>
            )}
            <p className={s.sampleNote}>{language === 'de' ? 'Beispieldaten · keine echten Dateien, Erinnerungen oder Werkzeuge' : 'Sample data · no real files, reminders, or tools'}</p>
          </div>
        </div>
      </section>

      <section className={`${s.section} ${s.memorySection}`}>
        <header className={s.sectionHead}>
          <p className={`${s.hand} ${s.sectionKicker}`}>04 / {language === 'de' ? 'Gedächtnis' : 'Memory'}</p>
          <h2>{t.memoryTitle}</h2>
          <p>{t.memoryIntro}</p>
        </header>
        <div className={s.memoryWalkthrough}>
          <aside className={s.memoryControls}>
            <p className={s.panelLabel}>{language === 'de' ? 'GEDÄCHTNISPFAD' : 'MEMORY INPUT PATH'}</p>
            <div className={s.memoryModes} role="group" aria-label={language === 'de' ? 'Gedächtnispfad auswählen' : 'Choose a memory path'}>
              {t.memoryModes.map((mode, index) => <button key={mode} type="button" aria-pressed={memoryMode === index} data-on={memoryMode === index} onClick={() => setMemoryMode(index)}>{mode}</button>)}
            </div>
            <p className={s.memoryModeText}>{t.memoryModeText[memoryMode]}</p>
            <p className={s.panelLabel}>{t.memoryScopeTitle}</p>
            <div className={s.memoryScopes} role="group" aria-label={t.memoryScopeTitle}>
              {t.memoryScopes.map((scope, index) => <button key={scope} type="button" aria-pressed={memoryScope === index} data-on={memoryScope === index} onClick={() => setMemoryScope(index)}>{scope}</button>)}
            </div>
            <p className={s.scopeNote}>{language === 'de' ? 'Der ausgewählte Bereich bestimmt die Graph-Gruppe; die Suche bleibt auf erlaubte Bereiche beschränkt.' : 'The selected scope maps to a graph group; retrieval stays limited to allowed scopes.'}</p>
          </aside>
          <div className={s.memoryPipeline}>
            <p className={s.panelLabel}>{t.memoryPipelineLabel}</p>
            <ol>
              {t.memoryFlow.map(([title, description], index) => <li key={title}><span>0{index + 1}</span><h3>{title.slice(5)}</h3><p>{description}</p></li>)}
            </ol>
          </div>
        </div>
        <div className={s.memoryLayers}>
          {t.memoryStores.map((store, index) => <div key={store}><span>{store}</span><b>{t.memoryStoreDetails[index]}</b></div>)}
        </div>
        <p className={s.memoryFootnote}>{t.memoryFootnote}</p>
      </section>

      <section className={`${s.section} ${s.engineeringSection}`}>
        <header className={s.sectionHead}>
          <p className={`${s.hand} ${s.sectionKicker}`}>05 / {language === 'de' ? 'Technik' : 'Engineering'}</p>
          <h2>{t.underTitle}</h2>
          <p>{t.underIntro}</p>
        </header>
        <div className={s.architecture}>
          <div className={s.architectureTabs} role="group" aria-label={t.underTitle}>
            {t.architecture.map((name, index) => <button key={name} type="button" aria-pressed={architecture === index} data-on={architecture === index} onClick={() => setArchitecture(index)}>{name}<span>0{index + 1}</span></button>)}
          </div>
          <article className={s.architectureDetail}>
            <span className={`${s.hand} ${s.cardNumber}`}>0{architecture + 1}</span>
            <h3>{t.architecture[architecture]}</h3>
            <p>{t.architectureText[architecture]}</p>
            <p className={s.stackLine}>{t.architectureStack[architecture]}</p>
          </article>
        </div>
        <div className={s.systemMap}>
          <p className={s.panelLabel}>{t.diagramLabel}</p>
          <div>{t.diagram.map((item, index) => <span key={item}>{item}{index < t.diagram.length - 1 && <b aria-hidden="true">→</b>}</span>)}</div>
        </div>
        <div className={s.engineeringNotes}>
          <p><b>01</b> {language === 'de' ? 'Ereignisse werden priorisiert und mit Sperrzeiten geplant, damit Reaktionen nicht willkürlich wirken.' : 'Events are prioritized and scheduled with cooldowns, so reactions feel considered instead of random.'}</p>
          <p><b>02</b> {language === 'de' ? 'Werkzeuge und Spezialagenten sind typisiert; Freigaben bleiben eine eigene Entscheidung.' : 'Tools and specialist agents are typed; approval stays a separate decision.'}</p>
          <p><b>03</b> {language === 'de' ? 'Die Sprite-Pipeline erhält Frame-Ausrichtung und Transparenz über große Animationssätze hinweg.' : 'The sprite pipeline preserves frame alignment and transparency across large animation sets.'}</p>
        </div>
      </section>

      <section className={`${s.section} ${s.makingSection}`}>
        <header className={s.sectionHead}>
          <p className={`${s.hand} ${s.sectionKicker}`}>06 / {language === 'de' ? 'Prozess' : 'Process'}</p>
          <h2>{t.makingTitle}</h2>
          <p>{t.makingIntro}</p>
        </header>
        <div className={s.processGrid}>
          {[
            ['/rv/clippy-process/original-sheet.png', t.makingCaptions[0], 1536, 1024],
            ['/rv/clippy-process/character-sheet.png', t.makingCaptions[1], 1536, 1024],
            ['/rv/clippy-process/front-view.png', t.makingCaptions[2], 1254, 1254],
          ].map(([src, caption, width, height]) => <figure key={src}><Image src={src} alt={caption} width={width} height={height} sizes="(max-width: 760px) 90vw, 30vw" /><figcaption>{caption}</figcaption></figure>)}
        </div>
      </section>

      <section className={s.nextSection}>
        <p className={`${s.hand} ${s.sectionKicker}`}>07 / {language === 'de' ? 'Ausblick' : 'Roadmap'}</p>
        <h2>{t.nextTitle}</h2>
        <p>{t.nextIntro}</p>
        <ul>{t.nextItems.map((item) => <li key={item}>{item}<span>{language === 'de' ? 'In Arbeit' : 'In progress'}</span></li>)}</ul>
        <Link href={`${t.home}#works`} className={s.backLink}>← {t.back}</Link>
      </section>

    </main>
  );
}
