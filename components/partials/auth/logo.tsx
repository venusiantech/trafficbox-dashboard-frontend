'use client'
import Image from 'next/image';
import { useTheme } from "next-themes";

const Logo = () => {
    const { theme: mode } = useTheme();
  return (
    <div>
      <Image
        src={
          mode === "light"
            ? "/logo/trafficboxes_logo_full.png"
            : "/logo/trafficboxes_logo_full.png"
        }
        alt=""
        width={300}
        height={300}
        className=" w-36 "
      />
    </div>
  );
}

export default Logo;