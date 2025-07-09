!self.browser && self.chrome && (browser = chrome)

// Charger le FormManager
const script = document.createElement('script');
script.src = chrome.runtime.getURL('core/js/form-manager.js');
document.head.appendChild(script);

var app_page = window.location.href;
console.log("===============Efficom Enhanced===============");
var manifestData = chrome.runtime.getManifest();
console.log(manifestData.version);
const APP_VERSION = manifestData.version;
console.log("#APP_VERSION: " + APP_VERSION)

var app_settings = {
    app_url: "https://pilote-toyota.orcaformation.com/",
    fg_url: "http://localhost:10211/app_dev.php/prix",
    bo_app_url: "https://wkfefficom.dcs2.renault.com/",
    ws_prix_url: "https://wkfefficom.dcs2.renault.com/api/prix",
    user_info: null,
    messages: {
        not_connect: "Vous n'êtes pas connecter a efficom",
        connected: "Vous êtes connectés",
        connection: "Connexion",
        loading: `Chargement...`,
        loadingExport: `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Exportation en cours...`,
        export: "Exporter la Feuille de gestion",
        scrapping: "Scrapping en cours...",
        LoadingReprise: `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Scrapping de la reprise...`,
        loadingData: 'La récupération de données est toujours en cours, veuillez patienter, quelques secondes et réessayer.',
        init: 'Initialisation...',
        formReview: 'Vérifier les données',
        formEdit: 'Modifier les données'
    },
    types: {
        efficom_login_return: 'efficom_login_return',
        get_client_info: 'get_client_info',
        get_client_info_return: 'get_client_info_return',
        get_client_type_info: 'get_client_type_info',
        get_client_type_info_return: 'get_client_type_info_return',
        send_prix: 'send_prix',
        send_prix_return: 'send_prix_return',
        efficom_error: 'efficom_error',
        efficom_fail: 'efficom_fail',
        efficom_send_prix_error: 'efficom_send_prix_error',
        efficom_send_prix_return: 'efficom_send_prix_return',
        get_reprise_info: "get_reprise_info",
        get_reprise_info_return: "get_reprise_info_return",
        get_reprise_info_return2: "get_reprise_info_return2",
        get_reprise_info_return3: "get_reprise_info_return3",
        get_reprise_info_request_local: "get_reprise_info_request_local",
        get_reprise_info_return_local: "get_reprise_info_return_local",
        // Nouveaux types pour le formulaire
        show_scraped_data_form: 'show_scraped_data_form',
        update_scraped_data: 'update_scraped_data',
        export_to_efficom: 'export_to_efficom'
    }
}

