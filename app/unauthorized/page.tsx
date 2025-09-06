// app/unauthorized/page.tsx
export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold text-red-500">Unauthorized Access</h1>
      <p className="text-gray-400 mt-4">You don’t have permission to view this page.</p>
    </div>
  )
}
