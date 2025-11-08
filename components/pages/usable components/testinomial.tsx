import { Star } from "lucide-react";

export type TestimonialCardProps = {
  name: string;
  score: string;
  testimonialText: string;
};

export const TestimonialCard = (props: TestimonialCardProps) => {
  return (
    <div className="relative bg-white box-border caret-transparent z-0 ml-[30px] rounded-3xl md:ml-[50px] before:accent-auto before:border-b-gray-200 before:box-border before:caret-transparent before:text-neutral-800 before:block before:text-base before:not-italic before:normal-nums before:font-normal before:h-0 before:left-[-35px] before:tracking-[normal] before:leading-6 before:list-outside before:list-disc before:pointer-events-auto before:absolute before:text-start before:indent-[0px] before:normal-case before:visible before:w-0 before:z-[-1] before:border-t-white before:border-t-[25px] before:border-x-transparent before:border-x-[50px] before:border-separate before:border-solid before:top-0 before:font-noto_sans before:md:left-[-50px] before:md:border-t-[55px] before:md:border-x-[80px]">
      <div className="box-border caret-transparent pt-5 px-5 md:pt-[35px] md:px-[30px]">
        <div className="items-center box-border caret-transparent flex justify-between">
          <h6 className="text-gray-700 text-lg font-bold box-border caret-transparent leading-[21.6px] mb-2">
            {props.name}: {props.score}
          </h6>
          <ul className="box-border caret-transparent flex leading-[normal] list-none mb-4 pl-0">
            {[1, 2, 3, 4, 5].map((star) => (
              <li key={star} className="text-amber-400 text-lg box-border caret-transparent">
                <Star className="w-[18px] h-[18px] fill-amber-400" />
              </li>
            ))}
          </ul>
        </div>
        <p className="text-zinc-500 text-sm font-medium box-border caret-transparent max-w-[90%] min-h-0 text-left mb-4 py-[15px] md:max-w-none md:min-h-[198px]">
          {props.testimonialText}
        </p>
      </div>
      <div className="bg-red-600 shadow-[rgba(0,0,0,0.25)_10px_10px_34px_0px_inset] box-border caret-transparent px-5 py-3.5 rounded-b-3xl md:px-[30px]"></div>
    </div>
  );
};