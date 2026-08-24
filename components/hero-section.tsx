import { MessageCircle } from "lucide-react";
import Image from "next/image"
import Link from "next/link"



const HeroSection = ({ type, title, description, image, content }: any) => {

  const handleGetStarted = () => {
    window.dispatchEvent(new CustomEvent('openFooterModal'));
  };


  return (
    <section className="hero-gradient  py-12 flex items-center relative overflow-hidden w-full"> {/* Full width background */}
      {/* Animated background elements */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-28 left-10 w-4 h-4 bg-red-500 rounded-full animate-bounce-slow"></div>
        <div className="absolute top-32 left-16 w-2 h-2 bg-red-500 rounded-full animate-pulse-slow animate-stagger-1"></div>
        <div className="absolute top-44 left-12 w-2 h-2 bg-red-500 rounded-full animate-pulse-slow animate-stagger-2"></div>
        <div className="absolute top-56 left-18 w-2 h-2 bg-red-500 rounded-full animate-pulse-slow animate-stagger-3"></div>
        <div className="absolute top-68 left-14 w-2 h-2 bg-red-500 rounded-full animate-pulse-slow animate-stagger-4"></div>

        <div className="absolute top-20 right-20 w-20 h-20 border-2 border-red-300 rounded-full animate-rotate-slow"></div>
        <div className="absolute bottom-40 left-20 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-red-300 animate-float"></div>

        
        <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-pink-400 rounded-full animate-float animate-stagger-2"></div>
        <div className="absolute bottom-1/3 right-1/3 w-8 h-8 bg-yellow-400 rounded-full animate-bounce-slow animate-stagger-3"></div>
      </div> */}

      {/* Content container with responsive padding */}
      <div className="w-full px-6 sm:px-[4rem] lg:px-10"> {/* Add responsive padding here */}
        <div className="container-sm max-w-7xl mx-auto sm:py-20 py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-3">
              <div className="">
                <h1 className="text-3xl lg:text-4xl font-bold leading-[1.1]">
                  <span className="inline">{title?.split(';')[0] || "Gateway"}</span>
                  {/* <br /> */}
                  {type != "about" && <> <span className="text-gradient py-1 inline">
                    {title?.split(';')?.slice(1, title?.split(';')?.length)?.join(" ") || "Abroad Jaipur"}
                  </span>
                    <br /> </>}
                </h1>
              </div>

              <div>
                <div className="text-gray-600 text-base text-justify leading-relaxed max-w-3xl" dangerouslySetInnerHTML={{ __html: description }}></div>
              </div>

              <div className="flex flex-col pb-10 sm:flex-row gap-4 animate-stagger-4">
                <Link href="" className="btn-primary inline-block text-center group ">
                  <span className="relative z-10" onClick={handleGetStarted}>
                    Get Free Counselling — 100% Free
                  </span>
                </Link>
                <Link
                  href="https://wa.me/918302092630"
                  target="_blank"
                  className="flex items-center justify-center gap-2  bg-white  text-[#D81635] border border-[#D81635] px-6 py-2.5 rounded-lg font-semibold transition hover:-translate-y-[2px] hover:shadow-lg"
                >
                  {/* WhatsApp SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    className="w-8 h-8"
                    fill="#25D366"
                  >
                    <path d="M16.04 2.003C8.29 2.003 2 8.29 2 16.04c0 2.83.83 5.46 2.26 7.68L2 30l6.45-2.21a13.96 13.96 0 0 0 7.59 2.21c7.75 0 14.04-6.29 14.04-14.04 0-7.75-6.29-13.96-14.04-13.96zm0 25.48c-2.32 0-4.59-.62-6.56-1.8l-.47-.28-3.83 1.31 1.25-3.74-.31-.49a11.46 11.46 0 0 1-1.75-6.12c0-6.34 5.16-11.5 11.5-11.5 3.07 0 5.95 1.2 8.13 3.37a11.4 11.4 0 0 1 3.36 8.13c0 6.34-5.16 11.5-11.5 11.5zm6.31-8.63c-.35-.18-2.06-1.02-2.38-1.14-.32-.12-.55-.18-.78.18-.23.35-.9 1.14-1.1 1.37-.2.23-.4.26-.75.09-.35-.18-1.47-.54-2.8-1.72-1.03-.92-1.72-2.05-1.92-2.4-.2-.35-.02-.54.15-.72.15-.15.35-.4.52-.6.17-.2.23-.35.35-.58.12-.23.06-.43-.03-.6-.09-.18-.78-1.88-1.07-2.57-.28-.67-.56-.58-.78-.59h-.66c-.23 0-.6.09-.91.43-.32.35-1.2 1.17-1.2 2.85 0 1.68 1.23 3.3 1.4 3.53.17.23 2.42 3.7 5.87 5.18.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2.06-.84 2.35-1.65.29-.81.29-1.5.2-1.65-.09-.15-.32-.23-.66-.41z" />
                  </svg>
                  Chat with us
                </Link>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 ">
                {content?.stats?.map((metric, idx) => {
                  const bg = 'bg-[#D81635]'

                  return (
                    <div
                      key={idx}
                      className={`${idx % 2 === 0 ? bg : 'bg-gold-light border-2 border-black'} rounded-12 p-4 sm:p-3 text-center`}
                    >
                      <span className={` text-lg sm:text-xl font-extrabold block leading-none ${idx % 2 === 0 ? 'text-white' : 'text-black'}`}>
                        {metric?.value}
                      </span>
                      <span className={`text-[10px] sm:text-xs mt-1.5 block font-medium ${idx % 2 === 0 ? 'text-white' : 'text-black'}`}>
                        {metric?.content}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Stats with animation */}
              {/* <div className="grid grid-cols-3 gap-6 pt-8 animate-fadeInUp animate-stagger-5">
                <div className="text-center group">
                  <div className="text-2xl lg:text-3xl font-bold text-gradient group-hover:scale-110 transition-transform duration-300">
                    500+
                  </div>
                  <p className="text-gray-600 text-xm">Students Placed</p>
                </div>
                <div className="text-center group">
                  <div className="text-2xl lg:text-3xl font-bold text-gradient group-hover:scale-110 transition-transform duration-300">
                    15+
                  </div>
                  <p className="text-gray-600 text-xm">Countries</p>
                </div>
                <div className="text-center group">
                  <div className="text-2xl lg:text-3xl font-bold text-gradient group-hover:scale-110 transition-transform duration-300">
                    98%
                  </div>
                  <p className="text-gray-600 text-xm">Success Rate</p>
                </div>
              </div> */}
            </div>

            {/* Right Illustration with floating animation */}
            <div className="relative animate-fadeInRight mx-auto">
              <div className="relative z-10 animate-floa mx-auto">
                <Image
                  src={title ? image : "https://uat.gatewayabroadeducations.com/uploads/1725703170821-319524011.svg"}
                  alt="Study Abroad Illustration"
                  width={type == "about" ? 490 : 430}
                  height={400}
                  className="drop-shadow-xl"
                  loading="lazy"
                />
              </div>

              {/* Background circle with pulse animation */}
              {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white bg-opacity-30 rounded-full animate-pulse-slow -z-10"></div> */}

              {/* Additional decorative elements */}


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