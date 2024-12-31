declare module 'lucide-react' {
  import { FC, SVGProps, ComponentType } from 'react'

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
  export const MessageSquare: Icon
  export const User: Icon
  export const Settings: Icon
  export const Moon: Icon
  export const Menu: Icon
  export const Plus: Icon
  export const X: Icon
  export const PanelLeftClose: ComponentType<{
    color?: string
    size?: number | string
    strokeWidth?: number | string
    className?: string
  }>
} 