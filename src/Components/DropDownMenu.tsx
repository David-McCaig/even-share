import { Fragment, useState } from "react";
import { useFetchUserGroupsQuery } from "../features/expensetable/expenseTableSlice";
import { useAppSelector } from "../hooks/reduxTypeScriptHooks";
import { selectUser } from "../features/authentication/userSlice";
import { Listbox, Transition } from "@headlessui/react";
import { SelectedType } from "../types";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface SelectMenuProps {
  groupOnChange: (value: SelectedType) => void;
}

function DropDownMenu({ groupOnChange }: SelectMenuProps) {
  
  const userInfo = useAppSelector(selectUser);
  const userEmail = userInfo?.email;
  const { data } = useFetchUserGroupsQuery(userEmail);

  const [selected, setSelected] = useState({
    user_group_name: "Group Name",
    user_group_email: [],
    id: "0",
  });

  return (
    <Listbox
      value={selected}
      onChange={(value) => {
        setSelected(value);
        groupOnChange(value); 
      }}
    >
      {({ open }) => (
        <div>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
              <span className="flex items-center">
                <span className="ml-3 block truncate">
                  {selected.user_group_name || "Group Name"}
                </span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {data?.map((group) => (
                  <Listbox.Option
                    key={group.id}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-indigo-600 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={group}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          {/* <img src={person.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" /> */}
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "ml-3 block truncate"
                            )}
                          >
                            {group.user_group_name}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  );
}

export default DropDownMenu;
