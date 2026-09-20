import { ASSET_MANIFEST, NODE_ENV } from "@/config.js";
import type { Component, Children } from "@kitajs/html";
import { Manifest } from "vite";

interface Props {
  children: Children;
  title?: string;
}

function ProductionManifestEntrypoints({
  manifest,
}: {
  manifest: Manifest | null;
}) {
  if (!manifest) return null;

  const chunk = manifest["index.html"];

  return (
    <>
      <script type="module" src={chunk.file} />
      {chunk.css?.map((path) => (
        <link rel="stylesheet" href={path} />
      ))}
    </>
  );
}

export const Layout: Component<Props> = ({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {NODE_ENV === "development" && (
          <script type="module" src="http://localhost:5173/src/main.ts" />
        )}
        <ProductionManifestEntrypoints manifest={ASSET_MANIFEST} />
        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  );
};
