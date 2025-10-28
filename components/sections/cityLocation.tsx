import Link from "next/link";

export default function LocationAvailability({cities}) {
  return (
    <section className="pb-8">
      <div className="container-sm">
        <div className="row">
          <div className="col-12">
            <div className="mb-4">
              <h4 className="footer-title text-dark mb-4">STUDY ABROAD CONSULTATION IN</h4>
            </div>

            <div className="row">
              {cities.map((city, index) => (
                <div key={index} className="col-lg-2 col-md-3 col-sm-4 col-6 mb-1">
                  <div className="city-item">
                    <Link href={`/study-abroad/${city?.slug}`} className="city-link duration-200 hover:!translate-x-[6px] capitalize text-dark d-block position-relative">{city?.slug}</Link>
                  </div>
                </div>
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
