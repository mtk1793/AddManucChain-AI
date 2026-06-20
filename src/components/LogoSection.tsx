'use client'

import Image from 'next/image'

export function LogoSection() {
  return (
    <div className="flex items-center justify-center py-8 px-4">
      <div className="relative w-full max-w-sm">
        <Image
          src="/addmanuchain-logo.png"
          alt="AddManuChain Logo"
          width={300}
          height={200}
          priority
          className="w-full h-auto drop-shadow-lg"
        />
      </div>
    </div>
  )
}
