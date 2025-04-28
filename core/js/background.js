!self.browser && self.chrome && (browser = chrome)
var app_page = window.location.href;
console.log("[Efficom BG] Script loaded for page:", app_page);

var manifestData = chrome.runtime.getManifest();
const APP_VERSION = manifestData.version;
console.log("[Efficom BG] #APP_VERSION: " + APP_VERSION)

var hasReprise = false;
var ListModeles = {
    AY: "AYGO", AX: "Aygo X", CH: "C-HR Hybride", CY: "Camry", CO: "Corolla", CS: "Corolla TS",
    GY: "GR Yaris", GR: "GR86", HI: "Highlander", HL: "Hilux", LC: "Land Cruiser", MI: "Mirai",
    PD: "PROACE CITY", EC: "PROACE CITY EV", EP: "PROACE Electric", EV: "PROACE VERSO EV",
    PF: "PROACECITYVERSO", PS: "Prius", PV: "Prius PHV", PA: "Proace", PE: "Proace Verso",
    EQ: "ProaceCityVerEV", H1: "RAV4 Hybrid", H2: "RAV4 PHV", SU: "Supra", YS: "Yaris",
    YC: "Yaris Cross", YH: "Yaris Hybride", ES: 'ES 300h', L5: 'LC 500', LH: 'LC500h',
    CA: 'LC Cabriolet', LS: 'LS 500h', NX: 'NX 300h', NH: 'NX 350h', N4: 'NX 450h+',
    RC: 'RC F', RX: 'RX 450h', RH: 'RX 500h', UX: 'UX 250h', U3: 'UX 300e'
};

// Variable to hold the configuration fetched from the service worker
let app_settings = null;

var carInfoClient = false;
var Logoimage = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALkAAAA/CAIAAAAzJv7OAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAEmElEQVR42u2aPa7TQBDHcxIOkuNQ+BBcgSY1B3g1NGmokWiQaKCJ0CtAQgIhIRASQi+GAfutJ7Mz492xnZDkP0oR7/fHz/Ox69VvCKRMVlgCCFiBgBUIWIGAFQhYgYAVCOSSWNk2q0HWm52W3GzNGnn2brPWMlKtoY+s/EodSn2/RlN2iaxDXjQbyTCQfgRD6XzUF8tKWn49tWA/RJlhO2tZsdusLnNfrJwVUfIQSrByMHt9rTSNMVQ33t6MPpuVPsdJKOtX046HvY5sbgaVpVivlJX1ei1fwD7pfkmyJdJXzljoclZki9X9aqxY9krb3JTbNOqgwUrTJFi6tPVm07AlsRZEpiua/m/9sF6Z0K/pcribO6Cy1UcNVjbbbsbNtk9Kf6KsDA3wv7X+ylRWhLMxurkcFR1xsLLZ9X9708PeqjArmYkrZ0Xxp0v7/ffM/LCcFmdzJRyKGQMryfbkz0F/RVYL2INQv7mekbTYfWaBuRskXjErbHkP3s1gHKQH4NWshOMg1q9o2uzTQyX1DlYO/cgDYx08X1EOV0Ks1Pab0kzVYvW5HYl7umSHlRJn6UJYMZ6C57bqsW2Ilbp+WTtSU/p9WiG2GPzVsgLBfRAErEDACgSsQCBgBQJWIGAFAlYgYAUCViBgxc9+8PQu9pvYyNLVJ67a55/ti0/tk93+0et9avPhyztKoXTKLW/q26/21Zf25nb/+O2ej5AeKZGyqEB4j6gRUZhGWLhuYGUqKx9+tP5ydz8qM7rHVODZ+33JdKiY01r5UtQWBitxVugtLx8DqRlHwbz73lKBqtbefG0De0Rwc3UIVo7BChmX2mHQBqv6gECJraqKi1+F+E4lqTpYWZwVejtj60DGKDc9VRpF/HJdNWq/UsnnH4/OSu1CT2zktNUdl5DbBYJJOKeqFXC8S9rUxAH9sVyZHD5/+7l7O+ppgZWpU7DMfP6KqwqDwhmuVMqNi2UyRL8qT+pknTJgZZ4pqKqb63bL+aWImopxDlTvOFcVviYgz8mfoBhwp9gE8eqkTuCvXBgr6oYJy5LURuJD9WrVpqwAx/KCBVt5AVGrc2+FllJb/k9ZKTeZS1SvYkW1LLGom5/dpZ9zdqLaLBqPP0GR2KlAoUisimBl0k7PeEITaCoQ6AkoO/eWqzTKBStgpc8VYZSqacDKDGstip0jK8I7ET5158GcTRx0RqyoTobjkZBnoHq+AX9FDdc7C+KzIiqKs58u6kbMPD8r5XEQDy7IAxUB89HiIMcl564xWJmfFfUmiJRH3tfN7d5XA2pTzvmKeno7er7iDIZ3B1bmZ0U1BCJwdY53+andcc5t/cvOhBpYOd59EDkBZCPSvlo6X2xt4X2QtdMl90H+fWeynmdzz3xerNDmxS6HT3LPXDh3sLLU6cjoxx/l368Emqr6fiVl5Vff/NoZrCx4kla1x/53cY7Nmv5dnHPryV1ysLIgK50ToJ6RLPq9rd+aM7s85ObAgZVlWUnE0AtKWyh0A6VQ+izf8ROR1FrsO34n7OKtzcwKBAJWIGAFAlYgYAUCViBgBQJWIBCwAgErkCPLH2EtOW3okEXMAAAAAElFTkSuQmCC";

