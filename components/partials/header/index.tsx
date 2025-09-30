"use client";

import React from 'react'
import HeaderContent from './header-content'
import ProfileInfo from './profile-info'
// import Notifications from './notifications'
// import Messages from "./messages"
import ThemeSwitcher from './theme-switcher'
import { SheetMenu } from '@/components/partials/sidebar/menu/sheet-menu'
import HorizontalMenu from "./horizontal-menu"
import LocalSwitcher from './locale-switcher'
import HeaderLogo from "./header-logo"

const DashCodeHeader = () => {
    return (
        <>
            <HeaderContent>
                <div className='flex gap-3 items-center'>
                    <HeaderLogo />
                </div>
                <div className="nav-tools flex items-center md:gap-4 gap-3">
                    <LocalSwitcher />
                    <ThemeSwitcher />
                    {/* <Messages /> */}
                    {/* <Notifications /> */}
                    <ProfileInfo />
                    <SheetMenu />
                </div>
            </HeaderContent>
            <HorizontalMenu />
        </>
    )
}

export default DashCodeHeader