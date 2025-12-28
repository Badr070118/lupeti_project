import Image from 'next/image';

export function HeroStatic() {
  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-3xl bg-gradient-to-tr from-amber-100 via-rose-100 to-blue-100">
      <Image
        src="/hero-static.svg"
        alt="Stylized pet bowl illustration"
        fill
        sizes="(max-width:768px) 100vw, 50vw"
        className="object-cover"
        priority
      />
    </div>
  );
}
