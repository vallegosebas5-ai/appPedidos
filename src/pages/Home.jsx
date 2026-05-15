import { Link } from 'react-router-dom'
import { ShoppingBag, Store, Shield, Coins, QrCode, ChevronRight, Zap, Users, Star, CheckCircle, ArrowRight } from 'lucide-react'

const IMGS = {
  hero:    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80&fit=crop',
  burger:  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80&fit=crop',
  pizza:   'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80&fit=crop',
  sushi:   'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80&fit=crop',
  dessert: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80&fit=crop',
  drinks:  'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80&fit=crop',
  tacos:   'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80&fit=crop',
  market:  'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&q=80&fit=crop',
  vendor1: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80&fit=crop',
  vendor2: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&q=80&fit=crop',
  vendor3: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80&fit=crop',
  qr:      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80&fit=crop',
}

const PRODUCTS = [
  { img: IMGS.burger,  name: 'Hamburguesa clásica', price: 'Bs 35',  tag: 'Comida',   rating: 4.8 },
  { img: IMGS.pizza,   name: 'Pizza familiar',       price: 'Bs 65',  tag: 'Comida',   rating: 4.9 },
  { img: IMGS.sushi,   name: 'Combo Sushi 12 pzas',  price: 'Bs 85',  tag: 'Comida',   rating: 4.7 },
  { img: IMGS.dessert, name: 'Pastel de chocolate',  price: 'Bs 28',  tag: 'Postres',  rating: 5.0 },
  { img: IMGS.drinks,  name: 'Cóctel tropical',      price: 'Bs 22',  tag: 'Bebidas',  rating: 4.6 },
  { img: IMGS.tacos,   name: 'Tacos de pollo x3',    price: 'Bs 30',  tag: 'Comida',   rating: 4.8 },
]

const VENDORS = [
  { img: IMGS.vendor1, name: 'Burger House', cat: 'Comida rápida', products: 12 },
  { img: IMGS.vendor2, name: 'Bar & Grill',  cat: 'Parrilla',      products: 8  },
  { img: IMGS.vendor3, name: 'La Pizzería',  cat: 'Italiana',      products: 15 },
]

