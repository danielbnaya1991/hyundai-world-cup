interface FlagImageProps {
  iso: string;
  size?: number;
  className?: string;
}

export function FlagImage({ iso, size = 24, className = "" }: FlagImageProps) {
  return (
    <img
      src={`https://flagcdn.com/w80/${iso}.png`}
      alt=""
      width={size}
      height={Math.round(size * 0.75)}
      className={`inline-block rounded-[3px] object-cover ${className}`}
    />
  );
}
