import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/Tips.css';

const Tips = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const mainTip = {
    bg: '/Media/Untitled design(8).png',
    title: 'Ways to make money from the Internet',
    text: 'A video from the Online Lessons channel discusses ways to make money online and increase your sources of income..',
    link: 'https://youtu.be/wAIIct0rNZU?si=duAyUiHhcqcePIbT'
  };

  const tips = [
    {
      bg: '/Media/Untitled design(10).png',
      title: 'The most important rule in investment',
      text: 'What is investment, why do we invest, and how? This clip will answer these questions.',
      link: 'https://youtu.be/bFfeCSbLaB8?si=EDYwvHJEwK6WHj4u'
    },
    {
      bg: '/Media/Untitled design(11).png',
      title: 'Best money management system',
      text: 'A video from the Dupamicaffeine channel shows a practical way to divide your monthly salary and increase your income..',
      link: 'https://youtu.be/loGAyJTbu88?si=C6H6odrof4pjwXlS'
    },
    {
      bg: '/Media/Untitled design(14).png',
      title: 'How to be creative in financial management and save your money?',
      text: 'YouTube video showing ways to manage your finances well.',
      link: 'https://youtu.be/s0t_4MSQEYQ?si=aX-tJnzhbu4Alc-w'
    },
    {
      bg: '/Media/Untitled design(12).png',
      title: 'financial freedom',
      text: 'YouTube clip from the show \"Seen\" talking about financial freedom.',
      link: 'https://youtu.be/kZTSzFfMFjY?si=yGGtVtRu5M5NTLLw'
    }
  ];

  const [currentTip, setCurrentTip] = useState(mainTip);
  const [hiddenSlides, setHiddenSlides] = useState([]);

  const handleSlideChange = (swiper) => {
    const realIndex = swiper.realIndex;
    console.log('Current slide index:', realIndex);
    
    // Set the current tip based on the active slide
    const newTip = realIndex - 1 === -1 ? mainTip : tips[realIndex - 1];
    setCurrentTip(newTip);
    
    // Create an array of indices for slides that should be hidden
    const newHiddenSlides = [];
    for (let i = 0; i < swiper.slides.length; i++) {
      if (i < realIndex) {
        newHiddenSlides.push(i);
      }
    }
    
    setHiddenSlides(newHiddenSlides);
    console.log('Hidden slides:', newHiddenSlides);
  };

  useEffect(() => {
    const root = document.getElementById('hero');
    if (root) {
      root.style.backgroundImage = `url('${currentTip.bg}')`;
      root.style.backgroundSize = 'cover';
      root.style.backgroundPosition = 'center';
    }
  }, [currentTip]);

  return (
    <div className="tips-wrapper">
      <div id="hero" className="hero d-flex justify-content-between align-items-end">
        <div className="hero-content mb-5">
          <h1 className="tip-title text-right">{currentTip.title}</h1>
          <p className="tip-text text-left">{currentTip.text}</p>
          <a href={currentTip.link} className="tip-link" target="_blank" rel="noopener noreferrer">
            Discover Now
          </a>
        </div>

        <div className="swiper-block">
          <Swiper
            modules={[Navigation]}
            slidesPerView={5}
            spaceBetween={20}
            centeredSlides={true}
            loop={false}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiperRef.current = swiper;
            }}
            onSlideChange={handleSlideChange}
            initialSlide={0}
          >
            {tips.map((tip, index) => (
              <SwiperSlide
                key={index}
                className={`tip-slide ${hiddenSlides.includes(index) ? 'hidden-slide' : ''}`}
                style={{ 
                  backgroundImage: `url('${tip.bg}')`,
                  opacity: hiddenSlides.includes(index) ? 0.3 : 1,
                  transform: hiddenSlides.includes(index) ? 'scale(0.9)' : 'scale(1)'
                }}
              ></SwiperSlide>
            ))}
            <SwiperSlide style={{ opacity: 0 }}></SwiperSlide>
          </Swiper>
          <div className="swiper-nav">
            <div ref={prevRef} className="swiper-button-prev visible-button"></div>
            <div ref={nextRef} className="swiper-button-next visible-button"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tips;