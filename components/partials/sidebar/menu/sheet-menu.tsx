'use client'
import { Link } from '@/i18n/routing';
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetHeader,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { MenuClassic } from "./menu-classic";
import Image from "next/image";
import { useMobileMenuConfig } from "@/hooks/use-mobile-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useConfig } from "@/hooks/use-config";
import { cn } from "@/lib/utils";

export function SheetMenu() {
    const [mobileMenuConfig, setMobileMenuConfig] = useMobileMenuConfig();
    const [config, setConfig] = useConfig()
    const { isOpen } = mobileMenuConfig;

    const isDesktop = useMediaQuery("(min-width: 1280px)");
    if (isDesktop) return null;
    return (
        <Sheet open={isOpen} onOpenChange={() => setMobileMenuConfig({ isOpen: !isOpen })}>
            <SheetTrigger className="xl:hidden" asChild>
                <Button className="h-8" variant="ghost" size="icon" onClick={() => setConfig({
                    ...config, collapsed: false,
                })} >

                    <Icon icon="heroicons:bars-3-bottom-right" className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
                <SheetHeader>
                    <Link href="/dashboard/analytics" className="flex gap-2 items-center     ">
                        <Image src="/logo/trafficboxes_logo_full.png" priority alt="logo" width={150} height={100} />
                    </Link>
                </SheetHeader>
                <div className="flex-1 overflow-hidden">
                    <MenuClassic />
                </div>
                {/* Contact Us Button for Mobile */}
                <div className="px-4 pb-4 pt-4 border-t border-default-300">
                    <Button
                        onClick={() => {
                            if (window.Tawk_API) {
                                window.Tawk_API.maximize();
                            }
                            setMobileMenuConfig({ isOpen: false });
                        }}
                        className="w-full justify-start bg-white border border-default text-default hover:bg-white/90"
                    >
                        <Icon icon="heroicons:chat-bubble-left-right" className="h-5 w-5 me-2" />
                        <span className="text-sm font-medium">Contact Us</span>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
