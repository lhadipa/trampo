import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Mariana S.",
    role: "Contratante",
    text: "Precisei de garçons para um evento em pouco tempo e em horas tinha tudo resolvido. Simples assim.",
  },
  {
    name: "Carlos E.",
    role: "Trabalhador",
    text: "Encontro trabalhos perto de casa, combino tudo pelo chat e recebo bem. Virou minha renda extra.",
  },
  {
    name: "Dona Rosa",
    role: "Contratante",
    text: "Não entendo muito de tecnologia e mesmo assim consegui usar. Foi muito tranquilo do começo ao fim.",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-white/50 py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Quem usa, recomenda
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            A confiança começa aqui
          </h2>
          <p className="mt-4 text-muted-foreground">
            Histórias reais de quem encontrou o trampo certo pela região.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex flex-col rounded-3xl border border-border/70 bg-white p-8 shadow-sm"
            >
              <div className="flex items-center gap-1" aria-label="5 de 5 estrelas">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 fill-primary text-primary"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                “{testimonial.text}”
              </blockquote>
              <figcaption className="mt-6 border-t border-border/60 pt-4">
                <p className="text-sm font-semibold">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">{testimonial.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
