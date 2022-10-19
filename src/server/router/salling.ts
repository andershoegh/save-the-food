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

const storeInfoSchema = z.object({
    address: z.object({
        city: z.string(),
        country: z.string(),
        extra: z.string().nullable(),
        street: z.string(),
        zip: z.string(),
    }),
    attributes: z.object({
        babyChanging: z.boolean().optional(),
        bakery: z.boolean().optional(),
        carlsJunior: z.boolean().optional(),
        clickAndCollect: z.boolean().optional(),
        enablingFacilities: z.boolean().optional(),
        flowers: z.boolean().optional(),
        foodClickAndCollect: z.boolean().optional(),
        garden: z.boolean().optional(),
        holidayOpen: z.boolean().optional(),
        nonFood: z.boolean().optional(),
        open247: z.boolean().optional(),
        parking: z.string().optional(),
        parkingRestrictions: z.boolean().optional(),
        petFood: z.boolean().optional(),
        pharmacy: z.boolean().optional(),
        smileyscheme: z.string().optional(),
        starbucks: z.boolean().optional(),
        swipBox: z.boolean().optional(),
        wc: z.boolean().optional(),
        wifi: z.boolean().optional(),
    }),
    brand: z.string(),
    coordinates: z.array(z.number()),
    created: z.string(),
    distance_km: z.number().nullable(),
    hours: z.array(
        z.object({
            close: z.string().nullable().optional(),
            closed: z.boolean().nullable().optional(),
            date: z.string().nullable().optional(),
            open: z.string().nullable().optional(),
            type: z.string().nullable().optional(),
            customerFlow: z.array(z.number()).nullable().optional(),
        })
    ),
    id: z.string(),
    modified: z.string(),
    name: z.string(),
    phoneNumber: z.string(),
    sapSiteId: z.string(),
    type: z.string(),
    vikingStoreId: z.string(),
})

const storeInfoShortSchema = z.object({
    id: z.string(),
    name: z.string(),
    brand: z.string(),
})

const sallingResponseSchema = z.array(storeWithClearance)
const sallingStoreInfoSchema = z.array(storeInfoSchema)
const sallingStoreInfoShortSchema = z.array(storeInfoShortSchema)

export type StoreWithClearance = z.infer<typeof storeWithClearance>
export type Clearance = z.infer<typeof clearance>

async function getSallingStoresInZip(zip: string) {
    // The only brands that have food waste
    const brands = ["foetex", "netto", "bilka"]

    const zipCode = zip

    // Return only the fields "id", "name" and "brand" for each store
    const fields = "id%2Cname%2Cbrand"

    // Number of stores to return. This might have to be increased in high density areas.
    const per_page = "20"

    const url = `https://api.sallinggroup.com/v2/stores/?fields=${fields}&per_page=${per_page}&zip=${zipCode}`
    const response = await fetch(url, {
        headers: {
            Authorization: process.env.SALLING_KEY || "",
        },
    })
    const res = await response.json()

    // Filter the response so only the info on stores with food waste is kept.
    const sallingStores = sallingStoreInfoShortSchema
        .parse(res)
        .filter((element) => brands.includes(element.brand))

    return sallingStores
}

async function getSallingStoreFoodWaste(storeID: string) {
    const url = `https://api.sallinggroup.com/v1/food-waste/${storeID}`
    const response = await fetch(url, {
        headers: {
            Authorization: process.env.SALLING_KEY || "",
        },
    })
    const res = await response.json()

    const clearances = storeWithClearance.parse(res)

    return clearances
}

export const sallingFoodRouter = createRouter().query("foodWasteInfo", {
    input: z
        .object({
            storeID: z.string(),
        })
        .nullish(),
    resolve({ input }) {
        if (!input) {
            return undefined
        }
        return getSallingStoreFoodWaste(input.storeID)
    },
})

export const storeInfoRouter = createRouter().query("getStores", {
    input: z
        .object({
            zip: z.string().optional(),
        })
        .nullish(),
    resolve({ input }) {
        if (!input || !input.zip) {
            return undefined
        }
        return getSallingStoresInZip(input.zip)
    },
})
