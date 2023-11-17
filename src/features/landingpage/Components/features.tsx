import { useState, useRef, useEffect } from "react";
import { Transition } from "@headlessui/react";
import {
  BanknotesIcon,
  FolderIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import FeaturesBg from "../../../assets/images/tablet-track-balances.png";
import GroupExpense from "../../../assets/images/tablet-organise-group.png";
import AddExpense from "../../../assets/images/tablet-add-expenses.png";
import SettleUP from "../../../assets/images/tablet-settle-up.png";

export default function Features() {
  const [tab, setTab] = useState<number>(1);

  const tabs = useRef<HTMLDivElement>(null);

  const heightFix = () => {
    if (tabs.current && tabs.current.parentElement)
      tabs.current.parentElement.style.height = `${tabs.current.clientHeight}px`;
  };

  useEffect(() => {
    heightFix();
  }, []);

  return (
    <section className="relative bg-zinc-100  h-[96rem]  sm:h-[86rem]  lg:h-[53rem]">
      {/* Section background (needs .relative class on parent and next sibling elements) */}
      <div
        className="absolute inset-0 pointer-events-none mb-16"
        aria-hidden="true"
      ></div>
      <div className="absolute left-0 right-0 m-auto w-px p-px h-20 transform -translate-y-1/2"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="h2 mb-4">Sharing expenses with friends?</h1>
            <p className="text-xl text-gray-600">
              Empower your crew. Evenshare, the ultimate expense tracker for
              travelers, flatmates, couples, and beyond! 🦸{" "}
            </p>
          </div>

          {/* Section content */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-6">
            {/* Content */}
            <div
              className="max-w-xl lg:max-w-none lg:w-full mx-auto  lg:col-span-6 md:mt-6"
              data-aos="fade-right"
            >
              {/* Tabs buttons */}
              <div className="mb-8 md:mb-0">
                <div
                  className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${
                    tab !== 1
                      ? "bg-white shadow-md border-gray-200 hover:shadow-lg"
                      : "bg-gray-200 border-transparent"
                  }`}
                  
                  onClick={(e) => {
                    e.preventDefault();
                    setTab(1);
                  }}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1">
                      Track balances
                    </div>
                    <div className="text-gray-600">
                      Streamline shared finances with evenshare. effortlessly
                      monitor shared expenses, balances, and debts.
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-9 h-9 bg-white rounded-full shadow flex-shrink-0 ml-3">
                    <BanknotesIcon className="p-1.5" />
                  </div>
                </div>
                <div
                  className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${
                    tab !== 2
                      ? "bg-white shadow-md border-gray-200 hover:shadow-lg"
                      : "bg-gray-200 border-transparent"
                  }`}
                  
                  onClick={(e) => {
                    e.preventDefault();
                    setTab(2);
                  }}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1">
                      Effortlessly organize shared expenses
                    </div>
                    <div className="text-gray-600">
                      Seamless expense splitting for every group with Evenshare.
                      From trips to housemates, friends to family.
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-9 h-9 bg-white rounded-full shadow flex-shrink-0 ml-3">
                    <FolderIcon className="p-1.5" />
                  </div>
                </div>
                <div
                  className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${
                    tab !== 3
                      ? "bg-white shadow-md border-gray-200 hover:shadow-lg"
                      : "bg-gray-200 border-transparent"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setTab(3);
                  }}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1">
                      Add expenses easily
                    </div>
                    <div className="text-gray-600">
                      Never forget who paid. Instantly add expenses on the go
                      with Evenshare.
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-9 h-9 bg-white rounded-full shadow flex-shrink-0 ml-3">
                    <PlusIcon className="p-1.5" />
                  </div>
                </div>
                <div
                  className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${
                    tab !== 4
                      ? "bg-white shadow-md border-gray-200 hover:shadow-lg"
                      : "bg-gray-200 border-transparent"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setTab(4);
                  }}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1">
                      Effortlessly settle up
                    </div>
                    <div className="text-gray-600">
                      Settle up smoothly. Evenshare records cash or online
                      payments with friends.
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-9 h-9 bg-white rounded-full shadow flex-shrink-0 ml-3">
                    <ShieldCheckIcon className="p-1.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs items */}
            <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 md:order-1">
              <div className="transition-all">
                <div
                  className="relative flex flex-col text-center lg:text-right"
                  data-aos="zoom-y-out"
                  ref={tabs}
                >
                  {/* Item 1 */}
                  <Transition
                    show={tab === 1}
                    appear={true}
                    className="w-full"
                    enter="transition ease-in-out duration-700 transform order-first"
                    enterFrom="opacity-0 translate-y-16"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in-out duration-300 transform absolute"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-16"
                    beforeEnter={() => heightFix()}
                    unmount={false}
                  >
                    <div className="relative inline-flex flex-col">
                      <img
                        className="md:max-w-none mx-auto rounded-xl shadow-xl w-72 sm:w-96 md:w-[26rem] lg:w-[28rem] "
                        src={FeaturesBg}
                        alt="Features bg"
                      />
                    </div>
                  </Transition>
                  {/* Item 2 */}
                  <Transition
                    show={tab === 2}
                    appear={true}
                    className="w-full"
                    enter="transition ease-in-out duration-700 transform order-first"
                    enterFrom="opacity-0 translate-y-16"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in-out duration-300 transform absolute"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-16"
                    beforeEnter={() => heightFix()}
                    unmount={false}
                  >
                    <div className="relative inline-flex flex-col">
                      <img
                        className="md:max-w-none mx-auto rounded-xl shadow-xl"
                        src={GroupExpense}
                        width={450}
                        height="400"
                        alt="Features bg"
                      />
                    </div>
                  </Transition>
                  {/* Item 3 */}
                  <Transition
                    show={tab === 3}
                    appear={true}
                    className="w-full"
                    enter="transition ease-in-out duration-700 transform order-first"
                    enterFrom="opacity-0 translate-y-16"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in-out duration-300 transform absolute"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-16"
                    beforeEnter={() => heightFix()}
                    unmount={false}
                  >
                    <div className="relative inline-flex flex-col">
                      <img
                        className="md:max-w-none mx-auto rounded-xl shadow-xl"
                        src={AddExpense}
                        width={450}
                        height="400"
                        alt="Features bg"
                      />
                    </div>
                  </Transition>
                  <Transition
                    show={tab === 4}
                    appear={true}
                    className="w-full"
                    enter="transition ease-in-out duration-700 transform order-first"
                    enterFrom="opacity-0 translate-y-16"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in-out duration-300 transform absolute"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-16"
                    beforeEnter={() => heightFix()}
                    unmount={false}
                  >
                    <div className="relative inline-flex flex-col">
                      <img
                        className="md:max-w-none mx-auto rounded-xl shadow-xl"
                        src={SettleUP}
                        width={450}
                        height="400"
                        alt="Features bg"
                      />
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
