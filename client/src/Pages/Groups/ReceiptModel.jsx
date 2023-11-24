import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import FormInput from "../../Components/FormInput";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import InputCategory from "../../Components/InputCategory";
import BeatLoader from "react-spinners/BeatLoader";
import { XIcon } from "@heroicons/react/solid";

const Receipt = ({ memberList, groupId, open = false, setOpen }) => {
  const [Loading, setLoading] = useState(true);
  const [allImage, setAllImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  useEffect(() => {
    getPdf();
  }, [groupId]);
  const getPdf = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        `http://localhost:4000/get-files/${groupId}`
      );
      console.log(result.data);
      setAllImage(result.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const showPdf = (pdf) => {
    window.open(`http://localhost:4000/files/${pdf}`, "_blank", "noreferrer");
    // setPdfFile(`http://localhost:5000/files/${pdf}`);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="w-80 bg-white px-4 pt-2 pb-4 sm:w-auto sm:px-6 sm:pt-3 sm:pb-4">
                  <div className="flex w-full justify-end">
                    <button
                      className="justify-end"
                      type="icon"
                      onClick={() => setOpen(false)}
                    >
                      <XIcon className="w-5 text-gray-600" />
                    </button>
                  </div>
                  <div className="flex justify-center md-2">Receipt</div>

                  <div className="mt-2">
                    {Loading ? (
                      <BeatLoader />
                    ) : allImage.length === 0 ? (
                      <h1>No Receipt Uploaded</h1>
                    ) : (
                      allImage.map((data) => {
                        return (
                          <button
                            onClick={() => {
                              showPdf(data.pdf);
                            }}
                            className="w-full mt-4 bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700"
                            width="w-full"
                          >
                            {data.pdf}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Receipt;
