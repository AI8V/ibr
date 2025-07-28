'use strict';

document.addEventListener('DOMContentLoaded', () => {
    
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    const videoSpotlights = document.querySelectorAll('.video-spotlight');

    window.onYouTubeIframeAPIReady = function() {
        videoSpotlights.forEach(spotlight => {
            initializeSpotlight(spotlight);
        });
    };

    function initializeSpotlight(spotlightElement) {
        const videoId = spotlightElement.dataset.videoId;
        const startSeconds = parseInt(spotlightElement.dataset.startSeconds, 10) || 0;
        const endSeconds = parseInt(spotlightElement.dataset.endSeconds, 10) || 0;

        const imageOverlay = spotlightElement.querySelector('.card-img-top');
        const iframeContainer = spotlightElement.querySelector('.video-iframe-container');
        
        let player;

        imageOverlay.addEventListener('click', () => {
            imageOverlay.querySelector('img').classList.add('d-none');
            imageOverlay.querySelector('.play-button-overlay').classList.add('d-none');
            iframeContainer.classList.remove('d-none');

            if (!player) {
                // *** التغيير الذكي هنا ***
                // 1. إنشاء عنصر مؤقت بـ ID فريد داخل حاوية الـ ratio.
                const playerTargetId = `player-target-${videoId}-${Math.random().toString(36).substring(7)}`;
                const playerTargetElement = document.createElement('div');
                playerTargetElement.id = playerTargetId;
                iframeContainer.appendChild(playerTargetElement);
                
                // 2. جعل اليوتيوب يستبدل العنصر المؤقت وليس الحاوية الرئيسية.
                player = new YT.Player(playerTargetId, { // استخدام الـ ID الجديد
                    videoId: videoId,
                    playerVars: {
                        'autoplay': 1, 'controls': 1, 'rel': 0,
                        'showinfo': 0, 'modestbranding': 1, 'start': startSeconds
                    },
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                    }
                });
            } else {
                player.playVideo();
            }
        });

        function onPlayerReady(event) {
            event.target.playVideo();
        }

        function onPlayerStateChange(event) {
            if (endSeconds > 0 && event.data === YT.PlayerState.PLAYING) {
                const checkTimeInterval = setInterval(() => {
                    if (player.getCurrentTime() >= endSeconds) {
                        player.stopVideo();
                        clearInterval(checkTimeInterval);
                    }
                }, 1000);
            }
        }
    }

    // لم نعد بحاجة لتعريفات CSS المخصصة لحاوية الفيديو، Bootstrap يتكفل بها.
    const style = document.createElement('style');
    style.textContent = `
        .play-button-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: rgba(0, 0, 0, 0.4);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .play-button-overlay:hover {
            background-color: rgba(0, 0, 0, 0.6);
        }
        /* Bootstrap's .ratio handles the iframe's responsiveness now */
    `;
    document.head.appendChild(style);
});