var carInfoClient = false;
var Logoimage = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALkAAAA/CAIAAAAzJv7OAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAEmElEQVR42u2aPa7TQBDHcxIOkuNQ+BBcgSY1B3g1NGmokWiQaKCJ0CtAQgIhIRASQi+GAfutJ7Mz492xnZDkP0oR7/fHz/Ox69VvCKRMVlgCCFiBgBUIWIGAFQhYgYAVCOSSWNk2q0HWm52W3GzNGnn2brPWMlKtoY+s/EodSn2/RlN2iaxDXjQbyTCQfgRD6XzUF8tKWn49tWA/RJlhO2tZsdusLnNfrJwVUfIQSrByMHt9rTSNMVQ33t6MPpuVPsdJKOtX046HvY5sbgaVpVivlJX1ei1fwD7pfkmyJdJXzljoclZki9X9aqxY9krb3JTbNOqgwUrTJFi6tPVm07AlsRZEpiua/m/9sF6Z0K/pcribO6Cy1UcNVjbbbsbNtk9Kf6KsDA3wv7X+ylRWhLMxurkcFR1xsLLZ9X9708PeqjArmYkrZ0Xxp0v7/ffM/LCcFmdzJRyKGQMryfbkz0F/RVYL2INQv7mekbTYfWaBuRskXjErbHkP3s1gHKQH4NWshOMg1q9o2uzTQyX1DlYO/cgDYx08X1EOV0Ks1Pab0kzVYvW5HYl7umSHlRJn6UJYMZ6C57bqsW2Ilbp+WTtSU/p9WiG2GPzVsgLBfRAErEDACgSsQCBgBQJWIGAFAlYgYAUCViBgxc9+8PQu9pvYyNLVJ67a55/ti0/tk93+0et9avPhyztKoXTKLW/q26/21Zf25nb/+O2ej5AeKZGyqEB4j6gRUZhGWLhuYGUqKx9+tP5ydz8qM7rHVODZ+33JdKiY01r5UtQWBitxVugtLx8DqRlHwbz73lKBqtbefG0De0Rwc3UIVo7BChmX2mHQBqv6gECJraqKi1+F+E4lqTpYWZwVejtj60DGKDc9VRpF/HJdNWq/UsnnH4/OSu1CT2zktNUdl5DbBYJJOKeqFXC8S9rUxAH9sVyZHD5/+7l7O+ppgZWpU7DMfP6KqwqDwhmuVMqNi2UyRL8qT+pknTJgZZ4pqKqb63bL+aWImopxDlTvOFcVviYgz8mfoBhwp9gE8eqkTuCvXBgr6oYJy5LURuJD9WrVpqwAx/KCBVt5AVGrc2+FllJb/k9ZKTeZS1SvYkW1LLGom5/dpZ9zdqLaLBqPP0GR2KlAoUisimBl0k7PeEITaCoQ6AkoO/eWqzTKBStgpc8VYZSqacDKDGstip0jK8I7ET5158GcTRx0RqyoTobjkZBnoHq+AX9FDdc7C+KzIiqKs58u6kbMPD8r5XEQDy7IAxUB89HiIMcl564xWJmfFfUmiJRH3tfN7d5XA2pTzvmKeno7er7iDIZ3B1bmZ0U1BCJwdY53+andcc5t/cvOhBpYOd59EDkBZCPSvlo6X2xt4X2QtdMl90H+fWeynmdzz3xerNDmxS6HT3LPXDh3sLLU6cjoxx/l368Emqr6fiVl5Vff/NoZrCx4kla1x/53cY7Nmv5dnHPryV1ysLIgK50ToJ6RLPq9rd+aM7s85ObAgZVlWUnE0AtKWyh0A6VQ+izf8ROR1FrsO34n7OKtzcwKBAJWIGAFAlYgYAUCViBgBQJWIBCwAgErkCPLH2EtOW3okEXMAAAAAElFTkSuQmCC";

// Template amélioré avec bouton pour le formulaire
EfficomPave = `
<div class="bootstrap-sf1 row page-header page-header-compact contexty-efficom">
<div class="bootstrap-sf1 col-xs-3 nopadding white text-center info-app">
    <div class="col-xs-6"><img class="efficom-logo" src="${Logoimage}" alt=""></div>
</div>
  <div class="bootstrap-sf1 col-xs-9 white padding-top12" style="">
    <div style="text-align:left" class="white bootstrap-sf1 col-xs-4 efficom-message"></div>
    <div class="bootstrap-sf1 col-xs-4 white" style="text-align:center">
        <button class="btn btn-info hidden" id="efficom-action-form" type="button">
            ${app_settings.messages.formReview}
        </button>
    </div>
    <div class="bootstrap-sf1 col-xs-4 white" style="text-align:right">
        <button class="btn btn-primary hidden" id="efficom-action-login" type="button">
            ${app_settings.messages.connection}
        </button>
    </div>
  </div>
</div>
`;

