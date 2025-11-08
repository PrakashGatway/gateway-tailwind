import Link from "next/link";

export default function LocationAvailability({ cities }) {
  return (
    <section className="pb-8 w-[80%] mx-auto">
      <div className="container-sm">
        <div className="row">
          <div className="col-12">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-800 inline-block px-1 py-1 rounded-full ">🌍 Study Abroad Consultants in</h4>
            </div>

            <div style={{borderColor:'#f1f1f14a!important'}} className="flex gap-1 flex-wrap justify-start items-center sm:gap-3 overflow-x-auto scrollbar-thin border-b scrollbar-thumb-gray-300 scrollbar-track-transparent pb-3">
              {cities.map((city, index) => (
                <Link
                  key={index}
                  href={`/study-abroad/${city?.slug}`}
                  className={`relative flex items-center justify-center px-3 sm:px-3 py-2 text-sm md:text-xs font-medium capitalize whitespace-nowrap transition-all duration-300 border border-gray-200 rounded-full hover:bg-gray-50 hover:text-gray-900 shadow-sm
                 text-gray-700 `}
                >
                  {city?.slug.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .city-item {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .city-link {
          font-weight: 500;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.3s ease;
          padding-bottom: 3px;
        }
        
        .city-link:hover {
          color: #dc3545 !important;
          font-weight: 600;
          transform: scale(1.05);
        }
        
        .city-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #dc3545;
          transition: width 0.3s ease;
        }
        
        // .city-link:hover::after {
        //   width: 50%;
        // }
        
        .footer-title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 1rem;
        }
      `}</style>
    </section>
  )
}
