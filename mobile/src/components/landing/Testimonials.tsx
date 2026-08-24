import { Star } from "lucide-react-native";
import { Text, View } from "react-native";

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

export const Testimonials = () => (
  <View className="bg-white/50 px-4 py-16">
    <View className="items-center">
      <Text className="text-xs font-semibold uppercase tracking-widest text-primary">
        Quem usa, recomenda
      </Text>
      <Text className="mt-3 text-center text-3xl font-bold tracking-tight text-foreground">
        A confiança começa aqui
      </Text>
      <Text className="mt-4 text-center text-muted-foreground">
        Histórias reais de quem encontrou o trampo certo pela região.
      </Text>
    </View>

    <View className="mt-12 gap-6">
      {testimonials.map((testimonial) => (
        <View
          key={testimonial.name}
          className="rounded-3xl border border-border bg-white p-8"
        >
          <View className="flex-row items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={16} color="#e85d04" fill="#e85d04" />
            ))}
          </View>
          <Text className="mt-4 text-sm leading-relaxed text-muted-foreground">
            “{testimonial.text}”
          </Text>
          <View className="mt-6 border-t border-border pt-4">
            <Text className="text-sm font-semibold text-foreground">{testimonial.name}</Text>
            <Text className="text-xs text-muted-foreground">{testimonial.role}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);
