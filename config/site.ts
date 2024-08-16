export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "YTC - Youtube Comment Tool",
  description: "Your Youtube comments simplified and sorted just like that",
  navItems: [
    // {
    //   label: "Home",
    //   href: "/",
    // },
    {
      label: "Tool",
      href: "/tool",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Tool",
      href: "/tool",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/scriptscrypt/ytc-next",
    twitter: "https://twitter.com/0xsrinivasa",
    docs: "https://github.com/scriptscrypt/ytc-next",
    tool: "/tool",
    discord: "https://discord.gg/scriptscrypt",
    sponsor: "https://patreon.com/scriptscrypt",
  },
};
