import type { ReactNode } from 'react'
import { ArrowDown, ArrowUpRight, EnvelopeSimple, FileArrowDown, GithubLogo, LinkedinLogo } from '@phosphor-icons/react'
import { chapters, experience, profile, projects, skills, type Project } from '../data'
import { GhostButton, IconLink, PrimaryButton, SignatureButton, Tag } from './Buttons'
import { BorderBeam } from '../components/ui/border-beam'
import { TextEffect } from '../components/ui/text-effect'
import { TextScramble } from '../components/ui/text-scramble'

type PanelRef = (i: number) => (el: HTMLDivElement | null) => void
type Shared = { panelRef: PanelRef; active: number; started: boolean }

function Chapter({
  index,
  side,
  panelRef,
  children,
  labelledBy,
  width = 'max-w-[500px]',
}: {
  index: number
  side: 'left' | 'right'
  panelRef: PanelRef
  children: ReactNode
  labelledBy: string
  width?: string
}) {
  const c = chapters[index]
  return (
    <section id={c.id} aria-labelledby={labelledBy} className="chapter h-[180svh] max-[860px]:h-[150svh]">
      <div ref={panelRef(index)} className={`panel ${side === 'left' ? 'scrim-left' : 'scrim-right'}`} style={{ opacity: index === 0 ? 1 : 0 }}>
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-24 sm:px-8 lg:px-20 min-[861px]:pb-0 min-[861px]:pt-16">
          <div className={`w-full ${width} ${side === 'right' ? 'min-[861px]:ml-auto min-[861px]:mr-10' : ''}`}>{children}</div>
        </div>
      </div>
    </section>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 max-[860px]:hidden">
      {items.map((p) => (
        <li key={p} className="flex gap-3 text-[14px] leading-snug text-mute">
          <span className="mt-[0.6em] h-px w-4 shrink-0 bg-accent" aria-hidden />
          {p}
        </li>
      ))}
    </ul>
  )
}

function Hero({ panelRef, started, onWork }: Shared & { onWork: () => void }) {
  return (
    <Chapter index={0} side="left" panelRef={panelRef} labelledBy="hero-title" width="max-w-[860px]">
      <span className="inline-flex items-center gap-2.5 rounded-full bg-white/[0.06] py-1 pl-2.5 pr-3.5 text-[13px] text-mute shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06)]">
        <span className="relative flex h-2 w-2" aria-hidden>
          <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full bg-accent" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
        Open to full-stack and frontend roles
      </span>
      <TextScramble
        as="h1"
        id="hero-title"
        trigger={started}
        duration={1.1}
        className="mt-6 cursor-default whitespace-nowrap text-[clamp(2.6rem,6.3vw,6.1rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-ink"
      >
        {profile.name}
      </TextScramble>
      <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-mute">
        Full-stack developer and CSE student at VIT Chennai. <span className="text-ink">{profile.tagline}</span>
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-3">
        <SignatureButton onClick={onWork} icon={ArrowDown}>
          View work
        </SignatureButton>
        <GhostButton href={profile.resume} icon={FileArrowDown} download>
          Resume
        </GhostButton>
      </div>
    </Chapter>
  )
}

function About({ panelRef, active }: Shared) {
  const facts = [
    ['Studying', 'B.Tech CSE at VIT Chennai, class of 2029'],
    ['Off hours', 'Hackathons, and whatever problem comes next'],
    ['Looking for', 'Full-stack and frontend roles'],
  ]
  const on = active === 1
  return (
    <Chapter index={1} side="right" panelRef={panelRef} labelledBy="about-title" width="max-w-[640px]">
      <div className="bezel relative">
        <BorderBeam play={on} duration={12} />
        <div className="bezel-core p-4 sm:p-5">
          <div className="grid grid-cols-[42%_1fr] items-center gap-4 min-[861px]:grid-cols-[230px_1fr] min-[861px]:items-stretch min-[861px]:gap-6">
            <div className="relative overflow-hidden rounded-[1.15rem]">
              <img
                src={profile.photo}
                alt="A Rohit Vishwa at his desk"
                width={880}
                height={880}
                className="aspect-[4/5] h-full w-full object-cover object-[50%_30%] transition-transform duration-1000 ease-soft hover:scale-[1.04]"
              />
              <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]" />
            </div>
            <div className="flex flex-col justify-center min-[861px]:py-2 min-[861px]:pr-2">
              <TextEffect as="h2" id="about-title" show={on} className="text-[1.6rem] font-semibold leading-[1.05] tracking-[-0.035em] min-[861px]:text-[2.1rem]">
                I love the process of building.
              </TextEffect>
              <p className="mt-4 text-[15px] leading-relaxed text-mute max-[860px]:hidden">
                From architecture decisions to the small UI details that make something feel finished. Since my internship at the India
                Meteorological Department I've shipped three full-stack projects across health-tech, finance and AI travel planning.
              </p>
            </div>
          </div>
          <p className="mt-4 px-1 text-[14px] leading-relaxed text-mute min-[861px]:hidden">
            From architecture decisions to the small UI details that make something feel finished. Three full-stack projects shipped since my IMD internship.
          </p>
          <dl className="mt-5 grid grid-cols-3 gap-x-5 border-t border-white/[0.06] px-1 pt-4 pb-1 max-[860px]:hidden">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[12px] text-faint">{k}</dt>
                <dd className="mt-1 text-[14px] leading-snug text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Chapter>
  )
}

