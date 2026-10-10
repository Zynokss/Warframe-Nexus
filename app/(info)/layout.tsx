import Navbar from '@/components/Navbar'
import type { ReactNode } from 'react'

export default function InfoLayout({ children }: { children: ReactNode }) {
  return <div className="nexus-page nexus-utility min-h-screen"><Navbar /><main className="info-page-main">{children}</main></div>
}
