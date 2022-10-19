// src/server/router/index.ts
import { createRouter } from "./context"
import superjson from "superjson"

import { sallingFoodRouter } from "./salling"
import { storeInfoRouter } from "./salling"

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("sallingFood.", sallingFoodRouter)
    .merge("sallingStore.", storeInfoRouter)

// export type definition of API
export type AppRouter = typeof appRouter
