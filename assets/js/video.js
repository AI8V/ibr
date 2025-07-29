'use strict';

/**
 * Ai8V Video Library Engine
 * This single script controls the entire video library functionality.
 * Instructions: Customize the 'allVideos' array with your video data.
 */
document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // CONFIGURATION: Customize this section with your video data
    // ===================================================================
    const allVideos = [
        // Example Data: Replace with your actual video data
        { id: "oBes4dudzY4", title: "جهود دبلوماسية لإنهاء الحروب في أوكرانيا وقطاع غزة", category: "تحليل سياسى", description: "343_ إتفاق روسى أوكرانى بوساطة تركية على لقاء بوتبن وزيلينسكى وجورجيا ميلونى تزور سد النهضة الإثيوبى", articleUrl: "/ibr/New/" },
        { id: "Yl6Zx1FOHUE", title: "النمسا تفتح الباب أمام محادثات الانضمام لحلف الناتو", category: "الحرب على القطاع", description: "341 _ النمسا تعلن أنها ستنضم لحلف الناتو وبريطانيا تعلن أنها ستدخل الحرب ضد الصين دفاعاً عن تايوان", articleUrl: "/ibr/Gazza/" },
{ id: "2yRJV-su9yo", title: "هجوم أوكراني فاشل يستهدف بوتين في سان بطرسبرغ", category: "الحرب الروسية الأوكرانية", description: "340_ضرب منظومات الباتريوت فور وصولها المطارات الأوكرانية وأوكرانيا تهاجم سان بطرسبرج أثناء الإحتفال", articleUrl: "/ibr/World/" },

{ id: "rOIsx5vuNRI", title: "", category: "الحرب الروسية الأوكرانية", description: "339_ بوتين يتحدى الناتو فى بحر البلطيق والناتو يرد وترامب يوقف الحرب بين تايلاند وكمبوديا", articleUrl: "article-1.html" },
{ id: "0OE7yd2n_Qs", title: "", category: "الحرب الروسية الأوكرانية", description: "338_بدء إنسحاب الأوكران من بوكروفسك وعودة المظاهرات للعاصمة كييف وبريطانيا تتهرب من الإعتراف بفلسطين", articleUrl: "article-1.html" },
{ id: "IUDlkiv2oiM", title: "", category: "الحرب الروسية الأوكرانية", description: "337_الجيش الروسى ينجح فى إقتحام بكروفسك أكبر حصن فى إقليم دونيتسك وصحف بريطانيا تطالب برحيل زيلينسكى", articleUrl: "article-1.html" },
{ id: "cFL25Kpuo_Y", title: "قصة آدم والجنة: هل كانت في السماء أم على الأرض؟", category: "البداية والنهاية", description: "9 - جنة آدم علية السلام كانت فى شبة الجزيرة العربية ( مكة ) البداية والنهاية _ إبراهيم الشرقاوى", articleUrl: "/ibr/Learn" },
{ id: "PtdAtm__2og", title: "eJOY extension 2024 - Your Ultimate Knowledge & English Learning Tool", category: "Category Name", description: "A brief description for the article link.", articleUrl: "article-1.html" },

        { id: "PtdAtm__2og", title: "eJOY extension 2024 - Your Ultimate Knowledge & English Learning Tool", category: "رياضيات", description: "تعلم أساسيات الجبر في هذا الدرس الشامل الذي يغطي المعادلات والمتغيرات.", articleUrl: "article-1.html" },
        { id: "CCiWWTHz-ZY", title: "أساسيات الكيمياء العضوية", category: "علوم", description: "استكشف عالم المركبات العضوية وتفاعلاتها في هذا الفيديو التعليمي الممتع.", articleUrl: "article-2.html" },
        // ... Add up to 100+ videos here
    ];
    const VIDEOS_PER_PAGE = 6; // Number of videos to show per page

    // ===================================================================
    // ENGINE INITIALIZATION (Do not edit below this line)
    // ===================================================================
    const videosContainer = document.getElementById('videosContainer');
    const paginationContainer = document.querySelector('.pagination');
    const categoriesContainer = document.getElementById('categoriesContainer');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const paginationNav = document.getElementById('paginationNav');
   
    const videoModalEl = document.getElementById('videoModal');
    const videoModal = new bootstrap.Modal(videoModalEl);
    const modalIframe = videoModalEl.querySelector('iframe');
    const modalTitle = videoModalEl.querySelector('.modal-title');

    let currentPage = 1;
    let filteredVideos = [...allVideos];

    function render() {
        renderCategories();
        renderVideos();
        renderPagination();
    }

    function renderCategories() {
        const categories = ['الكل', ...new Set(allVideos.map(video => video.category))];
        categoriesContainer.innerHTML = categories.map(category => `
            <button class="btn btn-outline-secondary category-btn" data-category="${category}">
                ${category}
            </button>
        `).join('');
       
        // Add event listeners to new buttons
        categoriesContainer.querySelectorAll('.category-btn').forEach(button => {
            button.addEventListener('click', () => {
                applyFilters({ category: button.dataset.category });
            });
        });
        updateActiveCategoryButton();
    }

    function renderVideos() {
        const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
        const endIndex = startIndex + VIDEOS_PER_PAGE;
        const pageVideos = filteredVideos.slice(startIndex, endIndex);

        noResultsMessage.classList.toggle('d-none', filteredVideos.length > 0);
        videosContainer.innerHTML = pageVideos.map(video => createVideoCard(video)).join('');
    }

    function createVideoCard(video) {
    const searchQuery = searchInput.value.trim();
    let highlightedTitle = video.title;
    if (searchQuery) {
        const regex = new RegExp(`(${searchQuery})`, 'gi');
        highlightedTitle = video.title.replace(regex, `<mark class="p-0">$1</mark>`);
    }

    // --- START: التحسينات الجديدة ---

    // 1. تحديد أبعاد الصورة المصغرة (نسبة 4:3 شائعة لصور hqdefault)
    const imageWidth = 480;
    const imageHeight = 360;

    // 2. استخدام الصورة المصغرة المتوسطة (mqdefault) كخيار أفضل للأداء
    //    فهي تأتي بحجم 320x180 (نسبة 16:9) وهو أقرب لتصميم الفيديو
    const thumbnailUrl = `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`;
    const imageWidthMq = 320;
    const imageHeightMq = 180;

    // --- END: التحسينات الجديدة ---

    return `
        <div class="col">
            <div class="card h-100 shadow-sm video-card" data-video-id="${video.id}" role="button" tabindex="0" aria-label="تشغيل فيديو: ${video.title}">
                <div class="position-relative">
                   

<img src="${thumbnailUrl}"
     class="card-img-top"
     alt="صورة مصغرة لفيديو: ${video.title}"
     loading="lazy"
     decoding="async"
     width="320"
     height="180"
     style="aspect-ratio: 16 / 9; object-fit: cover;">

                    <div class="position-absolute top-50 start-50 translate-middle">
                        <span class="bi bi-play-circle-fill display-4 text-white" style="opacity: 0.8;"></span>
                    </div>
                    <span class="badge bg-dark position-absolute top-0 start-0 m-2">${video.category}</span>
                </div>
                <div class="card-body d-flex flex-column">
    <h3 class="card-title h6">${highlightedTitle}</h3>
    <p class="card-text text-muted small flex-grow-1">${video.description || ''}</p>
    ${video.articleUrl ? `<a href="${video.articleUrl}" class="btn btn-outline-primary btn-sm mt-2">اقرأ المقال الكامل</a>` : ''}
</div>
            </div>
        </div>
    `;
}

    function renderPagination() {
        const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
        paginationNav.classList.toggle('d-none', totalPages <= 1);
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        const createPageItem = (page, text = page, isDisabled = false, isActive = false) => {
            return `
                <li class="page-item ${isDisabled ? 'disabled' : ''} ${isActive ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${page}">${text}</a>
                </li>
            `;
        };
       
        let paginationHtml = createPageItem(currentPage - 1, 'السابق', currentPage === 1);

        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += createPageItem(i, i, false, i === currentPage);
        }

        paginationHtml += createPageItem(currentPage + 1, 'التالي', currentPage === totalPages);
        paginationContainer.innerHTML = paginationHtml;
    }

    function applyFilters({ page = 1, category = null, search = null }) {
        currentPage = page;
        const currentCategory = category ?? getCurrentCategory();
        const currentSearch = search ?? searchInput.value.trim().toLowerCase();

        filteredVideos = allVideos.filter(video => {
            const matchesCategory = currentCategory === 'الكل' || video.category === currentCategory;
            const matchesSearch = !currentSearch || video.title.toLowerCase().includes(currentSearch);
            return matchesCategory && matchesSearch;
        });

        renderVideos();
        renderPagination();
        updateActiveCategoryButton(currentCategory);
    }
   
    function getCurrentCategory() {
        const activeButton = categoriesContainer.querySelector('.active');
        return activeButton ? activeButton.dataset.category : 'الكل';
    }

    function updateActiveCategoryButton(category = getCurrentCategory()) {
        categoriesContainer.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
            btn.classList.toggle('btn-primary', btn.dataset.category === category);
            btn.classList.toggle('btn-outline-secondary', btn.dataset.category !== category);
        });
    }

    // Event Listeners
    searchButton.addEventListener('click', () => applyFilters({}));
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') applyFilters({});
    });

    paginationContainer.addEventListener('click', (e) => {
        if (e.target.matches('.page-link')) {
            e.preventDefault();
            const page = parseInt(e.target.dataset.page, 10);
            if (!isNaN(page)) {
                applyFilters({ page: page });
            }
        }
    });
   
    videosContainer.addEventListener('click', (e) => {
    // 1. تحديد ما إذا كانت النقرة على زر "اقرأ المقال"
    const articleLink = e.target.closest('a.btn');

    // 2. إذا كانت النقرة على الزر، لا تفعل شيئًا ودع المتصفح يقوم بعمله
    if (articleLink) {
        return;
    }

    // 3. إذا لم تكن النقرة على الزر، ابحث عن البطاقة وقم بتشغيل الفيديو
    const card = e.target.closest('.video-card');
    if (card) {
        const videoId = card.dataset.videoId;
        const video = allVideos.find(v => v.id === videoId);
        if (video) {
            modalTitle.textContent = video.title;
            modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            videoModal.show();
        }
    }
});

    videoModalEl.addEventListener('hidden.bs.modal', () => {
        modalIframe.src = 'about:blank';
    });
   
    // Initial Render
    render();
});



