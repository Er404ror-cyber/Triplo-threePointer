interface ErrorAlertProps {
  message: string | null; // 👈 Altera de string para string | null (ou string | null | undefined)
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null; // Não renderiza nada se não houver erro

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
      {message}
    </div>
  );
}