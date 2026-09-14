/** Decorative page background: aurora blobs, grid and a soft vignette. */
export default function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-ink-950" />

      <div
        className="absolute -top-40 -left-32 h-[38rem] w-[38rem] rounded-full opacity-55 blur-[120px] animate-drift"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(124,58,237,0.75), transparent 65%)",
        }}
      />
      <div
        className="absolute -top-24 right-[-10rem] h-[34rem] w-[34rem] rounded-full opacity-45 blur-[130px] animate-drift"
        style={{
          animationDelay: "-9s",
          background:
            "radial-gradient(circle at 60% 40%, rgba(6,182,212,0.7), transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-[-14rem] left-1/3 h-[32rem] w-[32rem] rounded-full opacity-35 blur-[140px] animate-drift"
        style={{
          animationDelay: "-17s",
          background:
            "radial-gradient(circle at 50% 50%, rgba(236,72,153,0.6), transparent 68%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 35%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 35%, transparent 100%)",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-ink-950 to-transparent" />
    </div>
  );
}
