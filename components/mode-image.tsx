import Image from 'next/image';

type Props = {
  demonSrc: string;
  angelSrc: string;
  alt: string;
  className?: string;
  fill?: boolean;
};

export function ModeImage({ demonSrc, angelSrc, alt, className = '', fill = false }: Props) {
  return (
    <>
      <Image src={demonSrc} alt={alt} className={`mode-image-dark ${className}`} fill={fill} width={fill ? undefined : 900} height={fill ? undefined : 1100} />
      <Image src={angelSrc} alt={alt} className={`mode-image-light ${className}`} fill={fill} width={fill ? undefined : 900} height={fill ? undefined : 1100} />
    </>
  );
}