var EfficomPave = ``; // Will be populated after config is fetched

var prix = {};
var JSON_FG_WEB = {
    "prix": { /* Structure remains the same, values will be populated */
        "userIpn": "", "dateCreate": "", "iNumVersion": 9, "szNomEtablissement": "",
        "szIdentifiantRR": "", "szRattachement": "", "szCodePND": "", "szNomVendeur": "",
        "szPrenomVendeur": "", "cTypeVendeur": null, "szTypeClient": "", "szCiviliteClient": "",
        "szNomClient": "", "szPrenomClient": "", "szAdresseClient": "", "szCodePostalClient": "",
        "szVilleClient": "", "szTelClientPortable": "", "szEmailClient": "", "szEmailOptin": "",
        "szMarque": "", "szGamme": "", "szGenre": "", "szModele": "", "szSemiClairModele": "",
        "szVersion": "", "szSemiClairVersion": "", "iNumTarif": 0, "szCouleur": "",
        "fMontantCatalogue": 0, "fPrixHTPublic": 0, "fPrixHTPlaques": 0, "fPrixHTPreparation": 0,
        "fPrixHTConcessionnaire": 0, "szDateLivraison": "", "fMontantRemise": 0, "fTauxTVA": 0,
        "szTypeTVA": "", "szEnergie": "", "iNivCO2": 0, "iNbVehicule": 1, "szTypeProduit": "",
        "fMontantAFinancer": 0, "fApport": 0, "fDG": 0, "fPLM": 0, "iNbreAssurances": 0,
        "fMontantEngagementReprise": 0, "iFinancementAvecCaution": 0, "fSurestimationRepVO": 0,
        "szDateVente": "", "szNumExport": "", "numCmde": "", "szCodeDistrinet": "",
        "fAideRPE": 0, "fAideAutres": 0, "szCategorieFinanDMS": "", "fCommissionVehicule": 0,
        "fCommissionFinance": 0, "fCommissionAssurances": 0, "fCommissionServices": 0,
        "fCommissionAccessoires": 0, "fCommissionIntermediaire": 0, "fCommissionGFA": 0,
        "fCommissionTransfo": 0, "fCommissionGravage": 0, "fCommissionAutres": 0,
        "iNumVersionActionCo": 0, "iNbreActionsCo": 0, "iNbreSupplements": 0,
        "iNumVersionSupplements": 0, "iNbreServices": 0, "iNumVersionServices": 0,
        "iNbreOptions": 0, "iNumVersionOptions": 0, "iNbreAccessoires": 0,
        "iNumVersionAccessoires": 0, "iNumContratFinanDiac": "", "iNumContratCommande": "",
        "szClientFinal": "", "szRefClient": "", "szRepVONom_CG": "", "szRepVO_Marque": "",
        "szRepVO_Modele": "", "szRepVO_Origine": "", "szRepVO_Km": 0, "szRepVO_ImmaDate1": "",
        "szRepVO_ImmaDate": "", "szRepVO_Chassis": "", "szRepVO_Energie": "", "szRepVoNumImmat": "",
        "szRepVO_PrimeConv": 0, "fgModeAcompte": "", "fgAcompte": 0, "iKmCompteur": 0,
        "bKmReel": 0, "szOrigineVO": "", "szNumImmat": "", "bPremiereMain": 0,
        "szDatePremiereImmat": "", "szDateImmat": "", "szTypeGarantie": "0", "szNumSerie": "",
        "szCarosserie": "", "iPuissance": 0, "iPlacesAssises": 0,
        "accessoire": [], "actionCo": [], "option": [], "supplement": [], "service": [],
        "document": [], "malus": []
    }
};

