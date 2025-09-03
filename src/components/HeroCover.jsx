import Spline from '@splinetool/react-spline';

export default function HeroCover() {
  return (
    <section className="relative w-full h-72 md:h-96">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/zhZFnwyOYLgqlLWk/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 via-white/30 to-white"></div>

      <div className="relative h-full max-w-6xl mx-auto px-4 flex flex-col justify-end pb-6">
        <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">Your single source of truth for UTM links</h1>
        <p className="text-neutral-600 max-w-2xl mt-2">
          Build consistent tracking URLs, analyze clicks, manage templates, and compare channel performance in one place.
        </p>
      </div>
    </section>
  );
}
