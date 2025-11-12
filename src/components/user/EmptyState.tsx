interface EmptyStateProps {
  message?: string
}

export default function EmptyState({ message = "No data found." }: EmptyStateProps) {
  return (
    <div className="px-6 py-12 text-center text-gray-500">
      {message}
    </div>
  )
}