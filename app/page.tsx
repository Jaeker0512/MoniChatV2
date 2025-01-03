import Login from '@/components/Login'

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black">
      <div className="relative flex w-full flex-1 flex-col items-center justify-center gap-10 px-4">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:100px_100px] [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 via-purple-500/30 to-pink-500/30" />
        <div className="container relative z-10 flex max-w-[64rem] flex-col items-center gap-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
              MoniChat
            </h1>
            <p className="mx-auto max-w-[42rem] leading-normal text-white/60 sm:text-xl sm:leading-8">
              Your AI-powered chat companion. Experience the future of conversation with our intelligent chat interface.
            </p>
          </div>
          <div className="w-full max-w-md">
            <Login />
          </div>
        </div>
      </div>
    </div>
  )
}

