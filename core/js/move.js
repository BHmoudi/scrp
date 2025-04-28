!self.browser && self.chrome && (browser = chrome)
var app_page = window.location.href;
console.log("[Efficom Move] Script loaded for page:", app_page);

var manifestData = chrome.runtime.getManifest();
const APP_VERSION = manifestData.version;
console.log("[Efficom Move] #APP_VERSION: " + APP_VERSION)

// Variable to hold the configuration fetched from the service worker
let app_settings = null;

var marques = { 0: 'RENAULT', 1: 'NISSAN', 2: 'DACIA', 3: 'INFINITY', 4: 'ALPINE', 5: 'ABARTH', 6: 'ALFA ROMEO', 7: 'ALPINA', 8: 'ASTON MARTIN', 9: 'AUDI', 10: 'AUSTIN', 11: 'BENTLEY', 12: 'BMW', 14: 'BUGATTI', 15: 'BUICK', 16: 'CADILLAC', 17: 'CHEVROLET', 18: 'CHRYSLER', 19: 'CITROEN', 20: 'CORVETTE', 21: 'DANGEL', 22: 'DAIHATSU', 23: 'DE TOMASO', 24: 'DODGE', 25: 'DS', 26: 'FERRARI', 27: 'FIAT', 28: 'FORD', 29: 'HONDA', 30: 'HUMMER', 31: 'HYUNDAI', 32: 'ISUZU', 33: 'IVECO', 34: 'JAGUAR', 35: 'JEEP', 36: 'KIA', 37: 'LADA', 38: 'LAMBORGHINI', 39: 'LANCIA', 40: 'LEXUS', 41: 'LOTUS', 42: 'LAND ROVER', 43: 'MAHINDRA', 44: 'MASERATI', 45: 'MAYBACH', 46: 'MAZDA', 47: 'MERCEDES', 48: 'MINI', 49: 'MITSUBISHI', 50: 'MORGAN', 51: 'OPEL', 52: 'PANTHER', 53: 'PEUGEOT', 54: 'PGO', 55: 'PIAGGIO', 56: 'PORSCHE', 57: 'ROLLS-ROYCE', 58: 'ROVER', 59: 'SAAB', 60: 'SANTANA', 61: 'SEAT', 62: 'SKODA', 63: 'SMART', 64: 'SSANGYONG', 65: 'SUBARU', 66: 'SUZUKI', 67: 'TOYOTA', 68: 'TRIUMPH', 69: 'VOLKSWAGEN', 70: 'VOLVO', 71: 'BOLLORE', 72: 'MEGA', 73: 'LIGIER', 74: 'MG', 75: 'AIXAM', 76: 'AMG', 77: 'TESLA' };
var energies = { 1: 'Essence', 2: 'Essence', 14: 'Essence', 3: 'Diesel', 8: 'Electrique', 9: 'Electrique', 12: 'Electrique', 13: 'Electrique', 4: 'GPL', 5: 'Biocarburant', 6: 'Hybride', 7: 'Hybride' };

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
        "szCarosserie": "", "iPuissance": 0, "iPlacesAssises": 0, "fMontantSuperBonus": 0,
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

// --- Initialization Function ---
async function initializeExtension() {
    console.log("[Efficom Move] Initializing...");
    try {
        const response = await chrome.runtime.sendMessage({ type: "getConfig" });
        if (chrome.runtime.lastError) {
            throw new Error(`Error getting config: ${chrome.runtime.lastError.message}`);
        }
        if (response && response.config) {
            app_settings = response.config;
            console.log("[Efficom Move] Configuration received:", app_settings);
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
        console.error("[Efficom Move] Initialization failed:", error);
        // Display an error message to the user on the page?
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
        console.error("[Efficom Move] Could not display initialization error on page.", e);
    }
}

// --- UI Building Function ---
function buildUI() {
    console.log("[Efficom Move] Building UI elements...");
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
        console.log("[Efficom Move] UI Pave injected.");
        // Now select the elements within the injected HTML
        efficomMessage = document.querySelector('.efficom-message');
        efficomActionLogin = document.querySelector('#efficom-action-login');
    } else {
        console.error("[Efficom Move] Could not find target element to inject UI.");
    }
}

