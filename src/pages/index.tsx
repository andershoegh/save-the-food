import { AnimatePresence, AnimationProps, motion } from "framer-motion"
import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import { ArrowDown, CircleNotch, MagnifyingGlass } from "phosphor-react"
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
  const [chosenStoreID, setchosenStoreID] = useState<string>("")
  const [zipToSearch, setZipToSearch] = useState<string>("")

  const { data: storeFoodData, isLoading: loadingStoreFoodData } =
    trpc.useQuery(["sallingFood.foodWasteInfo", { storeID: chosenStoreID }], {
      refetchInterval: 60000,
      enabled: !!chosenStoreID,
    })

  const { data: stores, isLoading: loadingStores } = trpc.useQuery(
    ["sallingStore.getStores", { zip: zipToSearch }],
    {
      refetchInterval: 60000,
      enabled: !!zipToSearch && zipToSearch.length === 4,
    }
  )

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
      <main className="relativeflex h-screen w-screen flex-col bg-zinc-100">
        {storeFoodData ? (
          <div className="py-4" key={storeFoodData.store.id}>
            <div className="mx-2 mb-20 grid grid-cols-2 gap-3">
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
              <div className="flex flex-col items-center justify-center">
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
          {showStoreSearchModal && (
            <Modal
              handleClose={() => setShowStoreSearchModal(false)}
              className="w-3/4 rounded-md bg-white"
            >
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
              <div className="h-px bg-gray-200" />

              {stores && (
                <motion.div
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className=" max-h-80 overflow-scroll"
                  variants={containerAnimation}
                >
                  {stores.map((store, idx) => {
                    return (
                      <motion.div
                        className={`${
                          idx + 1 !== stores.length &&
                          "border-b border-gray-100"
                        } 
                        flex  items-center px-3 `}
                        variants={storeItemAnimation}
                        key={store.id}
                        onClick={() => {
                          setchosenStoreID(store.id)
                          setShowStoreSearchModal(false)
                        }}
                      >
                        <div className="relative my-2.5 mr-2 h-6 w-6">
                          {store.brand && (
                            <Image
                              src={getStoreBrandLogo(store.brand)}
                              alt={`Store brand  ${store.brand}`}
                              objectFit="contain"
                              layout="fill"
                            />
                          )}
                        </div>
                        <div className="text-sm text-gray-700">
                          {store.name.substring(store.name.indexOf(" ") + 1)}
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}
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