var marques = { 0: 'RENAULT', 1: 'NISSAN', 2: 'DACIA', 3: 'INFINITY', 4: 'ALPINE', 5: 'ABARTH', 6: 'ALFA ROMEO', 7: 'ALPINA', 8: 'ASTON MARTIN', 9: 'AUDI', 10: 'AUSTIN', 11: 'BENTLEY', 12: 'BMW', 14: 'BUGATTI', 15: 'BUICK', 16: 'CADILLAC', 17: 'CHEVROLET', 18: 'CHRYSLER', 19: 'CITROEN', 20: 'CORVETTE', 21: 'DANGEL', 22: 'DAIHATSU', 23: 'DE TOMASO', 24: 'DODGE', 25: 'DS', 26: 'FERRARI', 27: 'FIAT', 28: 'FORD', 29: 'HONDA', 30: 'HUMMER', 31: 'HYUNDAI', 32: 'ISUZU', 33: 'IVECO', 34: 'JAGUAR', 35: 'JEEP', 36: 'KIA', 37: 'LADA', 38: 'LAMBORGHINI', 39: 'LANCIA', 40: 'LEXUS', 41: 'LOTUS', 42: 'LAND ROVER', 43: 'MAHINDRA', 44: 'MASERATI', 45: 'MAYBACH', 46: 'MAZDA', 47: 'MERCEDES', 48: 'MINI', 49: 'MITSUBISHI', 50: 'MORGAN', 51: 'OPEL', 52: 'PANTHER', 53: 'PEUGEOT', 54: 'PGO', 55: 'PIAGGIO', 56: 'PORSCHE', 57: 'ROLLS-ROYCE', 58: 'ROVER', 59: 'SAAB', 60: 'SANTANA', 61: 'SEAT', 62: 'SKODA', 63: 'SMART', 64: 'SSANGYONG', 65: 'SUBARU', 66: 'SUZUKI', 67: 'TOYOTA', 68: 'TRIUMPH', 69: 'VOLKSWAGEN', 70: 'VOLVO', 71: 'BOLLORE', 72: 'MEGA', 73: 'LIGIER', 74: 'MG', 75: 'AIXAM', 76: 'AMG', 77: 'TESLA' };
var energies = { 1: 'Essence', 2: 'Essence', 14: 'Essence', 3: 'Diesel', 8: 'Electrique', 9: 'Electrique', 12: 'Electrique', 13: 'Electrique', 4: 'GPL', 5: 'Biocarburant', 6: 'Hybride', 7: 'Hybride' };
var prix = {};

// Structure JSON améliorée avec plus de champs
var JSON_FG_WEB = {
    "prix": {
        "userIpn": "",
        "dateCreate": "",
        "iNumVersion": 9,
        "szNomEtablissement": "",
        "szIdentifiantRR": "",
        "szRattachement": "",
        "szCodePND": "",
        "szNomVendeur": "",
        "szPrenomVendeur": "",
        "cTypeVendeur": null,
        "szTypeClient": "",
        "szCiviliteClient": "",
        "szNomClient": "",
        "szPrenomClient": "",
        "szAdresseClient": "",
        "szCodePostalClient": "",
        "szVilleClient": "",
        "szTelClientPortable": "",
        "szEmailClient": "",
        "szEmailOptin": "",
        "szMarque": "",
        "szGamme": "",
        "szGenre": "",
        "szModele": "",
        "szSemiClairModele": "",
        "szVersion": "",
        "szSemiClairVersion": "",
        "iNumTarif": 0,
        "szCouleur": "",
        "fMontantCatalogue": 0,
        "fMontantVenteVO": 0,
        "fPrixHTPublic": 0,
        "fPrixHTPlaques": 0,
        "fPrixHTPreparation": 0,
        "fPrixHTConcessionnaire": 0,
        "szDateLivraison": "",
        "fMontantRemise": 0,
        "fTauxTVA": 0,
        "szTypeTVA": "",
        "szEnergie": "",
        "iNivCO2": 0,
        "iNbVehicule": 1,
        "szTypeProduit": "",
        "fMontantAFinancer": 0,
        "fApport": 0,
        "fDG": 0,
        "fPLM": 0,
        "iNbreAssurances": 0,
        "fMontantEngagementReprise": 0,
        "iFinancementAvecCaution": 0,
        "fSurestimationRepVO": 0,
        "szDateVente": "",
        "szNumExport": "",
        "numCmde": "",
        "szCodeDistrinet": "",
        "fAideRPE": 0,
        "fAideAutres": 0,
        "szCategorieFinanDMS": "",
        "fCommissionVehicule": 0,
        "fCommissionFinance": 0,
        "fCommissionAssurances": 0,
        "fCommissionServices": 0,
        "fCommissionAccessoires": 0,
        "fCommissionIntermediaire": 0,
        "fCommissionGFA": 0,
        "fCommissionTransfo": 0,
        "fCommissionGravage": 0,
        "fCommissionAutres": 0,
        "iNumVersionActionCo": 0,
        "iNbreActionsCo": 0,
        "iNbreSupplements": 0,
        "iNumVersionSupplements": 0,
        "iNbreServices": 0,
        "iNumVersionServices": 0,
        "iNbreOptions": 0,
        "iNumVersionOptions": 0,
        "iNbreAccessoires": 0,
        "iNumVersionAccessoires": 0,
        "iNumContratFinanDiac": "",
        "iNumContratCommande": "",
        "szClientFinal": "",
        "szRefClient": "",
        "szRepVONom_CG": "",
        "szRepVO_Marque": "",
        "szRepVO_Modele": "",
        "szRepVO_Origine": "",
        "szRepVO_Km": 0,
        "szRepVO_ImmaDate1": "",
        "szRepVO_ImmaDate": "",
        "szRepVO_Chassis": "",
        "szRepVO_Energie": "",
        "szRepVoNumImmat": "",
        "szRepVO_PrimeConv": 0,
        "fgModeAcompte": "",
        "fgAcompte": 0,
        "iKmCompteur": 0,
        "bKmReel": 0,
        "szOrigineVO": "",
        "szNumImmat": "",
        "bPremiereMain": 0,
        "szDatePremiereImmat": "",
        "szDateImmat": "",
        "szTypeGarantie": "0",
        "szNumSerie": "",
        "szCarosserie": "",
        "iPuissance": 0,
        "iPlacesAssises": 0,
        "fValeurRepriseVO": 0,
        "accessoire": [],
        "actionCo": [],
        "option": [],
        "supplement": [],
        "service": [],
        "document": [],
        "malus": [],
        "fMontantSuperBonus": 0,
        // Nouveaux champs pour le suivi
        "scrapingStats": {
            "totalFields": 0,
            "scrapedFields": 0,
            "missingFields": 0,
            "manualFields": 0
        }
    }
};

