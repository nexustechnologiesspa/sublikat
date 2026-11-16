export default function Hero() {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3" />
      <div className="bg-surface sticker-border sticker-shadow-lg p-6 sm:p-10 lg:p-12 relative overflow-hidden od-hero">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 od-hero__body">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[62px] leading-[1.08] tx-ink tracking-tight od-hero__title">
              Polerones y productos personalizados a su medida
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
