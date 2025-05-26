import React from 'react';

// Mock Swiper components
export const Swiper = ({ children, ...props }) => {
  // Filter out Swiper-specific props that shouldn't be passed to DOM elements
  const {
    modules,
    slidesPerView,
    spaceBetween,
    centeredSlides,
    loop,
    navigation,
    onBeforeInit,
    onSlideChange,
    initialSlide,
    ...domProps
  } = props;
  
  return React.createElement('div', { 'data-testid': 'swiper', ...domProps }, children);
};

export const SwiperSlide = ({ children, ...props }) => {
  return React.createElement('div', { 'data-testid': 'swiper-slide', ...props }, children);
};

// Mock Swiper modules
export const Navigation = {};
export const Pagination = {};
export const Autoplay = {};

// Default export for swiper/react
export default {
  Swiper,
  SwiperSlide
}; 