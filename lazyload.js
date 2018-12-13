/*
 * @Author: guotq
 * @Date: 2018-12-13 15:06:09
 * @Last Modified by: guotq
 * @Last Modified time: 2018-12-13 16:32:20
 * @Description: LazyLoad
 */
(function() {
    'use strict';

    window.addEventListener('load', function() {
      let lazyImgs = [].slice.call(document.querySelectorAll('#imgContainer img.lazy'));

      if ('IntersectionObserver' in window) {
        let lazyObserve = new IntersectionObserver(function(entries, observe) {
          entries.forEach(function(e) {
            if (e.isIntersecting) {
              let imgEl = e.target;

              imgEl.src = imgEl.dataset.src;
              imgEl.classList.remove('lazy');
              lazyObserve.unobserve(imgEl);
            }
          });
        });

        lazyImgs.forEach(function(imgEl) {
          lazyObserve.observe(imgEl);
        });
      }
      else {
        // 针对不兼容 IntersectionObserver 的浏览器，可以用 IntersectionObserver 的 Polyfill
        // 或者可以用 scroll、resize、getBoundingClientRect 来实现
        lazyLoad();
      }

      function lazyLoad() {
        setTimeout(() => {
          lazyImgs.forEach(function(imgEl) {
            let getBoundingClientRect = imgEl.getBoundingClientRect();

            if (getBoundingClientRect.top <= window.innerHeight && getBoundingClientRect.bottom >= 0) {
              imgEl.src = imgEl.dataset.src;
              imgEl.classList.remove('lazy');

              lazyImgs = lazyImgs.filter(function(img) {
                return imgEl !== img;
              });

              if (lazyImgs.length === 0) {
                window.removeEventListener('scroll', lazyLoad);
                window.removeEventListener('resize', lazyLoad);
              }
            }
          });
        }, 200);
      }

      lazyLoad();
      
      window.addEventListener('scroll', lazyLoad);
      window.addEventListener('resize', lazyLoad);
    });
}());