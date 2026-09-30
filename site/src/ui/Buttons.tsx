import type { ComponentType, ReactNode } from 'react'
import { ArrowUpRight, type IconProps } from '@phosphor-icons/react'
import { Magnetic } from '../components/ui/magnetic'
import { ShimmerButton } from '../components/ui/shimmer-button'

type Common = {
  children: ReactNode
  href?: string
  onClick?: () => void
  icon?: ComponentType<IconProps>
  download?: boolean
  external?: boolean
}

function linkProps({ href, external, download }: Common) {
  return {
    href,
    ...(external ? { target: '_blank', rel: 'noreferrer' } : {}),
    ...(download ? { download: '' } : {}),
  }
}

/** The nested icon circle that nudges up and right on hover. */
function IconDot({ icon: Icon, tone }: { icon: ComponentType<IconProps>; tone: 'dark' | 'light' }) {
  return (
    <span
      className={`relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-transform duration-500 ease-soft group-hover:scale-105 ${
        tone === 'dark' ? 'bg-accent-ink/10' : 'bg-accent text-accent-ink'
      }`}
    >
      <Icon size={16} weight="bold" className="transition-transform duration-500 ease-soft group-hover:-translate-y-[2px] group-hover:translate-x-[2px]" />
    </span>
  )
}

/** Solid amber pill with the trailing icon in its own circle. */
export function PrimaryButton(props: Common) {
  const Tag = props.href ? 'a' : 'button'
  return (
    <Magnetic>
      <Tag
        {...(props.href ? linkProps(props) : { type: 'button' as const })}
        onClick={props.onClick}
        className="group relative inline-flex items-center gap-3 overflow-hidden whitespace-nowrap rounded-full bg-accent py-1.5 pl-5 pr-1.5 text-[15px] font-medium text-accent-ink transition-transform duration-500 ease-soft active:scale-[0.98]"
      >
        {/* light sweep on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 transition-[transform,opacity] duration-700 ease-soft group-hover:translate-x-[300%] group-hover:opacity-100"
        />
        <span className="relative">{props.children}</span>
        <IconDot icon={props.icon ?? ArrowUpRight} tone="dark" />
      </Tag>
    </Magnetic>
  )
}

/** Dark pill with a spark travelling around its border. Reserved for the main call on a screen. */
export function SignatureButton(props: Common) {
  const Icon = props.icon ?? ArrowUpRight
  return (
    <Magnetic>
      <ShimmerButton href={props.href} onClick={props.onClick} external={props.external} className="gap-3 py-1.5 pl-5 pr-1.5 text-[15px] font-medium">
        <span className="relative">{props.children}</span>
        <IconDot icon={Icon} tone="light" />
      </ShimmerButton>
    </Magnetic>
  )
}

export function GhostButton(props: Common) {
  const Icon = props.icon
  const Tag = props.href ? 'a' : 'button'
  return (
    <Magnetic>
      <Tag
        {...(props.href ? linkProps(props) : { type: 'button' as const })}
        onClick={props.onClick}
        className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-[15px] text-ink shadow-[inset_0_0_0_1px_rgb(255_255_255/0.14)] transition-[background-color,box-shadow,transform] duration-500 ease-soft hover:bg-white/[0.06] hover:shadow-[inset_0_0_0_1px_rgb(242_166_90/0.5)] active:scale-[0.98]"
      >
        {Icon && <Icon size={17} weight="light" className="text-mute transition-colors duration-500 group-hover:text-accent" />}
        {props.children}
      </Tag>
    </Magnetic>
  )
}

/** Round icon-only link, labelled for screen readers. */
export function IconLink({ href, label, icon: Icon }: { href: string; label: string; icon: ComponentType<IconProps> }) {
  return (
    <Magnetic intensity={0.4}>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        title={label}
        className="flex h-11 w-11 items-center justify-center rounded-full text-ink shadow-[inset_0_0_0_1px_rgb(255_255_255/0.14)] transition-[background-color,color,box-shadow,transform] duration-500 ease-soft hover:bg-white/[0.06] hover:text-accent hover:shadow-[inset_0_0_0_1px_rgb(242_166_90/0.5)] active:scale-95"
      >
        <Icon size={20} weight="light" />
      </a>
    </Magnetic>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-white/[0.05] px-3 py-1 font-mono text-[12px] text-mute">{children}</span>
}