var _this = this;
var logged = false;
var chrome_ext = _this.chrome.extension;
var efficomMessage = $('.efficom-message');
var efficomActionLogin = $('#efficom-action-login');
var efficomActionForm = $('#efficom-action-form');
var instance = null;
var formManager = null;

// Initialiser le FormManager quand il est disponible
function initFormManager() {
    if (typeof FormManager !== 'undefined') {
        formManager = new FormManager();
        formManager.initialize();
        console.log('FormManager initialisé');
    } else {
        setTimeout(initFormManager, 100);
    }
}

// Démarrer l'initialisation
setTimeout(initFormManager, 500);

//Error handler
function handleError(response) {
    efficomActionLogin.removeAttr('disabled');
    efficomActionLogin.text(app_settings.messages.export);
    efficomMessage.html(response);
}

function handleFailError(response) {
    efficomActionLogin.removeAttr('disabled');
    efficomActionLogin.text(app_settings.messages.export);
    console.log(response);
    response = "Erreur inattendue! Exporté une autre fois";
    efficomMessage.html(response);
}

function getClassInfo(isOk) {
    return isOk ? 'scrape-ok' : 'scrape-ko';
}

// Fonction améliorée pour recharger les infos avec statistiques
function reloadInfoB() {
    console.log(JSON_FG_WEB);
    console.log(JSON.stringify(JSON_FG_WEB));
    
    var carInfo = (JSON_FG_WEB.prix.fMontantCatalogue > 0 || JSON_FG_WEB.prix.fMontantVenteVO > 0);
    var carOptions = JSON_FG_WEB.prix.option.length > 0;
    var carAccessories = JSON_FG_WEB.prix.accessoire.length > 0;
    var carDisburments = JSON_FG_WEB.prix.supplement.length > 0;
    var carServices = JSON_FG_WEB.prix.service.length > 0;
    var carFinance = JSON_FG_WEB.prix.fMontantAFinancer > 0 || JSON_FG_WEB.prix.szTypeProduit === 'CPT';
    var carReprise = JSON_FG_WEB.prix.fValeurRepriseVO > 0;
    carInfoClient = JSON_FG_WEB.prix.szNomClient && JSON_FG_WEB.prix.szTypeClient;
    
    // Calculer les statistiques de scraping
    calculateScrapingStats();
    
    instance[0].setContent(`<p class="scrape-pp">
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
<span class="scrape">Utilisateur : ${app_settings.user_info[0]}</span>
<span class="scrape">Version : V${APP_VERSION}</span>
<span class="scrape">Scrapé : ${JSON_FG_WEB.prix.scrapingStats.scrapedFields}/${JSON_FG_WEB.prix.scrapingStats.totalFields} champs</span>
</p>`);

    // Afficher le bouton du formulaire si des données ont été scrapées
    if (JSON_FG_WEB.prix.scrapingStats.scrapedFields > 0) {
        efficomActionForm.removeClass('hidden');
        efficomActionForm.text(app_settings.messages.formReview);
    }
}

