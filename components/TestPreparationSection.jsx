import Image from "next/image"
import Link from "next/link"

const TestPreparation = ({CourseData}) => {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
        {CourseData && CourseData.map((test, index) => (
          <Link
            href={`/course/${test.pageName}`}
            key={test.id}
            className={`
                relative overflow-hidden rounded-3xl p-6 cursor-pointer
                transition-all duration-500 ease-out
                transform hover:scale-103
                shadow-xl hover:shadow-2xl
                backdrop-blur-sm border border-white/20
                ${test.isHighlighted
                ? "bg-gradient-to-br from-rose-600 via-rose-500 to-pink-600 text-white"
                : "bg-gradient-to-br from-gray-300 via-gray-50 to-white text-gray-800 hover:from-rose-700 hover:via-rose-600 hover:to-pink-600 hover:text-white"
              }
                group animate-fade-in
              `}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gray rounded-full -translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-900"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12 group-hover:scale-150 transition-transform duration-700"></div>
            </div>
            <div className="absolute inset-0  from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-2xl font-bold mb-3 text-center transition-all duration-600 group-hover:scale-105">
                {test.pageName}
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-center transition-all duration-600 opacity-90 group-hover:opacity-100">
                {test.pageTitle}
              </p>
            </div>
            <div className="absolute inset-0 rounded-3xl transition-all duration-500 opacity-0 group-hover:opacity-100">
              <div className="absolute inset-0 rounded-3xl  from-rose-400 via-pink-400 to-rose-400 p-0.5">
                <div className="w-full h-full rounded-3xl bg-transparent"></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

export default TestPreparation
