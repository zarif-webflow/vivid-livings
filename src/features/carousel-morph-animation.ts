import { EmblaNodeElement } from '@/types/embla';

type ChildAnimationElements = {
  details: HTMLElement | undefined | null;
  price: HTMLElement | undefined | null;
};
type ChildAnimationElementsMap = Map<Number, ChildAnimationElements>;

const init = () => {
  const featuredListingCarouslNodes = Array.from(
    document.querySelectorAll<EmblaNodeElement>('[data-carousel-parent][data-featured-listing]')
  );

  for (const carouselNode of featuredListingCarouslNodes) {
    let carouselApi = carouselNode.emblaApi;
    let slides = carouselApi?.slideNodes();
    let currentIndex = carouselApi?.selectedScrollSnap();

    const childAnimationElementsMap: ChildAnimationElementsMap = new Map();

    const selectCurrentSlide = (currIndex: number) => {
      if (slides === undefined) {
        console.debug('selectCurrentSlide was used before carousel was initialized');
        return;
      }

      const childElementsAnimationRevealState: gsap.TweenVars = {
        yPercent: 0,
        opacity: 1,
        stagger: 0.25,
        delay: 0.15,
        overwrite: true,
      };

      const childElementsAnimationHiddenState: gsap.TweenVars = {
        yPercent: -105,
        opacity: 0.5,
        overwrite: true,
      };

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i]!;
        const isCurrentSlide = i === currIndex;

        const childAnimationElements = childAnimationElementsMap.get(i);
        const childAnimationElementsArr = [
          childAnimationElements?.details,
          childAnimationElements?.price,
        ].filter((el) => el !== undefined && el !== null);

        if (isCurrentSlide) {
          gsap.to(slide, { scale: 1, x: 0, ease: 'back', duration: 0.7 });
          gsap.to(childAnimationElementsArr, childElementsAnimationRevealState);
        } else {
          const isLeftSide = i < currIndex;

          const positionIndex = isLeftSide ? currIndex - i - 1 : i - currIndex - 1;

          const transformAlign = isLeftSide ? 'right' : 'left';
          slide.style.transformOrigin = `${transformAlign} center`;

          gsap.to(slide, {
            x: () => {
              const gapAdjustment = Number.parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue(
                  '--_responsive---featured-listing-carousel--animation-gap-adjustment-percent'
                )
              );

              return isLeftSide
                ? `${gapAdjustment * positionIndex}%`
                : `-${gapAdjustment * positionIndex}%`;
            },
            scale: () => {
              const scale = getComputedStyle(document.documentElement).getPropertyValue(
                '--_responsive---featured-listing-carousel--inactive-slide-scale-ratio'
              );
              return scale;
            },
            ease: 'back',
            duration: 0.7,
          });
          gsap.to(childAnimationElementsArr, childElementsAnimationHiddenState);
        }
      }
    };

    carouselNode.addEventListener('embla:init', (event) => {
      carouselApi = event.detail.embla;

      slides = carouselApi.slideNodes();
      currentIndex = carouselApi.selectedScrollSnap();

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i]!;
        const details = slide.querySelector<HTMLElement>('[data-featured-details]');
        const price = slide.querySelector<HTMLElement>('[data-featured-price]');

        const childAnimationElements: ChildAnimationElements = { details, price };

        childAnimationElementsMap.set(i, childAnimationElements);
      }

      selectCurrentSlide(currentIndex);
    });

    carouselNode.addEventListener('embla:select', (event) => {
      carouselApi = event.detail.embla;

      currentIndex = carouselApi.selectedScrollSnap();

      selectCurrentSlide(currentIndex);
    });

    carouselNode.addEventListener('embla:reInit', (event) => {
      carouselApi = event.detail.embla;

      currentIndex = carouselApi.selectedScrollSnap();

      selectCurrentSlide(currentIndex);
    });
  }
};

init();
