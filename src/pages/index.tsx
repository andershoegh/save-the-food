import { AnimatePresence, AnimationProps, motion } from "framer-motion"
import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import { CircleNotch, MagnifyingGlass } from "phosphor-react"
import { useState } from "react"
import Modal from "../components/Modal"
import ProductCard from "../components/ProductCard"
import { Clearance } from "../server/router/salling"
import { trpc } from "../utils/trpc"

const containerAnimation: AnimationProps["variants"] = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.05,
        },
    },
}

const storeItemAnimation: AnimationProps["variants"] = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
    exit: { opacity: 0 },
}

const Home: NextPage = () => {
    const [showStoreSearchModal, setShowStoreSearchModal] = useState(false)
    const [zipToSearch, setZipToSearch] = useState<string>("")

    // const { data, isLoading } = trpc.useQuery(
    //     ["salling.foodWasteInfo", { zip: zipToSearch }],
    //     {
    //         refetchInterval: 60000,
    //         enabled: !!zipToSearch && zipToSearch.length === 4,
    //     }
    // )

    const { data: stores, isLoading: loadingStores } = trpc.useQuery(
        ["salling.getStores", { zip: zipToSearch }],
        {
            refetchInterval: 60000,
            enabled: !!zipToSearch && zipToSearch.length === 4,
        }
    )

    // if (isLoading)
    //     return (
    //         <div className="flex h-screen w-screen items-center justify-center bg-white ">
    //             <CircleNotch className="animate-spin " size={30} />
    //         </div>
    //     )
    return (
        <>
            <Head>
                <title>Save the food</title>⁄
                <meta name="description" content="Save the food" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="relative flex h-screen w-screen flex-col overflow-y-scroll bg-zinc-100">
                {/* {data && data.length > 0 ? (
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
                        Ingen butikker fundet
                    </div>
                )} */}
                <div
                    onClick={() => setShowStoreSearchModal(true)}
                    className="fixed bottom-4 left-4 right-4 flex items-center justify-center rounded-full border border-gray-100 bg-white py-4 px-2 text-sm font-medium text-slate-700 shadow-xl"
                >
                    Vælg en butik
                </div>
                <AnimatePresence mode="wait">
                    {showStoreSearchModal && (
                        <Modal
                            handleClose={() => setShowStoreSearchModal(false)}
                            className="flex max-h-screen w-3/4 rounded-md bg-white"
                        >
                            <div className="w-full rounded-md">
                                <div className="flex items-center px-4 py-4">
                                    {loadingStores ? (
                                        <div className="">
                                            <CircleNotch
                                                className="mr-4 animate-spin text-gray-400"
                                                size={18}
                                            />
                                        </div>
                                    ) : (
                                        <MagnifyingGlass
                                            className="mr-4 text-gray-400"
                                            weight="bold"
                                            size={18}
                                        />
                                    )}
                                    <input
                                        type="number"
                                        autoFocus
                                        value={zipToSearch}
                                        placeholder="Indtast post nr."
                                        className="border-none text-gray-600 outline-none focus:ring-0"
                                        onChange={(e) => {
                                            setZipToSearch(e.target.value)
                                        }}
                                    />
                                </div>
                                <div className="h-px bg-gray-300" />

                                {stores && (
                                    <motion.div
                                        initial="hidden"
                                        animate="show"
                                        exit="exit"
                                        className="overflow-auto"
                                        variants={containerAnimation}
                                    >
                                        {stores.map((store, idx) => {
                                            console.log(stores.length, +idx + 1)
                                            return (
                                                <motion.div
                                                    className={`${
                                                        idx + 1 !==
                                                            stores.length &&
                                                        "border-b border-gray-100"
                                                    } 
                                                     my-2 flex h-10 items-center px-3 py-2`}
                                                    variants={
                                                        storeItemAnimation
                                                    }
                                                    key={store.id}
                                                >
                                                    <div className="relative mr-2 h-7 w-7">
                                                        {store.brand && (
                                                            <Image
                                                                src={getStoreBrandLogo(
                                                                    store.brand
                                                                )}
                                                                alt={`Store brand  ${store.brand}`}
                                                                objectFit="contain"
                                                                layout="fill"
                                                            />
                                                        )}
                                                    </div>
                                                    {store.name.substring(
                                                        store.name.indexOf(
                                                            " "
                                                        ) + 1
                                                    )}
                                                </motion.div>
                                            )
                                        })}
                                    </motion.div>
                                )}
                            </div>
                        </Modal>
                    )}
                </AnimatePresence>
            </main>
        </>
    )
}

export default Home

function getStoreBrandLogo(brand: string) {
    switch (brand) {
        case "foetex":
            return "/foetex.png"
        case "netto":
            return "/netto.png"
        case "bilka":
            return "/bilka.png"
        default:
            return "/missingBrandImage.png"
    }
}
