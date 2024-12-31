import { SVGProps } from 'react'

export function MushroomIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 13C3 8.02944 7.02944 4 12 4C16.9706 4 21 8.02944 21 13H3Z"
        fill="currentColor"
      />
      <rect x="9" y="13" width="6" height="7" fill="currentColor" />
      <circle cx="9" cy="10" r="1.5" fill="white" />
      <circle cx="15" cy="10" r="1.5" fill="white" />
    </svg>
  )
} 