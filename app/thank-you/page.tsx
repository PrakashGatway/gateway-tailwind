import { Facebook, Instagram, MessageSquare, Youtube } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata() {
  const seoData = {
    title: "Thank You - Gateway Abroad",
    description: "Thank you for contacting Gateway Abroad! Our experts will reach out to you soon.",
    keywords: "Study Abroad, IELTS, TOEFL, Gateway Abroad, thank you page",
    ogTitle: "Thank You - Gateway Abroad",
    ogDescription: "We appreciate your interest in Gateway Abroad. Stay tuned for updates!",
    ogImage: "/img/og-about.jpg",
    twitterTitle: "Thank You - Gateway Abroad",
    twitterDescription: "Thanks for getting in touch! Our team will contact you shortly.",
    twitterImage: "/img/og-about.jpg",
    canonical: "https://www.gatewayabroadeducations.com/thank-you"
  };

  return {
    metadataBase: new URL('https://www.gatewayabroadeducations.com'),
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    openGraph: {
      title: seoData.ogTitle,
      description: seoData.ogDescription,
      images: [seoData.ogImage],
      url: seoData.canonical,
      type: "website",
      site_name: "Gateway Abroad Education",
    },
    twitter: {
      card: "summary_large_image",
      title: seoData.twitterTitle,
      description: seoData.twitterDescription,
      images: [seoData.twitterImage],
    },
    alternates: { canonical: seoData.canonical },
  };
}

const Thankyou = () => {
    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/img/Background.png')" }}>
            {/* Main Content */}
            <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
                {/* Logo Section */}
                <div className="mb-10 text-center">
                    <Link href="/" className="inline-block">
                        <img 
                            src="/img/ga-logo.svg" 
                            alt="Gateway Abroad Logo" 
                            className="h-16 md:h-20 w-auto mx-auto"
                        />
                    </Link>
                </div>

                {/* Thank You Heading */}
                <div className="w-full max-w-4xl mb-6">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-900 leading-tight">
                        Thank You for Reaching Out to Gateway Abroad!
                    </h1>
                </div>

                {/* Thank You Message */}
                <div className="w-full max-w-2xl mb-12">
                    <p className="text-lg md:text-xl text-gray-700 text-center leading-relaxed">
                        Thank you for submitting the form! Our expert consultant will review your details 
                        and reach out to you soon. In the meantime, feel free to explore our services 
                        or contact us for any immediate questions.
                    </p>
                </div>

                {/* Stay Tuned Link */}
                <div className="mb-12">
                    <Link
                        href="/" 
                        className="inline-block bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200" 
                        rel="noopener noreferrer"
                    >
                        Stay tuned for exciting opportunities!
                    </Link>
                </div>

                {/* Social Media Section */}
                <div className="mt-auto pt-8">
                    <p className="text-center text-gray-600 mb-6 text-lg">
                        Get social with us
                    </p>
                    
                    <div className="flex justify-center items-center space-x-8 md:space-x-12">
                        <Link 
                            href="https://www.facebook.com/gagatewayabroadjaipur?mibextid=ZbWKwL" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-12 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-300 hover:scale-110"
                        >
                            <Facebook className="h-5 w-5" />
                        </Link>
                        
                        <Link 
                            href="https://www.youtube.com/@GatewayAbroadJaipur" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-12 h-12 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-300 hover:scale-110"
                        >
                            <Youtube className="h-5 w-5" />
                        </Link>
                        
                        <Link 
                            href="https://api.whatsapp.com/send?phone=8302092630" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-12 h-12 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-full transition-all duration-300 hover:scale-110"
                        >
                          <MessageSquare className="w-5 h-5 " />
                        </Link>
                        
                        <Link 
                            href="https://www.instagram.com/testprep_with_gatewayjaipur/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-12 h-12 flex items-center justify-center bg-pink-600 hover:bg-pink-700 text-white rounded-full transition-all duration-300 hover:scale-110"
                        >
                           <Instagram className="w-5 h-5 " />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Thankyou;