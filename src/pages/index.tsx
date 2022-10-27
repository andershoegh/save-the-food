import { AnimatePresence } from "framer-motion"
import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import { ArrowDown, CircleNotch, Info, MagnifyingGlass } from "phosphor-react"
import { useState } from "react"
import Disclaimer from "../components/Disclaimer"
import ProductCard from "../components/ProductCard"
import StoreSearchModal from "../components/StoreSearchModal"
import { Clearance } from "../server/router/salling"
import { getStoreBrandLogo } from "../utils/getStoreBrand"
import { trpc } from "../utils/trpc"

const Home: NextPage = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [showStoreSearchModal, setShowStoreSearchModal] = useState(false)
  const [chosenStoreID, setchosenStoreID] = useState<string>("")
  const [zipToSearch, setZipToSearch] = useState<string>("")

  const { data: stores, isLoading: loadingStores } = trpc.useQuery(
    ["sallingStore.getStores", { zip: zipToSearch }],
    {
      refetchInterval: 60000,
      enabled: !!zipToSearch && zipToSearch.length === 4,
    }
  )

  const { data: storeFoodData, isLoading: loadingStoreFoodData } =
    trpc.useQuery(["sallingFood.foodWasteInfo", { storeID: chosenStoreID }], {
      refetchInterval: 60000,
      enabled: !!chosenStoreID,
    })

  if (loadingStoreFoodData)
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white ">
        <CircleNotch className="animate-spin text-gray-300" size={30} />
      </div>
    )

  return (
    <>
      <Head>
        <title>Save the food</title>
        <meta name="description" content="Save the food" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex h-full w-screen flex-col bg-zinc-100">
        <div className="flex items-center justify-between py-4 px-4">
          <span className="text-sm text-gray-600">Save the food</span>
          <button onClick={() => setShowDisclaimer(true)}>
            <Info size={20} className="text-gray-600" />
          </button>
        </div>
        {storeFoodData ? (
          <div className="pb-4" key={storeFoodData.store.id}>
            <div className="mx-2 mb-20 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {storeFoodData.clearances.map((clearance: Clearance) => {
                return (
                  <ProductCard
                    clearance={clearance}
                    key={clearance.offer.ean}
                  />
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center font-medium text-gray-600 ">
            {chosenStoreID ? (
              <span>Fandt ingen produkter</span>
            ) : (
              <div className="flex h-screen flex-col items-center justify-center">
                <span>Find billige datovarer</span>
                <ArrowDown className="mt-3" weight="bold" />
              </div>
            )}
          </div>
        )}

        <div
          onClick={() => setShowStoreSearchModal(true)}
          className="fixed bottom-8 left-1/2 flex -translate-x-1/2  
          cursor-pointer justify-center rounded-md border border-gray-100 
        bg-white py-1.5 px-4 text-base text-gray-600 shadow-xl"
        >
          {chosenStoreID ? (
            <div className="relative flex items-center justify-between gap-6 px-2">
              <div className="relative h-8 w-8">
                {storeFoodData?.store.brand && (
                  <Image
                    src={getStoreBrandLogo(storeFoodData.store.brand)}
                    alt={`Store brand  ${storeFoodData.store.brand}`}
                    objectFit="contain"
                    layout="fill"
                  />
                )}
              </div>
              <div className="whitespace-nowrap">
                {storeFoodData?.store.name.substring(
                  storeFoodData.store.name.indexOf(" ") + 1
                ) || ""}
              </div>
              <MagnifyingGlass className="" size={20} />
            </div>
          ) : (
            <span>Vælg en butik</span>
          )}
        </div>
        <AnimatePresence mode="wait">
          {showDisclaimer && (
            <Disclaimer closeModal={() => setShowDisclaimer(false)} />
          )}
          {showStoreSearchModal && (
            <StoreSearchModal
              closeModal={() => setShowStoreSearchModal(false)}
              stores={stores}
              loadingStores={loadingStores}
              setZipToSearch={(zip) => setZipToSearch(zip)}
              setchosenStoreID={(storeID) => setchosenStoreID(storeID)}
              zipToSearch={zipToSearch}
            />
          )}
        </AnimatePresence>
      </main>
    </>
  )
}

export default Home
