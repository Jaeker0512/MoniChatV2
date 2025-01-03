import Login from '@/components/Login'

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0014]">
      <div className="relative flex w-full flex-1 flex-col items-center justify-center gap-10 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1B2735_0%,#090A0F_50%,#0a0014_100%)]" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars-small" />
          <div className="stars-medium" />
          <div className="stars-large" />
          <div className="meteor" />
          <div className="meteor" />
          <div className="meteor" />
          <div className="absolute right-[-150px] top-1/2 transform -translate-y-1/2 opacity-80">
            <div className="earth" style={{ width: '500px', height: '500px' }}>
              <div className="atmosphere" style={{ width: '520px', height: '520px', top: '-10px', left: '-10px' }} />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#ff4f9e]/20 via-[#9373FF]/20 to-[#4F46E5]/20 blur-[80px] animate-space-float mix-blend-screen" />
          <div className="absolute bottom-[30%] right-[20%] w-[35%] h-[35%] rounded-full bg-gradient-to-tr from-[#4F46E5]/30 via-[#9373FF]/20 to-[#ff4f9e]/20 blur-[100px] animate-space-float-reverse mix-blend-screen" />
          <div className="absolute top-[40%] right-[30%] w-[25%] h-[25%] rounded-full bg-[#ffffff]/10 blur-[50px] animate-pulse mix-blend-screen" />
        </div>
        <div className="container relative z-20 flex max-w-[64rem] flex-col items-center gap-8">
          <Login />
        </div>
      </div>
    </div>
  )
}

