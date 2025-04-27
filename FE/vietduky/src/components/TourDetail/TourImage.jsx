import { useEffect, useState } from "react";
import { TourService } from "@/services/API/tour.service";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

export default function TourImage({ id }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [album, setAlbum] = useState([]);

  const fallbackImage = "/Image/Overlay+Shadow.png";

  useEffect(() => {
    TourService.getTour(id)
      .then((res) => {
        const images = res.data.data.album;
        if (Array.isArray(images)) {
          setAlbum(images);
        } else {
          setAlbum([]);
        }
      })
      .catch((err) => console.error("Error fetching tour data:", err));
  }, [id]);

  const displayAlbum = album.length > 0 ? album : [fallbackImage];

  // console.log("Album", album);

  return (
    <div className="w-full">
      {/* Swiper chính */}
      <Swiper
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mb-4 rounded-lg overflow-hidden h-[580px] transition-all"
      >
        {displayAlbum.map((url, index) => (
          <SwiperSlide key={index}>
            <img
              src={url || "/Image/Overlay+Shadow.png"}
              alt={`Tour Image ${index}`}
              className="w-full object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Swiper thumbnail */}
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="rounded-lg"
      >
        {displayAlbum.map((url, index) => (
          <SwiperSlide key={index}>
            <img
              src={url}
              alt={`Thumb ${index}`}
              className="w-full h-32 object-cover cursor-pointer border rounded-md hover:opacity-80"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
