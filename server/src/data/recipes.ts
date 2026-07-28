import type { Recipe } from "../types.js";

export const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Spagueti a la Carbonara',
    category: 'italian',
    description:
      'Un clásico romano: pasta sedosa mezclada con huevos, queso Pecorino Romano y guanciale crujiente.',
    image: '',
    content:
      '## Ingredientes\n\n- 400g de espaguetis\n- 200g de guanciale (o panceta), en cubitos\n- 4 huevos grandes\n- 100g de queso Pecorino Romano, finamente rallado\n- Pimienta negra recién molida\n- Sal\n\n## Instrucciones\n\n1. Pon a hervir una olla grande con agua bien salada. Cocina los espaguetis hasta que estén al dente, reservando 1 taza del agua de la pasta antes de escurrirlos.\n2. Fríe el guanciale en una sartén grande a fuego medio hasta que esté crujiente. Retira del fuego y deja enfriar un poco.\n3. Bate los huevos con la mayor parte del Pecorino en un bol. Sazona generosamente con pimienta negra.\n4. Añade la pasta caliente escurrida a la sartén (fuera del fuego). Vierte la mezcla de huevo y remueve rápidamente, añadiendo agua de la pasta para crear una salsa sedosa.\n5. Sirve inmediatamente con el resto del Pecorino y más pimienta negra.\n\n## Notas\n\nTrabaja rápido y usa el agua de la pasta para controlar la temperatura. Nunca añadas los huevos sobre calor directo.',
    likes: [],
  },
  {
    id: '2',
    title: 'Pollo Tikka Masala',
    category: 'indian',
    description:
      'Trozos de pollo marinado en una salsa cremosa y aterciopelada de tomate con especias cálidas.',
    image: '',
    content:
      '## Ingredientes\n\n### Marinada\n- 500g de muslos de pollo deshuesados, cortados en trozos\n- 150g de yogur natural\n- 2 cditas de garam masala\n- 1 cdita de cúrcuma\n- 1 cdita de comino\n- Sal\n\n### Salsa\n- 1 cebolla grande, finamente picada\n- 4 dientes de ajo, picados\n- 1 cda de jengibre fresco, rallado\n- 400g de tomates triturados\n- 200ml de crema de leche (nata)\n- 2 cditas de garam masala\n- 1 cdita de pimentón dulce (paprika)\n\n## Instrucciones\n\n1. Mezcla el pollo con los ingredientes de la marinada. Refrigera por al menos 1 hora, idealmente toda la noche.\n2. Asa o dora el pollo en una sartén hasta que tenga partes tostadas. Reserva.\n3. Sofríe la cebolla en aceite hasta que esté dorada, unos 10 minutos. Añade el ajo y el jengibre, cocina por 2 minutos.\n4. Añade las especias y remueve por 1 minuto. Añade los tomates y cocina a fuego lento por 15 minutos.\n5. Incorpora la crema y el pollo. Cocina a fuego lento por 10 minutos hasta que la salsa espese.\n6. Sirve con arroz basmati o pan naan.',
    likes: [],
  },
  {
    id: '3',
    title: 'Tostada de Aguacate',
    category: 'breakfast',
    description:
      'Aguacate cremoso triturado sobre pan de masa madre tostado, con sal en escamas y un chorrito de limón.',
    image: '',
    content:
      '## Ingredientes\n\n- 2 rebanadas de pan de masa madre\n- 1 aguacate maduro\n- Jugo de 1 limón\n- Sal marina en escamas\n- Hojuelas de chile rojo (opcional)\n- 2 huevos (opcional, para hacer huevos escalfados encima)\n\n## Instrucciones\n\n1. Tuesta el pan de masa madre hasta que esté dorado y crujiente.\n2. Corta el aguacate por la mitad, quita el hueso y saca la pulpa en un bol.\n3. Añade un chorrito de jugo de limón y una pizca de sal. Tritura hasta lograr la textura deseada (con trozos o suave).\n4. Unta generosamente sobre la tostada.\n5. Corona con sal en escamas, hojuelas de chile y un huevo escalfado si lo deseas.\n\n## Notas\n\nLos aguacates maduros deben ceder suavemente a la presión. Los aguacates inmaduros tendrán un sabor amargo.',
    likes: [],
  },
  {
    id: '4',
    title: 'Sopa de Cebolla Francesa',
    category: 'french',
    description:
      'Un rico caldo de cebolla caramelizada coronado con un crutón tostado y queso Gruyère derretido y burbujeante.',
    image: '',
    content:
      '## Ingredientes\n\n- 1kg de cebollas amarillas, en rodajas finas\n- 4 cdas de mantequilla sin sal\n- 1 cda de aceite de oliva\n- 1 cdita de azúcar\n- 2 dientes de ajo, picados\n- 200ml de vino blanco seco\n- 1.5L de caldo de carne\n- 4 rebanadas gruesas de baguette, tostadas\n- 150g de queso Gruyère, rallado\n- Sal y pimienta\n\n## Instrucciones\n\n1. Derrite la mantequilla con el aceite en una olla grande y pesada a fuego medio-bajo. Añade las cebollas y el azúcar. Cocina, removiendo ocasionalmente, entre 45 y 60 minutos hasta que estén muy caramelizadas y de color marrón dorado.\n2. Añade el ajo y cocina 2 minutos. Vierte el vino y raspa los trozos dorados del fondo. Cocina a fuego lento hasta que se reduzca a la mitad.\n3. Añade el caldo, lleva a ebullición y cocina 20 minutos. Sazona con sal y pimienta.\n4. Sirve la sopa en tazones aptos para horno. Coloca un crutón encima y cubre con Gruyère.\n5. Gratina hasta que el queso esté burbujeante y dorado, unos 2–3 minutos. Sirve inmediatamente.\n\n## Notas\n\nNo apresures la caramelización: 45 minutos removiendo pacientemente es lo que le da a esta sopa su profundidad.',
    likes: [],
  },
];

