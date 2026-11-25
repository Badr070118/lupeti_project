import Image from 'next/image';

export function HeroSlider({ imageUrl }: { imageUrl: string }) {
  return (
    <section className="w-full">
      <div className="overflow-hidden rounded-3xl bg-slate-100 shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
        <Image
          src={imageUrl}
          alt="Lupeti evcil hayvanları"
          width={1920}
          height={1080}
          priority
          quality={100}
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="block h-auto w-full object-contain"
          unoptimized
        />
      </div>
    </section>
  );
}
