import React from "react";
import Banner from "@/assets/images/HeaderBanner.jpeg";

const BannerArticle = () => {
  return (
    <div className="relative h-48 md:h-64 w-full">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${Banner})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-zinc-900 bg-opacity-70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-xl md:text-4xl font-bold leading-10">
          Hướng dẫn của bạn đến mọi nơi
        </h1>
        <p className="text-lg leading-7 mt-2">
          Tìm cảm hứng, hướng dẫn và câu chuyện cho bất cứ nơi nào bạn đến
        </p>
      </div>
    </div>
  );
};

export default BannerArticle;
