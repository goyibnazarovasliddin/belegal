import type { SVGProps } from 'react'

type Props = SVGProps<SVGSVGElement>

const base: Props = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
}

export const ScaleIcon = (p: Props) => (
  <svg {...base} {...p}><path d="M12 3v18M5 21h14M7 7l-3 7a3.5 3.5 0 007 0L8 7M16 7l-3 7a3.5 3.5 0 007 0l-3-7M5 7h14M12 3l-7 4M12 3l7 4" /></svg>
)

export const PlusIcon = (p: Props) => (
  <svg {...base} strokeWidth={2} {...p}><path d="M12 5v14M5 12h14" /></svg>
)

export const SearchIcon = (p: Props) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
)

export const DocumentIcon = (p: Props) => (
  <svg {...base} {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" /><path d="M14 2v6h6M8 13h8M8 17h8M8 9h2" /></svg>
)

export const DocumentsIcon = (p: Props) => (
  <svg {...base} {...p}><path d="M9 2h6l5 5v11a2 2 0 01-2 2H9a2 2 0 01-2-2V4a2 2 0 012-2z" /><path d="M14 2v5h5M4 8v12a2 2 0 002 2h9" /></svg>
)

export const SettingsIcon = (p: Props) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" /></svg>
)

export const LogoutIcon = (p: Props) => (
  <svg {...base} {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
)

export const TrashIcon = (p: Props) => (
  <svg {...base} strokeWidth={2} {...p}><path d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M10 6V4a2 2 0 012-2h0a2 2 0 012 2v2" /></svg>
)

export const ChevronRightIcon = (p: Props) => (
  <svg {...base} strokeWidth={2} {...p}><path d="M9 18l6-6-6-6" /></svg>
)

export const ChevronDownIcon = (p: Props) => (
  <svg {...base} strokeWidth={2} {...p}><path d="M6 9l6 6 6-6" /></svg>
)

export const ArrowLeftIcon = (p: Props) => (
  <svg {...base} strokeWidth={2} {...p}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
)

export const ArrowRightIcon = (p: Props) => (
  <svg {...base} strokeWidth={2} {...p}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
)

export const SendIcon = (p: Props) => (
  <svg {...base} strokeWidth={2} {...p}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
)

export const CheckIcon = (p: Props) => (
  <svg {...base} strokeWidth={2.5} {...p}><path d="M5 13l4 4L19 7" /></svg>
)

export const XIcon = (p: Props) => (
  <svg {...base} strokeWidth={2} {...p}><path d="M18 6L6 18M6 6l12 12" /></svg>
)

export const ClockIcon = (p: Props) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)

export const BoltIcon = (p: Props) => (
  <svg {...base} {...p}><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" /></svg>
)

export const BookIcon = (p: Props) => (
  <svg {...base} {...p}><path d="M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>
)

export const LockIcon = (p: Props) => (
  <svg {...base} {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>
)

export const ChatBubbleIcon = (p: Props) => (
  <svg {...base} {...p}><path d="M21 12c0 4.4-4 8-9 8a9.8 9.8 0 01-4-.8L3 21l1.8-5A8 8 0 013 12c0-4.4 4-8 9-8s9 3.6 9 8z" /></svg>
)

export const PhoneIcon = (p: Props) => (
  <svg {...base} {...p}><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.5 2.1L7.9 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.8.5 2.7.6a2 2 0 011.7 2z" /></svg>
)

export const ShieldCheckIcon = (p: Props) => (
  <svg {...base} {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
)

export const ClipboardIcon = (p: Props) => (
  <svg {...base} {...p}><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2M9 12l2 2 4-4" /></svg>
)

export const BriefcaseIcon = (p: Props) => (
  <svg {...base} {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>
)

export const DownloadIcon = (p: Props) => (
  <svg {...base} {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
)

export const BellIcon = (p: Props) => (
  <svg {...base} {...p}><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" /></svg>
)

export const FolderIcon = (p: Props) => (
  <svg {...base} {...p}><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" /></svg>
)

export const GlobeIcon = (p: Props) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" /></svg>
)

export const BuildingIcon = (p: Props) => (
  <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 22V12h6v10M3 9h18M9 6h.01M15 6h.01" /></svg>
)

export const GavelIcon = (p: Props) => (
  <svg {...base} {...p}><path d="M14 12l-8.5 8.5a2.1 2.1 0 11-3-3L11 9M17 6l3 3M9 11l4-4M19 13l-3 3M16 6l2-2M16 6l3 3-3 3-3-3 3-3z" /></svg>
)

export const HardHatIcon = (p: Props) => (
  <svg {...base} {...p}><path d="M2 18h20M4 18a8 8 0 0116 0M9 18V8M15 18V8M9 8h6" /></svg>
)

export const ScrollIcon = (p: Props) => (
  <svg {...base} {...p}><path d="M19 17V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2zM19 17v2a2 2 0 002 2h0a2 2 0 002-2v-2h-4z" /><path d="M7 7h8M7 11h8M7 15h5" /></svg>
)

export const HomeIcon = (p: Props) => (
  <svg {...base} {...p}><path d="M3 11l9-8 9 8M5 9v11a1 1 0 001 1h12a1 1 0 001-1V9" /></svg>
)

export const StarIcon = (p: Props) => (
  <svg {...base} {...p}><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9 12 2" /></svg>
)

export const SparklesIcon = (p: Props) => (
  <svg {...base} {...p}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zM5 17l.7 2L8 20l-2.3.7L5 23l-.7-2.3L2 20l2.3-.7L5 17z" /></svg>
)

export const UserIcon = (p: Props) => (
  <svg {...base} {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
)
