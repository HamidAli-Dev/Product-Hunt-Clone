import { Fragment } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";

interface ModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

const EditProductModal: React.FC<ModalProps> = ({
  visible,
  setVisible,
  children,
}) => {
  return (
    <Transition show={visible} as={Fragment}>
      <Dialog onClose={() => setVisible(false)} static={true} open={visible}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-50 transition-opacity bg-[#00000047] bg-opacity-75 backdrop-filter backdrop-blur"></div>
        </TransitionChild>

        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100 "
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100 "
          leaveTo="opacity-0 scale-95 0"
        >
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <DialogPanel className="relative h-full w-full  max-w-[1500px] flex bg-white rounded-sm shadow-md">
              <div className="absolute top-0 right-0 mt-4 mr-4">
                <button
                  onClick={() => setVisible(false)}
                  className="hover:opacity-70 focus:outline-none "
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <div className="overflow-auto flex justify-center flex-col flex-1 px-8 py-10 text-left rounded-t-md">
                {children}
              </div>
            </DialogPanel>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
};

export default EditProductModal;
