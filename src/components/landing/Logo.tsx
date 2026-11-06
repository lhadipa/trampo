import logo from "@/assets/logo.png";

const Logo = () => (
  <a href="#inicio" className="inline-flex items-center rounded-md text-foreground outline-none" aria-label="Trampô - página inicial">
    <img src={logo} alt="Trampô" className="h-9 w-auto max-w-[170px] object-contain transition-transform duration-300 ease-out hover:scale-105" />
  </a>
);

export default Logo;
