// Shared by the server layout (head script) and the client Preloader.
export const INTRO_SESSION_KEY = "axrok:intro";

/**
 * Inline, render-blocking. Marks repeat visits before first paint so the intro never flashes,
 * and flags still-render mode (?still=) used to capture the pre-rendered fallbacks.
 */
export const introHeadScript = `try{var d=document.documentElement;if(sessionStorage.getItem("${INTRO_SESSION_KEY}"))d.dataset.intro="skip";if(/[?&]still=/.test(location.search)){d.dataset.intro="skip";d.dataset.still=""}}catch(e){}`;
