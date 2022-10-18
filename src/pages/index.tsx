import type { NextPage } from "next"
import Head from "next/head"
import { CircleNotch } from "phosphor-react"
import { useState } from "react"
import ProductCard from "../components/ProductCard"
import { Clearance } from "../server/router/salling"
import { trpc } from "../utils/trpc"

const Home: NextPage = () => {
    const [zip, setZip] = useState<string>("")
    const [zipToUseInAPICall, setZipToUseInAPICall] = useState<string>("9220")

    const { data, isLoading } = trpc.useQuery(
        ["salling.foodWasteInfo", { zip: zipToUseInAPICall }],
        {
            refetchInterval: 60000,
        }
    )

    if (isLoading)
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-white ">
                <CircleNotch className="animate-spin " size={30} />
            </div>
        )
    return (
        <>
            <Head>
                <title>Save the food</title>⁄
                <meta name="description" content="Save the food" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="relative flex h-screen w-screen flex-col overflow-y-scroll bg-zinc-100">
                <div className="pt-2">
                    <div className="relative mx-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                                aria-hidden="true"
                                className="h-5 w-5 text-gray-500 "
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
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
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
                            placeholder="Post nr."
                            required
                        />
                        <button
                            onClick={() => {
                                setZipToUseInAPICall(zip)
                            }}
                            className="absolute right-2.5 bottom-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 "
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
                                <h1 className="mb-4 text-center text-2xl text-gray-900 first-letter:capitalize ">
                                    {store.name}
                                </h1>
                                <div className="mx-2 grid grid-cols-2 gap-3">
                                    {clearances.map((clearance: Clearance) => {
                                        return (
                                            <ProductCard
                                                clearance={clearance}
                                                key={clearance.offer.ean}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="flex h-full items-center justify-center font-medium text-gray-600 ">
                        Ingen butikker fundet på post nr: {zipToUseInAPICall}
                    </div>
                )}
                <div className="fixed bottom-4 left-4 right-4 flex items-center justify-center rounded-full border border-gray-100 bg-white py-4 px-2 text-sm font-medium text-slate-700 shadow-xl">
                    Click to choose a store
                </div>
            </main>
        </>
    )
}

export default Home
