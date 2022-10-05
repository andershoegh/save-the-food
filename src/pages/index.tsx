import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
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

    if (isLoading) return <div>Fetching data</div>
    return (
        <>
            <Head>
                <title>Save the food</title>⁄
                <meta name="description" content="Save the food" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className=" flex min-h-screen flex-col items-center justify-center py-10">
                Zip Code:
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
                    className="border-2 border-gray-400"
                />
                <button
                    className="mt-2 rounded-lg bg-blue-200 py-2 px-4"
                    onClick={() => {
                        setZipToUseInAPICall(zip)
                    }}
                >
                    Search
                </button>
                <div>
                    {data?.map((sallingLocation) => {
                        const { store, clearances } = sallingLocation
                        return (
                            <div className="my-10" key={store.id}>
                                <h1 className="mb-4 text-2xl">{store.name}</h1>
                                <table className="w-full table-auto text-sm">
                                    <thead>
                                        <tr>
                                            <th className="border-b p-4 pl-8 pt-0 pb-3 text-left font-medium text-slate-900">
                                                Food
                                            </th>
                                            <th className="border-b p-4 pl-8 pt-0 pb-3 text-left font-medium text-slate-900">
                                                Original price
                                            </th>
                                            <th className="border-b p-4 pl-8 pt-0 pb-3 text-left font-medium text-slate-900">
                                                New price
                                            </th>
                                            <th className="border-b p-4 pl-8 pt-0 pb-3 text-left font-medium text-slate-900">
                                                End time
                                            </th>
                                            <th className="border-b p-4 pl-8 pt-0 pb-3 text-left font-medium text-slate-900">
                                                Stock
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {clearances.map((clearance) => {
                                            const { description, image } =
                                                clearance.product
                                            const {
                                                newPrice,
                                                originalPrice,
                                                endTime,
                                                stock,
                                            } = clearance.offer
                                            return (
                                                <tr key={clearance.product.ean}>
                                                    <td className="border-b border-slate-100 p-4 pl-8 text-slate-800">
                                                        {description}
                                                    </td>
                                                    <td className="border-b border-slate-100 p-4 pl-8 text-slate-800 line-through">
                                                        {originalPrice}
                                                    </td>
                                                    <td className="border-b border-slate-100 p-4 pl-8 text-slate-800">
                                                        {newPrice}
                                                    </td>
                                                    <td className="border-b border-slate-100 p-4 pl-8 text-slate-800">
                                                        {endTime.split("T")[0]}
                                                    </td>
                                                    <td className="border-b border-slate-100 p-4 pl-8 text-slate-800">
                                                        {stock}
                                                    </td>
                                                    <td className="border-b border-slate-100 p-4 pl-8 text-slate-800">
                                                        {image ? (
                                                            <Image
                                                                width={40}
                                                                height={40}
                                                                src={image}
                                                                alt={
                                                                    description
                                                                }
                                                            />
                                                        ) : (
                                                            <span>N/A</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )
                    })}
                </div>
            </main>
        </>
    )
}

export default Home