var _this = this;
var logged = false;
// Error handler elements will be selected after DOM is ready and config is loaded
var efficomMessage = null;
var efficomActionLogin = null;
var instance = null;
var nbrAccessoires = 0;

// --- Initialization Function ---
async function initializeExtension() {
    console.log("[Efficom BG] Initializing...");
    try {
        const response = await chrome.runtime.sendMessage({ type: "getConfig" });
        if (chrome.runtime.lastError) {
            throw new Error(`Error getting config: ${chrome.runtime.lastError.message}`);
        }
        if (response && response.config) {
            app_settings = response.config;
            console.log("[Efficom BG] Configuration received:", app_settings);
            // Now that config is loaded, build the UI elements that depend on it
            buildUI();
            // Add event listeners or perform other setup tasks
            setupListeners();
            // Check login status or perform initial actions
            checkInitialState();
        } else {
            throw new Error("Invalid or missing configuration received from service worker.");
        }
    } catch (error) {
        console.error("[Efficom BG] Initialization failed:", error);
        // Display an error message to the user on the page?
        // Maybe try to use default settings or disable functionality.
        displayInitializationError("Impossible de charger la configuration de l'extension.");
    }
}

function displayInitializationError(message) {
    // Attempt to add an error message to the top of the body
    try {
        const errorDiv = document.createElement('div');
        errorDiv.style.backgroundColor = 'red';
        errorDiv.style.color = 'white';
        errorDiv.style.padding = '10px';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.fontWeight = 'bold';
        errorDiv.textContent = `Erreur Efficom Extension: ${message}`;
        document.body.insertBefore(errorDiv, document.body.firstChild);
    } catch (e) {
        console.error("[Efficom BG] Could not display initialization error on page.", e);
    }
}

