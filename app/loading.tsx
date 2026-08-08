"use client";
export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* =====================================================
          SKELETON ANIMATION
      ===================================================== */}
      <style jsx global>{`
        @keyframes skeletonPulse {
          0%,
          100% {
            opacity: 0.55;
          }
          50% {
            opacity: 1;
          }
        }

        .skeleton {
          background: #e9edf2;
          animation: skeletonPulse 1.6s ease-in-out infinite;
        }
      `}</style>

      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <header className="w-full border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="skeleton h-10 w-36 rounded-lg" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-7 lg:flex">
            <div className="skeleton h-4 w-14 rounded" />
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-4 w-28 rounded" />
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton h-4 w-20 rounded" />
          </div>

          {/* CTA */}
          <div className="hidden items-center gap-3 sm:flex">
            <div className="skeleton h-10 w-28 rounded-lg" />
            <div className="skeleton h-10 w-32 rounded-lg" />
          </div>

          {/* Mobile Menu */}
          <div className="skeleton h-9 w-9 rounded-lg lg:hidden" />
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="bg-[#f8fafc]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-20">

          {/* Hero Content */}
          <div>
            <div className="skeleton mb-5 h-7 w-44 rounded-full" />

            <div className="space-y-3">
              <div className="skeleton h-12 w-full max-w-xl rounded-lg" />
              <div className="skeleton h-12 w-4/5 max-w-lg rounded-lg" />
            </div>

            <div className="mt-5 space-y-2">
              <div className="skeleton h-4 w-full max-w-lg rounded" />
              <div className="skeleton h-4 w-11/12 max-w-lg rounded" />
              <div className="skeleton h-4 w-3/4 max-w-md rounded" />
            </div>

            {/* Hero Buttons */}
            <div className="mt-7 flex flex-wrap gap-3">
              <div className="skeleton h-12 w-40 rounded-xl" />
              <div className="skeleton h-12 w-36 rounded-xl" />
            </div>

            {/* Trust */}
            <div className="mt-8 flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="skeleton h-8 w-8 rounded-full" />
                <div className="skeleton h-4 w-24 rounded" />
              </div>

              <div className="flex items-center gap-2">
                <div className="skeleton h-8 w-8 rounded-full" />
                <div className="skeleton h-4 w-24 rounded" />
              </div>

              <div className="flex items-center gap-2">
                <div className="skeleton h-8 w-8 rounded-full" />
                <div className="skeleton h-4 w-24 rounded" />
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="skeleton aspect-[4/3] w-full rounded-3xl" />

            {/* Floating card */}
            <div className="absolute -bottom-5 left-5 hidden rounded-2xl bg-white p-4 shadow-lg sm:block">
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton mt-2 h-6 w-28 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-gray-100 px-4 py-7 sm:grid-cols-4 sm:px-6">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex flex-col items-center justify-center gap-2 px-3"
            >
              <div className="skeleton h-7 w-20 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
          ))}

        </div>
      </section>

      {/* =====================================================
          COUNSELLING + INTRO SECTION
      ===================================================== */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_380px] lg:py-20">

          {/* Left */}
          <div>
            <div className="skeleton h-5 w-40 rounded" />

            <div className="mt-4 space-y-3">
              <div className="skeleton h-10 w-full max-w-2xl rounded-lg" />
              <div className="skeleton h-10 w-4/5 max-w-xl rounded-lg" />
            </div>

            <div className="mt-6 space-y-2">
              <div className="skeleton h-4 w-full max-w-2xl rounded" />
              <div className="skeleton h-4 w-full max-w-xl rounded" />
              <div className="skeleton h-4 w-4/5 max-w-lg rounded" />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-gray-100 p-5"
                >
                  <div className="skeleton h-10 w-10 rounded-xl" />
                  <div className="skeleton mt-4 h-5 w-32 rounded" />
                  <div className="skeleton mt-3 h-3 w-full rounded" />
                  <div className="skeleton mt-2 h-3 w-4/5 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Counselling Form */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="skeleton h-7 w-52 rounded" />

            <div className="mt-6 space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item}>
                  <div className="skeleton mb-2 h-3 w-24 rounded" />
                  <div className="skeleton h-11 w-full rounded-lg" />
                </div>
              ))}

              <div className="skeleton h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES / WHY CHOOSE
      ===================================================== */}
      <section className="bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">

          <div className="mx-auto max-w-2xl text-center">
            <div className="skeleton mx-auto h-5 w-32 rounded" />
            <div className="skeleton mx-auto mt-4 h-9 w-full max-w-xl rounded-lg" />
            <div className="skeleton mx-auto mt-3 h-4 w-4/5 rounded" />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-gray-100 bg-white p-6"
              >
                <div className="skeleton h-12 w-12 rounded-xl" />

                <div className="skeleton mt-5 h-5 w-40 rounded" />

                <div className="mt-4 space-y-2">
                  <div className="skeleton h-3 w-full rounded" />
                  <div className="skeleton h-3 w-11/12 rounded" />
                  <div className="skeleton h-3 w-3/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          DESTINATIONS
      ===================================================== */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="skeleton h-5 w-40 rounded" />

              <div className="skeleton mt-4 h-9 w-80 max-w-full rounded-lg" />

              <div className="skeleton mt-3 h-4 w-96 max-w-full rounded" />
            </div>

            <div className="skeleton h-10 w-28 rounded-lg" />
          </div>

          <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
              >
                <div className="skeleton aspect-[4/3] w-full" />

                <div className="p-4">
                  <div className="skeleton h-4 w-24 rounded" />
                  <div className="skeleton mt-2 h-3 w-16 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          6 STEP PROCESS
      ===================================================== */}
      <section className="bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">

          <div className="mx-auto max-w-2xl text-center">
            <div className="skeleton mx-auto h-5 w-36 rounded" />
            <div className="skeleton mx-auto mt-4 h-9 w-full max-w-2xl rounded-lg" />
            <div className="skeleton mx-auto mt-3 h-4 w-4/5 rounded" />
          </div>

          {/* Process Cards */}
          <div className="mt-12 space-y-5">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="flex min-h-[150px] items-center gap-6 rounded-3xl border border-gray-100 bg-white p-6"
              >
                {/* Number */}
                <div className="skeleton hidden h-16 w-16 flex-shrink-0 rounded-full sm:block" />

                <div className="flex-1">
                  <div className="skeleton h-3 w-20 rounded" />
                  <div className="skeleton mt-3 h-6 w-56 max-w-full rounded" />

                  <div className="mt-3 space-y-2">
                    <div className="skeleton h-3 w-full max-w-xl rounded" />
                    <div className="skeleton h-3 w-4/5 max-w-lg rounded" />
                  </div>
                </div>

                <div className="skeleton hidden h-24 w-32 rounded-xl md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          TEST PREPARATION
      ===================================================== */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

            <div>
              <div className="skeleton h-5 w-40 rounded" />

              <div className="mt-4 space-y-3">
                <div className="skeleton h-9 w-full max-w-xl rounded-lg" />
                <div className="skeleton h-9 w-4/5 rounded-lg" />
              </div>

              <div className="mt-5 space-y-2">
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-11/12 rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
              </div>

              <div className="skeleton mt-7 h-11 w-40 rounded-lg" />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {["IELTS", "PTE", "TOEFL", "GRE", "GMAT", "SAT"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-gray-100 p-5"
                  >
                    <div className="skeleton mx-auto h-12 w-12 rounded-full" />
                    <div className="skeleton mx-auto mt-4 h-4 w-16 rounded" />
                    <div className="skeleton mx-auto mt-2 h-3 w-20 rounded" />
                  </div>
                )
              )}
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          RESULTS / TESTIMONIALS
      ===================================================== */}
      <section className="bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">

          <div className="mx-auto max-w-2xl text-center">
            <div className="skeleton mx-auto h-5 w-40 rounded" />
            <div className="skeleton mx-auto mt-4 h-9 w-full max-w-xl rounded-lg" />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-gray-100 bg-white p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="skeleton h-12 w-12 rounded-full" />

                  <div>
                    <div className="skeleton h-4 w-28 rounded" />
                    <div className="skeleton mt-2 h-3 w-16 rounded" />
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="skeleton h-3 w-full rounded" />
                  <div className="skeleton h-3 w-full rounded" />
                  <div className="skeleton h-3 w-4/5 rounded" />
                </div>

                <div className="skeleton mt-5 h-4 w-20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CITY / LOCATION SECTION
      ===================================================== */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">

          <div className="mx-auto max-w-2xl text-center">
            <div className="skeleton mx-auto h-5 w-40 rounded" />
            <div className="skeleton mx-auto mt-4 h-9 w-full max-w-2xl rounded-lg" />
            <div className="skeleton mx-auto mt-3 h-4 w-4/5 rounded" />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              1,
              2,
              3,
              4,
              5,
              6,
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-gray-100 bg-white p-5 text-center"
              >
                <div className="skeleton mx-auto h-10 w-10 rounded-full" />
                <div className="skeleton mx-auto mt-4 h-4 w-20 rounded" />
                <div className="skeleton mx-auto mt-2 h-3 w-28 rounded" />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section className="bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">

          <div className="overflow-hidden rounded-3xl bg-[#eef1f5] p-7 sm:p-10 lg:p-14">

            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_380px]">

              <div>
                <div className="skeleton h-9 w-full max-w-xl rounded-lg" />
                <div className="skeleton mt-3 h-9 w-4/5 max-w-lg rounded-lg" />

                <div className="mt-5 space-y-2">
                  <div className="skeleton h-4 w-full max-w-xl rounded" />
                  <div className="skeleton h-4 w-4/5 max-w-lg rounded" />
                </div>

                <div className="skeleton mt-7 h-12 w-40 rounded-xl" />
              </div>

              <div className="skeleton h-52 w-full rounded-2xl" />

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">

            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="skeleton h-10 w-36 rounded-lg" />

              <div className="mt-5 space-y-2">
                <div className="skeleton h-3 w-full rounded" />
                <div className="skeleton h-3 w-4/5 rounded" />
                <div className="skeleton h-3 w-3/4 rounded" />
              </div>

              <div className="mt-5 flex gap-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="skeleton h-9 w-9 rounded-full"
                  />
                ))}
              </div>
            </div>

            {/* Footer columns */}
            {[1, 2, 3].map((column) => (
              <div key={column}>
                <div className="skeleton h-4 w-28 rounded" />

                <div className="mt-5 space-y-3">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className="skeleton h-3 w-24 rounded"
                    />
                  ))}
                </div>
              </div>
            ))}

          </div>

          {/* Bottom */}
          <div className="mt-10 border-t border-gray-100 pt-6">
            <div className="skeleton h-3 w-64 max-w-full rounded" />
          </div>

        </div>
      </footer>
    </div>
  );
}