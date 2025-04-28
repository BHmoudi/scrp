!self.browser && self.chrome && (browser = chrome)
var app_page = window.location.href;
console.log("===============Efficom customer360psa.com ===============");
var manifestData = chrome.runtime.getManifest();
console.log(manifestData.version);
const APP_VERSION = manifestData.version;
console.log("#APP_VERSION: " + APP_VERSION);
var MODE_DEV = false;
var i=1;
var $brands = {
    "AC": "Citroen",
    "AP": "Peugeot",
    "DS": "DS",
    "All": "Tout",
    "OP": "Opel",
    "VX": "Vauxhall",
    "SP": "Spoticar",
    "CH": "Chevrolet",
    "Unknown": "Unknown",
    "FT": "Fiat",
    "FO": "Fiat Professional",
    "AH": "Abarth",
    "AR": "Alfa Romeo",
    "LA": "Lancia",
    "CY": "Chrysler",
    "DG": "Dodge",
    "JE": "Jeep",
    "FCA": "FCA",
    "UC": "Voitures d'occasion"
};
var app_settings = {
    //app_url: "http://localhost:10210/ManPerf_dev.php/",
    app_url: "https://pilote-toyota.orcaformation.com/",
    fg_url: "http://localhost:10211/app_dev.php/prix",
    bo_app_url: "https://wkfefficom.dcs2.renault.com/",
    ws_prix_url: "https://wkfefficom.dcs2.renault.com/api/prix",
    //ws_prix_url: "http://localhost:10301/app_dev.php/api/prix",
    user_info: null,
    messages: {
        not_connect: "Vous n'êtes pas connecter a efficom",
        connected: "Vous êtes connectés",
        connection: "Connexion",
        loading: `Chargement...`,
        loadingExport: `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Exportation en cours...`,
        export: "Exporter la Feuille de gestion",
        scrapping: `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Scrapping en cours...`,
        LoadingReprise: `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Scrapping de la reprise...`,
        Loading_upload_bdc: `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Uploading BDC...`,
        upload_bdc: `Upload BDC`,
        loadingData: 'La récupération de données est toujours en cours, veuillez patienter, quelques secondes et réessayer.',
        init: 'Initialisation...',
    },
    types: {
        efficom_login_return: 'efficom_login_return',
        efficom_initDVFG_return: 'efficom_initDVFG_return',
        efficom_uploadBDC_return: 'efficom_uploadBDC_return',
        efficom_uploadBDC_check_return: 'efficom_uploadBDC_check_return',
        efficom_initDVFG: 'efficom_initDVFG',
        efficom_uploadBDC: 'efficom_uploadBDC',
        efficom_uploadBDC_check: 'efficom_uploadBDC_check',
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
        get_reprise_info_return_local: "get_reprise_info_return_local"
    }
}
if (MODE_DEV) {
    app_settings.bo_app_url = "http://localhost:10301/app_dev.php/";
    app_settings.ws_prix_url = "http://localhost:10301/app_dev.php/api/prix";
    app_settings.app_url = "http://localhost:10210/ManPerf_dev.php/";
}
var carInfoClient = false;
window.isPDFCommandeScrapped = false;
var Logoimage = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALkAAAA/CAIAAAAzJv7OAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAEmElEQVR42u2aPa7TQBDHcxIOkuNQ+BBcgSY1B3g1NGmokWiQaKCJ0CtAQgIhIRASQi+GAfutJ7Mz492xnZDkP0oR7/fHz/Ox69VvCKRMVlgCCFiBgBUIWIGAFQhYgYAVCOSSWNk2q0HWm52W3GzNGnn2brPWMlKtoY+s/EodSn2/RlN2iaxDXjQbyTCQfgRD6XzUF8tKWn49tWA/RJlhO2tZsdusLnNfrJwVUfIQSrByMHt9rTSNMVQ33t6MPpuVPsdJKOtX046HvY5sbgaVpVivlJX1ei1fwD7pfkmyJdJXzljoclZki9X9aqxY9krb3JTbNOqgwUrTJFi6tPVm07AlsRZEpiua/m/9sF6Z0K/pcribO6Cy1UcNVjbbbsbNtk9Kf6KsDA3wv7X+ylRWhLMxurkcFR1xsLLZ9X9708PeqjArmYkrZ0Xxp0v7/ffM/LCcFmdzJRyKGQMryfbkz0F/RVYL2INQv7mekbTYfWaBuRskXjErbHkP3s1gHKQH4NWshOMg1q9o2uzTQyX1DlYO/cgDYx08X1EOV0Ks1Pab0kzVYvW5HYl7umSHlRJn6UJYMZ6C57bqsW2Ilbp+WTtSU/p9WiG2GPzVsgLBfRAErEDACgSsQCBgBQJWIGAFAlYgYAUCViBgxc9+8PQu9pvYyNLVJ67a55/ti0/tk93+0et9avPhyztKoXTKLW/q26/21Zf25nb/+O2ej5AeKZGyqEB4j6gRUZhGWLhuYGUqKx9+tP5ydz8qM7rHVODZ+33JdKiY01r5UtQWBitxVugtLx8DqRlHwbz73lKBqtbefG0De0Rwc3UIVo7BChmX2mHQBqv6gECJraqKi1+F+E4lqTpYWZwVejtj60DGKDc9VRpF/HJdNWq/UsnnH4/OSu1CT2zktNUdl5DbBYJJOKeqFXC8S9rUxAH9sVyZHD5/+7l7O+ppgZWpU7DMfP6KqwqDwhmuVMqNi2UyRL8qT+pknTJgZZ4pqKqb63bL+aWImopxDlTvOFcVviYgz8mfoBhwp9gE8eqkTuCvXBgr6oYJy5LURuJD9WrVpqwAx/KCBVt5AVGrc2+FllJb/k9ZKTeZS1SvYkW1LLGom5/dpZ9zdqLaLBqPP0GR2KlAoUisimBl0k7PeEITaCoQ6AkoO/eWqzTKBStgpc8VYZSqacDKDGstip0jK8I7ET5158GcTRx0RqyoTobjkZBnoHq+AX9FDdc7C+KzIiqKs58u6kbMPD8r5XEQDy7IAxUB89HiIMcl564xWJmfFfUmiJRH3tfN7d5XA2pTzvmKeno7er7iDIZ3B1bmZ0U1BCJwdY53+andcc5t/cvOhBpYOd59EDkBZCPSvlo6X2xt4X2QtdMl90H+fWeynmdzz3xerNDmxS6HT3LPXDh3sLLU6cjoxx/l368Emqr6fiVl5Vff/NoZrCx4kla1x/53cY7Nmv5dnHPryV1ysLIgK50ToJ6RLPq9rd+aM7s85ObAgZVlWUnE0AtKWyh0A6VQ+izf8ROR1FrsO34n7OKtzcwKBAJWIGAFAlYgYAUCViBgBQJWIBCwAgErkCPLH2EtOW3okEXMAAAAAElFTkSuQmCC";
EfficomPave = `
<div style="padding:0;margin-bottom:16px !important;height:90px !important" class="slds-page-header slds-page-header_record-home forceHighlightsStencilDesktop forceRecordLayout contexty-efficom">
<div class="bootstrap-sf1 col-xs-3 nopadding white text-center info-app">
    <div class="col-xs-6"><img class="efficom-logo" src="${Logoimage}" alt="">
    <button class="slds-button slds-button_brand " id="efficom-action-login" type="button" style="float:right;margin-top:15px;margin-right:15px;">
    ${app_settings.messages.connection}
    </button>
    <button class="slds-button slds-button_brand hidden" id="efficom-action-upload" type="button" style="display:none;float:right;margin-top:15px;margin-right:15px;">
    ${app_settings.messages.upload_bdc}
    </button>
    </div>
    <span style="text-align: right;" class="white efficom-message"></span>
</div>
</div>
`;
var prix = {};
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
        "accessoire": [],
        "actionCo": [],
        "option": [],
        "supplement": [],
        "service": [],
        "document": [],
        "malus": [],
        "fMontantSuperBonus": 0,
    }
};
var _this = this;
logged = false;
var chrome_ext = _this.chrome.extension;
//Error handler
var instance = null;