// --- UI Building Function ---
function buildUI() {
    console.log("[Efficom BG] Building UI elements...");
    // Reconstruct EfficomPave using the loaded app_settings
    EfficomPave = `
    <div class="bootstrap-sf1 row page-header page-header-compact contexty-efficom">
        <div class="bootstrap-sf1 col-xs-3 nopadding white text-center info-app">
            <div class="col-xs-6"><img class="efficom-logo" src="${Logoimage}" alt=""></div>
            <div class="col-xs-6"><p class="InfoUser" style="font-size: 16px !important;color:black"></p>
            <p class="Version" style="font-size: 13px !important;color:black;font-weight: bold">V${APP_VERSION}</p>
            </div>
        </div>
        <div class="bootstrap-sf1 col-xs-9 white padding-top12" style="">
            <div style="text-align:left" class="white bootstrap-sf1 col-xs-6 efficom-message"></div>
            <div class="bootstrap-sf1 col-xs-6 white" style="text-align:right">
                <button class="btn btn-primary hidden" id="efficom-action-login" type="button">
                    ${app_settings.messages.connection || 'Connexion'} 
                </button>
            </div>
        </div>
    </div>`;

    // Inject the header/pave into the page (adjust selector as needed)
    const targetElement = document.querySelector('body'); // Or a more specific element
    if (targetElement) {
        targetElement.insertAdjacentHTML('afterbegin', EfficomPave);
        console.log("[Efficom BG] UI Pave injected.");
        // Now select the elements within the injected HTML
        efficomMessage = document.querySelector('.efficom-message');
        efficomActionLogin = document.querySelector('#efficom-action-login');
    } else {
        console.error("[Efficom BG] Could not find target element to inject UI.");
    }
}

// --- Event Listener Setup ---
function setupListeners() {
    console.log("[Efficom BG] Setting up listeners...");
    // Add listeners for messages from the service worker or other parts
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log("[Efficom BG] Received message:", message);
        if (!app_settings) {
             console.warn("[Efficom BG] Received message before config loaded. Ignoring.");
             return;
        }
        switch (message.type) {
            case app_settings.types.efficom_login_return:
                login(message);
                break;
            case app_settings.types.efficom_send_prix_return:
                handleSendPrixReturn(message.data);
                break;
            case app_settings.types.efficom_send_prix_error:
                handleError(message.data.error || "Erreur lors de l'envoi du prix.");
                break;
            case app_settings.types.get_reprise_info_return:
            case app_settings.types.get_reprise_info_return2:
            case app_settings.types.get_reprise_info_return3:
                handleRepriseInfoReturn(message.data);
                break;
            case app_settings.types.get_reprise_info_return_local:
                handleRepriseInfoReturn(message.data); // Handle same way?
                break;
            // Add other message types as needed
            default:
                console.log("[Efficom BG] Unhandled message type in content script:", message.type);
        }
    });

    // Add listeners for UI elements if needed (e.g., if login button was handled here)
    if (efficomActionLogin) {
        // Example: efficomActionLogin.addEventListener('click', handleLoginClick);
    }
}

// --- Initial State Check ---
function checkInitialState() {
    console.log("[Efficom BG] Checking initial state...");
    if (!app_settings) return;

    // Example: Check if user info exists in config or needs fetching
    if (!app_settings.user_info) {
        // Maybe try to detect if logged into the target site and trigger login fetch?
        // This depends heavily on the site structure.
        // For now, just log it.
        console.log("[Efficom BG] User info not available in initial config.");
        // If login button exists, make it visible?
        if (efficomActionLogin) {
            // efficomActionLogin.classList.remove('hidden');
        }
        if (efficomMessage) {
            efficomMessage.textContent = app_settings.messages.not_connect || "Non connecté.";
        }
    } else {
        logged = true;
        if (efficomMessage) {
            efficomMessage.textContent = app_settings.messages.connected || "Connecté.";
        }
        // Update UI with user info
        const infoUserElement = document.querySelector('.InfoUser');
        if (infoUserElement && app_settings.user_info && app_settings.user_info.length > 0) {
            infoUserElement.textContent = app_settings.user_info[0]; // Assuming first element is username
        }
        // Start scraping or other actions if logged in
        startScrapingProcess();
    }
}

// --- Core Logic Functions (Modified to use dynamic app_settings) ---

function handleError(response) {
    console.error("[Efficom BG] Handling error:", response);
    if (efficomActionLogin) {
        efficomActionLogin.removeAttribute('disabled');
        efficomActionLogin.textContent = app_settings.messages.export || "Exporter";
    }
    if (efficomMessage) {
        efficomMessage.textContent = response;
    }
}

