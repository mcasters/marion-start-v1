import { createServerFn } from "@tanstack/react-start";
import { db } from "~/db";

export const getMetas = createServerFn()
    .handler(async (): Promise<Map<string, string>> => {
    const metas = await db.query.meta.findMany({
        columns: { id: false },
    });
    const map = new Map();
    metas.forEach((meta) => map.set(meta.key, meta.text));
    return map;
});

export const getMetasByKey = createServerFn({ method: "POST"})
    .inputValidator((d: string[]) => d)
    .handler(async ({data}): Promise<Map<string, string>> => {
    const metas = await db.query.meta.findMany({
        columns: { id: false },
        where: {
            key: { OR: [...data] },
        },
    });
    const map = new Map();
    metas.forEach((meta) => map.set(meta.key, meta.text));
    return map;
});
