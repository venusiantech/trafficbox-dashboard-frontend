

export type SubChildren = {
  href: string;
  label: string;
  active: boolean;
  children?: SubChildren[];
};
export type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus?: Submenu[];
  children?: SubChildren[];
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus?: Submenu[];
  id: string;
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
  id: string;
};

export function getMenuList(pathname: string, t: any): Group[] {

  return [
    {
      groupLabel: t("dashboard"),
      id: "dashboard",
      menus: [
        {
          id: "dashboard",
          href: "/dashboard/analytics",
          label: t("dashboard"),
          active: pathname.includes("/dashboard/analytics"),
          icon: "heroicons-outline:home",
        },
      ],
    },
    {
      groupLabel: t("campaign"),
      id: "campaign",
      menus: [
        {
          id: "campaign-create",
          href: "/dashboard/campaign/create",
          label: t("create_campaign"),
          active: pathname === "/dashboard/campaign/create",
          icon: "heroicons:plus-circle",
        },
        {
          id: "campaign-list",
          href: "/dashboard/campaign/list",
          label: t("campaigns"),
          active: pathname === "/dashboard/campaign/list",
          icon: "heroicons:list-bullet",
        }
      ],
    },
  ];
}
export function getHorizontalMenuList(pathname: string, t: any): Group[] {
  return [
    {
      groupLabel: t("dashboard"),
      id: "dashboard",
      menus: [
        {
          id: "dashboard",
          href: "/dashboard/analytics",
          label: t("dashboard"),
          active: pathname.includes("/dashboard/analytics"),
          icon: "heroicons-outline:home",
        },
      ],
    },
    {
      groupLabel: t("campaign"),
      id: "campaign",
      menus: [
        {
          id: "campaign-create",
          href: "/dashboard/campaign/create",
          label: t("create_campaign"),
          active: pathname === "/dashboard/campaign/create",
          icon: "heroicons:plus-circle",
        },
        {
          id: "campaign-list",
          href: "/dashboard/campaign/list",
          label: t("campaigns"),
          active: pathname === "/dashboard/campaign/list",
          icon: "heroicons:list-bullet",
        }
      ],
    },
  ];
}