function handleError(response, enable = true) {
    console.log("DM%D====>")
    if (enable) {
        $('#efficom-action-login').removeAttr('disabled');
        $('#efficom-action-login').text(app_settings.messages.export);
    }
    $('.efficom-message').html(response);
    reloadInfoB();
}

function handleFailError(response) {
    $('#efficom-action-login').removeAttr('disabled');
    $('#efficom-action-login').text(app_settings.messages.export);
    console.log(response);
    response = "Erreur inattendue! Exporté une autre fois";
    $('.efficom-message').html(response);
}
function getClassInfo(isOk) {
    return isOk ? 'scrape-ok' : 'scrape-ko';
}
function reloadInfoB() {
    console.log(JSON_FG_WEB);
    console.log(JSON.stringify(JSON_FG_WEB));
   

    var ll = setInterval(function () {
        var carInfo = (JSON_FG_WEB.prix.fMontantCatalogue > 0 || JSON_FG_WEB.prix.fMontantVenteVO > 0);
        var carOptions = JSON_FG_WEB.prix.option.length > 0;
        var carAccessories = JSON_FG_WEB.prix.accessoire.length > 0;
        var carDisburments = JSON_FG_WEB.prix.supplement.length > 0;
        var carServices = JSON_FG_WEB.prix.service.length > 0;
        var carFinance = JSON_FG_WEB.prix.fMontantAFinancer > 0 || JSON_FG_WEB.prix.szTypeProduit === 'CPT';
        var carReprise = JSON_FG_WEB.prix.fValeurRepriseVO > 0;
        var isPdfScrapped = window.PDFCommande != undefined && window.PDFCommande != "" && window.PDFCommande != null;
        console.log("reloadInfoB====>")
        carInfoClient = JSON_FG_WEB.prix.szNomClient && JSON_FG_WEB.prix.szTypeClient;
        //<span class="scrape hidden ${getClassInfo(carFinance)} carFinance">Financement</span>
        console.log(window)
        if (carInfo && carInfoClient && isPdfScrapped) {
            clearInterval(ll);
            instance[0].setContent(`<p class="scrape-pp">
            N° Commande ${JSON_FG_WEB.prix.numCmde} </br>
            Exporter la commande dans Efficom </br>
        <span class="scrape ${getClassInfo(carInfoClient)} carInfoClient">Client</span>
        <span class="scrape ${getClassInfo(carInfo)} carInfo">Véhicule</span>
        <span class="scrape ${getClassInfo(carOptions)} carOptions">Options</span>
        <span class="scrape ${getClassInfo(carAccessories)} carAccessories">Accéssoires</span>
        <span class="scrape ${getClassInfo(carDisburments)} carDisburments">Suppléments</span>
        <span class="scrape ${getClassInfo(carServices)} carServices">Services</span>
        <span class="scrape ${getClassInfo(carReprise)} carReprise">Reprise</span>
        <span class="scrape ${getClassInfo(isPdfScrapped)} pdf">PDF</span>
        <span class="scrape">Utilisateur : ${app_settings.user_info[0]}</span>
        <span class="scrape">Version : V${APP_VERSION}</span>
        </p>`);
            $('#efficom-action-login').html(app_settings.messages.export+' '+(isPdfScrapped ? "" : "sans PDF"));
            $('#efficom-action-login').removeAttr('disabled');
            instance[0].show();
        }else{
            console.log("NOT YET")
        }

    }, 100);
}


function scrapeClientPM(InfoClient, ClientContact) {
    //sfdc:RecordField.SBQQ__Quote__c.SBQQ__PrimaryContact__c
    PMName = InfoClient.CorporateName__c.value ? InfoClient.CorporateName__c.value : InfoClient.Name.value
    JSON_FG_WEB.prix.fgSocieteNom = PMName;
    JSON_FG_WEB.prix.szNomClient = PMName; //ClientContact.FirstName.value; // contact principale
    JSON_FG_WEB.prix.szPrenomClient = ""; //ClientContact.LastName.value;
    JSON_FG_WEB.prix.fgSiretClient = InfoClient.FiscalId__c.value;
    JSON_FG_WEB.prix.szRefClient = InfoClient.FCA_Main_Dealer_Code__c.value
    JSON_FG_WEB.prix.szAdresseClient = InfoClient.ShippingStreet.value;
    JSON_FG_WEB.prix.szCodePostalClient = InfoClient.ShippingPostalCode.value;
    JSON_FG_WEB.prix.szVilleClient = InfoClient.ShippingCity.value;
if(ClientContact){
    JSON_FG_WEB.prix.szTelClientPortable = ClientContact.MobileProfessionalTelephone__c.value;
    JSON_FG_WEB.prix.szEmailClient = ClientContact.ProfessionalEmail__c.value;
}
    reloadInfoB();
}

