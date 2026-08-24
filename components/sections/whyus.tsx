
import { useGlobal } from "@/hooks/AppStateContext";
import { BookOpen, Award, Clock, Laptop } from "lucide-react";
import { DynamicIcon } from "./processRoad";

export default function CardLayout({ content }: any) {
    const { drawer, setDrawer } = useGlobal()
    return (
        <section className=" py-6 sm:py-8 bg-[#FAFBFF] px-4">
            <div className="text-center mb-6 sm:mb-8">
                <h2 className="heading text-center d-block mb-2 text-xl sm:text-2xl font-bold">
                    {content?.title || "Why Choose Our Study Platform?"}
                </h2>
                <p className="sub-heading !text-xm sm:!text-base max-w-full sm:max-w-3xl mx-auto">
                    {content?.subTittle || "We provide comprehensive support to make your UK education dreams a reality with personalized guidance and expert assistance."}
                </p>
            </div>

            <div className="max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-7xl mx-auto p-3 sm:p-4 grid grid-cols-2 gap-4 sm:gap-6">

                {/* Left Column */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:w-[100%]">

                    {/* Top row - two cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                        {/* Card 1 */}
                        {content?.Cards && content?.Cards.slice(0, 2).map((card: any, index: any) => (
                            <div key={index} className="bg-white shadow-lg hover:shadow-xl transition-all rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100">
                                <DynamicIcon name={card.icon} size={28} className="w-8 h-8 text-[#DC2626] mb-2 sm:mb-3" />
                                <h3 className="sub-heading mb-1 sm:mb-2 text-xm sm:text-base">{card.name || "Expert Instructors"}</h3>
                                <p className="text-gray-800 text-xm sm:text-base">
                                    {card.content || "Learn directly from seasoned professionals who bring real-world"}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Bottom row - full width card */}
                    {content?.Cards && content?.Cards.slice(2, 3).map((card: any, index: any) => (
                        <div key={index} className="bg-white shadow-lg hover:shadow-xl transition-all rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100">
                            <DynamicIcon name={card.icon} size={28} className="w-8 h-8 text-[#DC2626] mb-2 sm:mb-3" />
                            <h3 className="sub-heading mb-1 sm:mb-2 text-xm sm:text-base">{card.name || "100+ Career-Boosting Courses"}</h3>
                            <p className="text-gray-800 text-xm sm:text-base">
                                {card.content || "Access our growing library of over 100 courses across web development, data science, design, and business. Updated regularly to keep you ahead in your field."}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Right Column - single tall card */}
                {content?.Cards && content?.Cards.length > 3 && content.Cards[3] && (
                    <div className="bg-[#FBE7EA] text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-lg">
                        <div>
                            <DynamicIcon name={content.Cards[3].icon} size={28} className="w-8 h-8 text-[#DC2626] mb-2 sm:mb-3" />
                            <h3 className="sub-heading !text-[#D71635] font-bold mb-1 sm:mb-2 text-xm sm:text-base">{content.Cards[3].name || "Flexible Learning Schedules"}</h3>
                            <p className="text-[#1F2937] text-xm sm:text-base">
                                {content.Cards[3].content || "Learn at your own pace with lifetime access to course materials. Our flexible schedules fit into your busy life, allowing you to balance learning with work and personal commitments."}
                            </p>
                        </div>
                        <button onClick={() => setDrawer(!drawer)} className="mt-4 sm:mt-6 btn-primary border border-white py-2 px-3 sm:py-2 sm:px-4 text-xm">
                            Start Your Journey →
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