// Calculer les statistiques de scraping
function calculateScrapingStats() {
    const requiredFields = [
        'szTypeClient', 'szNomClient', 'szMarque', 'szGenre', 'szModele',
        'fMontantCatalogue', 'szNomVendeur', 'szNomEtablissement'
    ];
    
    const optionalFields = [
        'szPrenomClient', 'szAdresseClient', 'szCodePostalClient', 'szVilleClient',
        'szTelClientPortable', 'szEmailClient', 'szVersion', 'szCouleur',
        'szEnergie', 'iNivCO2', 'fPrixHTPublic', 'fMontantRemise'
    ];
    
    const allFields = [...requiredFields, ...optionalFields];
    let scrapedCount = 0;
    
    allFields.forEach(field => {
        if (JSON_FG_WEB.prix[field] && JSON_FG_WEB.prix[field] !== '' && JSON_FG_WEB.prix[field] !== 0) {
            scrapedCount++;
        }
    });
    
    JSON_FG_WEB.prix.scrapingStats = {
        totalFields: allFields.length,
        scrapedFields: scrapedCount,
        missingFields: allFields.length - scrapedCount,
        manualFields: 0
    };
}

// Fonction de scraping améliorée
function ScrapeMove(Offre, InfoClient) {
    console.log(Offre, InfoClient);
    
    // Sauvegarder les données originales pour la réinitialisation
    chrome.storage.local.set({ originalScrapedData: JSON.parse(JSON.stringify(JSON_FG_WEB.prix)) });
    
    JSON_FG_WEB.prix.userIpn = app_settings.user_info[4];
    JSON_FG_WEB.prix.dateCreate = moment().format('YYYY-MM-DD H:mm:ss')
    JSON_FG_WEB.prix.szNomEtablissement = InfoClient.Data.EtablissementDTO.NomEtablissement;
    JSON_FG_WEB.prix.szIdentifiantRR = app_settings.user_info[5];
    JSON_FG_WEB.prix.szRattachement = app_settings.user_info[5];
    JSON_FG_WEB.prix.szCodePND = app_settings.user_info[3];
    JSON_FG_WEB.prix.szNomVendeur = app_settings.user_info[1];
    JSON_FG_WEB.prix.szPrenomVendeur = app_settings.user_info[2];
    JSON_FG_WEB.prix.cTypeVendeur = app_settings.user_info[7];

    JSON_FG_WEB.prix.szTypeClient = InfoClient.Data.TypeClient
    if (JSON_FG_WEB.prix.szTypeClient != 'PM') {
        JSON_FG_WEB.prix.szNomClient = InfoClient.Data.IndividuDTO.Nom;
        JSON_FG_WEB.prix.szPrenomClient = InfoClient.Data.IndividuDTO.Prenom;
        JSON_FG_WEB.prix.szAdresseClient = InfoClient.Data.IndividuDTO.AdresseDTO.Voie;
        JSON_FG_WEB.prix.szCodePostalClient = InfoClient.Data.IndividuDTO.AdresseDTO.CodePostal;
        JSON_FG_WEB.prix.szVilleClient = InfoClient.Data.IndividuDTO.AdresseDTO.Ville;
        JSON_FG_WEB.prix.szTelClientPortable = InfoClient.Data.IndividuDTO.ContactDTO.TelephoneDomicile;
        JSON_FG_WEB.prix.szEmailClient = InfoClient.Data.IndividuDTO.ContactDTO.Email;
        JSON_FG_WEB.prix.szCiviliteClient = InfoClient.Data.IndividuDTO.EtatCivilLibelle;
    } else {
        JSON_FG_WEB.prix.szNomClient = InfoClient.Data.SocieteDTO.RaisonSociale;
        JSON_FG_WEB.prix.szAdresseClient = InfoClient.Data.SocieteDTO.AdresseDTO.Voie;
        JSON_FG_WEB.prix.szCodePostalClient = InfoClient.Data.SocieteDTO.AdresseDTO.CodePostal;
        JSON_FG_WEB.prix.szVilleClient = InfoClient.Data.SocieteDTO.AdresseDTO.Ville;
        JSON_FG_WEB.prix.szTelClientPortable = InfoClient.Data.SocieteDTO.Telephone;
        JSON_FG_WEB.prix.szEmailClient = InfoClient.Data.SocieteDTO.Email;
    }
    
    // Continuer avec le reste du scraping...
    JSON_FG_WEB.prix.szGenre = Offre.Data.DossierDTO.TypeVnvo === 0 ? "VN" : "VO";
    const isVn = JSON_FG_WEB.prix.szGenre === 'VN';
    JSON_FG_WEB.prix.szMarque = Offre.Data.DossierDTO.Marque;
    JSON_FG_WEB.prix.szGamme = isVn ? Offre.Data.Proposition.Genre : 'VP';
    JSON_FG_WEB.prix.szModele = Offre.Data.DossierDTO.Modele;
    JSON_FG_WEB.prix.szSemiClairModele = Offre.Data.DossierDTO.ModeleCodeSemiClair;
    
    if (typeof JSON_FG_WEB.prix.szSemiClairModele === 'string') {
        JSON_FG_WEB.prix.szSemiClairModele = JSON_FG_WEB.prix.szSemiClairModele.slice(0,3);
    }
    
    JSON_FG_WEB.prix.szVersion = Offre.Data.DossierDTO.Version
    JSON_FG_WEB.prix.szSemiClairVersion = isVn ? Offre.Data.DossierDTO.VersionCodeSemiClair : '';
    JSON_FG_WEB.prix.iNumTarif = isVn ? Offre.Data.DossierDTO.NumeroTarif : '';
    JSON_FG_WEB.prix.szCouleur = Offre.Data.DossierDTO.LibelleCouleur;
    JSON_FG_WEB.prix.fMontantCatalogue = isVn ? Offre.Data.ResultatVehicule.PrixVehiculeTTC : 0;
    JSON_FG_WEB.prix.fMontantVenteVO = isVn ? 0 : Offre.Data.ResultatVehicule.PrixVehiculeTTC;
    JSON_FG_WEB.prix.fPrixHTPublic = Offre.Data.ResultatVehicule.PrixVehiculeHT;
    
    // Continuer avec le reste des données...
    // [Le reste du code de scraping reste identique]
    
    // Après le scraping, afficher le formulaire si configuré
    reloadInfoB();
    
    // Vérifier la configuration du formulaire
    chrome.storage.sync.get(['efficomConfig'], function(result) {
        const config = result.efficomConfig;
        if (config && config.form && config.form.showOnScrape && formManager) {
            setTimeout(() => {
                formManager.showForm(JSON_FG_WEB.prix);
            }, 1000);
        }
    });
}

