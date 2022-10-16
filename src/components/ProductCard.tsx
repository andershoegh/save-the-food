import dayjs from "dayjs"
import Image from "next/image"
import { ArrowDown, ArrowFatDown, ImageSquare } from "phosphor-react"
import React from "react"
import { Clearance } from "../server/router/salling"

type ProductCardProps = {
    clearance: Clearance
}

const ProductCard = ({ clearance }: ProductCardProps) => {
    const { offer, product } = clearance
    return (
        <div className="rounded-sm bg-white">
            <div className="h-[100px] p-3">
                <div className="relative flex h-full w-full items-center justify-center">
                    {product.image ? (
                        <Image
                            className=""
                            layout="fill"
                            src={product.image}
                            objectFit="contain"
                            alt={product.description}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                            <ImageSquare size={40} className="text-gray-300" />
                        </div>
                    )}
                </div>
            </div>
            <div className="my-2 px-3 text-slate-600">
                <div className="truncate text-sm font-bold lowercase text-slate-800 first-letter:capitalize ">
                    {product.description}
                </div>
                <div className="text-xs ">
                    {offer.stock}{" "}
                    {offer.stockUnit === "each" ? "stk" : offer.stockUnit}
                </div>
                <div className="text-xs">
                    Udløber: {dayjs(offer.endTime).format("DD/MM/YYYY")}
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center rounded-full bg-green-300 px-1 py-0.5 text-[10px]">
                        <span className="text-green-800">
                            {offer.discount}{" "}
                        </span>
                        <ArrowDown weight="bold" />
                    </div>
                    <div className="flex items-center">
                        <div className="mr-2 text-xs text-slate-500 line-through">
                            {offer.originalPrice}
                        </div>
                        <div className="text-sm font-medium">
                            {offer.newPrice + offer.currency}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
