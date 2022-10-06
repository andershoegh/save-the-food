import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import { CircleNotch } from "phosphor-react"
import { useState } from "react"
import { trpc } from "../utils/trpc"

const Home: NextPage = () => {
    const [zip, setZip] = useState<string>("")
    const [zipToUseInAPICall, setZipToUseInAPICall] = useState<string>("9220")

    const { data, isLoading } = trpc.useQuery(
        ["example.hello", { zip: zipToUseInAPICall }],
        {
            refetchInterval: 60000,
        }
    )

    if (isLoading)
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-gray-900">
                <CircleNotch
                    className="animate-spin dark:text-white"
                    size={30}
                />
            </div>
        )
    return (
        <>
            <Head>
                <title>Save the food</title>⁄
                <meta name="description" content="Save the food" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex h-screen w-screen flex-col overflow-y-scroll bg-white dark:bg-gray-900">
                <div className="pt-2">
                    <div className="relative mx-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                                aria-hidden="true"
                                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                        </div>
                        <input
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setZipToUseInAPICall(zip)
                                }
                            }}
                            max={4}
                            type="text"
                            onChange={(e) => {
                                setZip(e.target.value)
                            }}
                            id="default-search"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            placeholder="Post nr."
                            required
                        />
                        <button
                            onClick={() => {
                                setZipToUseInAPICall(zip)
                            }}
                            className="absolute right-2.5 bottom-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {data && data.length > 0 ? (
                    data.map((sallingLocation) => {
                        const { store, clearances } = sallingLocation
                        return (
                            <div className="py-4" key={store.id}>
                                <h1 className="mb-4 text-center text-2xl text-gray-900 first-letter:capitalize dark:text-white">
                                    {store.name}
                                </h1>

                                <div className="mx-2">
                                    {clearances.map((clearance) => {
                                        return (
                                            <div
                                                className="my-3 rounded-lg border-gray-200 p-4 shadow-md dark:border-gray-700 dark:bg-gray-800"
                                                key={clearance.offer.ean}
                                            >
                                                <div className="truncate text-lg font-medium tracking-tight text-gray-900 dark:text-white">
                                                    {
                                                        clearance.product
                                                            .description
                                                    }
                                                </div>
                                                <div className="flex">
                                                    <div className="text-lg font-bold  text-emerald-600">
                                                        {clearance.offer
                                                            .newPrice +
                                                            clearance.offer
                                                                .currency}
                                                    </div>
                                                </div>
                                                <div className="text-base line-through">
                                                    {clearance.offer
                                                        .originalPrice +
                                                        clearance.offer
                                                            .currency}
                                                </div>
                                                <div className="text-base text-gray-600 dark:text-white">
                                                    {`Quantity: ${clearance.offer.stock} ${clearance.offer.stockUnit}`}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="flex h-full items-center justify-center font-medium text-gray-600 dark:text-white">
                        Ingen butikker fundet på post nr: {zipToUseInAPICall}
                    </div>
                )}
            </main>
        </>
    )
}

export default Home
