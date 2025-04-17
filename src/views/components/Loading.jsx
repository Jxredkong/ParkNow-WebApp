import React from "react";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "../../App.css"; // Ensure styles are applied

const Loading = () => {
  return (
    <div className="loading-container">
      <DotLottiePlayer
        src="/loading-car.lottie"
        autoplay
        loop
        className="loading-animation"
      />
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
