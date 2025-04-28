// Keep original app_settings as defaults/fallbacks
var default_app_settings = {
    app_url: "https://pilote-toyota.orcaformation.com/",
    bo_app_url: "https://wkfefficom.dcs2.renault.com/",
    ws_prix_url: "https://efficom-bo-sf3-r7.orcaformation.com/api/prix",
    user_info: null,
    messages: {
        not_connect: "Vous n'êtes pas connecter a efficom"
    }
};

// Default configuration URL (replace with a placeholder or a real default if available)
const DEFAULT_CONFIG_URL = 'https://raw.githubusercontent.com/ManusExample/EfficomConfig/main/config.json'; // Example placeholder

// Variable to hold the effective configuration
let effective_app_settings = { ...default_app_settings }; // Start with defaults

// Function to fetch configuration from the stored URL
async function fetchConfiguration() {
    try {
        const result = await chrome.storage.local.get(['configApiUrl']);
        const configUrl = result.configApiUrl || DEFAULT_CONFIG_URL;

        console.log(`[Efficom Ext] Fetching configuration from: ${configUrl}`);
        const response = await fetch(configUrl, { cache: "no-store" }); // Ensure fresh fetch
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const configData = await response.json();
        console.log('[Efficom Ext] Configuration fetched successfully:', configData);

        // Merge fetched config with default settings. Fetched data overrides defaults.
        effective_app_settings = {
            ...default_app_settings, // Start with defaults
            app_url: configData.app_url || default_app_settings.app_url,
            bo_app_url: configData.bo_app_url || default_app_settings.bo_app_url,
            ws_prix_url: configData.ws_prix_url || default_app_settings.ws_prix_url,
            user_info: configData.user_info !== undefined ? configData.user_info : default_app_settings.user_info,
            messages: configData.messages ? { ...default_app_settings.messages, ...configData.messages } : default_app_settings.messages,
            // Add any other config keys needed from configData if necessary
        };

        console.log('[Efficom Ext] Effective app_settings:', effective_app_settings);

    } catch (error) {
        console.error('[Efficom Ext] Failed to fetch or apply configuration:', error);
        // Fallback to default settings if fetch fails
        effective_app_settings = { ...default_app_settings };
        console.warn('[Efficom Ext] Using default settings due to fetch error.');
    }
}

// --- Initialization ---
// Fetch configuration when the service worker starts
(async () => {
    await fetchConfiguration();
    console.log("[Efficom Ext] Service worker (run.js) started and initialized.");
})();


var REPRISE = "";
var CURRENTTAB = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle configuration requests asynchronously
    if (message.type === "getConfig") {
        // Return the current effective settings
        sendResponse({ config: effective_app_settings });
        return false; // Indicate synchronous response (config should be ready after startup)
    } else if (message.type === "syncConfig") {
        (async () => {
            await fetchConfiguration(); // Re-fetch the configuration
            // Optionally notify tabs about the update?
            sendResponse({ success: true, config: effective_app_settings });
        })();
        return true; // Indicate async response
    } else {
        // Handle other message types
        console.log("[Efficom Ext] Received message:", message);
        switch (message.type) {
            case "currenttab":
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    CURRENTTAB = tabs.length > 0 ? tabs[0] : null;
                    console.log("[Efficom Ext] Current tab set:", CURRENTTAB);
                });
                break;
            case "login":
                // URL is specific to the site, passed in message.url
                getUserInfo(message.url);
                break;
            case "efficom_initDVFG":
            case "efficom_uploadBDC":
                // Settings (including URL) are passed in message.settings.
                // Content script should construct this using config fetched via 'getConfig'.
                fetchUrl(message.settings, message.callback);
                break;
            case "send_prix":
                // Use the dynamic config URL here
                sendPrix(message.data);
                break;
            case "get_reprise_info_request_local":
                if (REPRISE !== "") {
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        if (tabs.length > 0) {
                            chrome.tabs.sendMessage(tabs[0].id, {
                                data: REPRISE,
                                type: "get_reprise_info_return_local"
                            }, (response) => {
                                if (chrome.runtime.lastError) {
                                    console.log("[Efficom Ext] Error sending message (local reprise):", chrome.runtime.lastError.message);
                                } else {
                                    console.log("[Efficom Ext] Response from get_reprise_info_return_local:", response);
                                }
                            });
                        }
                    });
                } else {
                    console.log("[Efficom Ext] REPRISE is empty for local request.");
                }
                break;
            case "get_reprise_info_return":
            case "get_reprise_info_return2": // Also handle get_reprise_info_return3 if needed
                REPRISE = message.data;
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs.length > 0) {
                        const tabId = tabs[0].id;
                        const typesToSend = ["get_reprise_info_return", "get_reprise_info_return2", "get_reprise_info_return3"];
                        typesToSend.forEach(type => {
                             chrome.tabs.sendMessage(tabId, { data: REPRISE, type: type }, (response) => {
                                 if (chrome.runtime.lastError) {
                                     console.log(`[Efficom Ext] Error sending ${type}:`, chrome.runtime.lastError.message);
                                 } else {
                                     console.log(`[Efficom Ext] Response from ${type}:`, response);
                                 }
                             });
                        });
                    }
                });
                break;
            default:
                console.log("[Efficom Ext] Unhandled message type:", message.type);
        }
        // Default: return false if no async response (sendResponse) is needed from this listener block.
        return false;
    }
});

