import { createRouter } from "./context"
import { z } from "zod"
import fetch from "node-fetch"

const sallingResponseSchema = z.array(
    z.object({
        clearances: z.array(
            z.object({
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
        ),
        store: z.object({
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
        }),
    })
)

async function getSallingStuff(zip?: string) {
    const zipCode = zip || "9220"

    const url = `https://api.sallinggroup.com/v1/food-waste/?zip=${zipCode}`
    const response = await fetch(url, {
        headers: {
            Authorization: "Bearer c1c77366-a3b9-44f4-94f8-e3b7087709a8",
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
