declare module 'lucide-react' {
  import { FC, SVGProps } from 'react'

  interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string
    color?: string
    strokeWidth?: number | string
  }

  type Icon = FC<IconProps>

  export const Send: Icon
  export const Image: Icon
  export const Paperclip: Icon
  export const MessageCircle: Icon
  export const LogOut: Icon
  export const Star: Icon
  export const StarHalf: Icon
  export const Sun: Icon
  export const MoonStar: Icon
  export const CloudSnow: Icon
  export const Flower2: Icon
  export const CloudSun: Icon
  export const CloudDrizzle: Icon
} 