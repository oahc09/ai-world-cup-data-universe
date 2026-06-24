interface Props {
  onClick: () => void
}

export function ShareButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 rounded-lg bg-green-500/20 border border-green-500/40 text-green-300 hover:bg-green-500/30 text-sm"
    >
      📸 截图分享
    </button>
  )
}