// --- Modified Functions ---

function getUserInfo(url) {
    var settings = {
        "url": url,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Cookie": "symfony=e750c26ba7f0a375f492ba2a451b8c1b" // Consider making configurable
        },
    };
    (async () => {
        try {
            const rawResponse = await fetch(settings.url, settings);
            if (!rawResponse.ok) {
                throw new Error(`HTTP error! status: ${rawResponse.status}`);
            }
            const response = await rawResponse.json();
            console.log("[Efficom Ext] User info fetched:", response);
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, { data: response, type: "efficom_login_return" }, (resp) => {
                         if (chrome.runtime.lastError) console.log("[Efficom Ext] Error sending login return:", chrome.runtime.lastError.message);
                    });
                }
            });
        } catch (error) {
            console.error("[Efficom Ext] Error fetching user info:", error);
            // Notify content script of error?
        }
    })();
}

function fetchUrl(settings, callback) {
    console.log("[Efficom Ext] fetchUrl called with settings:", settings, "and callback:", callback);
    (async () => {
        try {
            const rawResponse = await fetch(settings.url, settings);
            if (!rawResponse.ok) {
                 let errorBody = '';
                 try { errorBody = await rawResponse.text(); } catch (e) {}
                 console.error(`[Efficom Ext] fetchUrl Error: Status ${rawResponse.status}`, errorBody);
                 throw new Error(`HTTP error! status: ${rawResponse.status}`);
            }
            const response = await rawResponse.json();
            console.log("[Efficom Ext] fetchUrl response:", response);

            const targetTabId = CURRENTTAB ? CURRENTTAB.id : null;
            const sendMessageToTab = (tabId) => {
                chrome.tabs.sendMessage(tabId, { data: response, type: callback }, (resp) => {
                    if (chrome.runtime.lastError) console.log(`[Efficom Ext] Error sending ${callback}:`, chrome.runtime.lastError.message);
                });
            };

            if (targetTabId) {
                sendMessageToTab(targetTabId);
            } else {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs.length > 0) {
                        sendMessageToTab(tabs[0].id);
                    } else {
                         console.error("[Efficom Ext] fetchUrl: No active tab found to send response.");
                    }
                });
            }
        } catch (error) {
            console.error("[Efficom Ext] Error in fetchUrl:", error);
            const errorMsg = { error: `Failed to fetch ${settings.url}: ${error.message}` };
            const errorCallback = `${callback}_error`;
            const sendErrorToTab = (tabId) => {
                 chrome.tabs.sendMessage(tabId, { data: errorMsg, type: errorCallback }, (resp) => {
                     if (chrome.runtime.lastError) console.log(`[Efficom Ext] Error sending ${errorCallback}:`, chrome.runtime.lastError.message);
                 });
            };
             const targetTabId = CURRENTTAB ? CURRENTTAB.id : null;
             if (targetTabId) {
                 sendErrorToTab(targetTabId);
             } else {
                  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs.length > 0) {
                        sendErrorToTab(tabs[0].id);
                    } else {
                         console.error("[Efficom Ext] fetchUrl Error: No active tab found to send error response.");
                    }
                });
             }
        }
    })();
}

function sendPrix(JSON_FG_WEB) {
    var settings = {
        "url": effective_app_settings.ws_prix_url, // Use effective config
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
            "Cookie": "device_view=full" // Consider making configurable
        },
        body: JSON.stringify(JSON_FG_WEB)
    };

    (async () => {
        try {
            const rawResponse = await fetch(settings.url, settings);
            let response;
            try {
                 const responseText = await rawResponse.text();
                 response = JSON.parse(responseText);
            } catch (parseError) {
                 console.error("[Efficom Ext] sendPrix: Failed to parse JSON response.", parseError);
                 // If parsing fails but status is ok, maybe it's not JSON? Handle appropriately.
                 if (!rawResponse.ok) throw new Error(`HTTP error! status: ${rawResponse.status}`);
                 // If status is ok but not JSON, what should happen?
                 throw new Error("Received non-JSON response from sendPrix endpoint.");
            }

            if (!rawResponse.ok) {
                 console.error(`[Efficom Ext] sendPrix Error: Status ${rawResponse.status}`, response);
                 throw new Error(`HTTP error! status: ${rawResponse.status}`);
            }

            console.log("[Efficom Ext] sendPrix response:", response);

            const messageType = (response.statusCodeOrcabox === 200 && response.error === false)
                ? "efficom_send_prix_return"
                : "efficom_send_prix_error";

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, { data: response, type: messageType }, (resp) => {
                         if (chrome.runtime.lastError) console.log(`[Efficom Ext] Error sending ${messageType}:`, chrome.runtime.lastError.message);
                    });
                }
            });

        } catch (error) {
            console.error("[Efficom Ext] Error in sendPrix:", error);
            const errorMsg = { error: `Failed to sendPrix: ${error.message}` };
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                 if (tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, { data: errorMsg, type: "efficom_send_prix_error" }, (resp) => {
                         if (chrome.runtime.lastError) console.log("[Efficom Ext] Error sending sendPrix error:", chrome.runtime.lastError.message);
                    });
                 }
            });
        }
    })();
}

