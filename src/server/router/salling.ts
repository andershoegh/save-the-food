import { createRouter } from "./context"
import { z } from "zod"
import fetch from "node-fetch"

const sallingStoreInformation = z.object({
    address: z.object({
        city: z.string(),
        country: z.string(),
        extra: z.null(),
        street: z.string(),
        zip: z.string(),
    }),
    brand: z.string(),
    coordinates: z.array(z.number()),
    hours: z.array(
        z.object({
            date: z.string(),
            type: z.string(),
            open: z.string(),
            close: z.string(),
            closed: z.boolean(),
            customerFlow: z.array(z.number()),
        })
    ),
    name: z.string(),
    id: z.string(),
    type: z.string(),
})

const clearance = z.object({
    offer: z.object({
        currency: z.string(),
        discount: z.number(),
        ean: z.string(),
        endTime: z.string(),
        lastUpdate: z.string(),
        newPrice: z.number(),
        originalPrice: z.number(),
        percentDiscount: z.number(),
        startTime: z.string(),
        stock: z.number(),
        stockUnit: z.string(),
    }),
    product: z.object({
        description: z.string(),
        ean: z.string(),
        image: z.string().nullable(),
    }),
})

const storeWithClearance = z.object({
    clearances: z.array(clearance),
    store: sallingStoreInformation,
})

const sallingResponseSchema = z.array(storeWithClearance)

export type StoreWithClearance = z.infer<typeof storeWithClearance>
export type Clearance = z.infer<typeof clearance>

async function getSallingStuff(zip?: string) {
    const zipCode = zip || "9220"

    const url = `https://api.sallinggroup.com/v1/food-waste/?zip=${zipCode}`
    const response = await fetch(url, {
        headers: {
            Authorization: process.env.SALLING_KEY || "",
        },
    })
    const res = await response.json()

    const sallingResponse = sallingResponseSchema.parse(res)

    return sallingResponse
}

export const exampleRouter = createRouter().query("hello", {
    input: z
        .object({
            zip: z.string().optional(),
        })
        .nullish(),
    resolve({ input }) {
        if (!input) {
            return undefined
        }
        return getSallingStuff(input.zip)
    },
})