function ScrapeMove(Offre, InfoClient) {
    console.log(Offre, InfoClient);
    JSON_FG_WEB.prix.userIpn = app_settings.user_info[4];
    JSON_FG_WEB.prix.dateCreate = moment().format('YYYY-MM-DD H:mm:ss')
    JSON_FG_WEB.prix.szNomEtablissement = Offre.SBQQ__Partner__r.displayValue;
    //JSON_FG_WEB.prix.szNomEtablissement = InfoClient.Data.EtablissementDTO.CodeRrf // rrf
    JSON_FG_WEB.prix.szIdentifiantRR = app_settings.user_info[5];
    JSON_FG_WEB.prix.szRattachement = app_settings.user_info[5];
    JSON_FG_WEB.prix.szCodePND = app_settings.user_info[3];
    JSON_FG_WEB.prix.szNomVendeur = app_settings.user_info[1];
    JSON_FG_WEB.prix.szPrenomVendeur = app_settings.user_info[2];
    JSON_FG_WEB.prix.cTypeVendeur = app_settings.user_info[7];

    JSON_FG_WEB.prix.szTypeClient = InfoClient.IsPersonAccount.value ? (InfoClient.Professional__pc.value ? 'PP' : 'PA') : 'PM';
    if (JSON_FG_WEB.prix.szTypeClient != 'PM') {
        JSON_FG_WEB.prix.szNomClient = InfoClient.FirstName.value +" "+InfoClient.LastName.value;
        JSON_FG_WEB.prix.szPrenomClient = "";
        JSON_FG_WEB.prix.szAdresseClient = InfoClient.PersonMailingStreet.value + '' + InfoClient.PersonMailingState.value;
        JSON_FG_WEB.prix.szCodePostalClient = InfoClient.PersonMailingPostalCode.value;
        JSON_FG_WEB.prix.szVilleClient = InfoClient.PersonMailingCity.value;
        JSON_FG_WEB.prix.szTelClientPortable = InfoClient.MobilePersonalTelephone__pc.value;
        JSON_FG_WEB.prix.szEmailClient = InfoClient.PersonalEmail__pc.value;
        JSON_FG_WEB.prix.szCiviliteClient = InfoClient.Salutation ? InfoClient.Salutation.displayValue : "";
    } else {

        if ($getClientContact = getContactPM()) {
            console.log(window.idClientContact);
            $getClientContact.then(response => response.json())
                .then(data => {
                    var ll = setInterval(function () {
                        console.log(data);
                        console.log(data.context.globalValueProviders[i].values.records[window.idClientContact]);
                        console.log(data.context.globalValueProviders[i].values.records);
                        console.log('-----------------------Info CONTACT END-------------------');
                        if (data.context.globalValueProviders[i].values.records[window.idClientContact] != undefined) {
                            clearInterval(ll);
                            window.ClientContact = data.context.globalValueProviders[i].values.records[window.idClientContact].Contact.record.fields;
                            scrapeClientPM(InfoClient, ClientContact);
                        }

                    }, 100);
                })
                .catch(err => console.log(err));
        } else if (window.ClientContact != undefined) {
            console.log("window.ClientContact != undefined: " + window.ClientContact != undefined);
        } else{
            console.log("ClientContact not found");
            scrapeClientPM(InfoClient, ClientContact);

        }

    }

    //IsVN
    JSON_FG_WEB.prix.szGenre = Offre.OfferType__c.value;
    const isVn = JSON_FG_WEB.prix.szGenre === 'VN';
    JSON_FG_WEB.prix.szMarque = $brands[Offre.MVS__c.value];
    JSON_FG_WEB.prix.szGamme = isVn ? Offre.AssetDestinationUsage__c.value : 'VP';
    JSON_FG_WEB.prix.szModele = Offre.FamilyDescription__c.value;
    window.CARNumber__c = Offre.CARNumber__c.value;


    JSON_FG_WEB.prix.szSemiClairModele = Offre.Family__c.value;
    JSON_FG_WEB.prix.szVersion = Offre.VersionDescription__c.value
    JSON_FG_WEB.prix.szSemiClairVersion = Offre.VersionCode__c.value ? Offre.Family__c.value : "UNKN"; // NOT FOUND
    JSON_FG_WEB.prix.iNumTarif = isVn ? '' : ''; // NOT FOUND 
    JSON_FG_WEB.prix.szCouleur = Offre.ColorDescription__c.value;
    JSON_FG_WEB.prix.fMontantCatalogue = Offre.BasePrice__c.value;
    JSON_FG_WEB.prix.fMontantVenteVO = isVn ? 0 : 0; // NEED EXEMPLE
    JSON_FG_WEB.prix.fPrixHTPublic = (Offre.BasePrice__c.value / 1.2).toFixed(2);
    JSON_FG_WEB.prix.fPrixHTPlaques = 0; //ToDo ASK
    JSON_FG_WEB.prix.fPrixHTPreparation = 0; //ToDo ASK
    JSON_FG_WEB.prix.fPrixHTConcessionnaire = 0; //ToDo ASK

    // toDo Commande VO
    if (!isVn) { // NOT FOUND 
        /*         JSON_FG_WEB.prix.iKmCompteur = Offre.Data.DossierDTO.Kilometrage; // $('#KMCarConfig').text().trim();
                JSON_FG_WEB.prix.bKmReel = Offre.Data.DossierDTO.Reel; // $('#TypeKMCarConfig').text().trim();
                JSON_FG_WEB.prix.szOrigineVO = Offre.Data.DossierDTO.CodeOrigineVO; // $('#OriginCarConfig').text().trim();
                JSON_FG_WEB.prix.szNumImmat = Offre.Data.DossierDTO.NumImmat; // $('#PlateNumberCarConfig').text().trim();
                JSON_FG_WEB.prix.bPremiereMain = Offre.Data.DossierDTO.PremiereMain ? 'OUI' : 'NON'; // $('#FirstHandCarConfig').text().trim().toUpperCase() === 'OUI';
                JSON_FG_WEB.prix.szDatePremiereImmat = moment(Offre.Data.DossierDTO.DateImmat).format('YYYY-MM-DD'); //moment($('#FirstRegDateCarConfig').text().trim(), "DD/MM/YYYY").format('YYYY-MM-DD');
                JSON_FG_WEB.prix.szDateImmat = moment(Offre.Data.DossierDTO.DateCarteGrise).format('YYYY-MM-DD'); //"" // undefined;
                JSON_FG_WEB.prix.szTypeGarantie = Offre.Data.DossierDTO.TypeGarantie; //"" // undefined;
                JSON_FG_WEB.prix.szNumSerie = Offre.Data.DossierDTO.NumSerie; //$('#VINCarConfig').text().trim();
                JSON_FG_WEB.prix.szCarosserie = Offre.Data.DossierDTO.Carosserie; //"";  // undefined;
                JSON_FG_WEB.prix.iPuissance = Offre.Data.DossierDTO.PuissanceFiscale; //0;  // undefined;
                JSON_FG_WEB.prix.iPlacesAssises = Offre.Data.DossierDTO.PlaceAssise; //0;  // undefined; */
    }

    JSON_FG_WEB.prix.fMontantRemise = Offre.TotalDiscounts__c.value;
    JSON_FG_WEB.prix.szNumExport = Offre.OPV_OfferCode__c.value;
    JSON_FG_WEB.prix.numCmde = JSON_FG_WEB.prix.szMarque.charAt(0) + Offre.OPV_OfferCode__c.value;
    var fTauxTVA = 0.20;
    JSON_FG_WEB.prix.fTauxTVA = fTauxTVA.toFixed(2);
    JSON_FG_WEB.prix.szTypeTVA = "TC";
    JSON_FG_WEB.prix.szEnergie = Offre.EnergyDescription__c.value;
    JSON_FG_WEB.prix.iNivCO2 = ''; // NOT FOUND Offre.Data.EntreeFinan.Vehicule.TauxCO2;
    JSON_FG_WEB.prix.iNumContratFinanDiac = null;
    JSON_FG_WEB.prix.szTypeProduit = 'CPT';


    JSON_FG_WEB.prix.fMontantAFinancer = 0;
    JSON_FG_WEB.prix.fApport = 0;
    JSON_FG_WEB.prix.fPLM = 0; //Offre.Data.Proposition.Plm; // NOT FOUND
    JSON_FG_WEB.prix.fgAcompte = Offre.DownPayment__c.value;
    JSON_FG_WEB.prix.fgModeAcompte = '';
    JSON_FG_WEB.prix.iNbreAssurances = 0;
    JSON_FG_WEB.prix.szDateVente = Offre.TECH_CreatedDate__c.value;
    JSON_FG_WEB.prix.iNumContratCommande = Offre.Name.value + '' + Offre.OPV_OfferCode__c.value;

    // Reprise VO
    if (Offre.TradeInCarPrice__c.value > 0) {
        JSON_FG_WEB.prix.szRepVONom_CG = Offre.Reprise && Offre.Reprise.Account ? Offre.Reprise.Account.displayValue : '';
        JSON_FG_WEB.prix.szRepVO_Marque = Offre.Reprise.Brand__c.displayValue;
        JSON_FG_WEB.prix.szRepVO_Modele = Offre.Reprise.Model__c.value;
        JSON_FG_WEB.prix.szRepVO_Origine = Offre.Reprise.AssetType__c.displayValue;
        JSON_FG_WEB.prix.szRepVO_Km = Offre.Reprise.RealMileage__c.value;
        JSON_FG_WEB.prix.szRepVO_ImmaDate1 = Offre.Reprise.OnTheRoadFirstDate__c.value;
        JSON_FG_WEB.prix.szRepVO_ImmaDate = Offre.Reprise.FirstRegistrationDate__c.value;
        JSON_FG_WEB.prix.szRepVO_Chassis = Offre.Reprise.Name.value;
        JSON_FG_WEB.prix.szRepVO_Energie = Offre.Reprise.EnergyDescription__c.value
        JSON_FG_WEB.prix.szRepVoNumImmat = Offre.Reprise.LastKnownRegistrationNumber__c.value;
        //JSON_FG_WEB.prix.szRepVO_PrimeConv = Offre.Data.DossierDTO.RepriseVODTO.szRepVO_PrimeConv;
        JSON_FG_WEB.prix.fValeurRepriseVO = Offre.TradeInCarPrice__c.value;//-Offre.Data.RepriseVODTO.SoldeRachatFinancement;
        JSON_FG_WEB.prix.fSurestimationRepVO = 0; //NOT FOUND
        JSON_FG_WEB.prix.fMontantEngagementReprise = 0; // NOT FOUND Offre.Data.Proposition.Oa;
    }

    JSON_FG_WEB.prix.accessoire = [];
    JSON_FG_WEB.prix.supplement = [];
    JSON_FG_WEB.prix.actionCo = [];
    JSON_FG_WEB.prix.option = [];
    JSON_FG_WEB.prix.service = [];


    //TotalAccessories__c.value
    if (Offre.TotalAccessories__c.value > 0) {
        JSON_FG_WEB.prix.accessoire.push({
            "szLibelle": Offre.AccessoryDescription__c.value,
            "fMontant": Offre.TotalAccessories__c.value,
            "fTauxTva": 0.2,//tva,
            "szTypeTVA": "TC"
        });
    }
    if (Offre.TotalExpenses__c.value > 0) {
        JSON_FG_WEB.prix.supplement.push({
            "szLibelle": "Total des dépenses",
            "fMontant": Offre.TotalExpenses__c.value,
            "fTauxTva": 0.2,
            "szTypeTVA": "TC"
        }); //22
    }
    if (Offre.TotalOptions__c.value > 0) {
        JSON_FG_WEB.prix.option.push({
            "szLibelle": Offre.OptionDescription__c.value,
            "fMontant": Offre.TotalOptions__c.value,
            "fMontantRemise": 0,
            "szTypeTVA": "TC",
            "fTauxTva": 0.2,
            "szSemiClair": ''
        }); //20
    }

    if (Offre.TotalServices__c.value > 0) { // NEED EXEMPLE
        JSON_FG_WEB.prix.service.push(
            {
                "szTypeServices": "TS",
                "csLibelleServices": Offre.ServiceDescription__c.value,
                "szCodeBaremeServices": "TS",
                "csLibelleBaremeServices": "TS",
                "iDureeServices": v.Duree,
                "fMontantServices": Offre.TotalServices__c.value,
                "fMontantRemiseServices": 0,
                "bComptant": 0,
                "iKilometrageServices": 0,
                "fTauxTva": 0.2,
                "szTypeTVA": "TC",
            }
        ); // Proposition.ComplementsProposition.TypeComplement == 0
    }
    JSON_FG_WEB.prix.malus = [];
    JSON_FG_WEB.prix.assurances = [];
    // Options
    JSON_FG_WEB.prix.fMontantSuperBonus = 0;
    /*$.each(Offre.Data.EntreeFinan.Vehicule.Complements, function (i, v) {
        tva = v.Tva > 1 ? v.Tva / 100 : (v.Tva === 0) ? 1 : v.Tva;
        if (v.TypeOption === 20) {
            JSON_FG_WEB.prix.option.push({
                "szLibelle": v.DescLongueProduit,
                "fMontant": v.Montant,
                "fMontantRemise": 0,
                "szTypeTVA": "TC",
                "fTauxTva": 0.2,
                "szSemiClair": v.CodeExterne
            })
        } else if (v.TypeOption === 21 || v.TypeOption === 55) { // accessoires
            JSON_FG_WEB.prix.accessoire.push({
                "szLibelle": v.DescLongueProduit,
                "fMontant": v.Montant,
                "fTauxTva": 0.2,//tva,
                "szTypeTVA": "TC"
            });
        } else if (v.TypeOption === 22) { // supplement
            if (v.SousTypeOption === 9) //super bonus
            {
                JSON_FG_WEB.prix.fMontantSuperBonus += v.Montant;
            }
            else if (v.SousTypeOption === 8) //malus a mettre en superbonus
            {
                JSON_FG_WEB.prix.fMontantSuperBonus += v.Montant;
            }
            else if (v.SousTypeOption === 10) // En attente spec (ER?)
            {

            }
            else {
                JSON_FG_WEB.prix.supplement.push({
                    "szLibelle": v.DescLongueProduit,
                    "fMontant": v.Montant,
                    "fTauxTva": tva,
                    "szTypeTVA": "TC"
                });
            }
        }
    })
    $.each(Offre.Data.Proposition.ComplementsProposition, function (i, v) {
        tva = v.Tva > 1 ? v.Tva / 100 : (v.Tva === 0) ? 1 : v.Tva;
        if (v.TypeComplement === 0) {
            JSON_FG_WEB.prix.service.push({
                "szTypeServices": v.CodeProduitBase,
                "csLibelleServices": v.DescCourtePresta,
                "szCodeBaremeServices": v.CodeBaremePrest,
                "csLibelleBaremeServices": v.DescCourteBaremePresta,
                "iDureeServices": v.Duree,
                "fMontantServices": v.Montant,
                "fMontantRemiseServices": v.MontantRemise,
                "bComptant": [1, 2].includes(v.TypeCalcul) ? 1 : 0,
                "iKilometrageServices": v.Km,
                "fTauxTva": tva,
                "szTypeTVA": "TC",
            })
        }
    })*/
    JSON_FG_WEB.prix.szDateLivraison = Offre.InitialDeliveryDate__c.value;
    reloadInfoB();
}

