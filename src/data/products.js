/**
 * Mock data de productos.
 * Simula lo que vendría de una base de datos.
 * Cada producto tiene los campos básicos que necesita el marketplace.
 */
const products = [
  {
    id: 1,
    name: 'Café Orgánico Premium',
    description: 'Café de altura cultivado sin pesticidas. Tostado medio, ideal para espresso.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
    category: 'Bebidas',
    producer: 'Finca El Volcán'
  },
  {
    id: 2,
    name: 'Miel de Abeja Pura',
    description: 'Miel 100% natural recolectada artesanalmente. Sin conservantes ni aditivos.',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop',
    category: 'Endulzantes',
    producer: 'Apiario Las Flores'
  },
  {
    id: 3,
    name: 'Aceite de Oliva Extra Virgen',
    description: 'Aceite prensado en frío de primera calidad. Perfecto para ensaladas y cocina.',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop',
    category: 'Aceites',
    producer: 'Olivares del Sur'
  },
  {
    id: 4,
    name: 'Queso Artesanal Madurado',
    description: 'Queso semi-duro madurado por 3 meses. Sabor intenso y textura firme.',
    price: 10.75,
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop',
    category: 'Lácteos',
    producer: 'Granja Los Pinos'
  },
  {
    id: 5,
    name: 'Pan Integral Artesanal',
    description: 'Pan elaborado con harina integral y masa madre. Sin conservantes artificiales.',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    category: 'Panadería',
    producer: 'Panadería El Trigo'
  },
  {
    id: 6,
    name: 'Mermelada de Fresa',
    description: 'Mermelada casera hecha con fresas frescas y azúcar natural. Sin colorantes.',
    price: 6.25,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
    category: 'Conservas',
    producer: 'Dulces Doña María'
  },
  {
    id: 7,
    name: 'Chocolate Negro 70%',
    description: 'Chocolate artesanal con 70% cacao. Elaborado con cacao de origen único.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=300&fit=crop',
    category: 'Dulces',
    producer: 'Cacao Real'
  },
  {
    id: 8,
    name: 'Granola Natural',
    description: 'Mezcla de avena, nueces, semillas y miel. Perfecta para desayunos saludables.',
    price: 9.50,
    image: 'https://images.unsplash.com/photo-1517093728432-a0440f8d45af?w=400&h=300&fit=crop',
    category: 'Cereales',
    producer: 'Vida Sana Foods'
  },
  {
    id: 9,
    name: 'Salsa Picante Habanero',
    description: 'Salsa artesanal de chile habanero. Picor intenso con notas ahumadas.',
    price: 5.75,
    image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&h=300&fit=crop',
    category: 'Salsas',
    producer: 'Salsas del Campo'
  },
  {
    id: 10,
    name: 'Té Verde Orgánico',
    description: 'Hojas de té verde seleccionadas a mano. Rico en antioxidantes naturales.',
    price: 11.00,
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&h=300&fit=crop',
    category: 'Bebidas',
    producer: 'Jardines del Té'
  }
];

export default products;
