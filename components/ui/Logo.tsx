import Image from "next/image";

type Variant = "dark" | "light" | "brand-bg" | "isotipo";

const sources: Record<Variant, string> = {
  dark: "/brand/layro-logo-dark.svg",
  light: "/brand/layro-logo-light.svg",
  "brand-bg": "/brand/layro-logo-brand-bg.svg",
  isotipo: "/brand/layro-isotipo.svg",
};

export function Logo({
  variant = "dark",
  className = "h-8 w-auto",
  priority = false,
}: {
  variant?: Variant;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={sources[variant]}
      alt="LAYRO"
      width={160}
      height={40}
      priority={priority}
      className={className}
    />
  );
}
