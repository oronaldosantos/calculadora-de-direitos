function Tooltip({ content, children }) {
  return (
    <span className="group relative inline-flex cursor-help items-center">
      {children}
      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden w-64 -translate-x-1/2 rounded-lg bg-midnight px-3 py-2 text-xs text-white shadow-lg group-hover:block">
        {content}
      </span>
    </span>
  )
}

export default Tooltip