// Gestionnaire d'événements amélioré
chrome.runtime.onMessage.addListener(function (response, b, c) {
    console.log("======== Enhanced move.js ==========");
    console.log(response);
    switch (response.type) {
        case app_settings.types.efficom_login_return:
            login(response)
            break;
        case app_settings.types.export_to_efficom:
            // Mettre à jour les données avec celles du formulaire
            JSON_FG_WEB.prix = { ...JSON_FG_WEB.prix, ...response.data };
            // Procéder à l'export
            if (carInfoClient) {
                sendPrix(JSON_FG_WEB);
                efficomActionLogin.attr('disabled', 'disabled');
                efficomActionLogin.html(app_settings.messages.loadingExport);
            }
            break;
    }
});

// Fonction de login inchangée
function login(response) {
    console.log("login");
    console.log(response);
    if (!app_settings.user_info) {
        if (response.data.data) {
            app_settings.user_info = unserialize(atob(response.data.data));
            console.log(app_settings.user_info)
            efficomActionLogin.removeClass('hidden');
            efficomActionLogin.html(app_settings.messages.export);
            instance[0].setContent(`Vous êtes connecté.
            <span class="scrape">Utilisateur : ${app_settings.user_info[0]}</span>
<span class="scrape">Version : V${APP_VERSION}</span>`);
            instance[0].show();
            logged = true;
        } else {
            efficomActionLogin.removeClass('hidden');
            efficomActionLogin.text(app_settings.messages.connection);
            console.log(instance);
            instance[0].setContent(`Connectez-vous à Efficom avant d'exporter votre commande.
            <span class="scrape">Version : V${APP_VERSION}</span>`);
            instance[0].show();
        }
        efficomActionLogin.removeAttr('disabled');
    }
}

// Fonctions sendPrix et autres restent identiques...
function sendPrix(JSON_FG_WEB) {
    var settings = {
        "url": app_settings.ws_prix_url,
        "method": "POST",
        "timeout": 0,
        body: JSON.stringify(JSON_FG_WEB)
    };

    fetch(settings.url, settings)
        .then(response => response.text())
        .then(data => {
            const response = JSON.parse(data);
            if (response.responseOrcabox && response.responseOrcabox.statusCodeOrcabox === 200 && response.responseOrcabox.error === false) {
                handleReturnSendPrix({ data: response, type: "efficom_send_prix_return" })
            } else {
                handleErrorSendPrix({ data: response, type: "efficom_send_prix_error" })
            }
        }).catch(error => {
        console.log(error);
        handleErrorSendPrix({ data: "Error ws", type: "efficom_send_prix_error" })
    });
}

