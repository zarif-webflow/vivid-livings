import { EmblaNodeElement } from '@/types/embla';

const init = () => {
  const featuredListingCarouslNodes = Array.from(
    document.querySelectorAll<EmblaNodeElement>('[data-carousel-parent][data-featured-listing]')
  );

  for (const carouselNode of featuredListingCarouslNodes) {
    let carouselApi = carouselNode.emblaApi;
    let slides = carouselApi?.slideNodes();
    let currentIndex = carouselApi?.selectedScrollSnap();

    const selectCurrentSlide = (currIndex: number) => {
      if (slides === undefined) {
        console.debug('selectCurrentSlide was used before carousel was initialized');
        return;
      }

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i]!;
        const isCurrentSlide = i === currIndex;

        if (isCurrentSlide) {
          // expandSlide(slide);
          // Reset any translation for current slide
          gsap.to(slide, { scale: 1, x: 0 });
        } else {
          // Determine if slide is left or right of current slide
          const isLeftSide = i < currIndex;
          // const isRightSide = i > currIndex;

          // Calculate position within left or right group
          const positionIndex = isLeftSide
            ? currIndex - i - 1 // For left slides (counting from closest to current)
            : i - currIndex - 1; // For right slides (counting from closest to current)

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
          });
        }
      }
    };

    carouselNode.addEventListener('embla:init', (event) => {
      carouselApi = event.detail.embla;

      slides = carouselApi.slideNodes();
      currentIndex = carouselApi.selectedScrollSnap();

      selectCurrentSlide(currentIndex);
    });

    carouselNode.addEventListener('embla:select', (event) => {
      carouselApi = event.detail.embla;

      currentIndex = carouselApi.selectedScrollSnap();

      selectCurrentSlide(currentIndex);
    });

    console.log(carouselApi);
  }
};

init();
