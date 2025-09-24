
import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import Image from 'next/image'
const config: DocsThemeConfig = {
  logo: (
    <span className=" inline-flex gap-2.5 items-center">
      <Image src="/logo/trafficboxes_logo_full.png" alt="logo" width={150} height={100} />
    </span>
  ),
  project: {
    link: "https://github.com/shuding/nextra",
  },
  banner: {
    key: "1.0-release",
    text: (
      <a href="/dashboard" target="_blank">
        🎉 Trafficboxes
      </a>
    ),
  },
  footer: {
    text: (
      <span>
        {new Date().getFullYear()} ©{" "}
        <a href="https://codeshaper.net/" target="_blank">
          CodeShaper
        </a>
        .
      </span>
    ),
  },
  themeSwitch: {
    useOptions() {
      return {
        light: 'Light',
        dark: 'Dark',
        system: 'System', // Add this line
      };
    },
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s – Trafficboxes",
    };
  },
};

export default config