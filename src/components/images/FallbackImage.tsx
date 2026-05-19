interface FallbackImageProps {
  src: string;
  alt: string;
  fallBackSrc: string;
  className?: string;
}

export default function FallbackImage({
  src,
  alt,
  fallBackSrc,
  className,
}: FallbackImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.src = fallBackSrc;
      }}
    />
  );
}
