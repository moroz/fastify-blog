import type { Component, Children } from "@kitajs/html";

interface Props {
  children: Children;
  title?: string;
}

export const Layout: Component<Props> = ({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/assets/app.css" />
        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  );
};