function handleFailError(response) {
    console.error("[Efficom BG] Handling fail error:", response);
    if (efficomActionLogin) {
        efficomActionLogin.removeAttribute('disabled');
        efficomActionLogin.textContent = app_settings.messages.export || "Exporter";
    }
    const errorText = "Erreur inattendue! Réessayez d'exporter plus tard.";
    if (efficomMessage) {
        efficomMessage.textContent = errorText;
    }
}

function getClassInfo(isOk) {
    return isOk ? 'scrape-ok' : 'scrape-ko';
}

function reloadInfoB() {
    if (!instance || !instance[0] || !app_settings) return;
    console.log("[Efficom BG] Reloading Info Box with data:", JSON_FG_WEB);

    const carInfo = (JSON_FG_WEB.prix.fMontantCatalogue > 0 || JSON_FG_WEB.prix.fMontantVenteVO > 0);
    const carOptions = JSON_FG_WEB.prix.option.length > 0;
    const carAccessories = nbrAccessoires > 0;
    const carDisburments = JSON_FG_WEB.prix.supplement.length > 0;
    const carServices = JSON_FG_WEB.prix.service.length > 0;
    const carFinance = JSON_FG_WEB.prix.fMontantAFinancer > 0 || JSON_FG_WEB.prix.szTypeProduit === 'CPT';
    const carReprise = JSON_FG_WEB.prix.fValeurRepriseVO > 0;
    carInfoClient = !!(JSON_FG_WEB.prix.szNomClient && JSON_FG_WEB.prix.szTypeClient);

    // Construct the tooltip content
    let tooltipContent = `<p class="scrape-pp">Exporter la commande dans Efficom </br>
        <span class="scrape ${getClassInfo(carInfoClient)} carInfoClient">Client</span>
        <span class="scrape ${getClassInfo(carInfo)} carInfo">Véhicule</span>
        <span class="scrape ${getClassInfo(carOptions)} carOptions">Options</span>
        <span class="scrape ${getClassInfo(carAccessories)} carAccessories">Accéssoires</span>
        <span class="scrape ${getClassInfo(carDisburments)} carDisburments">Suppléments</span>
        <span class="scrape ${getClassInfo(carServices)} carServices">Services</span>
        <span class="scrape ${getClassInfo(carFinance)} carFinance">Financement</span>
        <span class="scrape ${getClassInfo(carReprise)} carReprise">Reprise</span>
    </p>`;

    try {
        instance[0].setContent(tooltipContent);
    } catch (e) {
        console.error("[Efficom BG] Error setting tooltip content:", e);
    }
}

function getUserInfoByRrf(affaire) {
    if (!app_settings) return;
    var settings = {
        "url": `${app_settings.bo_app_url}api/wsEfficom/getToken/${affaire}`,
        "method": "GET",
        "timeout": 0,
        "headers": {
            // Consider making Cookie configurable via API
            "Cookie": "symfony=e750c26ba7f0a375f492ba2a451b8c1b"
        },
    };

    (async () => {
        try {
            const rawResponse = await fetch(settings.url, settings);
            if (!rawResponse.ok) {
                throw new Error(`HTTP error! status: ${rawResponse.status}`);
            }
            const response = await rawResponse.json();
            console.log("[Efficom BG] RRF Info response:", response);
            if (response.error === false) {
                if (response.url) {
                    // Update app_url in the *local* copy of settings for this session?
                    // Or maybe the service worker should handle this?
                    // For now, let's assume the service worker handles the primary login.
                    console.log("[Efficom BG] Received URL from RRF, sending login message:", response.url);
                    chrome.runtime.sendMessage({ type: "login", url: response.url });
                }
            } else {
                handleError(response.error || "Erreur lors de la récupération des informations RRF.");
            }
        } catch (error) {
            console.error("[Efficom BG] Error fetching RRF info:", error);
            handleError(`Erreur réseau RRF: ${error.message}`);
        }
    })();
}

