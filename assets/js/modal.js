$(document).ready(function() {

    let modalHTML = `
    <div class="modal" id="modaljs">
        <div class="modal-wrapper">
            <img class="current-image" width='auto' height='100%' src="" alt="modal-image">
        </div>
        <div class="close-btn"><a class="close-action action-js" href="#"></a></div>
        <div class="arrows">
            <a class="prev-btn switcher-btn action-js" href="#"></a>
            <a class="next-btn switcher-btn action-js" href="#"></a>
        </div>
        <div class="pagination">
            <div class="pag-wrapper"></div>
        </div>
    </div>  
    `

    function modalExists() {
        return $('#modaljs').length > 0;
    }
    if (!modalExists()) {
        $('body').append(modalHTML);
    }
    // modal variable
    let modal = $('#modaljs');

    function setModalStatus(modal) {
        if(modal.hasClass('show')) {
            localStorage.setItem("modalStatus", true);
        } else {
        localStorage.setItem("modalStatus", false);
        }
    }
    setModalStatus(modal);

    // converts style of background to url path
    function parseURL(path) {
        return path.match(/url\(['"]?(.*?)['"]?\)/i)[1];
    }

    // checks if modal is open -> return true
    function isModalAcitve() {
        return localStorage.getItem('modalStatus') === 'true';
    }
      
    function getCurrentSlideIndex(array) {
        let currentSlide = $('.current-image').attr('src');
        return array.indexOf(currentSlide);
    }

    // get current bullet index same as slide 
    function getCurrentBulletIndex() {
        let slides = getSlides()
        let index = getCurrentSlideIndex(slides);
        return index;
    }


    // Modal Listener
    function modalOpenListener(action) {
        $('.container .box').click(function(){
            action();
        })
    }

    // listens slide changes
    function modalSlideOnChange(action) {
        $('.current-image').on('load', function () {
            action();
           });
    }

 

    $('.container .box').click(function() {
        let src = $(this).attr('style');
        modal.addClass('show');
        let url = parseURL(src);
        $('.current-image').attr('src',url);
        setModalStatus(modal);
    })

    $('.close-action').click(function() {
        $('#modaljs').removeClass('show');
        setModalStatus(modal);
    })

    // get array urls of slides
    function getSlides() {
        const slides = [];
        $('.card .box').each(function() {
            let url = parseURL($(this).attr('style'));
            slides.push(url);
        })
        return slides;
    }
    // simple animation for slides
    function slideAnimation() {
        $('.current-image').addClass('modal-anim');
        setTimeout(() => {
            $('.current-image').removeClass('modal-anim');
        }, 500);
    }

    // Modal arrows
    function modalActions() {
        const slides = getSlides();
        $('.modal .next-btn').click(function() {
            let i = getCurrentSlideIndex(slides);
            if (i < slides.length - 1) {
                i++;
                let currentPath = slides[i];
                $('.current-image').attr('src', currentPath);
                slideAnimation();
                activeBullet();
                updateArrowsState();
            }
        });

        $('.modal .prev-btn').click(function() {
            let i = getCurrentSlideIndex(slides);
            if (i > 0) {
                i--;
                let currentPath = slides[i];
                $('.current-image').attr('src', currentPath);
                slideAnimation();
                activeBullet();
                updateArrowsState();
            }
        });
    }

    modalActions()


    function paginationModal() {
        let slides = getSlides();

        // create bullets
        slides.forEach(function(slide) {
            $('.pagination .pag-wrapper').append('<a class="bullet" href="#"></a>');
        });

    }
    paginationModal();

    // determine active bullet
    function activeBullet() {
        let slides = getSlides()
        let index = getCurrentSlideIndex(slides);
        $('.bullet').removeClass('active');
        $($('.bullet')[index]).addClass('active');
    }

    // disables prev/next arrows at the first/last slide
    function updateArrowsState() {
        let slides = getSlides();
        let index = getCurrentSlideIndex(slides);
        $('.prev-btn').toggleClass('disabled', index <= 0);
        $('.next-btn').toggleClass('disabled', index >= slides.length - 1);
    }



    function bulletAction() {
        $('.bullet').click(function() {
            let slides = getSlides()
            // let index = getCurrentSlideIndex(slides);
            let bulletIndex = $('.bullet').index(this);
            $('.current-image').attr('src',slides[bulletIndex]);
            $('.bullet').removeClass('active')
            $(this).addClass('active');
            slideAnimation();
            updateArrowsState();
        })
    }
    bulletAction();


    $(document).click(function(e) {
        if(isModalAcitve() && (e.target === $('div.modal-wrapper')[0] || e.target === $('div.arrows')[0])) {
            modal.removeClass('show');
        }
    })


    modalOpenListener(function() {
        activeBullet();
        bulletOverflow();
        updateArrowsState();
    })

    modalSlideOnChange(function() {
        bulletOverflow();
    })

    // keeps the active bullet inside the visible pagination window,
    // computed fresh from the current index each time (no direction state,
    // so forward/backward navigation always agree on the offset)
    function bulletOverflow() {
        const visible = 5;
        const step = 17; // bullet width (12px) + margin-right (5px)
        const index = getCurrentBulletIndex();
        const slidesLength = getSlides().length;

        const maxSteps = Math.max(slidesLength - visible, 0);
        const threshold = Math.max(visible - 3, 0);
        const steps = Math.min(Math.max(index - threshold, 0), maxSteps);

        $('.pag-wrapper').css('transform', `translateX(${-steps * step}px)`);
    }
});