function Experience({ panelRef, active }: Shared) {
  return (
    <Chapter index={2} side="left" panelRef={panelRef} labelledBy="imd-title">
      <p className="font-mono text-[13px] text-accent">Internship</p>
      <TextEffect as="h2" id="imd-title" show={active === 2} className="mt-3 text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl">
        Making weather codes readable.
      </TextEffect>
      <p className="mt-4 text-[14px] leading-snug text-ink">{experience.context}</p>
      <p className="mt-4 text-[15px] leading-relaxed text-mute">{experience.summary}</p>
      <div className="mt-5">
        <Bullets items={experience.points} />
      </div>
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <GhostButton href={experience.code} icon={GithubLogo} external>
          Code
        </GhostButton>
        <div className="flex flex-wrap gap-2">
          {experience.stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
      </div>
    </Chapter>
  )
}

function ProjectPanel({ p, index, side, panelRef, active }: Shared & { p: Project; index: number; side: 'left' | 'right' }) {
  const on = active === index
  return (
    <Chapter index={index} side={side} panelRef={panelRef} labelledBy={`${p.id}-title`}>
      <article className="bezel relative">
        <BorderBeam play={on} delay={index} />
        <div className="bezel-core overflow-hidden">
          {p.image && (
            <a
              href={p.live}
              target="_blank"
              rel="noreferrer"
              tabIndex={-1}
              aria-hidden
              className="group relative block overflow-hidden rounded-t-[calc(1.75rem-0.375rem)]"
            >
              <img
                src={p.image}
                alt=""
                width={1200}
                height={750}
                loading="lazy"
                className="shot w-full object-cover object-top opacity-90 transition-[transform,opacity] duration-1000 ease-soft group-hover:scale-[1.04] group-hover:opacity-100"
              />
              <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[rgb(20_19_23)] to-transparent" />
            </a>
          )}
          <div className="p-6 sm:p-7">
            <p className="font-mono text-[13px] text-accent">{p.context}</p>
            <TextScramble as="h2" id={`${p.id}-title`} trigger={on} className="mt-2 cursor-default text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              {p.name}
            </TextScramble>
            <p className="mt-3 text-[15px] leading-relaxed text-mute">{p.summary}</p>
            <div className="mt-4 [@media(max-height:820px)]:hidden">
              <Bullets items={p.points} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {p.live && (
                <PrimaryButton href={p.live} external>
                  Live site
                </PrimaryButton>
              )}
              <GhostButton href={p.code} icon={GithubLogo} external>
                Code
              </GhostButton>
            </div>
          </div>
        </div>
      </article>
    </Chapter>
  )
}

function Toolkit({ panelRef, active }: Shared) {
  return (
    <Chapter index={6} side="left" panelRef={panelRef} labelledBy="skills-title">
      <TextEffect as="h2" id="skills-title" show={active === 6} className="text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl">
        The toolkit.
      </TextEffect>
      <p className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-mute">What I reach for when an idea needs to become something people can use.</p>
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        {skills.map((g) => (
          <div key={g.group}>
            <h3 className="font-mono text-[12px] text-faint">{g.group}</h3>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <span
                  key={s}
                  className="cursor-default rounded-full bg-white/[0.06] px-3 py-1 text-[13px] text-ink transition-[background-color,color,transform] duration-500 ease-soft hover:-translate-y-0.5 hover:bg-accent hover:text-accent-ink"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Chapter>
  )
}

function Contact({ panelRef, active }: Shared) {
  return (
    <Chapter index={7} side="right" panelRef={panelRef} labelledBy="contact-title">
      <TextEffect as="h2" id="contact-title" show={active === 7} className="text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl">
        I'd love to hear from you.
      </TextEffect>
      <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed text-mute">
        Whether it's a role, a project, feedback on my work or just a hello, my inbox is always open. I'm still learning, and every
        conversation helps.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <SignatureButton href={`mailto:${profile.email}`} icon={EnvelopeSimple}>
          Email me
        </SignatureButton>
        <IconLink href={profile.linkedin} label="LinkedIn" icon={LinkedinLogo} />
        <IconLink href={profile.github} label="GitHub" icon={GithubLogo} />
        <GhostButton href={profile.resume} icon={FileArrowDown} download>
          Resume
        </GhostButton>
      </div>
      <a
        href={`mailto:${profile.email}`}
        className="group mt-6 inline-flex items-center gap-1.5 font-mono text-[13px] text-mute transition-colors hover:text-accent"
      >
        {profile.email}
        <ArrowUpRight size={13} className="transition-transform duration-500 ease-soft group-hover:-translate-y-px group-hover:translate-x-0.5" />
      </a>
      <p className="mt-12 text-[12px] text-faint">© 2026 A Rohit Vishwa. Built with React Three Fiber and Lenis.</p>
    </Chapter>
  )
}

export default function Chapters({ onWork, ...shared }: Shared & { onWork: () => void }) {
  return (
    <main>
      <Hero {...shared} onWork={onWork} />
      <About {...shared} />
      <Experience {...shared} />
      <ProjectPanel {...shared} p={projects[0]} index={3} side="right" />
      <ProjectPanel {...shared} p={projects[1]} index={4} side="left" />
      <ProjectPanel {...shared} p={projects[2]} index={5} side="right" />
      <Toolkit {...shared} />
      <Contact {...shared} />
    </main>
  )
}
