// src/server/router/index.ts
import { createRouter } from "./context"
import superjson from "superjson"

import { exampleRouter } from "./salling"
import { storeInfoRouter } from "./salling"

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("salling.", exampleRouter)
    .merge("salling.", storeInfoRouter)

// export type definition of API
export type AppRouter = typeof appRouter

