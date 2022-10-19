import { AnimationProps, motion } from "framer-motion"
import React, { PropsWithChildren } from "react"
import ReactDOM from "react-dom"

type Props = {
    handleClose: () => void
    className: string
}

const animation: AnimationProps["variants"] = {
    hidden: {
        y: "-100vh",
        opacity: 0,
    },
    visible: {
        y: "0",
        opacity: 1,
        transition: {
            duration: 0.1,
            type: "spring",
            damping: 25,
            stiffness: 500,
        },
    },
    exit: {
        y: "100vh",
        opacity: 0,
    },
}

const Modal: React.FC<PropsWithChildren<Props>> = ({
    children,
    handleClose,
    className,
}) => {
    return ReactDOM.createPortal(
        <div className="max-h-screen w-full">
            <motion.div
                className="absolute top-0 left-0 flex h-full w-screen items-center 
                justify-center overflow-y-hidden bg-gray-200 bg-opacity-90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
            >
                <motion.div
                    className={className}
                    variants={animation}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </motion.div>
            </motion.div>
        </div>,
        document.body
    )
}

export default Modal
