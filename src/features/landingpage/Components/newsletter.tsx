import { useState } from "react";
import { CalendarDaysIcon, HandRaisedIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../Components/ui/button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const submitEmail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.length < 1) {
      setError(true);
    }
    setEmail("")
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
    }, 3000);
  };

  return (
    <section className="relative isolate overflow-hidden bg-zinc-100 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Subscribe to our newsletter.
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Subscribe to our newsletter and stay in the loop with Evenshare's
              latest updates, exclusive tips, and insightful content.
            </p>
            <div className="mt-6 flex max-w-md gap-x-4">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <form className="w-full" onSubmit={submitEmail}>
                <input
                  id="email-address"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full sm:w-44 min-w-0 mr-2 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  placeholder="Enter your email"
                />
                <Button
                  type="submit"
                  className="mt-4 w-full sm:w-24 "
                >
                  Subscribe
                </Button>
                {error && <p className="text-red-600">Please fill in email</p>}
                {successMessage && (
                  <p className="text-green-600 mt-2">Thanks for Signing up! 🎉 </p>
                )}
              </form>
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <CalendarDaysIcon
                  className="h-6 w-6 text-gray-900"
                  aria-hidden="true"
                />
              </div>
              <dt className="mt-4 font-semibold text-gray-800">
                Weekly articles
              </dt>
              <dd className="mt-2 leading-7 text-gray-800">
                Explore a Wealth of Wisdom: Dive into our weekly articles and
                unlock a treasure trove of insights with Evenshare.
              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <HandRaisedIcon
                  className="h-6 w-6 text-gray-900"
                  aria-hidden="true"
                />
              </div>
              <dt className="mt-4 font-semibold text-gray-900">No spam</dt>
              <dd className="mt-2 leading-7 text-gray-800">
                Quality Content, Zero Spam: Subscribe to our newsletter for
                weekly articles that promise valuable insights without the
                clutter.
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div
        className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
        aria-hidden="true"
      >
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-white"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </section>
  );
}