// Authentification handler (called when login message returns from service worker)
function login(response) {
    console.log("[Efficom BG] Handling login response:", response);
    if (!app_settings) return;

    if (response.data && response.data.data) {
        // Assuming response.data.data contains the user info array
        app_settings.user_info = response.data.data;
        logged = true;
        console.log("[Efficom BG] Login successful, user info:", app_settings.user_info);
        if (efficomMessage) {
            efficomMessage.textContent = app_settings.messages.connected || "Connecté.";
        }
        if (efficomActionLogin) {
            efficomActionLogin.classList.add('hidden');
        }
        // Update UI with user info
        const infoUserElement = document.querySelector('.InfoUser');
        if (infoUserElement && app_settings.user_info.length > 0) {
            infoUserElement.textContent = app_settings.user_info[0];
        }
        // Trigger scraping or other actions now that we are logged in
        startScrapingProcess();

    } else {
        logged = false;
        app_settings.user_info = null;
        console.warn("[Efficom BG] Login failed or user info not found in response.");
        if (efficomMessage) {
            efficomMessage.textContent = app_settings.messages.not_connect || "Non connecté.";
        }
        if (efficomActionLogin) {
            efficomActionLogin.classList.remove('hidden');
        }
    }
}

// --- Scraping Logic (Placeholder - adapt based on original functionality) ---
function startScrapingProcess() {
    console.log("[Efficom BG] Starting scraping process (if applicable for this page)...");
    if (!app_settings || !logged) {
        console.warn("[Efficom BG] Cannot start scraping: config not loaded or not logged in.");
        return;
    }

    // Add the logic that was previously in the main part of the script
    // This will likely involve selecting elements, extracting data, and potentially
    // sending messages back to the service worker (e.g., send_prix).

    // Example: Initialize tooltip (assuming tippy.js is loaded via manifest)
    if (typeof tippy !== 'undefined') {
         instance = tippy(".contexty-efficom", {
            allowHTML: true,
            interactive: true,
            trigger: "mouseenter",
            placement: "bottom",
            content: app_settings.messages.init || "Initialisation...",
            onShow(instance) {
                console.log("[Efficom BG] Tippy tooltip shown.");
                reloadInfoB(); // Update content when shown
            }
        });
        console.log("[Efficom BG] Tippy instance created.");
    } else {
        console.error("[Efficom BG] tippy.js not found!");
    }

    // Example: Check URL and potentially trigger specific scraping functions
    if (app_page.includes("toyota-france.my.site.com")) {
        scrapeToyotaSite();
    } else if (app_page.includes("reprise-argus.fr")) {
        scrapeArgusSite();
    }
    // Add other site-specific logic here

    // Example: If an export button exists on the page, add a listener
    const exportButton = document.getElementById('someExportButtonId'); // Replace with actual ID
    if (exportButton) {
        exportButton.addEventListener('click', handleExportClick);
    }
}

function scrapeToyotaSite() {
    console.log("[Efficom BG] Scraping Toyota site...");
    // Add Toyota-specific scraping logic here
    // ... find elements, extract data ...
    // Example: populate JSON_FG_WEB.prix with scraped data
    // JSON_FG_WEB.prix.szNomClient = document.getElementById('clientName')?.value || '';
    // ... etc ...

    // Request reprise info if needed
    // chrome.runtime.sendMessage({ type: app_settings.types.get_reprise_info_request_local });
}

function scrapeArgusSite() {
    console.log("[Efficom BG] Scraping Argus site...");
    // Add Argus-specific scraping logic here
    // ... find elements, extract data for reprise ...
    // Example: Send reprise data back to service worker
    // let repriseData = { marque: '...', modele: '...', ... };
    // chrome.runtime.sendMessage({ type: app_settings.types.get_reprise_info_return, data: repriseData });
}

