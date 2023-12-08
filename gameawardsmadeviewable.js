// ==UserScript==
// @name         Game Awards Auto-Unmute
// @namespace    github.com/marriaga158
// @version      0.1
// @description  lets you watch what you actually came for
// @author       Marco Arriaga
// @match        https://www.twitch.tv/thegameawards
// @grant        none
// @run-at       document-end
// ==/UserScript==

const checkCaptions = () => {
    console.log('[Game Awards Auto-Unmute]: muteTwitch() fired');
	let captionsContainer = document.getElementsByClassName('player-captions-container__caption-window').item(0);
    // todo: something when captionsContainer is null to stop polluting console with uncaught errors
	let ttvMuteButton = document.querySelector('[data-a-target="player-mute-unmute-button"]');
	let captions = "";
	for (const caption of captionsContainer.children) {
		captions += " " + caption.textContent;
	}
	if(captions.toLowerCase().includes('world premiere') && ttvMuteButton.getAttribute("aria-label") === "Unmute (m)"){
		ttvMuteButton.click();
		console.log('[Game Awards Auto-Unmute]: New game!');
	} else {
        if(captions.toLowerCase().includes('world premiere')){
            console.log('[Game Awards Auto-Unmute]: window already unmuted!')
        } else {
            console.log(`[Game Awards Auto-Unmute]: caption: ${captions}, 'world premiere' not found`);
        }
	}
}

(async function() {
    'use strict';
    console.log('[Game Awards Auto-Unmute]: started');

    const waitForCaptionContainer = async () => {
        return new Promise(resolve => {
            if(document.getElementsByClassName('video-player__default-player').item(0)){
                return resolve(document.getElementsByClassName('video-player__default-player').item(0));
            }
            const observer = new MutationObserver(mutations => {
                if (document.getElementsByClassName('video-player__default-player').item(0)) {
                    observer.disconnect();
                    resolve(document.getElementsByClassName('video-player__default-player').item(0));
                }
            });
        })
    }

    const toObserve = await waitForCaptionContainer();

    console.log('[Game Awards Auto-Unmute]: toObserve', toObserve);

	const observer = new MutationObserver(checkCaptions);
    observer.observe(toObserve, {childList: true, subtree: true});
})();