'use client'
import React from "react";
import { Link } from '@/i18n/routing';
import { useConfig } from "@/hooks/use-config";
import { useMenuHoverConfig } from "@/hooks/use-menu-hover";
import { useMediaQuery } from "@/hooks/use-media-query";
import Image from "next/image";



const Logo = () => {
    const [config] = useConfig()
    const [hoverConfig] = useMenuHoverConfig();
    const { hovered } = hoverConfig
    const isDesktop = useMediaQuery('(min-width: 1280px)');

    if (config.sidebar === 'compact') {
        return <Link href="/dashboard/analytics" className="flex gap-2 items-center   justify-center    ">
            <Image src="/logo/trafficboxes_logo.png" alt="logo" width={32} height={32} />
        </Link>
    }
    if (config.sidebar === 'two-column' || !isDesktop) return null

    return (
        <Link href="/dashboard/analytics" className="flex gap-2 items-center    ">
            {(!config?.collapsed || hovered) && (
              <Image src="/logo/trafficboxes_logo_full.png" alt="logo" width={150} height={100} />

            )}
        </Link>

    );
};

export default Logo;
