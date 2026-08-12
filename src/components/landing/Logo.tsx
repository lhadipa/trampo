const Logo = () => {
  return (
    <a
      href="#inicio"
      className="inline-flex items-center gap-2.5 rounded-md text-foreground outline-none"
      aria-label="Trampô - página inicial"
    >
      <span className="relative inline-flex" aria-hidden="true">
        <svg
          viewBox="0 0 36 36"
          className="h-9 w-9 transition-transform duration-300 ease-out hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="1" y="1" width="34" height="34" rx="11" fill="hsl(var(--primary))" />
          <circle cx="18" cy="18" r="7" fill="#FFFFFF" fillOpacity="0.96" />
          <circle cx="18" cy="17" r="2.2" fill="hsl(var(--primary))" />
        </svg>
      </span>
      <span className="text-xl font-bold tracking-tight">
        Tramp
        <span className="relative text-primary">
          <span
            className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_0_3px_rgba(232,93,4,0.12)]"
            aria-hidden="true"
          />
          ô
        </span>
      </span>
    </a>
  );
};

export default Logo;