function getUserInfoByRrf(affaire) {


    
    if (MODE_DEV) {
        chrome.runtime.sendMessage({ type: 'currenttab' });
        chrome.runtime.sendMessage({ type: "login", url: app_settings.app_url + '/wsEfficom/getToken' });
        return;
    }
    var settings = {
        "url": app_settings.bo_app_url + "api/wsEfficom/getToken/" + affaire,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Cookie": "symfony=e750c26ba7f0a375f492ba2a451b8c1b"
        },
    };
    //fetch(settings.url, { method: "GET", mode: 'cors', headers: { 'Content-Type': 'application/json'}}).then(response => response.json())
    (async () => {
        const rawResponse = await fetch(settings.url, settings);
        if (!rawResponse.ok) {
            console.log(re)
        }
        const response = await rawResponse.json();
        console.log(response)
        if (response.error == false) {
            if (response.url) {
                app_settings.app_url = response.url;
                //login({type: "login", url: app_settings.app_url}, instant)
                chrome.runtime.sendMessage({ type: 'currenttab' });
                chrome.runtime.sendMessage({ type: "login", url: app_settings.app_url })
            }
        } else {
            handleError(response.error);
        }
    })();

}

//Authentification handler
function login(response) {
    console.log("=============login===================");
    console.log(response);
    if (!app_settings.user_info) {
        if (response.data.data) {
            app_settings.user_info = unserialize(atob(response.data.data));
            console.log(app_settings.user_info)
            $('#efficom-action-login').removeClass('hidden');
            $('#efficom-action-login').html(app_settings.messages.scrapping);
            $('#efficom-action-login').attr('disabled', 'disabled');
            instance[0].setContent(`Vous êtes connecté.
            <span class="scrape">Utilisateur : ${app_settings.user_info[0]}</span>
<span class="scrape">Version : V${APP_VERSION}</span>`);
            instance[0].show();
            logged = true;
            scrapeMoveApi();
        } else {
            $('#efficom-action-login').removeClass('hidden');
            $('#efficom-action-login').text(app_settings.messages.connection);
            console.log(instance);
            instance[0].setContent(`Connectez-vous à Efficom avant d'exporter votre commande.
            <span class="scrape">Version : V${APP_VERSION}</span>`);
            instance[0].show();
        }
        $('#efficom-action-login').removeAttr('disabled');
    }
}
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

function returnInitDvfg(response) {
    console.log("=============returnInitDvfg===================");
    console.log(response);
    if (response.data.status == 200 && response.data.error == false) {
       handleError(response.data.message);
        window.open(window.URLFG, '_blank');
        window.focus();
        //$('#efficom-action-upload').show();
    } else {
        handleError('FG Ok, DV KO - ' + JSON.stringify(response));
        window.open(window.URLFG, '_blank');
    }
    reloadInfoB();
}

