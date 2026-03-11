const stats = [
  { value: "2.500+", label: "Trabalhadores cadastrados" },
  { value: "450+", label: "Empresas parceiras" },
  { value: "8.000+", label: "Trabalhos realizados" },
  { value: "4.8★", label: "Avaliação média" },
];

const Stats = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center animate-count-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">
                {stat.value}
              </div>
              <p className="text-secondary-foreground/70 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
