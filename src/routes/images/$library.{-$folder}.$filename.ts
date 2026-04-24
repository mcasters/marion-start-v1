import { createFileRoute } from "@tanstack/react-router";
import fs from "node:fs";
import path from "node:path";

export const Route = createFileRoute("/images/$library/{-$folder}/$filename")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const library = params.library;
        const folder = params.folder ?? "";
        const filename = params.filename;
        const filepath = path.join(
          `${process.env.PHOTOS_PATH!}`,
          library,
          folder,
          filename,
        );
        try {
          const buffer = fs.readFileSync(filepath);
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