function returnUploadBDC(response) {
    console.log("=============returnUploadBDC===================");
    console.log(response);
    if (response.data.status == 200 && response.data.error == false) {
        //window.open(window.URLFG);
        handleError('Création FG OK, Initialisation DV OK, Upload BDC OK');
        $('#efficom-action-upload').removeAttr('disabled');
        $('#efficom-action-upload').text(app_settings.messages.upload_bdc);
    }
    else {
        handleError('FG Ok, DV OK, Upload BDC KO  - ' + JSON.stringify(response));
    }


}
function initDvFG(url, urlFg, message) {
    efficom_initDVFG_return = false;
    efficom_uploadBDC_return = false;
    window.URLFG = urlFg;
    window.URLINITDV = url;
    /* var mapForm = document.createElement("form");
     mapForm.target = "_blank";
     mapForm.method = "POST";
     mapForm.id = "initdvfg";
     mapForm.action = url + '/initdv/0/bdc/1';
 
     // Create an input
     var mapInput = document.createElement("input");
     mapInput.type = "text";
     mapInput.name = "json";
     mapInput.value = JSON.stringify({ fileRaw: PDFCommande, numCar: CARNumber__c });
 
     // Add the input to the form
     mapForm.appendChild(mapInput);
 
     // Add the form to dom
     document.body.appendChild(mapForm);*/

    //handleError(message + ', creation DV en cours...', false);
    /*var settings = {
        "url": url + "/initdv/1/bdc/1",
        "type": "POST",
        "timeout": 0,
        "data": JSON.stringify({ fileRaw: PDFCommande, numCar: CARNumber__c }),
        //headers: {},
        //"mode": "no-cors",
        "headers": {
            "Cookie": "symfony=e750c26ba7f0a375f492ba2a451b8c1b"
        },
        "success": function(response){
            console.log(response);
            returnInitDvfg({data:response})
        },
        "error": function(xhr, status, err) {
            console.log(err);
        }
    };

    $.ajax(settings);*/

    //chrome.runtime.sendMessage({ type: 'currenttab' });
    //chrome.runtime.sendMessage({ type: app_settings.types.efficom_initDVFG, settings: settings, callback: app_settings.types.efficom_initDVFG_return });

    var settings = {
        "url": url + "/initdv/1/bdc/1",
        "method": "POST",
        "timeout": 0,
        body: JSON.stringify({ fileRaw: PDFCommande, numCar: CARNumber__c }),
        //headers: {},
        //"mode": "no-cors",
        "headers": {
            "Cookie": "symfony=e750c26ba7f0a375f492ba2a451b8c1b"
        }
    };
    (async () => {
        const rawResponse = await fetch(settings.url, settings);
        console.log(rawResponse)
        if (!rawResponse.ok) {
            console.log(rawResponse)
            throw new Error(`Error! status: ${rawResponse.status}, ${rawResponse.message}`);
        }
        try{
        const response = await rawResponse.json();
            console.log(response)
            returnInitDvfg({data:response})
        }catch(e){
            handleError(`Error! status: ${rawResponse.status}`);
        }
        console.log("======= fetchUrl INIT DVFG  =======")
    })();



    /* fetch(settings.url, settings)
         //.then(response => response.json())
         .then(dataReturn => {
             console.log(dataReturn);
             if (dataReturn && dataReturn.status === 200) {
                 handleError(message + '<br>' + dataReturn.message);
                 window.open(urlFg);
                 // Just submit
                 mapForm.submit();
 
             }
         }).catch(error => {
             handleError(message + ',  L\'upload du BDC est en cours...Vérifiez-vous le dossier après 5min.');
             console.log(urlFg);
             window.open(urlFg);
             console.log("Error ws init DV:" + error.message);
             //handleError("Error ws init DV:" + error.message);
         });*/
}

function handleReturnSendPrix(response) {
    console.log('handleReturnSendPrix');
    scraped = true;
    //handleError(response.data.responseOrcabox.statusMessageOrcabox)
    //url = response.data.urlFgOrcabox;//urlRequestToFg + `feuillegestion/feuille/id/${response.data.FgId}/u_id/${response.data.user_id}`;
    url = new URL(response.data.urlFgOrcabox).origin
    if (MODE_DEV) {
        url = url + '/ManPerf_dev.php';
    }
    url = url + `/feuillegestion/feuille/id/${response.data.responseOrcabox.FgId}/u_id/${response.data.responseOrcabox.user_id}`;
    urlInitDV = url.replace('/feuille/', '/initDVFG/');
    console.log(urlInitDV, url);
    initDvFG(urlInitDV, url, response.data.responseOrcabox.statusMessageOrcabox);
    //console.log(url);
    //window.open(url);
}
function handleErrorSendPrix(response) {
    console.log('handleErrorSendPrix');
    console.log(response);
    var msg = ""
    if (response.data.statusMessageOrcabox) {
        msg = response.data.statusMessageOrcabox
    } else if (response.data.statusMessageMove) {
        msg = response.data.statusMessageMove
    } else {
        //msg = "Erreur inconnue, veuillez contacter le support Efficom au 01 80 42 00 4";
    }
    error = msg + ': <br>';
    if (response.data.responseOrcaboxBrute) {
        response.data.responseOrcaboxBrute = response.data.responseOrcaboxBrute.replace('The value "Unknown" is not a valid IP address.', '');
        responseOrcabox = JSON.parse(response.data.responseOrcaboxBrute)
        if (responseOrcabox.errors) {
            responseOrcabox.errors.forEach(function (v, i) {
                error = `${v.errors[0]}<br>`;
            })
        }
    }
    handleError(error)
    //handleError(response.data.statusMessageOrcabox)
}
// authetification
efficom_initDVFG_return = false;
efficom_uploadBDC_return = false;
chrome.runtime.onMessage.addListener(function (response, b, c) {
    console.log("======== BG.js ==========");
    console.log(response);
    switch (response.type) {
        case app_settings.types.efficom_login_return:
            login(response)
            break;
        case app_settings.types.efficom_initDVFG_return:
            if (efficom_initDVFG_return == false) {
                returnInitDvfg(response)
            }
            efficom_initDVFG_return = true;
            break;
        case app_settings.types.efficom_uploadBDC_return:
            if (efficom_uploadBDC_return == false) {
                returnUploadBDC(response)
            }
            efficom_uploadBDC_return = true;
            break;
    }
});

//window.sessionStorage.getItem =

