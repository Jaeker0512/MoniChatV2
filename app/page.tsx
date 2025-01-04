import Login from '@/components/Login'

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0014]">
      <div className="relative flex w-full flex-1 flex-col items-center justify-center gap-10 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1B2735_0%,#090A0F_50%,#0a0014_100%)]" />
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:100px_100px] [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="container relative z-20 flex max-w-[64rem] flex-col items-center gap-8">
          <Login />
        </div>
      </div>
    </div>
  )
}