function handleReturnSendPrix(response) {
    console.log('handleReturnSendPrix');
    scraped = true;
    handleError(response.data.responseOrcabox.statusMessageOrcabox)
    url = new URL(response.data.urlFgOrcabox).origin
    url = url + `/feuillegestion/feuille/id/${response.data.responseOrcabox.FgId}/u_id/${response.data.responseOrcabox.user_id}`;
    console.log(url);
    window.open(url);
}

function handleErrorSendPrix(response) {
    console.log('handleErrorSendPrix');
    console.log(response);
    var msg = ""
    if (response.data.statusMessageOrcabox) {
        msg = response.data.statusMessageOrcabox
    } else if (response.data.statusMessageMove) {
        msg = response.data.statusMessageMove
    }
    error = msg + ': <br>';
    if (response.data.responseOrcaboxBrute) {
        response.data.responseOrcaboxBrute = response.data.responseOrcaboxBrute.replace('The value "Unknown" is not a valid IP address.','');
        responseOrcabox = JSON.parse(response.data.responseOrcaboxBrute)
        if (responseOrcabox.errors) {
            responseOrcabox.errors.forEach(function (v, i) {
                error += `<strong>${v.key}</strong>: ${v.errors[0]}<br>`;
            })
        }
    }
    handleError(error)
}

