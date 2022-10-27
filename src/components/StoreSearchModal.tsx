import { AnimationProps, motion } from "framer-motion"
import { CircleNotch, MagnifyingGlass, WarningCircle } from "phosphor-react"
import React from "react"
import Modal from "./Modal"
import Image from "next/image"
import { getStoreBrandLogo } from "../utils/getStoreBrand"

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

interface IStoreSearchModal {
  stores?: {
    brand: string
    name: string
    id: string
  }[]
  loadingStores: boolean
  closeModal: () => void
  zipToSearch: string
  setZipToSearch: (zip: string) => void
  setchosenStoreID: (zip: string) => void
}

const StoreSearchModal: React.FC<IStoreSearchModal> = ({
  stores,
  loadingStores,
  closeModal,
  zipToSearch,
  setZipToSearch,
  setchosenStoreID,
}) => {
  return (
    <Modal
      handleClose={closeModal}
      className="w-3/4 rounded-md bg-white  sm:w-2/4  md:w-2/5"
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
          className="w-full border-none text-gray-600 outline-none focus:ring-0"
          onChange={(e) => {
            setZipToSearch(e.target.value)
          }}
        />
      </div>
      <div className="h-px bg-gray-200" />

      {stores?.length === 0 && (
        <motion.div
          animate={{ y: 0, opacity: 1 }}
          initial={{ y: -50, opacity: 0 }}
          className="my-6 flex flex-col items-center justify-center"
        >
          <WarningCircle size={25} className="mb-2 text-yellow-500" />
          <span className="text-sm text-gray-600">
            Ingen butikker fundet i {zipToSearch}
          </span>
        </motion.div>
      )}

      {stores && (
        <motion.div
          initial="hidden"
          animate="show"
          exit="exit"
          className="max-h-80 overflow-scroll"
          variants={containerAnimation}
        >
          {stores.map((store, idx) => {
            return (
              <motion.div
                className={`${
                  idx + 1 !== stores.length && "border-b border-gray-100"
                } 
                        flex  cursor-pointer items-center px-3`}
                variants={storeItemAnimation}
                key={store.id}
                onClick={() => {
                  setchosenStoreID(store.id)
                  closeModal()
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
  )
}

export default StoreSearchModal
