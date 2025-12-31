import Image from 'next/image';
import heroStaticImage from '@/../public/hero-static.jpg';

export function HeroStatic() {
  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-3xl bg-gradient-to-tr from-amber-100 via-rose-100 to-blue-100">
      <Image
        src={heroStaticImage}
        alt="Stylized pet bowl illustration"
        fill
        sizes="(max-width:768px) 100vw, 50vw"
        className="object-cover"
        priority
      />
    </div>
  );
}
