import Image from "next/image"
import Link from "next/link"

const HeroSection = ({ type, title, description, image }: any) => {
  return (
    <section className="hero-gradient pt-12 py-12 flex items-center relative overflow-hidden w-full"> {/* Full width background */}
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* <div className="absolute top-28 left-10 w-4 h-4 bg-red-500 rounded-full animate-bounce-slow"></div>
        <div className="absolute top-32 left-16 w-2 h-2 bg-red-500 rounded-full animate-pulse-slow animate-stagger-1"></div>
        <div className="absolute top-44 left-12 w-2 h-2 bg-red-500 rounded-full animate-pulse-slow animate-stagger-2"></div>
        <div className="absolute top-56 left-18 w-2 h-2 bg-red-500 rounded-full animate-pulse-slow animate-stagger-3"></div>
        <div className="absolute top-68 left-14 w-2 h-2 bg-red-500 rounded-full animate-pulse-slow animate-stagger-4"></div> */}

        <div className="absolute top-20 right-20 w-20 h-20 border-2 border-red-300 rounded-full animate-rotate-slow"></div>
        <div className="absolute bottom-40 left-20 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-red-300 animate-float"></div>

        {/* Additional floating elements */}
        <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-pink-400 rounded-full animate-float animate-stagger-2"></div>
        <div className="absolute bottom-1/3 right-1/3 w-8 h-8 bg-yellow-400 rounded-full animate-bounce-slow animate-stagger-3"></div>
      </div>

      {/* Content container with responsive padding */}
      <div className="w-full px-4 sm:px-6 lg:px-8"> {/* Add responsive padding here */}
        <div className="container-sm max-w-7xl mx-auto sm:py-24 py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-3">
              <div className="">
                <h1 className="text-3xl lg:text-[2.5rem] font-bold leading-[1.1]">
                  <span className="inline">{title?.split(';')[0] || "Gateway"}</span>
                  {/* <br /> */}
                  {type != "about" && <> <span className="text-gradient py-1 inline">
                    {title?.split(';')?.slice(1, title?.split(';')?.length)?.join(" ") || "Abroad Jaipur"}
                  </span>
                    <br /> </>}
                </h1>
              </div>

              <div className="">
                <div className="text-gray-600 text-base text-justify leading-relaxed max-w-3xl" dangerouslySetInnerHTML={{ __html: description }}></div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animate-stagger-4">
                <Link href="/contact" className="btn-primary inline-block text-center group">
                  <span className="relative z-10">Get Started Today</span>
                </Link>
                <Link href="/about" className="btn-secondary text-center group">
                  Learn More
                </Link>
              </div>

              {/* Stats with animation */}
              {/* <div className="grid grid-cols-3 gap-6 pt-8 animate-fadeInUp animate-stagger-5">
                <div className="text-center group">
                  <div className="text-2xl lg:text-3xl font-bold text-gradient group-hover:scale-110 transition-transform duration-300">
                    500+
                  </div>
                  <p className="text-gray-600 text-sm">Students Placed</p>
                </div>
                <div className="text-center group">
                  <div className="text-2xl lg:text-3xl font-bold text-gradient group-hover:scale-110 transition-transform duration-300">
                    15+
                  </div>
                  <p className="text-gray-600 text-sm">Countries</p>
                </div>
                <div className="text-center group">
                  <div className="text-2xl lg:text-3xl font-bold text-gradient group-hover:scale-110 transition-transform duration-300">
                    98%
                  </div>
                  <p className="text-gray-600 text-sm">Success Rate</p>
                </div>
              </div> */}
            </div>

            {/* Right Illustration with floating animation */}
            <div className="relative animate-fadeInRight mx-auto">
              <div className="relative z-10 animate-floa mx-auto">
                <Image
                  src={title ? image : "https://www.gatewayabroadeducations.com/uploads/1725703170821-319524011.svg"}
                  alt="Study Abroad Illustration"
                  width={type == "about" ? 490 : 430}
                  height={400}
                  className="drop-shadow-xl"
                  priority
                />
              </div>

              {/* Background circle with pulse animation */}
              {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white bg-opacity-30 rounded-full animate-pulse-slow -z-10"></div> */}

              {/* Additional decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-bounce-slow"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse-slow"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection