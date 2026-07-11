import { createFileRoute } from "@tanstack/react-router";
import fs from "node:fs";
import path from "node:path";

export const Route = createFileRoute("/images/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { _splat } = params;
        const filepath = path.join(`${process.env.PHOTOS_PATH!}`, _splat ?? "");
        try {
          const buffer = await fs.promises.readFile(filepath);
          return new Response(buffer, {
            headers: {
              "content-type": "image/jpeg",
            },
          });
        } catch (e) {
          return Response.json({ error: "Image not found" }, { status: 404 });
        }
      },
    },
  },
});
