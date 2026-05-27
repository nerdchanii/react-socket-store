import { defineConfig } from "vitepress";

export default defineConfig({
  title: "react-socket-store",
  description: "React provider and hooks for socket-store.",
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/" },
      { text: "API", link: "/api/" },
      { text: "Examples", link: "/examples/" },
      { text: "Migration", link: "/migration/" },
      { text: "Next.js", link: "/nextjs/" },
    ],
    sidebar: [
      { text: "Guide", link: "/guide/" },
      { text: "API", link: "/api/" },
      { text: "Examples", link: "/examples/" },
      { text: "Migration", link: "/migration/" },
      { text: "Next.js", link: "/nextjs/" },
    ],
  },
});
