interface Props {
  size?: number
  className?: string
  spin?: boolean
}

export default function Logo({ size = 32, className = '', spin = true }: Props) {
  return (
    <img
      src="/logo.png"
      alt="BeLegal"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`object-contain select-none ${spin ? 'belegal-logo-spin' : ''} ${className}`}
      draggable={false}
    />
  )
}