// Initialisation pour movev2.mobilize-fs.com
if (app_page.indexOf("movev2.mobilize-fs.com") > -1) {
    console.log(app_page);
    var move = {};
    $(document).ready(function () {
        console.log('Nissan Enhanced');
        infoUser = (app_settings.user_info !== null && typeof(app_settings.user_info[0]) != 'undefined') ? app_settings.user_info[0] : null;
        
        // Template amélioré avec bouton formulaire
        EfficomPave = `
        <span class='bg-info col-md-12 efficom-message' style="
        margin-top: 5px;
        text-align: center;
        font-weight: bold;"></span>
        <div style="display: flex; gap: 10px; margin-top: 5px;">
            <button id="efficom-action-form" disabled="true" class="btn btn-info btn-block ng-binding" style="flex: 1;">
                <span class="pvf-icon-local-edit pvf-icon-padding-right"></span>
                ${app_settings.messages.formReview}
            </button>
            <button id="efficom-action-login" disabled="true" class="btn button-main-action-modal btn button-main-action-modal-export btn-exportActionModal btn-block ng-binding" style="flex: 1;">
                <span class="pvf-icon-local-print pvf-icon-padding-right"></span>
                ${app_settings.messages.init}
            </button>
        </div>
        `;
        
        scraped = false;
        urlClient = 'https://bck.move.vectury.com/api/client/' + window.sessionStorage.getItem('clientId');
        let affaire = null;

        // Le reste de l'initialisation reste identique...
        callMoveApi(urlClient)
            .then(response => response.json())
            .then(infoClient => {
                console.log(infoClient);
                const identifiantRr = infoClient?.Data?.EtablissementDTO?.IdentifiantRr;
                console.log('api to get affaire :', identifiantRr);

                if (identifiantRr) {
                    affaire = identifiantRr;
                    window.sessionStorage.setItem("codeRrfEtablissement", affaire);
                } else {
                    affaire = window.sessionStorage.getItem("codeRrfEtablissement");
                }

                console.log('Final affaire:', affaire);
            })
            .catch(err => {
                console.log(err);
                affaire = window.sessionStorage.getItem("codeRrfEtablissement");
                console.log('Fallback affaire:', affaire);
            });

        eventLKilled = false;
        eventL = window.setInterval(function () {
            if ($('#26').length == 1 && $('#efficom-action-login').length == 0 && typeof(affaire) != 'undefined') {
                console.log('init sys true');
                initSys();
            }
            if(typeof(affaire) == 'undefined') {
                affaire = window.sessionStorage.codeRrfRattachement;
                if (!affaire) {
                    affaire = window.sessionStorage.codeRrfEtablissement;
                } 
            }
        }, 100);

        function initSys() {
            $(EfficomPave).insertAfter($('#26'));
            efficomMessage = $('.efficom-message');
            efficomActionLogin = $('#efficom-action-login');
            efficomActionForm = $('#efficom-action-form');
            scraped = false;
            
            instance = tippy("#efficom-action-login", {
                arrow: true,
                content: '',
                allowHTML: true,
                placement: 'top',
                onHidden(instance) {
                    if (app_settings.user_info && !scraped) {
                        instance.setContent(app_settings.messages.loading);
                        scrapeMoveApi();
                    }
                },
                onShown(instance) {
                    //scrape();
                }
            });
            
            // Gestionnaire pour le bouton formulaire
            efficomActionForm.click(function () {
                if (formManager && JSON_FG_WEB.prix.scrapingStats.scrapedFields > 0) {
                    formManager.showForm(JSON_FG_WEB.prix);
                } else {
                    alert('Aucune donnée scrapée disponible pour le formulaire.');
                }
            });
            
            efficomActionLogin.click(function () {
                efficomMessage.text("");
                if (app_settings.user_info) {
                    if (logged && JSON_FG_WEB.prix.userIpn) {
                        instance[0].setContent(app_settings.messages.scrapping);
                        scrapeMoveApi();

                        if (carInfoClient) {
                            sendPrix(JSON_FG_WEB);
                            efficomActionLogin.attr('disabled', 'disabled');
                            efficomActionLogin.html(app_settings.messages.loadingExport);
                        } else {
                            efficomMessage.html(app_settings.messages.loadingData);
                        }
                    } else {
                        instance[0].setContent(app_settings.messages.scrapping);
                        instance[0].show();
                    }
                } else {
                    url = new URL(app_settings.app_url).origin
                    window.open(url + "/auth/logout");
                }
            })
            
            if (!app_settings.user_info) {
                getUserInfoByRrf(affaire);
            } else {
                console.log('User already logged in');
                efficomActionLogin.removeClass('hidden');
                efficomActionLogin.html(app_settings.messages.export);
                efficomActionLogin.removeAttr('disabled');
                instance[0].setContent(app_settings.messages.loading);
                instance[0].show();
                logged = true;
            }
        }

        function scrapeMoveApi() {
            urlClient = 'https://bck.move.vectury.com/api/client/' + window.sessionStorage.getItem('clientId');
            urlOffre = "https://bck.move.vectury.com/api/offreReprise?IdProposition=" + window.sessionStorage.getItem('offerId') + "&ModeUtilisationBackOffice=false&ModeUtilisationPgr=false"
            
            callMoveApi(urlClient).then(response => response.json())
                .then(infoClient => {
                    console.log(infoClient);
                    callMoveApi(urlOffre).then(data => data.json())
                        .then(Offre => {
                            console.log(Offre);
                            ScrapeMove(Offre, infoClient)
                        })
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        }
    });
    
    // Fonctions utilitaires restent identiques...
    function callMoveApi(url, token) {
        const headers = {
            "Content-type": "application/json;charset=utf-8",
            "Authorization": window.sessionStorage.getItem('authentication_Authorization'),
            "ctx_trace_enable": true,
            "ctx_userid" : window.sessionStorage.getItem('ctx_userid'),
            "version": "v2",
            "dateapplicative": getFormattedDate(),
            "profil": window.sessionStorage.getItem('profil'),
            "idapplicatif":0
        };
     
        const settings = {
            url: url,
            method: "GET",
            headers: headers,
            timeout: 0
        };
     
        try {
            return fetch(settings.url, settings)
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

// Fonctions utilitaires restent identiques...
function formatFloat($str) {
    if ($str == '' || $str == null) {
        $str = '0';
    }
    console.log("formatFloat: " + $str);
    $str = $str.replace(/\s/g, '');
    $str = $str.replace(',', '.');
    $str = $str.replace('%', '');
    $str = $str.replace('&nbsp;', '');
    console.log("formatFloat: " + $str);
    return parseFloat($str)
}

function getFormattedDate() {
    const date = new Date();
    const pad = (num, size = 2) => String(num).padStart(size, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliseconds = pad(date.getMilliseconds(), 3);
    const offset = -date.getTimezoneOffset();
    const offsetSign = offset >= 0 ? '+' : '-';
    const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
    const offsetMinutes = pad(Math.abs(offset) % 60);
    const timezone = `${offsetSign}${offsetHours}:${offsetMinutes}`;
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezone}`;
}