if (app_page.indexOf("customer360psa.com") > -1) {
    console.log(app_page);
    var move = {};
    (function () {
        var a = setInterval(function () {
            if (typeof window.jQuery === 'undefined') {
                console.log("Jquery not Loaded");
                return;
            }
            clearInterval(a);

            console.log('jQuery is loaded'); // call your function with jQuery instead of this
        }, 500);
    })();


    window.addEventListener('locationchange', function () {
        console.log('location changed!');
    });
    window.navigation.addEventListener("navigate", (event) => {
        scraped = false;
        window.InfoClient = null;
        window.idClient = null;
        window.Offre = null;
        window.idCommande = null;
        window.idReprise = null;
        window.PDFCommande = null;
        window.idClientContact = null;
        window.ClientContact = null
        app_page = window.location.href;
        console.log(app_page);
        window.onload = (kolo());
        if (document.readyState === "complete" || document.readyState === "interactive") {
            kolo()
        }
    })


function kolo () {
        //var $('.efficom-message') = $('.efficom-message');
        //var $('#efficom-action-login') = $('#efficom-action-login');
        console.log('customer360psa');
        infoUser = (app_settings.user_info !== null && typeof (app_settings.user_info[0]) != 'undefined') ? app_settings.user_info[0] : null;
        scraped = false;
        //getUserInfoByRrf(affaire);
        eventLKilled = false;


        chrome.runtime.sendMessage({ type: 'currenttab' });






        var eventL = window.setInterval(function () {
            getRrf();
            console.log("window.setInterval");
            console.log($('.slds-page-header_record-home').length);
            console.log(affaire);
            console.log(window.affaire);
            console.log($('#efficom-action-login').length);
            console.log(typeof (affaire) != 'undefined');
            if (
                $('.slds-page-header_record-home').length >0
                && $('#efficom-action-login').length == 0
                && typeof (affaire) != 'undefined') {
                initSys();
                clearInterval(eventL);
            }
            if ($('.slds-page-header_record-home').length > 0
                && $('#efficom-action-login').length > 0
                && typeof (affaire) != 'undefined') {
                    console.log("IN COND")
                clearInterval(eventL);
            }
            // if($('.recordTypeName').length>0 && $('.recordTypeName').text().indexOf("Offre")>-1){
            //     console.log('STOP!');
            //     clearInterval(eventL);
            //     return;
            // }
        }, 1000);

    function initSys() {
        console.log("------------initSys--------------------------")

        const path = window.location.pathname.substr(1);
        const pathSegments = path.split('/');
        if (pathSegments.includes('quote') && $('.recordTypeName').length > 0 && $('.recordTypeName').text().indexOf("Offre") === -1) {
            $(EfficomPave).insertBefore($('.slds-page-header_record-home'));
            //$('.efficom-message') = $('.efficom-message');
            //$('#efficom-action-login') = $('#efficom-action-login');
            scraped = false;
            instance = tippy("#efficom-action-login", {
                arrow: true,
                content: '',
                allowHTML: true,
                placement: 'top',
                onHidden(instance) {
                    /*if (app_settings.user_info && !scraped) {
                        instance.setContent(app_settings.messages.loading);
                        scrapeMoveApi();
                    }*/
                },
                onShown(instance) {
                    //scrape();
                    //instance2[0].setContent('Loading...');
                }
            });


            $('#efficom-action-upload').click(function () {

                $(this).attr('disabled', "disabled");
                $(this).html(app_settings.messages.Loading_upload_bdc);
                var settings = {
                    "url": window.URLINITDV + "/initdv/0/bdc/1",
                    "method": "POST",
                    "timeout": 0,
                    body: JSON.stringify({ fileRaw: PDFCommande, numCar: CARNumber__c }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Origin': '*',
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Origin': '*',
                    },
                    // "mode": "no-cors",
                };
                chrome.runtime.sendMessage({ type: 'currenttab' });
                chrome.runtime.sendMessage({ type: app_settings.types.efficom_uploadBDC, settings: settings, callback: app_settings.types.efficom_uploadBDC_return });


                setTimeout(() => {
                    console.log("timeout")
                    $('#efficom-action-upload').removeAttr('disabled');
                    $('#efficom-action-upload').text(app_settings.messages.upload_bdc);
                }, 60*1000);
            });
            $('#efficom-action-login').click(function () {
                $('.efficom-message').text("");
                if (app_settings.user_info) {
                    if (logged && JSON_FG_WEB.prix.userIpn) {
                        instance[0].setContent(app_settings.messages.scrapping);
                        //scrapeMoveApi();
                        if (carInfoClient && isPDFCommandeScrapped) {
                            //chrome.runtime.sendMessage({type: app_settings.types.send_prix, data: JSON_FG_WEB});
                            isPdfScrapped = window.PDFCommande != undefined && window.PDFCommande != "" && window.PDFCommande != null
                            $('#efficom-action-login').attr('disabled', 'disabled');
                            $('#efficom-action-login').html(app_settings.messages.loadingExport+' '+(isPdfScrapped ? "" : "sans PDF"));
                            sendPrix(JSON_FG_WEB);
                        } else {
                            $('.efficom-message').html(app_settings.messages.loadingData);
                            scrapeMoveApi();
                            //$('#efficom-action-login').trigger('click');
                        }
                    } else {
                        instance[0].setContent(app_settings.messages.scrapping);
                        instance[0].show();
                    }
                }
                // else {
                //     url = new URL(app_settings.app_url).origin
                //     window.open(url + "/auth/logout");
                // }
            })
            if (!app_settings.user_info) {
                getUserInfoByRrf(affaire);
            } else {
                console.log('HAHAHAH');
                $('#efficom-action-login').removeClass('hidden');
                $('#efficom-action-login').html(app_settings.messages.export);
                $('#efficom-action-login').removeAttr('disabled');
                instance[0].setContent(app_settings.messages.loading);
                instance[0].show();
                logged = true;
                scrapeMoveApi();
            }
        }
    }








    }

    window.onload = (kolo());
    function scrapeMoveApi() {

        if ($getClient = getClient()) {
            console.log(window.idClient);
            $getClient.then(response => response.json())
                .then(data => {
                    var ll = setInterval(function () {
                        if (data.context.globalValueProviders[i].values.records[window.idClient] != undefined) {
                            clearInterval(ll);
                        }
                        console.log(data);
                        console.log(data.context.globalValueProviders[i].values.records[window.idClient]);
                        console.log(data.context.globalValueProviders[i].values.records);
                        window.InfoClient = data.context.globalValueProviders[i].values.records[window.idClient].Account.record.fields;//data.context.globalValueProviders[1].values.records[$id].Account.record.fields;
                        console.log('-----------------------Info CLIENT END-------------------');

                    }, 100);
                })
                .catch(err => console.log(err));
        }

        if ($getCommandeDetails = getCommandeDetails()) {
            console.log(window.idCommande);
            $getCommandeDetails.then(data => data.json())
                .then(offre => {
                    console.log(offre);
                    window.Offre = offre.context.globalValueProviders[i].values.records[window.idCommande].SBQQ__Quote__c.record.fields;
                    console.log('-----------------------Info COMMANDE DETAILS END-------------------');
                    if (Offre.TradeInCarPrice__c.value > 0) {
                        Offre.isReprise = true;
                        if ($getReprise = getReprise()) {
                            /** */
                            $getReprise.then(data => data.json())
                                .then(reprise => {
                                    console.log(reprise);
                                    window.Offre.Reprise = reprise.context.globalValueProviders[i].values.records[window.idReprise].Asset.record.fields;
                                    console.log('-----------------------Info REPRISE  END-------------------');
                                    ScrapeMove(window.Offre, window.InfoClient);
                                })
                                .catch(err => console.log(err));
                            /** */


                        }
                    }


                    /// GET PDF
                    if ($getPDF = getPDF()) {
                        $getPDF.then(data => data.json())
                            .then(pdf => {
                                console.log(pdf);
                                window.PDFCommande = pdf.actions[0].returnValue
                                window.isPDFCommandeScrapped = true
                                console.log(window.PDFCommande);
                                //downloadPDF(window.PDFCommande);
                            });
                    }

                })
                .catch(err => console.log(err));
        }

        var ll = setInterval(function () {
            if (window.InfoClient != undefined && window.Offre != undefined) {
                clearInterval(ll);
                console.log(window.Offre);
                console.log(window.InfoClient);
                ScrapeMove(window.Offre, window.InfoClient);
            } else {
                console.log("=============NOT YET===========");
                console.log(window.Offre);
                console.log(window.InfoClient);
                // scrapeMoveApi();
            }
        }, 100);
        //IF REPRISE EXISTE

    }
    function downloadPDF(pdf) {
        const linkSource = `data:application/pdf;base64,${pdf}`;
        const downloadLink = document.createElement("a");
        const fileName = "abc.pdf";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }
    function callMoveApi(url, settings) {
        /*headers = JSON.parse(window.sessionStorage.getItem('authentication'));
        console.log(headers);
        headers["Content-type"] = "application/json;charset=utf-8";
        var settings = {
            "url": url,
            "method": "GET",
            "headers": headers,
            "timeout": 0
        };*/

        return fetch(url, settings)
    }
}

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





