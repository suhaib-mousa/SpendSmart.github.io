import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/Tips.css';

const Tips = () => {
  const [currentTip, setCurrentTip] = useState({
    bg: '/html/Media/Untitled design(8).png',
    title: 'Ways to make money from the Internet',
    text: 'A video from the Online Lessons channel discusses ways to make money online and increase your sources of income..',
    link: 'https://youtu.be/wAIIct0rNZU?si=duAyUiHhcqcePIbT'
  });

  const tips = [
    {
      bg: '/html/Media/Untitled design(10).png',
      title: 'The most important rule in investment',
      text: 'What is investment, why do we invest, and how? This clip will answer these questions.',
      link: 'https://youtu.be/bFfeCSbLaB8?si=EDYwvHJEwK6WHj4u'
    },
    {
      bg: '/html/Media/Untitled design(11).png',
      title: 'Best money management system',
      text: 'A video from the Dupamicaffeine channel shows a practical way to divide your monthly salary and increase your income..',
      link: 'https://youtu.be/loGAyJTbu88?si=C6H6odrof4pjwXlS'
    },
    {
      bg: '/html/Media/Untitled design(14).png',
      title: 'How to be creative in financial management and save your money?',
      text: 'YouTube video showing ways to manage your finances well.',
      link: 'https://youtu.be/s0t_4MSQEYQ?si=aX-tJnzhbu4Alc-w'
    },
    {
      bg: '/html/Media/Untitled design(12).png',
      title: 'financial freedom',
      text: 'YouTube clip from the show \'Seen\' talking about financial freedom.',
      link: 'https://youtu.be/kZTSzFfMFjY?si=yGGtVtRu5M5NTLLw'
    }
  ];

  const handleSlideChange = (swiper) => {
    const realIndex = swiper.realIndex;
    if (realIndex === 0) {
      setCurrentTip({
        bg: '/html/Media/Untitled design(8).png',
        title: 'Ways to make money from the Internet',
        text: 'A video from the Online Lessons channel discusses ways to make money online and increase your sources of income..',
        link: 'https://youtu.be/wAIIct0rNZU?si=duAyUiHhcqcePIbT'
      });
    } else {
      setCurrentTip(tips[realIndex - 1]);
    }
  };

  useEffect(() => {
    document.body.style.backgroundImage = `url(${currentTip.bg})`;
    return () => {
      document.body.style.backgroundImage = 'none';
    };
  }, [currentTip]);

  return (
    <div className="tips-container" style={{ backgroundImage: `url(${currentTip.bg})` }}>
      <div className="hero d-flex align-items-end">
        <div className="hero-content mb-5">
          <h1 className="tip-title text-right">{currentTip.title}</h1>
          <p className="tip-text text-left">{currentTip.text}</p>
          <a href={currentTip.link} className="tip-link" target="_blank" rel="noopener noreferrer">
            Discover Now
          </a>
        </div>

        <div className="d-flex flex-column">
          <div className="swiper-container">
            <Swiper
              modules={[Navigation]}
              slidesPerView={5}
              spaceBetween={20}
              centeredSlides={true}
              navigation={true}
              onSlideChange={handleSlideChange}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 10
                },
                480: {
                  slidesPerView: 2,
                  spaceBetween: 15
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 15
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 20
                }
              }}
            >
              {tips.map((tip, index) => (
                <SwiperSlide
                  key={index}
                  style={{ backgroundImage: `url(${tip.bg})` }}
                ></SwiperSlide>
              ))}
              <SwiperSlide style={{ opacity: 0 }}></SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tips;