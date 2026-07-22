import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import img1 from '../assets/hero.png'

const MyCarousel = () => {
  return (
    <Carousel infiniteLoop dynamicHeight>
      <div>
        <img src="pexels-nana-llj-38667937.jpg" />
        <p className="legend">China</p>
      </div>
      <div>
        <img src={img1} />
        <p className="legend">Hero Image</p>
      </div>
      <div>
        <img src="https://images.pexels.com/photos/32885186/pexels-photo-32885186.jpeg" />
        <p className="legend">Online Image</p>
      </div>
    </Carousel>
  );
};

export default MyCarousel;
