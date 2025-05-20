const init = () => {
  const featuredListingCarouslNodes = Array.from(document.querySelectorAll("[data-carousel-parent][data-featured-listing]"));
  for (const carouselNode of featuredListingCarouslNodes) {
    let carouselApi = carouselNode.emblaApi;
    let slideCards = Array.from(carouselNode.querySelectorAll("[data-carousel-card]"));
    let currentIndex = carouselApi?.selectedScrollSnap();
    const childAnimationElementsMap = /* @__PURE__ */ new Map();
    const selectCurrentSlide = (currIndex) => {
      if (slideCards === void 0) {
        console.debug("selectCurrentSlide was used before carousel was initialized");
        return;
      }
      const childElementsAnimationRevealState = {
        yPercent: 0,
        opacity: 1,
        stagger: 0.25,
        delay: 0.15,
        overwrite: true
      };
      const childElementsAnimationHiddenState = {
        yPercent: -105,
        opacity: 0.5,
        overwrite: true
      };
      for (let i = 0; i < slideCards.length; i++) {
        const slideCard = slideCards[i];
        const isCurrentSlide = i === currIndex;
        const childAnimationElements = childAnimationElementsMap.get(i);
        const childAnimationElementsArr = [
          childAnimationElements?.details,
          childAnimationElements?.price
        ].filter((el) => el !== void 0 && el !== null);
        if (isCurrentSlide) {
          gsap.to(slideCard, { scale: 1, x: 0, ease: "back", duration: 0.7 });
          gsap.to(childAnimationElementsArr, childElementsAnimationRevealState);
        } else {
          const isLeftSide = i < currIndex;
          const positionIndex = isLeftSide ? currIndex - i - 1 : i - currIndex - 1;
          const transformAlign = isLeftSide ? "right" : "left";
          slideCard.style.transformOrigin = `${transformAlign} top`;
          gsap.to(slideCard, {
            x: () => {
              const gapAdjustment = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--_responsive---featured-listing-carousel--animation-gap-adjustment-percent"));
              return isLeftSide ? `${gapAdjustment * positionIndex}%` : `-${gapAdjustment * positionIndex}%`;
            },
            scale: () => {
              const scale = getComputedStyle(document.documentElement).getPropertyValue("--_responsive---featured-listing-carousel--inactive-slide-scale-ratio");
              return scale;
            },
            ease: "back",
            duration: 0.7
          });
          gsap.to(childAnimationElementsArr, childElementsAnimationHiddenState);
        }
      }
    };
    carouselNode.addEventListener("embla:init", (event) => {
      carouselApi = event.detail.embla;
      slideCards = Array.from(carouselNode.querySelectorAll("[data-carousel-card]"));
      currentIndex = carouselApi.selectedScrollSnap();
      for (let i = 0; i < slideCards.length; i++) {
        const slideCard = slideCards[i];
        const details = slideCard.querySelector("[data-featured-details]");
        const price = slideCard.querySelector("[data-featured-price]");
        const childAnimationElements = { details, price };
        childAnimationElementsMap.set(i, childAnimationElements);
      }
      selectCurrentSlide(currentIndex);
    });
    carouselNode.addEventListener("embla:select", (event) => {
      carouselApi = event.detail.embla;
      currentIndex = carouselApi.selectedScrollSnap();
      selectCurrentSlide(currentIndex);
    });
    carouselNode.addEventListener("embla:reInit", (event) => {
      carouselApi = event.detail.embla;
      currentIndex = carouselApi.selectedScrollSnap();
      selectCurrentSlide(currentIndex);
    });
  }
};
init();
