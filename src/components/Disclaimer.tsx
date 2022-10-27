import React from "react"
import Modal from "./Modal"

interface IDisclaimer {
  closeModal: () => void
}

const Disclaimer: React.FC<IDisclaimer> = ({ closeModal }) => {
  return (
    <Modal
      className="mx-4 rounded-md bg-white p-4 text-sm text-gray-700"
      handleClose={closeModal}
    >
      <p>This site is in no way affiliated with Salling Group.</p>
      <p>We thank Salling Group for providing public access to their API.</p>
      <a
        className="mt-4 block text-blue-700"
        href="https://github.com/andershoegh/save-the-food"
      >
        Link to Github project
      </a>
    </Modal>
  )
}

export default Disclaimer
