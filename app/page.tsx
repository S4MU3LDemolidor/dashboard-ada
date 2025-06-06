"use client"

import dynamic from "next/dynamic"

const DashboardComponent = dynamic(() => import("./dashboard"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse">📦</div>
        <p className="text-gray-600">Carregando dados do Programa ADA...</p>
      </div>
    </div>
  ),
})

export default function Page() {
  return <DashboardComponent />
}