// --- Event Listener Setup ---
function setupListeners() {
    console.log("[Efficom Move] Setting up listeners...");
    // Add listeners for messages from the service worker or other parts
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log("[Efficom Move] Received message:", message);
        if (!app_settings) {
             console.warn("[Efficom Move] Received message before config loaded. Ignoring.");
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
                console.log("[Efficom Move] Unhandled message type in content script:", message.type);
        }
    });

    // Add listeners for UI elements if needed (e.g., if login button was handled here)
    if (efficomActionLogin) {
        efficomActionLogin.addEventListener('click', handleLoginClick);
    }
}

function handleLoginClick() {
    console.log("[Efficom Move] Login button clicked");
    if (!app_settings) {
        console.error("[Efficom Move] Configuration not loaded yet");
        return;
    }
    // Implement login logic here
}

// --- Initial State Check ---
function checkInitialState() {
    console.log("[Efficom Move] Checking initial state...");
    if (!app_settings) return;

    // Example: Check if user info exists in config or needs fetching
    if (!app_settings.user_info) {
        // Maybe try to detect if logged into the target site and trigger login fetch?
        // This depends heavily on the site structure.
        // For now, just log it.
        console.log("[Efficom Move] User info not available in initial config.");
        // If login button exists, make it visible?
        if (efficomActionLogin) {
            efficomActionLogin.classList.remove('hidden');
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
    console.error("[Efficom Move] Handling error:", response);
    if (efficomActionLogin) {
        efficomActionLogin.removeAttribute('disabled');
        efficomActionLogin.textContent = app_settings.messages.export || "Exporter";
    }
    if (efficomMessage) {
        efficomMessage.textContent = response;
    }
}

function handleFailError(response) {
    console.error("[Efficom Move] Handling fail error:", response);
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
    console.log("[Efficom Move] Reloading Info Box with data:", JSON_FG_WEB);

    const carInfo = (JSON_FG_WEB.prix.fMontantCatalogue > 0 || JSON_FG_WEB.prix.fMontantVenteVO > 0);
    const carOptions = JSON_FG_WEB.prix.option.length > 0;
    const carAccessories = JSON_FG_WEB.prix.accessoire.length > 0;
    const carDisburments = JSON_FG_WEB.prix.supplement.length > 0;
    const carServices = JSON_FG_WEB.prix.service.length > 0;
    const carFinance = JSON_FG_WEB.prix.fMontantAFinancer > 0 || JSON_FG_WEB.prix.szTypeProduit === 'CPT';
    const carReprise = JSON_FG_WEB.prix.fValeurRepriseVO > 0;
    carInfoClient = !!(JSON_FG_WEB.prix.szNomClient && JSON_FG_WEB.prix.szTypeClient);

    // Construct the tooltip content
    let tooltipContent = `<p class="scrape-pp">
        N° Commande ${JSON_FG_WEB.prix.iNumContratCommande} </br>
        Exporter la commande dans Efficom </br>
        <span class="scrape ${getClassInfo(carInfoClient)} carInfoClient">Client</span>
        <span class="scrape ${getClassInfo(carInfo)} carInfo">Véhicule</span>
        <span class="scrape ${getClassInfo(carOptions)} carOptions">Options</span>
        <span class="scrape ${getClassInfo(carAccessories)} carAccessories">Accéssoires</span>
        <span class="scrape ${getClassInfo(carDisburments)} carDisburments">Suppléments</span>
        <span class="scrape ${getClassInfo(carServices)} carServices">Services</span>
        <span class="scrape ${getClassInfo(carFinance)} carFinance">Financement</span>
        <span class="scrape ${getClassInfo(carReprise)} carReprise">Reprise</span>
        <span class="scrape">Utilisateur : ${app_settings.user_info ? app_settings.user_info[0] : 'Non connecté'}</span>
        <span class="scrape">Version : V${APP_VERSION}</span>
    </p>`;

    try {
        instance[0].setContent(tooltipContent);
    } catch (e) {
        console.error("[Efficom Move] Error setting tooltip content:", e);
    }
}

// --- Scraping Logic (Placeholder - adapt based on original functionality) ---
function startScrapingProcess() {
    console.log("[Efficom Move] Starting scraping process (if applicable for this page)...");
    if (!app_settings || !logged) {
        console.warn("[Efficom Move] Cannot start scraping: config not loaded or not logged in.");
        return;
    }

    // Example: Initialize tooltip (assuming tippy.js is loaded via manifest)
    if (typeof tippy !== 'undefined') {
         instance = tippy(".contexty-efficom", {
            allowHTML: true,
            interactive: true,
            trigger: "mouseenter",
            placement: "bottom",
            content: app_settings.messages.init || "Initialisation...",
            onShow(instance) {
                console.log("[Efficom Move] Tippy tooltip shown.");
                reloadInfoB(); // Update content when shown
            }
        });
        console.log("[Efficom Move] Tippy instance created.");
    } else {
        console.error("[Efficom Move] tippy.js not found!");
    }

    // Add site-specific scraping logic here
    // This would be the implementation of ScrapeMove and other functions
}

function ScrapeMove(Offre, InfoClient) {
    console.log("[Efficom Move] Scraping Move data:", Offre, InfoClient);
    if (!app_settings || !app_settings.user_info) {
        console.error("[Efficom Move] Cannot scrape: user info not available");
        return;
    }
    
    JSON_FG_WEB.prix.userIpn = app_settings.user_info[4];
    JSON_FG_WEB.prix.dateCreate = moment().format('YYYY-MM-DD H:mm:ss');
    JSON_FG_WEB.prix.szNomEtablissement = InfoClient.Data.EtablissementDTO.NomEtablissement;
    JSON_FG_WEB.prix.szIdentifiantRR = app_settings.user_info[5];
    JSON_FG_WEB.prix.szRattachement = app_settings.user_info[5];
    JSON_FG_WEB.prix.szCodePND = app_settings.user_info[3];
    JSON_FG_WEB.prix.szNomVendeur = app_settings.user_info[1];
    JSON_FG_WEB.prix.szPrenomVendeur = app_settings.user_info[2];
    JSON_FG_WEB.prix.cTypeVendeur = app_settings.user_info[7];
    
    // Continue with the rest of the scraping logic...
    // This would be the implementation of the original ScrapeMove function
}

function login(response) {
    console.log("[Efficom Move] Handling login response:", response);
    if (!app_settings) return;

    if (response.data && response.data.data) {
        // Assuming response.data.data contains the user info array
        app_settings.user_info = response.data.data;
        logged = true;
        console.log("[Efficom Move] Login successful, user info:", app_settings.user_info);
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
        console.warn("[Efficom Move] Login failed or user info not found in response.");
        if (efficomMessage) {
            efficomMessage.textContent = app_settings.messages.not_connect || "Non connecté.";
        }
        if (efficomActionLogin) {
            efficomActionLogin.classList.remove('hidden');
        }
    }
}

function handleSendPrixReturn(data) {
    console.log("[Efficom Move] Received send_prix confirmation:", data);
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
    console.log("[Efficom Move] Received reprise info:", data);
    // Update JSON_FG_WEB with reprise data
    if (data) {
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
    }
    // Update tooltip
    reloadInfoB();
}

// --- Start Initialization ---
// Use DOMContentLoaded to ensure the body exists before injecting UI
document.addEventListener('DOMContentLoaded', initializeExtension);
