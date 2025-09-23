

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
            // {
            //   href: "/dashboard/dash-ecom",
            //   label: t("ecommerce"),
            //   active: pathname === "/dashboard/dash-ecom",
            //   icon: "heroicons:shopping-cart",
            //   children: [],
            // },
            // {
            //   href: "/dashboard/project",
            //   label: t("project"),
            //   active: pathname === "/dashboard/project",
            //   icon: "heroicons:document",
            //   children: [],
            // },
            // {
            //   href: "/dashboard/crm",
            //   label: t("crm"),
            //   active: pathname === "/dashboard/crm",
            //   icon: "heroicons:share",
            //   children: [],
            // },
            // {
            //   href: "/dashboard/banking",
            //   label: t("banking"),
            //   active: pathname === "/dashboard/banking",
            //   icon: "heroicons:credit-card",
            //   children: [],
            // },
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
            // {
            //   href: "/dashboard/dash-ecom",
            //   label: t("ecommerce"),
            //   active: pathname === "/dashboard/dash-ecom",
            //   icon: "heroicons:shopping-cart",
            //   children: [],
            // },
            // {
            //   href: "/dashboard/project",
            //   label: t("project"),
            //   active: pathname === "/dashboard/project",
            //   icon: "heroicons:document",
            //   children: [],
            // },
            // {
            //   href: "/dashboard/crm",
            //   label: t("crm"),
            //   active: pathname === "/dashboard/crm",
            //   icon: "heroicons:share",
            //   children: [],
            // },
            // {
            //   href: "/dashboard/banking",
            //   label: t("banking"),
            //   active: pathname === "/dashboard/banking",
            //   icon: "heroicons:credit-card",
            //   children: [],
            // },
          ],
        },
      ],
    },
  ];
}


