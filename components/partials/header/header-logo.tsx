'use client'
import React from 'react'
import { Link } from '@/components/navigation'
import { useConfig } from '@/hooks/use-config'
import { useMediaQuery } from '@/hooks/use-media-query'
import Image from 'next/image'

const HeaderLogo = () => {
    const [config] = useConfig();

    const isDesktop = useMediaQuery('(min-width: 1280px)');

    return (
        config.layout === 'horizontal' ? (
            <Link href="/dashboard/analytics" className="flex gap-2 items-center    ">
                <Image src="/logo/trafficboxes_logo_full.png" priority alt="logo" width={150} height={100} />
            </Link>
        ) :
            !isDesktop && (
                <Link href="/dashboard/analytics" className="flex gap-2 items-center    ">
                    <Image src="/logo/trafficboxes_logo_full.png" priority alt="logo" width={150} height={100} />
                </Link>
            )
    )
}

export default HeaderLogo