function getRrf() {
    //console.log(window);
    if (window.affaire != undefined && window.affaire != "") {
        return;
    }
    $key = localStorage.getItem("window.aura.clientService.Fc");
    console.log($('[data-target-selection-name="sfdc:RecordField.SBQQ__Quote__c.SBQQ__Partner__c"] a'));
    console.log($('[data-target-selection-name="sfdc:RecordField.SBQQ__Quote__c.SBQQ__Partner__c"] a').attr('data-recordid'));
    $id = $('[data-target-selection-name="sfdc:RecordField.SBQQ__Quote__c.SBQQ__Partner__c"] a').attr('data-recordid');
    console.log($key, $id);
    if ($id == undefined) {
        return;
    }
    message = {
        "actions": [
            {
                "id": "1878;a",
                "descriptor": "serviceComponent://ui.force.components.controllers.recordGlobalValueProvider.RecordGvpController/ACTION$getRecord",
                "callingDescriptor": "UNKNOWN",
                "params": {
                    "recordDescriptor": $id + ".012690000007m9lAAA.null.null.null.Name.VIEW.false.null.Name,LastModifiedDate,BillingCity,IsPersonAccount,PersonContactId,PhysicalSiteId__c,RecordType;2Name,RecordType;2IsPersonType,CurrencyIsoCode,Text_FCABrands__c,FCA_Dealer_Outlet__c,SystemModstamp,BillingCountry,BillingStreet,RecordTypeId,CreatedDate,BillingPostalCode,PhotoUrl,Main_Actor_Code__c,RecordType;2Id,Id,LastModifiedById,BillingState.null"
                }
            }
        ]
    };
    context = {
        "mode": "PROD",
        "fwuid": localStorage.getItem("window.aura.clientService.fj.context.fwuid"),
        "app": "siteforce:communityApp",
        "loaded": {
            "APPLICATION@markup://siteforce:communityApp": "MjIgGOAP9KfmIHP0sRc5nw",
            "COMPONENT@markup://instrumentation:o11ySecondaryLoader": "VZ2Rg7MN_BaoV_0Qlk5pAw",
            "COMPONENT@markup://forceCommunity:recordDetail": "dJP1ig7P7XU7gbhYj9wrNA",
            "COMPONENT@markup://forceCommunity:relatedRecords": "uqDPtFWCdYp18Hc3gLXVAw",
            "COMPONENT@markup://force:inputField": "bG6T4BjIVRsBNxMkiX7G9g",
            "COMPONENT@markup://force:previewPanel": "Jn3JuAiy_6pmX_BHqTqHtg"
        },
        "dn": [],
        "globals": {
            "density": "VIEW_ONE"
        },
        "uad": false
    };
    console.log(app_page.split(".com"));
    pageURI = app_page.split(".com")[1];
    token = $key;


    (async () => {
        var dd = await fetch("https://www.customer360psa.com/s/sfsites/aura?r=49&ui-force-components-controllers-recordGlobalValueProvider.RecordGvp.getRecord=1", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-sfdc-page-scope-id": "4c18afb9-5863-40e0-89fc-ede7a7ae343b",
                "x-sfdc-request-id": "518087600000fa01cc"
            },
            "referrer": app_page,
            "referrerPolicy": "origin-when-cross-origin",
            "body": "message=" + JSON.stringify(message) + "&aura.context=" + JSON.stringify(context) + "&aura.pageURI=" + pageURI + "&aura.token=" + token,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        var ddm = await dd.json();
        console.log(ddm);
        console.log(ddm.context.globalValueProviders[i].values.records[$id].Account.record.fields.PhysicalSiteId__c.value);
        window.affaire = ddm.context.globalValueProviders[i].values.records[$id].Account.record.fields.PhysicalSiteId__c.value;

    })();
}

function getCommandeDetails() {
    //context.globalValueProviders[2].values.records.a1F6900000KfwXJEAZ.SBQQ__Quote__c.record.fields
    //console.log(window);
    if (window.Offre != undefined && window.Offre != "") {
        return false;
    }
    $key = localStorage.getItem("window.aura.clientService.Fc");
    const myRe = /quote\/.+?\//;
    app_page=window.location.href;
    window.idCommande = $id = myRe.exec(app_page)[0].replace(/quote\//gi, "").replace(/\//gi, "");
    console.log($key, $id);
    if ($id == undefined) {
        return false;
    }



    message = {
        "actions": [
            {
                "id": "286;a",
                "descriptor": "serviceComponent://ui.force.components.controllers.recordGlobalValueProvider.RecordGvpController/ACTION$getRecord",
                "callingDescriptor": "UNKNOWN",
                "params": {
                    "recordDescriptor": $id + ".0120O000000ZSjLQAW.FULL.null.null.null.VIEW.true.null.Name,RecordType;2Name,RecordTypeId.null"
                }
            }
        ]
    };
    context = {
        "mode": "PROD",
        "fwuid": localStorage.getItem("window.aura.clientService.fj.context.fwuid"),
        "app": "siteforce:communityApp",
        "loaded": {
            "APPLICATION@markup://siteforce:communityApp": "MjIgGOAP9KfmIHP0sRc5nw",
            "COMPONENT@markup://instrumentation:o11ySecondaryLoader": "VZ2Rg7MN_BaoV_0Qlk5pAw",
            "COMPONENT@markup://forceCommunity:recordDetail": "dJP1ig7P7XU7gbhYj9wrNA",
            "COMPONENT@markup://forceCommunity:relatedRecords": "uqDPtFWCdYp18Hc3gLXVAw"
        },
        "dn": [],
        "globals": {},
        "uad": false
    };
    console.log(app_page.split(".com"));
    pageURI = app_page.split(".com")[1];
    token = $key;


    return fetch("https://www.customer360psa.com/s/sfsites/aura?r=49&ui-force-components-controllers-recordGlobalValueProvider.RecordGvp.getRecord=1", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-sfdc-page-scope-id": "4c18afb9-5863-40e0-89fc-ede7a7ae343b",
            "x-sfdc-request-id": "518087600000fa01cc"
        },
        "referrer": app_page,
        "referrerPolicy": "origin-when-cross-origin",
        "body": "message=" + JSON.stringify(message) + "&aura.context=" + JSON.stringify(context) + "&aura.pageURI=" + pageURI + "&aura.token=" + token,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
}

function getClient() {
    //context.globalValueProviders[1].values.records["0016900003F9axNAAR"].Account.record.fields
    //console.log(window);
    if (window.InfoClient != undefined && window.InfoClient != "") {
        return false;
    }
    $key = localStorage.getItem("window.aura.clientService.Fc");
    console.log($('[data-target-selection-name="sfdc:RecordField.SBQQ__Quote__c.SBQQ__Account__c"] a'));
    console.log($('[data-target-selection-name="sfdc:RecordField.SBQQ__Quote__c.SBQQ__Account__c"] a').attr('data-recordid'));
    window.idClient = $id = $('[data-target-selection-name="sfdc:RecordField.SBQQ__Quote__c.SBQQ__Account__c"] a').attr('data-recordid');
    console.log($key, $id);
    if ($id == undefined) {
        return false;
    }
    message = {
        "actions": [
            {
                "id": "368;a",
                "descriptor": "serviceComponent://ui.force.components.controllers.recordGlobalValueProvider.RecordGvpController/ACTION$getRecord",
                "callingDescriptor": "UNKNOWN",
                "params": {
                    "recordDescriptor": $id + ".012690000019pK9AAI.FULL.null.null.null.VIEW.true.null.Name,RecordTypeId,RecordType;2DeveloperName,RecordType;2Name.null"
                }
            }
        ]
    };
    context = {
        "mode": "PROD",
        "fwuid": localStorage.getItem("window.aura.clientService.fj.context.fwuid"),
        "app": "siteforce:communityApp",
        "loaded": {
            "APPLICATION@markup://siteforce:communityApp": "MjIgGOAP9KfmIHP0sRc5nw",
            "COMPONENT@markup://instrumentation:o11ySecondaryLoader": "VZ2Rg7MN_BaoV_0Qlk5pAw"
        },
        "dn": [],
        "globals": {},
        "uad": false
    };
    console.log(app_page.split(".com"));
    pageURI = app_page.split(".com")[1];
    token = $key;


    return fetch("https://www.customer360psa.com/s/sfsites/aura?r=49&ui-force-components-controllers-recordGlobalValueProvider.RecordGvp.getRecord=1", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-sfdc-page-scope-id": "4c18afb9-5863-40e0-89fc-ede7a7ae343b",
            "x-sfdc-request-id": "518087600000fa01cc"
        },
        "referrer": app_page,
        "referrerPolicy": "origin-when-cross-origin",
        "body": "message=" + JSON.stringify(message) + "&aura.context=" + JSON.stringify(context) + "&aura.pageURI=" + pageURI + "&aura.token=" + token,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
}


function getContactPM() {
    if (window.ClientContact != undefined && window.ClientContact != "") {
        return false;
    }
    $key = localStorage.getItem("window.aura.clientService.Fc");
    console.log($('[data-target-selection-name="sfdc:RecordField.SBQQ__Quote__c.SBQQ__PrimaryContact__c"] a'));
    console.log($('[data-target-selection-name="sfdc:RecordField.SBQQ__Quote__c.SBQQ__PrimaryContact__c"] a').attr('data-recordid'));
    window.idClientContact = $id = $('[data-target-selection-name="sfdc:RecordField.SBQQ__Quote__c.SBQQ__PrimaryContact__c"] a').attr('data-recordid');
    console.log($key, $id);
    if ($id == undefined) {
        return false;
    }
    message = {
        "actions": [
            {
                "id": "3954;a",
                "descriptor": "serviceComponent://ui.force.components.controllers.recordGlobalValueProvider.RecordGvpController/ACTION$getRecord",
                "callingDescriptor": "UNKNOWN",
                "params": {
                    "recordDescriptor": $id + ".012690000019pJyAAI.FULL.null.null.null.VIEW.true.null.Name,RecordTypeId,RecordType;2DeveloperName,RecordType;2Name.null"
                }
            }
        ]
    }

    context = {
        "mode": "PROD",
        "fwuid": localStorage.getItem("window.aura.clientService.fj.context.fwuid"),
        "app": "siteforce:communityApp",
        "loaded": {
            "APPLICATION@markup://siteforce:communityApp": "MjIgGOAP9KfmIHP0sRc5nw",
            "COMPONENT@markup://instrumentation:o11ySecondaryLoader": "VZ2Rg7MN_BaoV_0Qlk5pAw"
        },
        "dn": [],
        "globals": {},
        "uad": false
    };
    console.log(app_page.split(".com"));
    pageURI = app_page.split(".com")[1];
    token = $key;



    return fetch("https://www.customer360psa.com/s/sfsites/aura?r=87&ui-force-components-controllers-recordGlobalValueProvider.RecordGvp.getRecord=1", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-sfdc-page-scope-id": "0747c1c7-55c6-432e-9a9c-4709b5fdfc1e",
            "x-sfdc-request-id": "1799123500000ae544"
        },
        "referrer": app_page,
        "referrerPolicy": "origin-when-cross-origin",
        "body": "message=" + JSON.stringify(message) + "&aura.context=" + JSON.stringify(context) + "&aura.pageURI=" + pageURI + "&aura.token=" + token,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });

}

