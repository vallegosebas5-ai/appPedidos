export default function WhatsAppButton() {
  const phone = '59164965600'
  const message = encodeURIComponent('Hola! Me comunico desde la app Wechi, necesito ayuda 👋')
  const url = `https://wa.me/${phone}?text=${message}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group"
      title="Contactar soporte por WhatsApp"
    >
      {/* Tooltip */}
      <span className="hidden group-hover:flex items-center bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap">
        ¿Necesitas ayuda?
      </span>

      {/* Botón */}
      <div className="relative w-14 h-14 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200">
        {/* Pulso animado */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        {/* Ícono WhatsApp SVG */}
        <svg
          viewBox="0 0 32 32"
          className="w-8 h-8 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.363.617 4.587 1.697 6.52L2.667 29.333l6.98-1.667A13.267 13.267 0 0016.003 29.333c7.364 0 13.33-5.97 13.33-13.333s-5.966-13.333-13.33-13.333zm0 24.267a11.02 11.02 0 01-5.617-1.537l-.4-.237-4.147.99.997-3.997-.26-.413A10.98 10.98 0 015.003 16c0-6.073 4.927-11 11-11s11 4.927 11 11-4.927 11-11 11zm6.033-8.237c-.33-.163-1.95-.96-2.253-1.07-.303-.107-.523-.163-.743.163-.22.327-.853 1.07-1.047 1.29-.193.22-.387.247-.717.083-.33-.163-1.393-.513-2.653-1.637-.98-.873-1.643-1.953-1.837-2.283-.193-.33-.02-.507.147-.67.15-.147.33-.383.493-.577.163-.193.217-.33.327-.55.107-.22.053-.413-.027-.577-.08-.163-.743-1.793-1.017-2.453-.267-.643-.54-.557-.743-.567l-.633-.013a1.213 1.213 0 00-.88.413c-.303.33-1.153 1.127-1.153 2.747s1.18 3.187 1.343 3.407c.163.22 2.323 3.547 5.627 4.973.787.34 1.4.543 1.877.693.787.25 1.503.217 2.07.133.633-.097 1.95-.797 2.223-1.567.273-.77.273-1.43.193-1.567-.08-.133-.3-.213-.63-.377z" />
        </svg>
      </div>
    </a>
  )
}
