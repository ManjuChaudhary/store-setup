document.querySelectorAll('[data-cta-read-more]').forEach((element) => {
    element.addEventListener('click', function () {
        if(element.closest('.collection-meta-description') != null){

        let contentBlock = element.closest('.collection-meta-description').querySelector('.show-more-content');
        let contentHeight = contentBlock.getAttribute('data-content-height')
        const isOpen = contentBlock.classList.contains('show-more');
        let contentBlockHeight = Utility._getHeightofHiddenEle(contentBlock);
        if (!isOpen) {
            contentBlock.style.height = contentBlockHeight + 'px';
            setTimeout(() => {
                contentBlock.style.height = '';
            }, 300);
            contentBlock.classList.add('show-more');
            element.closest('.collection-meta-description').classList.add('open');
        } else {
            contentBlock.style.height = contentBlockHeight + 'px';
            setTimeout(function () {
                contentBlock.style.height = contentHeight + 'px';
            }, 1);
            setTimeout(function () {
                contentBlock.classList.remove('show-more');
                element.closest('.block-content-wrapper').classList.remove('open')
            }, 300);
        }
        }
    })
})