function getReprise() {
    //console.log(window);
    if (window.Reprise != undefined && window.Reprise != "") {
        return false;
    }
    $key = localStorage.getItem("window.aura.clientService.Fc");
    console.log($('[data-target-selection-name="sfdc:RecordField.SBQQ__Quote__c.TradeInCar__c"] a'));
    console.log($('[data-target-selection-name="sfdc:RecordField.SBQQ__Quote__c.TradeInCar__c"] a').attr('data-recordid'));
    window.idReprise = $id = $('[data-target-selection-name="sfdc:RecordField.SBQQ__Quote__c.TradeInCar__c"] a').attr('data-recordid');
    console.log($key, $id);
    if ($id == undefined) {
        return false;
    }
    message = {
        "actions": [
            {
                "id": "1878;a",
                "descriptor": "serviceComponent://ui.force.components.controllers.recordGlobalValueProvider.RecordGvpController/ACTION$getRecord",
                "callingDescriptor": "UNKNOWN",
                "params": {
                    "recordDescriptor": $id + ".0120O000000pBMeQAM.FULL.null.null.null.VIEW.true.null.Name,RecordType;2Name,RecordTypeId.null"
                }
            }
        ]
    };
    context = {
        "mode": "PROD",
        "fwuid": localStorage.getItem("window.aura.clientService.fj.context.fwuid"),
        "app": "siteforce:communityApp",
        "loaded": {
            "APPLICATION@markup://siteforce:communityApp": "MjIgGOAP9KfmIHP0sRc5nw",
            "COMPONENT@markup://instrumentation:o11ySecondaryLoader": "VZ2Rg7MN_BaoV_0Qlk5pAw",
            "COMPONENT@markup://forceCommunity:recordDetail": "dJP1ig7P7XU7gbhYj9wrNA",
            "COMPONENT@markup://forceCommunity:relatedRecords": "uqDPtFWCdYp18Hc3gLXVAw",
            "COMPONENT@markup://force:inputField": "bG6T4BjIVRsBNxMkiX7G9g",
            "COMPONENT@markup://force:previewPanel": "Jn3JuAiy_6pmX_BHqTqHtg"
        },
        "dn": [],
        "globals": {
            "density": "VIEW_ONE"
        },
        "uad": false
    };
    pageURI = app_page.split(".com")[1];
    token = $key;


    return fetch("https://www.customer360psa.com/s/sfsites/aura?r=49&ui-force-components-controllers-recordGlobalValueProvider.RecordGvp.getRecord=1", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-sfdc-page-scope-id": "4c18afb9-5863-40e0-89fc-ede7a7ae343b",
            "x-sfdc-request-id": "518087600000fa01cc"
        },
        "referrer": app_page,
        "referrerPolicy": "origin-when-cross-origin",
        "body": "message=" + JSON.stringify(message) + "&aura.context=" + JSON.stringify(context) + "&aura.pageURI=" + pageURI + "&aura.token=" + token,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
}



function getPDF() {
    //console.log(window);
    if (window.PDFCommande != undefined && window.PDFCommande != "") {
        return false;
    }
    $key = localStorage.getItem("window.aura.clientService.Fc");
    if (window.idCommande != undefined) {
        const myRe = /quote\/.+?\//;
        window.idCommande = $id = myRe.exec(app_page)[0].replace(/quote\//gi, "").replace(/\//gi, "");
    } else {
        $id = window.idCommande;
    }
    console.log($key, $id);

    if ($id == undefined) {
        return false;
    }
    message = {
        "actions": [
            {
                "id": "1371;a",
                "descriptor": "apex://PDFReader/ACTION$getCalloutResponseContents",
                "callingDescriptor": "markup://c:QuotesPDF",
                "params": {
                    "sRecordId": $id,
                    "isB2Link": false,
                    "b2LinkURL": "",
                    "isFCA": false,
                    "fcaURL": "",
                    "isOMNI": false
                },
                "version": null
            }
        ]
    };
    context = {
        "mode": "PROD",
        "fwuid": localStorage.getItem("window.aura.clientService.fj.context.fwuid"),
        "app": "siteforce:communityApp",
        "loaded": {
            "APPLICATION@markup://siteforce:communityApp": "pbTYxUpp_9IPfsISARS1_Q",
            "COMPONENT@markup://instrumentation:o11ySecondaryLoader": "VZ2Rg7MN_BaoV_0Qlk5pAw",
            "COMPONENT@markup://forceCommunity:recordDetail": "eWR0W4DRuacb-x-zeIUgeg",
            "COMPONENT@markup://forceCommunity:relatedRecords": "RJ7gbL14dbidc9VMoYhgmw",
            "COMPONENT@markup://force:inputField": "lN_8ESx9oBi_rwJtzF6mxQ",
            "COMPONENT@markup://force:quickActionRunnable": "sl0LDZtoB5aS8XmQrCYgRw",
            "COMPONENT@markup://forceChatter:lightningComponent": "udZ25_vJttPLsRxx1n18IQ"
        },
        "dn": [],
        "globals": {
            "density": "VIEW_ONE"
        },
        "uad": false
    }
    pageURI = app_page.split(".com")[1];
    token = $key;



    return fetch("https://www.customer360psa.com/s/sfsites/aura?r=39&other.PDFReader.getCalloutResponseContents=1", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-sfdc-page-scope-id": "76028e14-69d5-4529-bf15-48a585e88141",
            "x-sfdc-request-id": "8411400000095f1f9a"
        },
        "referrer": app_page,
        "referrerPolicy": "origin-when-cross-origin",
        "body": "message=" + JSON.stringify(message) + "&aura.context=" + JSON.stringify(context) + "&aura.pageURI=" + pageURI + "&aura.token=" + token,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
}

