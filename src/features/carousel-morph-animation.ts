import { EmblaNodeElement } from '@/types/embla';

type ChildAnimationElements = {
  heading: HTMLElement | undefined | null;
  details: HTMLElement | undefined | null;
  price: HTMLElement | undefined | null;
};
type ChildAnimationElementsMap = Map<HTMLElement, ChildAnimationElements>;

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

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i]!;
        const isCurrentSlide = i === currIndex;

        // const childAnimationElements = childAnimationElementsMap.get(slide)!;

        // console.log(childAnimationElements, 'Child Animation Elements');

        if (isCurrentSlide) {
          gsap.to(slide, { scale: 1, x: 0, ease: 'back', duration: 0.7 });
          // gsap.fromTo(
          //   [
          //     childAnimationElements.heading,
          //     childAnimationElements.details,
          //     childAnimationElements.price,
          //   ],
          //   { yPercent: -100, opacity: 0 },
          //   {
          //     yPercent: 0,
          //     opacity: 1,
          //   }
          // );
        } else {
          const isLeftSide = i < currIndex;

          const positionIndex = isLeftSide ? currIndex - i - 1 : i - currIndex - 1;

          const transformAlign = isLeftSide ? 'right' : 'left';
          slide.style.transformOrigin = `${transformAlign} center`;

          gsap.to(slide, {
            x: () => {
              const morphX = Number.parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue(
                  '--featured-animation-morph-x-percent'
                )
              );

              return isLeftSide ? `${morphX * positionIndex}%` : `-${morphX * positionIndex}%`;
            },
            scale: () => {
              const scale = getComputedStyle(document.documentElement).getPropertyValue(
                '--featured-animation-scale'
              );
              return scale;
            },
            ease: 'back',
            duration: 0.7,
          });
          // gsap.fromTo(
          //   [
          //     childAnimationElements.heading,
          //     childAnimationElements.details,
          //     childAnimationElements.price,
          //   ],
          //   { yPercent: -100, opacity: 0 },
          //   {
          //     yPercent: 0,
          //     opacity: 1,
          //   }
          // );
        }
      }
    };

    carouselNode.addEventListener('embla:init', (event) => {
      carouselApi = event.detail.embla;

      slides = carouselApi.slideNodes();
      currentIndex = carouselApi.selectedScrollSnap();

      selectCurrentSlide(currentIndex);

      /*
      for (const slide of slides) {
        const heading = slide.querySelector<HTMLElement>('[data-featured-heading]');
        const details = slide.querySelector<HTMLElement>('[data-featured-details]');
        const price = slide.querySelector<HTMLElement>('[data-featured-price]');

        const childAnimationElements: ChildAnimationElements = { heading, details, price };

        childAnimationElementsMap.set(slide, childAnimationElements);
      }
        */
    });

    carouselNode.addEventListener('embla:select', (event) => {
      carouselApi = event.detail.embla;

      currentIndex = carouselApi.selectedScrollSnap();

      selectCurrentSlide(currentIndex);
    });
  }
};

init();
