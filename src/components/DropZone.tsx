type DropZoneProps = {
  dragging: boolean
  onFile: (file: File) => void
  onDraggingChange: (dragging: boolean) => void
}

export function DropZone({ dragging, onFile, onDraggingChange }: DropZoneProps) {
  return (
    <label
      className={`dropzone ${dragging ? 'is-dragging' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        onDraggingChange(true)
      }}
      onDragLeave={() => onDraggingChange(false)}
      onDrop={(e) => {
        e.preventDefault()
        onDraggingChange(false)
        const file = e.dataTransfer.files[0]
        if (file) onFile(file)
      }}
    >
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
          e.target.value = ''
        }}
      />
      <div className="dropzone-icon" aria-hidden="true">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect x="5" y="7" width="26" height="22" rx="3" stroke="currentColor" strokeWidth="1.6" />
          <path d="M5 24l7.5-7.5 5.5 5.5L24 16l7 8" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="13" cy="14" r="2" fill="currentColor" />
        </svg>
      </div>
      <p className="dropzone-title">Drop a screenshot here</p>
      <p className="dropzone-hint">
        or press <kbd>Ctrl</kbd> <kbd>V</kbd> / <kbd>⌘</kbd> <kbd>V</kbd>
      </p>
    </label>
  )
}
