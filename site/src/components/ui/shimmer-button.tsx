// Adapted from Magic UI "Shimmer Button" (MIT, magicui.design), also listed on 21st.dev.
import type { CSSProperties, ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Props = {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  shimmerColor?: string
  shimmerSize?: string
  shimmerDuration?: string
  background?: string
  external?: boolean
}

/** A pill whose border carries a travelling spark. Renders <a> when given href, else <button>. */
export function ShimmerButton({
  children,
  href,
  onClick,
  className,
  external,
  shimmerColor = '#f2a65a',
  shimmerSize = '0.09em',
  shimmerDuration = '3.2s',
  background = 'rgb(28 22 16)',
}: Props) {
  const style = {
    '--spread': '90deg',
    '--shimmer-color': shimmerColor,
    '--radius': '999px',
    '--speed': shimmerDuration,
    '--cut': shimmerSize,
    '--bg': background,
  } as CSSProperties
  const cls = cn(
    'group relative z-0 inline-flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap [border-radius:var(--radius)] border border-white/10 text-ink [background:var(--bg)]',
    'transform-gpu transition-transform duration-500 ease-soft active:scale-[0.98]',
    className,
  )
  const inner = (
    <>
      <span className="absolute inset-0 -z-30 overflow-visible blur-[2px] [container-type:size]" aria-hidden>
        <span className="animate-shimmer-slide absolute inset-0 aspect-square h-[100cqh] rounded-none [mask:none]">
          <span className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
        </span>
      </span>
      {children}
      <span
        aria-hidden
        className="absolute inset-0 rounded-[inherit] shadow-[inset_0_-8px_10px_#ffffff12] transition-shadow duration-500 ease-soft group-hover:shadow-[inset_0_-6px_14px_#f2a65a40]"
      />
      <span aria-hidden className="absolute inset-(--cut) -z-20 [border-radius:var(--radius)] [background:var(--bg)]" />
    </>
  )
  return href ? (
    <a href={href} style={style} className={cls} onClick={onClick} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {inner}
    </a>
  ) : (
    <button type="button" style={style} className={cls} onClick={onClick}>
      {inner}
    </button>
  )
}
