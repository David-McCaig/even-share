import { ReactNode } from "react";

function BalanceSummaryColumn({ children }: { children: ReactNode }) {
  return (
    <article className="hidden lg:flex flex-col lg:sticky lg:top-0 lg:w-[32rem] lg:h-screen lg:bg-primary-bg-color  lg:dark:bg-gray-800 lg:rounded-l lg:shadow-lg lg:pt-0 ">
      <h2 className="mt-4 ml-4 font-semibold text-lg mb-5">Your Balance</h2>
      {children}
    </article>
  );
}

export default BalanceSummaryColumn;