const FEATURES = [
  { icon: Store,  color: 'bg-orange-500', title: 'Publica tu menú',        desc: 'Sube fotos, precios y categorías. Llega a más clientes.' },
  { icon: QrCode, color: 'bg-blue-500',   title: 'Pago QR y tarjeta',      desc: 'Acepta pagos instantáneos. Sin efectivo, sin complicaciones.' },
  { icon: Coins,  color: 'bg-yellow-500', title: 'Sistema de monedas',     desc: 'Compra monedas para publicar. Tú decides cuánto invertir.' },
  { icon: Zap,    color: 'bg-green-500',  title: 'Pedidos en tiempo real', desc: 'Notificaciones al instante. Gestiona entregas desde tu panel.' },
]

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-orange-50/90 backdrop-blur-lg border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/wechi1.png" alt="Wechi" className="h-10 w-auto" />
        </div>
        <div className="hidden sm:flex items-center gap-8">
          <a href="#features" className="text-sm text-gray-500 hover:text-orange-500 transition font-medium">Características</a>
          <a href="#how" className="text-sm text-gray-500 hover:text-orange-500 transition font-medium">Cómo funciona</a>
          <a href="#vendors" className="text-sm text-gray-500 hover:text-orange-500 transition font-medium">Vendedores</a>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-orange-500 transition rounded-xl hover:bg-orange-50">
            Iniciar sesión
          </Link>
          <Link to="/register" className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-orange-200">
            Empieza gratis
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 overflow-x-hidden">
      <Navbar />

      {/* ───── HERO ───── */}
      <section className="relative h-screen flex items-center justify-center text-center">
        {/* Fondo */}
        <div className="absolute inset-0 z-0">
          <img src={IMGS.hero} alt="hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-900/90" />
        </div>

        {/* Contenido centrado */}
        <div className="relative z-10 w-full max-w-3xl mx-auto px-6 flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/20 border border-orange-500/40 text-orange-300 text-sm font-semibold rounded-full mb-6 backdrop-blur">
            <Zap size={13} /> La plataforma #1 de pedidos en Bolivia
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-5">
            Tu mercado{' '}
            <span className="text-orange-400">digital</span>{' '}
            en Bolivia
          </h1>

          <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-xl">
            Conectamos vendedores y compradores. Publica tu negocio, acepta pagos con QR o tarjeta y gestiona tus pedidos en tiempo real.
          </p>

          {/* Botones hero */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              to="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-orange-500 hover:bg-orange-400 active:scale-95 text-white font-black rounded-2xl transition-all shadow-2xl shadow-orange-900/50 text-base"
            >
              Comenzar gratis <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur text-white font-bold rounded-2xl transition-all border border-white/25 text-base"
            >
              Ya tengo cuenta
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4 mt-10">
            <div className="flex -space-x-2">
              {[IMGS.vendor1, IMGS.vendor2, IMGS.vendor3].map((src, i) => (
                <img key={i} src={src} alt="" className="w-9 h-9 rounded-full border-2 border-white object-cover" />
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 mb-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-xs text-gray-300">+200 vendedores activos</p>
            </div>
          </div>
        </div>

        {/* Tarjeta flotante pedido */}
        <div className="absolute bottom-8 right-8 hidden lg:block z-10">
          <div className="bg-white rounded-2xl shadow-2xl p-4 w-64">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                <img src={IMGS.burger} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Nuevo pedido 🎉</p>
                <p className="text-xs text-gray-400">Hamburguesa clásica x2</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-green-100 text-green-600 font-semibold px-2 py-1 rounded-lg">En proceso</span>
              <span className="font-black text-orange-500 text-sm">Bs 70.00</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───── STATS ───── */}
      <section className="py-12 bg-orange-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { n: '+200',        label: 'Vendedores' },
              { n: '+1500',       label: 'Productos' },
              { n: 'QR + Tarjeta', label: 'Métodos de pago' },
              { n: '100%',        label: 'Gratis para compradores' },
            ].map(({ n, label }) => (
              <div key={label}>
                <p className="text-3xl lg:text-4xl font-black text-white">{n}</p>
                <p className="text-orange-200 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── PRODUCTOS DESTACADOS ───── */}
      <section className="py-20 bg-orange-50/60">
        <div className="w-full px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-orange-500 font-bold text-sm uppercase tracking-widest">Catálogo</span>
              <h2 className="text-4xl font-black text-gray-900 mt-1">Productos destacados</h2>
            </div>
            <Link to="/register" className="hidden sm:flex items-center gap-1.5 text-orange-500 font-semibold text-sm hover:gap-3 transition-all">
              Ver todo <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {PRODUCTS.map((p) => (
              <div key={p.name} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group cursor-pointer">
                <div className="h-36 overflow-hidden relative">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute top-2 left-2 text-xs bg-white/90 backdrop-blur px-2 py-0.5 rounded-full font-semibold text-gray-700">
                    {p.tag}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-gray-800 leading-tight mb-1">{p.name}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-400">{p.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-black text-orange-500 text-sm">{p.price}</p>
                    <div className="w-6 h-6 bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-center text-white text-base font-bold leading-none transition">+</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold rounded-xl transition-all shadow-md shadow-orange-200 text-sm"
            >
              Regístrate para ver el catálogo completo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section id="features" className="py-20">
        <div className="w-full px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-orange-500 font-bold text-sm uppercase tracking-widest">Por qué Wechi</span>
              <h2 className="text-4xl font-black text-gray-900 mt-2 mb-4">Todo lo que necesitas<br />en una sola plataforma</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Diseñado para que vendedores y compradores se conecten de la forma más fácil y segura posible.
              </p>
              <div className="space-y-3">
                {FEATURES.map(({ icon: Icon, color, title, desc }) => (
                  <div key={title} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 mb-0.5">{title}</p>
                      <p className="text-sm text-gray-400">{desc}</p>
                    </div>
                    <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img src={IMGS.market} alt="mercado" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <img src={IMGS.qr} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Pago confirmado ✅</p>
                  <p className="text-xs text-gray-400">QR · Bs 45.00</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-orange-500 text-white rounded-2xl shadow-lg p-3 text-center">
                <p className="text-2xl font-black">+200</p>
                <p className="text-xs text-orange-100">vendedores</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── VENDEDORES ───── */}
      <section id="vendors" className="py-20 bg-orange-50/60">
        <div className="w-full px-6">
          <div className="text-center mb-12">
            <span className="text-orange-500 font-bold text-sm uppercase tracking-widest">Negocios</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">Vendedores en Wechi</h2>
            <p className="text-gray-400 mt-3">Los mejores negocios locales en un solo lugar</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {VENDORS.map(({ img, name, cat, products }) => (
              <div key={name} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition group">
                <div className="h-48 overflow-hidden">
                  <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-black text-gray-800 text-lg">{name}</h3>
                      <p className="text-sm text-gray-400">{cat}</p>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-600 font-bold px-2 py-1 rounded-lg">{products} productos</span>
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />)}
                    <span className="text-xs text-gray-400 ml-1">5.0</span>
                  </div>
                  <Link
                    to="/register"
                    className="block w-full py-3 text-center bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-orange-200"
                  >
                    Ver productos
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CÓMO FUNCIONA ───── */}
      <section id="how" className="py-20">
        <div className="w-full px-6">
          <div className="text-center mb-14">
            <span className="text-orange-500 font-bold text-sm uppercase tracking-widest">Proceso</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">¿Cómo funciona?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: ShoppingBag, gradient: 'from-blue-500 to-blue-600',
                role: 'Comprador', emoji: '🛒',
                steps: ['Crea tu cuenta gratis', 'Explora el catálogo completo', 'Agrega productos al carrito', 'Paga con QR o tarjeta'],
              },
              {
                icon: Store, gradient: 'from-orange-500 to-orange-600',
                role: 'Vendedor', emoji: '🏪',
                steps: ['Regístrate como vendedor', 'Compra un paquete de monedas', 'Publica tus productos con foto', 'Recibe y gestiona pedidos'],
              },
              {
                icon: Shield, gradient: 'from-purple-500 to-purple-600',
                role: 'Administrador', emoji: '⚙️',
                steps: ['Acceso al panel completo', 'Gestiona usuarios y roles', 'Crea paquetes de monedas', 'Supervisa todos los pedidos'],
              },
            ].map(({ gradient, role, emoji, steps }) => (
              <div key={role} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition">
                <div className={`bg-gradient-to-br ${gradient} p-7`}>
                  <div className="text-4xl mb-3">{emoji}</div>
                  <h3 className="text-2xl font-black text-white">{role}</h3>
                </div>
                <div className="p-6">
                  <ol className="space-y-3">
                    {steps.map((step, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-black flex items-center justify-center shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-sm text-gray-600">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA FINAL ───── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={IMGS.market} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-orange-600/92" />
        </div>
        <div className="relative z-10 w-full px-6 text-center flex flex-col items-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
            ¿Listo para unirte a Wechi?
          </h2>
          <p className="text-orange-100 mb-10 text-lg">
            Gratis para compradores. Monedas para vendedores. Sin comisiones ocultas.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              to="/register"
              className="w-full sm:w-auto px-10 py-4 bg-white text-orange-500 font-black rounded-2xl hover:bg-orange-50 active:scale-95 transition-all shadow-2xl text-base"
            >
              Crear cuenta gratis
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-10 py-4 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold rounded-2xl transition-all border border-white/30 text-base backdrop-blur"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="bg-orange-50 border-t border-orange-100 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center">
              <img src="/wechi1.png" alt="Wechi" className="h-10 w-auto" />
            </div>
            <p className="text-sm text-gray-400">© 2025 Wechi · Plataforma de pedidos Bolivia</p>
            <div className="flex gap-6">
              <Link to="/login" className="text-sm text-gray-400 hover:text-orange-500 transition">Iniciar sesión</Link>
              <Link to="/register" className="text-sm text-gray-400 hover:text-orange-500 transition">Registrarse</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
