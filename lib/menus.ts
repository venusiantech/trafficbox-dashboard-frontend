

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
  submenus: Submenu[];
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
          active: pathname.includes("/dashboard"),
          icon: "heroicons-outline:home",
          submenus: [
            {
              href: "/dashboard/analytics",
              label: t("analytics"),
              active: pathname === "/dashboard/analytics",
              icon: "heroicons:arrow-trending-up",
              children: [],
            },
          ],
        },
      ],
    },
    {
      groupLabel: t("campaign"),
      id: "campaign",
      menus: [
        {
          id: "campaign",
          href: "/dashboard/campaign",
          label: t("campaign"),
          active: pathname.includes("/dashboard/campaign"),
          icon: "heroicons-outline:speakerphone",
          submenus: [
            {
              href: "/dashboard/campaign/create",
              label: t("create_campaign"),
              active: pathname === "/dashboard/campaign/create",
              icon: "heroicons:plus-circle",
              children: [],
            },
            {
              href: "/dashboard/campaign/list",
              label: t("campaigns"),
              active: pathname === "/dashboard/campaign/list",
              icon: "heroicons:list-bullet",
              children: [],
            },
          ],
        },
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
          active: pathname.includes("/dashboard"),
          icon: "heroicons-outline:home",
          submenus: [
            {
              href: "/dashboard/analytics",
              label: t("analytics"),
              active: pathname === "/dashboard/analytics",
              icon: "heroicons:arrow-trending-up",
              children: [],
            },
          ],
        },
      ],
    },
    {
      groupLabel: t("campaign"),
      id: "campaign",
      menus: [
        {
          id: "campaign",
          href: "/dashboard/campaign",
          label: t("campaign"),
          active: pathname.includes("/dashboard/campaign"),
          icon: "heroicons-outline:speakerphone",
          submenus: [
            {
              href: "/dashboard/campaign/create",
              label: t("create_campaign"),
              active: pathname === "/dashboard/campaign/create",
              icon: "heroicons:plus-circle",
              children: [],
            },
            {
              href: "/dashboard/campaign/list",
              label: t("campaigns"),
              active: pathname === "/dashboard/campaign/list",
              icon: "heroicons:list-bullet",
              children: [],
            },
          ],
        },
      ],
    },
  ];
}