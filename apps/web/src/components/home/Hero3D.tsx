import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight, ArrowRight } from 'lucide-react';
import '@/styles/hero3d.css';

type Hero3DProps = { locale: string };

const products = [
  { slug: 'tender-turkey-puppy-bites', image: '/products/tender-turkey-puppy-bites.png', category: 'Pour les chiens', name: 'Les essentiels pour chien', number: '01' },
  { slug: 'slow-roasted-quail-feast', image: '/products/slow-roasted-quail-feast.png', category: 'Pour les chats', name: 'Le meilleur pour les chats', number: '02' },
  { slug: 'highland-salmon-casserole', image: '/products/highland-salmon-casserole.png', category: 'Notre sélection', name: 'Des repas qui font plaisir', number: '03' },
];

export function Hero3D({ locale }: Hero3DProps) {
  return (
    <section className="hero3d" aria-labelledby="selection-title">
      <div className="hero3d__heading">
        <div>
          <p className="hero3d__eyebrow"><span /> La sélection Lupeti</p>
          <h2 id="selection-title">Bien nourris.<br /><em>Bien heureux.</em></h2>
        </div>
        <div className="hero3d__intro">
          <p>De bons repas pour leurs petits et grands moments de bonheur.</p>
          <Link className="hero3d__shop" href={`/${locale}/shop`}>
            Voir toute la boutique <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="hero3d__products">
        {products.map((product) => (
          <Link key={product.slug} href={`/${locale}/product/${product.slug}`} className="hero3d__product">
            <div className="hero3d__product-top"><span>{product.category}</span><span>{product.number}</span></div>
            <div className="hero3d__image">
              <Image src={product.image} alt="" fill sizes="(max-width: 640px) 78vw, (max-width: 900px) 45vw, 30vw" />
            </div>
            <div className="hero3d__product-bottom">
              <span>{product.name}</span>
              <span className="hero3d__arrow"><ArrowDownRight size={19} aria-hidden="true" /></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
