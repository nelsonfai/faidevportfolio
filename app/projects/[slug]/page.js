import Link from 'next/link';
import { notFound } from 'next/navigation';
import { caseStudies } from '../../projects-data';
import MermaidDiagram from '../../components/MermaidDiagram';

export function generateStaticParams() {
  return Object.keys(caseStudies).map((slug) => ({ slug }));
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const project = caseStudies[slug];
  if (!project) notFound();
  return <main className="case-study-page"><nav className="nav case-study-nav"><Link href="/"><div className="logo"><h2>&lt;fai/&gt;</h2></div></Link><Link href="/#project" className="case-study-back">← Selected work</Link></nav><article className="case-study"><header className="case-study-hero"><p className="case-study-eyebrow">{project.eyebrow}</p><h1>{project.title}</h1><p className="case-study-intro">{project.intro}</p><div className="case-study-meta"><div><span>Role</span><strong>{project.role}</strong></div><div><span>Area</span><strong>{project.area}</strong></div>{project.stack && <div><span>Stack</span><strong>{project.stack}</strong></div>}</div></header>{project.image && <img className="case-study-image" src={project.image} alt={project.title} />}<div className="case-study-content">{project.sections.map(([title, content, diagram], index) => <section key={title}><p className="case-study-number">{String(index + 1).padStart(2, '0')}</p><h2>{title}</h2><p>{content}</p>{diagram && <MermaidDiagram chart={diagram} />}</section>)}</div></article></main>;
}