function handleExportClick() {
    console.log("[Efficom BG] Export button clicked.");
    if (!app_settings || !logged) {
        handleError("Non connecté ou configuration non chargée.");
        return;
    }
    if (efficomActionLogin) {
        efficomActionLogin.setAttribute('disabled', 'disabled');
        efficomActionLogin.innerHTML = app_settings.messages.loadingExport || "Exportation...";
    }

    // --- Populate JSON_FG_WEB with latest scraped data --- 
    // (Ensure scraping functions update JSON_FG_WEB correctly)
    // Add user info from app_settings
    if (app_settings.user_info) {
        JSON_FG_WEB.prix.userIpn = app_settings.user_info[4] || "";
        JSON_FG_WEB.prix.szIdentifiantRR = app_settings.user_info[5] || "";
        JSON_FG_WEB.prix.szRattachement = app_settings.user_info[5] || ""; // Same as RR?
        JSON_FG_WEB.prix.szCodePND = app_settings.user_info[3] || "";
        JSON_FG_WEB.prix.szNomVendeur = app_settings.user_info[1] || "";
        JSON_FG_WEB.prix.szPrenomVendeur = app_settings.user_info[2] || "";
        JSON_FG_WEB.prix.cTypeVendeur = app_settings.user_info[7] !== undefined ? app_settings.user_info[7] : null;
    }
    JSON_FG_WEB.prix.dateCreate = moment().format('YYYY-MM-DD HH:mm:ss');
    // ... ensure all other necessary fields in JSON_FG_WEB.prix are populated ...

    console.log("[Efficom BG] Sending data for export:", JSON_FG_WEB);
    chrome.runtime.sendMessage({ type: app_settings.types.send_prix, data: JSON_FG_WEB });
}

function handleSendPrixReturn(data) {
    console.log("[Efficom BG] Received send_prix confirmation:", data);
    if (efficomActionLogin) {
        efficomActionLogin.removeAttribute('disabled');
        efficomActionLogin.textContent = app_settings.messages.export || "Exporter";
    }
    if (efficomMessage) {
        // Display success message from response or a default one
        efficomMessage.textContent = data.message || "Exportation réussie !";
    }
    // Maybe update tooltip
    reloadInfoB();
}

function handleRepriseInfoReturn(data) {
    console.log("[Efficom BG] Received reprise info:", data);
    // Update JSON_FG_WEB with reprise data
    if (data) {
        hasReprise = true;
        JSON_FG_WEB.prix.fValeurRepriseVO = data.fValeurRepriseVO || 0;
        JSON_FG_WEB.prix.fMontantEngagementReprise = data.fMontantEngagementReprise || 0;
        JSON_FG_WEB.prix.szRepVONom_CG = data.szRepVONom_CG || "";
        JSON_FG_WEB.prix.szRepVO_Marque = data.szRepVO_Marque || "";
        JSON_FG_WEB.prix.szRepVO_Modele = data.szRepVO_Modele || "";
        JSON_FG_WEB.prix.szRepVO_Origine = data.szRepVO_Origine || "";
        JSON_FG_WEB.prix.szRepVO_Km = data.szRepVO_Km || 0;
        JSON_FG_WEB.prix.szRepVO_ImmaDate1 = data.szRepVO_ImmaDate1 || "";
        JSON_FG_WEB.prix.szRepVO_ImmaDate = data.szRepVO_ImmaDate || "";
        JSON_FG_WEB.prix.szRepVO_Chassis = data.szRepVO_Chassis || "";
        JSON_FG_WEB.prix.szRepVO_Energie = data.szRepVO_Energie || "";
        JSON_FG_WEB.prix.szRepVoNumImmat = data.szRepVoNumImmat || "";
        JSON_FG_WEB.prix.szRepVO_PrimeConv = data.szRepVO_PrimeConv || 0;
        // ... add any other relevant reprise fields ...
    } else {
        hasReprise = false;
    }
    // Update tooltip
    reloadInfoB();
}

// --- Start Initialization ---
// Use DOMContentLoaded to ensure the body exists before injecting UI
document.addEventListener('DOMContentLoaded', initializeExtension);

