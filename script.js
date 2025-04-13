// Funzioni di controllo login
function checkLogin() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

// Aggiungi controllo login a tutte le pagine tranne login.html
if (!window.location.href.includes('login.html')) {
    checkLogin();
}

// Aggiungi questa costante all'inizio del file, dopo le altre costanti
const VERSION = '1.0.1'; // Incrementa questa versione ogni volta che vuoi forzare un reset
const BACKUP_PREFIX = 'backup_';
const MAX_BACKUPS = 5;

// Costanti per la gestione delle immagini
const IMAGE_CONSTRAINTS = {
    maxSize: 5 * 1024 * 1024, // 5MB
    maxWidth: 1200,
    maxHeight: 1200,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    quality: 0.8
};

// Struttura per gli NPC
class NPC {
    constructor(nome, pianoArenaCeleste, vitaIniziale, destrezza, velocita, riflessi, movesetDifensivo, movesetOffensivo, miniatura, imageUrl) {
        this.nome = nome;
        this.pianoArenaCeleste = pianoArenaCeleste;
        this.vitaIniziale = vitaIniziale;
        this.destrezza = destrezza;
        this.velocita = velocita;
        this.riflessi = riflessi;
        this.movesetDifensivo = movesetDifensivo;
        this.movesetOffensivo = movesetOffensivo;
        this.miniatura = miniatura;
        this.imageUrl = imageUrl;
    }
}

// Struttura per le mosse
class Mossa {
    constructor(descrizione, valore) {
        this.descrizione = descrizione;
        this.valore = valore; // forza per attacco, resistenza per difesa
    }
}

// Costanti per le miniature
const MINIATURA_BASE = `<div align="center"><div style="width:600px; line-height:100%; font-family: georgia; font-size:14px; color: black;text-align: justify; padding: 10px;"><div style="float: left; background-image: url(IMMAGINE_URL); width: 150px; height: 150px; border: 5px solid black; border-radius: 100%; margin-right:5px"></div><div style="width: auto; font-family: times; line-height: 20px; font-size: 20px; color: black; text-transform: uppercase; letter-spacing: 3px; text-shadow: 0 0 1px #7d7459; text-align: right; border-bottom: 5px solid black">NOME_NPC</div></div></div>`;

// Nuova costante per la miniatura nel post generato (ForumCommunity)
const MINIATURA_POST = `<div align="center"><div style="width:600px; line-height:100%; font-family: georgia; font-size:14px; color: black;text-align: justify; padding: 10px;"><div style="float: left; width: 150px; height: 150px; border: 5px solid black; border-radius: 100%; margin-right:5px; overflow: hidden;"><div style="width: 100%; height: 100%; background-image: url(IMMAGINE_URL); background-size: cover; background-position: center;"></div></div><div style="width: auto; font-family: times; line-height: 20px; font-size: 20px; color: black; text-transform: uppercase; letter-spacing: 3px; text-shadow: 0 0 1px #7d7459; text-align: right; border-bottom: 5px solid black">NOME_NPC</div></div></div>`;

const MINIATURA_COMPLETA = `<div align="center"><div style="width:600px; line-height:100%; font-family: georgia; font-size:14px; color: black;text-align: justify; padding: 10px;"><div style="float: left; background-image: url(IMMAGINE_URL); width: 150px; height: 150px; border: 5px solid black; border-radius: 100%; margin-right:5px"></div><div style="width: auto; font-family: times; line-height: 20px; font-size: 20px; color: black; text-transform: uppercase; letter-spacing: 3px; text-shadow: 0 0 1px #7d7459; text-align: right; border-bottom: 5px solid black">NOME_NPC</div><div style="text-align: right; font-family: times; font-size: 14px; padding-top:5px; padding-bottom:3px; padding-left:5px; line-height:90%">Narrato - <i>Pensato</i> - <b>Parlato</b>&nbsp;</div><div style="text-align: justify; font-family: times; font-size: 15px; padding-top:5px; padding-bottom:3px; padding-left:5px; line-height:90%">`;

const MINIATURA_ARBITRO = `\n\n\n\n\n<div align="center"><div style="width:600px; line-height:100%; font-family: georgia; font-size:14px; color: black;text-align: justify; padding: 10px;"><div style="float: left; width: 150px; height: 150px; border: 5px solid black; border-radius: 100%; margin-right:5px; overflow: hidden;"><div style="width: 100%; height: 100%; background-image: url(https://i.imgur.com/zSbKd1D.png); background-size: cover; background-position: center;"></div></div><div style="width: auto; font-family: times; line-height: 20px; font-size: 20px; color: black; text-transform: uppercase; letter-spacing: 3px; text-shadow: 0 0 1px #7d7459; text-align: right; border-bottom: 5px solid black">[color=black]P.L. HILL - ARBITRO[/color]</div><div style="text-align: right; font-family: times; font-size: 14px; padding-top:5px; padding-bottom:3px; padding-left:5px; line-height:90%">Narrato - <i>[color=black]Pensato[/color]</i> - <b>[color=black]Parlato[/color]</b>&nbsp;</div><div style="text-align: justify; font-family: times; font-size: 15px; padding-top:5px; padding-bottom:3px; padding-left:5px; line-height:90%">`;

const ARBITRO_VITTORIA_NPC = MINIATURA_ARBITRO + `L'arbitro alzò una mano, decretando la fine dell'incontro e indicando il vincitore.<b>[color=black]L'incontro è concluso! Il vincitore è "NOME_NPC" [/color]</b></div></div></div>\n\n[SPOILER]INCONTRO TERMINATO! A breve un membro dello Staff esaminerà l'incontro e verranno assegnate le ricompense![/SPOILER]`;

const ARBITRO_VITTORIA_GIOCATORE = MINIATURA_ARBITRO + `L'arbitro alzò una mano, decretando la fine dell'incontro e indicando il vincitore.<b>[color=black]L'incontro è concluso! Il vincitore è "NOME_GIOCATORE" [/color]</b></div></div></div>\n\n[SPOILER]INCONTRO TERMINATO! A breve un membro dello Staff esaminerà l'incontro e verranno assegnate le ricompense![/SPOILER]`;

// Modifica l'inizializzazione di npcList
let npcList = [];

// Funzione per inizializzare la lista NPC
function inizializzaNPCList() {
    try {
        const currentVersion = localStorage.getItem('version');
        
        // Forza il reset se la versione è diversa o non esiste
        if (currentVersion !== VERSION) {
            // Crea backup prima del reset
            creaBackupCompresso();
            
            localStorage.removeItem('npcList');
            localStorage.removeItem('descrizioni');
            localStorage.setItem('version', VERSION);
        }
        
        // Carica i dati dal localStorage
        const savedNPCList = localStorage.getItem('npcList');
        if (savedNPCList) {
            npcList = JSON.parse(savedNPCList);
        }
        
        // Inizializza le descrizioni se non esistono
        if (!localStorage.getItem('descrizioni')) {
            inizializzaEsempiDescrizioni();
        }
    } catch (error) {
        console.error('Errore durante l\'inizializzazione:', error);
        // Tenta di recuperare dal backup più recente in caso di errore
        recuperaUltimoBackup();
    }
}

function recuperaUltimoBackup() {
    try {
        const backupKeys = Object.keys(localStorage)
            .filter(key => key.startsWith('backup_'))
            .sort()
            .reverse();
            
        if (backupKeys.length === 0) {
            throw new Error('Nessun backup disponibile');
        }
        
        // Prova a recuperare l'ultimo backup valido
        for (const key of backupKeys) {
            try {
                const backupData = JSON.parse(localStorage.getItem(key));
                if (backupData && backupData.npcList && backupData.descrizioni) {
                    npcList = backupData.npcList;
                    localStorage.setItem('npcList', JSON.stringify(npcList));
                    localStorage.setItem('descrizioni', JSON.stringify(backupData.descrizioni));
                    console.log('Backup recuperato con successo:', key);
                    return true;
                }
            } catch (e) {
                console.warn('Backup corrotto:', key);
                localStorage.removeItem(key);
            }
        }
        
        throw new Error('Nessun backup valido trovato');
    } catch (error) {
        console.error('Errore durante il recupero del backup:', error);
        alert('Errore durante il recupero del backup: ' + error.message);
        return false;
    }
}

// Funzione di arrotondamento secondo le specifiche
function arrotonda(numero) {
    const parteDecimale = numero % 1;
    if (parteDecimale < 0.5) {
        return Math.floor(numero);
    }
    return Math.ceil(numero);
}

// Funzione unificata per popolare i select degli NPC
function popolaSelectNPC(tipo) {
    const elementId = tipo === 'incontro' ? 'selectNPC' : 'npcSelector';
    const element = document.getElementById(elementId);
    if (!element) return;

        const options = npcList.map((npc, index) => {
        return `<option value="${npc.nome}">${npc.pianoArenaCeleste}° ${npc.nome}</option>`;
        }).join('');
    
    element.innerHTML = `<option value="">Seleziona un NPC</option>${options}`;
}

// Funzione per mostrare le statistiche dell'NPC selezionato
function mostraStatisticheNPC() {
    const select = document.getElementById('selectNPC');
    const statsDiv = document.getElementById('statsNPC');
    if (!select || !statsDiv) return;

    const npcSelezionato = npcList.find(npc => npc.nome === select.value);
    if (!npcSelezionato) {
        statsDiv.innerHTML = '';
        return;
    }

    // Modifica la struttura della mossa difensiva 5 per supportare entrambe le descrizioni
    const mossaDifensiva5 = npcSelezionato.movesetDifensivo[4];
    if (mossaDifensiva5 && mossaDifensiva5.descrizione.includes('|')) {
        const [descrizioneSuccesso, descrizioneFallimento] = mossaDifensiva5.descrizione.split('|').map(d => d.trim());
        mossaDifensiva5.descrizione = descrizioneSuccesso;
        mossaDifensiva5.descrizioneAlternativa = descrizioneFallimento;
    }

    statsDiv.innerHTML = `
        <h3>Statistiche ${npcSelezionato.nome}</h3>
        <p>Piano Arena Celeste: ${npcSelezionato.pianoArenaCeleste}°</p>
        <p>Vita Iniziale: ${npcSelezionato.vitaIniziale}</p>
        <p>Destrezza: ${npcSelezionato.destrezza}</p>
        <p>Velocità: ${npcSelezionato.velocita}</p>
        <p>Riflessi: ${npcSelezionato.riflessi}</p>
    `;
}

// Funzione per copiare il testo generato
function copiaTestoGenerato() {
    const testoGenerato = document.getElementById('generatedText').textContent;
    navigator.clipboard.writeText(testoGenerato).then(() => {
        alert('Testo copiato negli appunti!');
    }).catch(err => {
        console.error('Errore durante la copia: ', err);
        alert('Errore durante la copia del testo');
    });
}

// Struttura per le descrizioni
let descrizioni = {
    vittoria_npc: [],
    sconfitta_npc: []
};

// Funzione per inizializzare le descrizioni
function inizializzaEsempiDescrizioni() {
    // Forza il reset delle descrizioni rimuovendo sempre quelle esistenti
    localStorage.removeItem('descrizioni');
    
    // Inizializza le descrizioni di esempio
    const descrizioniIniziali = {
        vittoria_npc: [
            "Il lottatore, con un grido di trionfo, alza le mani verso il cielo",
            "Un sorriso di pura soddisfazione illumina il volto del vincitore",
            "La folla esplode in un boato, acclamando il trionfatore",
            "Il combattente, esausto ma vittorioso, si lascia cadere sulle ginocchia, assaporando la vittoria",
            "Con un ultimo, potente colpo, il lottatore si assicura la vittoria, lasciando l'avversario a terra",
            "Il vincitore, con un'espressione di orgoglio, si erge sopra l'avversario sconfitto",
            "Il guerriero, con un gesto di rispetto, offre una mano all'avversario per aiutarlo a rialzarsi",
            "Un'ondata di potere pervade il vincitore, che si gode il momento di gloria",
            "Il combattente, con un'espressione determinata, si prepara per la prossima sfida",
            "Il vincitore, con un cenno del capo, riconosce la forza dell'avversario, nonostante la sconfitta"
        ],
        sconfitta_npc: [
            "Il lottatore cade a terra, privo di sensi, sotto il peso dei colpi ricevuti",
            "Un'espressione di sconcerto si dipinge sul volto del combattente, prima che perda conoscenza",
            "La folla ammutolisce, testimone della brusca caduta del lottatore",
            "Il combattente, esausto e sconfitto, crolla al suolo, perdendo i sensi",
            "La superiorità del nemico era evidente e il lottatore, dopo aver incassato l'ultimo colpo, cade a terra privo di sensi",
            "Il lottatore giace immobile, vittima della potenza del suo avversario",
            "Il guerriero, con un gemito, perde conoscenza, incapace di continuare il combattimento",
            "Un'ondata di debolezza travolge il combattente sconfitto, che crolla al suolo privo di sensi",
            "Il lottatore, con un ultimo sussulto, perde conoscenza, incapace di reagire",
            "Il perdente, con un'espressione di dolore, si accascia al suolo, privo di sensi"
        ]
    };

    // Salva le nuove descrizioni
    localStorage.setItem('descrizioni', JSON.stringify(descrizioniIniziali));
    
    // Carica le descrizioni nella variabile globale
    descrizioni = descrizioniIniziali;
}

// Funzione per salvare una nuova descrizione
async function salvaDescrizione() {
    try {
        const situazione = document.getElementById('selectSituazione').value;
        const descrizione = document.getElementById('txtDescrizione').value;
        
        if (!situazione || !descrizione) {
            throw new Error('Situazione e descrizione sono campi obbligatori');
        }
        
        // Carica le descrizioni esistenti dal localStorage
        descrizioni = JSON.parse(localStorage.getItem('descrizioni') || '{}');
        
        // Inizializza l'array se non esiste
        if (!descrizioni[situazione]) {
            descrizioni[situazione] = [];
        }
        
        // Aggiungi la nuova descrizione
        descrizioni[situazione].push(descrizione);
        
        // Salva nel localStorage
        localStorage.setItem('descrizioni', JSON.stringify(descrizioni));
        
        // Aggiorna la visualizzazione
        mostraDescrizioniPerSituazione(situazione);
        
        // Pulisci il campo dopo il salvataggio
        document.getElementById('txtDescrizione').value = '';
        
        // Mostra un messaggio di successo
        alert('Descrizione salvata con successo!');
        
        // Crea backup dopo il salvataggio
        creaBackupCompresso();
        
        return true;
    } catch (error) {
        console.error('Errore durante il salvataggio della descrizione:', error);
        alert('Errore durante il salvataggio: ' + error.message);
        return false;
    }
}

// Funzione per mostrare le descrizioni di una situazione
function mostraDescrizioniPerSituazione(situazione) {
    const elencoDescrizioni = document.getElementById('elencoDescrizioni');
    const descrizioniSituazione = descrizioni[situazione] || [];
    
    elencoDescrizioni.innerHTML = descrizioniSituazione.map((desc, index) => `
        <div class="descrizione-item">
            <p>${desc}</p>
            <button onclick="eliminaDescrizione('${situazione}', ${index})" class="button">Elimina</button>
        </div>
    `).join('');
}

// Funzione per eliminare una descrizione
function eliminaDescrizione(situazione, index) {
    if (confirm('Sei sicuro di voler eliminare questa descrizione?')) {
        // Rimuovi la descrizione dall'array
        descrizioni[situazione].splice(index, 1);
        
        // Aggiorna il localStorage con le nuove descrizioni
        localStorage.setItem('descrizioni', JSON.stringify(descrizioni));
        
        // Aggiorna la visualizzazione
        mostraDescrizioniPerSituazione(situazione);
    }
}

// Funzione per ottenere una descrizione casuale per una situazione
function getDescrizioneCasuale(situazione) {
    const descrizioniSituazione = descrizioni[situazione];
    if (!descrizioniSituazione || descrizioniSituazione.length === 0) {
        return '';
    }
    const indice = Math.floor(Math.random() * descrizioniSituazione.length);
    return descrizioniSituazione[indice];
}

// Funzione per controllare se l'NPC è sconfitto
function isNPCSconfitto(npc, vitaResidua) {
    const vitaSconfitta = Math.floor(npc.vitaIniziale * 0.05);
    return vitaResidua <= vitaSconfitta;
}

// Modifica la funzione generaPost
function generaPost() {
    // Recupero tutti i valori input
    const npcNome = document.getElementById('selectNPC').value;
    const nomeGiocatore = document.getElementById('nomeGiocatore').value;
    const esitoAttaccoPrecedente = document.getElementById('esitoAttaccoPrecedente').value;
    const difesaNPC = parseInt(document.getElementById('difesaNPC').value);
    const attaccoNPC = parseInt(document.getElementById('attaccoNPC').value);
    const tenaciaDifesa = parseInt(document.getElementById('tenaciaDifesa').value);
    const tenaciaAttacco = parseInt(document.getElementById('tenaciaAttacco').value);
    const forzaAttacco = parseInt(document.getElementById('forzaAttacco').value);
    const velocitaAttacco = parseInt(document.getElementById('velocitaAttacco').value);
    const vitaResidua = parseInt(document.getElementById('vitaResidua').value);
    const ostinazioneDifesa = document.getElementById('ostinazioneDifesa').checked;
    const ostinazioneAttacco = document.getElementById('ostinazioneAttacco').checked;

    // Validazione input
    if (!npcNome) {
        alert('Seleziona un NPC');
        return;
    }

    // Controllo valori NaN
    if (isNaN(difesaNPC)) {
        alert('Inserisci un valore valido per la difesa NPC');
        return;
    }
    if (isNaN(attaccoNPC)) {
        alert('Inserisci un valore valido per l\'attacco NPC');
        return;
    }
    if (isNaN(tenaciaDifesa)) {
        alert('Inserisci un valore valido per la tenacia difesa');
        return;
    }
    if (isNaN(tenaciaAttacco)) {
        alert('Inserisci un valore valido per la tenacia attacco');
        return;
    }
    if (isNaN(forzaAttacco)) {
        alert('Inserisci un valore valido per la forza attacco');
        return;
    }
    if (isNaN(velocitaAttacco)) {
        alert('Inserisci un valore valido per la velocità attacco');
        return;
    }
    if (isNaN(vitaResidua)) {
        alert('Inserisci un valore valido per la vita residua');
        return;
    }

    // Validazione specifica per ogni campo numerico
    if (difesaNPC < 1 || difesaNPC > 5) {
        alert('La difesa NPC deve essere un numero tra 1 e 5');
        return;
    }

    if (attaccoNPC < 1 || attaccoNPC > 5) {
        alert('L\'attacco NPC deve essere un numero tra 1 e 5');
        return;
    }

    if (tenaciaDifesa < 1 || tenaciaDifesa > 100) {
        alert('La tenacia difesa deve essere un numero tra 1 e 100');
        return;
    }

    if (tenaciaAttacco < 1 || tenaciaAttacco > 100) {
        alert('La tenacia attacco deve essere un numero tra 1 e 100');
        return;
    }

    if (forzaAttacco < 1) {
        alert('La forza attacco deve essere maggiore di 0');
        return;
    }

    if (velocitaAttacco < 1) {
        alert('La velocità attacco deve essere maggiore di 0');
        return;
    }

    if (vitaResidua < 0) {
        alert('La vita residua non può essere negativa');
        return;
    }

    let testoGenerato = '';
    const npc = npcList.find(n => n.nome === npcNome);
    let difesa = 0;
    
    // Aggiungi il disclaimer
    testoGenerato += '[SPOILER] Risposta generata in modo semiautomatico senza controllo stretto dello Staff. In caso di problemi o dubbi contattare i Master [/SPOILER]\n\n';
    
    // Usa l'URL originale dell'immagine
    if (!npc) {
        alert('NPC non trovato');
        return;
    }
    
    testoGenerato += MINIATURA_POST.replace('IMMAGINE_URL', npc.imageUrl).replace('NOME_NPC', npc.nome) + '\n\n';

    // Gestione vittoria NPC
    if (esitoAttaccoPrecedente === 'vittoria_npc') {
        const descrizioneVittoria = getDescrizioneCasuale('vittoria_npc');
        testoGenerato += `${descrizioneVittoria}\n\n`;
        testoGenerato += ARBITRO_VITTORIA_NPC.replace('NOME_NPC', npc.nome);
        testoGenerato += '\nINCONTRO CONCLUSO';
        document.getElementById('generatedText').textContent = testoGenerato;
        return;
    }

    // Gestione fase difensiva
    const mossaDifensiva = npc.movesetDifensivo[difesaNPC - 1];
    const descrizioneOriginale = mossaDifensiva.descrizione;

    // Tratta la mossa come schivata se è la quinta mossa o se è marcata come speciale
    if (difesaNPC === 5 || descrizioneOriginale.startsWith('€')) {
        // Gestisci diversamente la difesa 5 e le mosse speciali
        const schivataRiuscita = npc.riflessi >= velocitaAttacco && npc.destrezza >= velocitaAttacco;
        
        if (schivataRiuscita) {
            testoGenerato += `${npc.nome} schiva l'attacco\n\n`;
            testoGenerato += `[QUOTE]\n`;
            testoGenerato += `Riflessi (${npc.riflessi}) e Destrezza (${npc.destrezza}) maggiori o uguali di Velocità attacco (${velocitaAttacco}): Schivata riuscita\n`;
            testoGenerato += `[/QUOTE]\n\n`;
            
            // Gestione fase offensiva dopo schivata riuscita
            const mossaOffensiva = npc.movesetOffensivo[attaccoNPC - 1];
            testoGenerato += mossaOffensiva.descrizione + '\n\n';
            testoGenerato += `[QUOTE]\n`;
            testoGenerato += `Fase offensiva\n`;
            let forzaBase = mossaOffensiva.valore + (tenaciaAttacco * 5);
            let attacco = forzaBase;

            if (ostinazioneAttacco) {
                attacco = Math.floor(forzaBase * 1.5);
                testoGenerato += `Forza base = ${mossaOffensiva.valore}\n`;
                testoGenerato += `Attacco = (${mossaOffensiva.valore} + (${tenaciaAttacco} * 5)) * 1.5 (Bonus ostinazione) = ${attacco}\n`;
                let velocitaFinale = npc.velocita * 3;
                testoGenerato += `Velocità = ${npc.velocita} * 3 (Bonus ostinazione) = ${velocitaFinale} [/QUOTE]`;
            } else {
                testoGenerato += `Forza base = ${mossaOffensiva.valore}\n`;
                testoGenerato += `Attacco = ${mossaOffensiva.valore} + (${tenaciaAttacco} * 5) = ${attacco}\n`;
                testoGenerato += `Velocità = ${npc.velocita} [/QUOTE]`;
            }
        } else {
            testoGenerato += `${npc.nome} cerca di schivare l'attacco, senza riuscirci\n\n`;
            testoGenerato += `[QUOTE]\n`;
            testoGenerato += `Fase difensiva\n`;
            testoGenerato += `Riflessi (${npc.riflessi}) e/o Destrezza (${npc.destrezza}) minori di Velocità attacco (${velocitaAttacco}): Schivata fallita\n`;
            
            if (ostinazioneDifesa) {
                difesa = Math.floor(mossaDifensiva.valore * 0.5);
                testoGenerato += `Resistenza base = ${mossaDifensiva.valore}\n`;
                testoGenerato += `Difesa = ${mossaDifensiva.valore} * 0.5 (Malus ostinazione) = ${difesa}\n`;
            } else {
                difesa = mossaDifensiva.valore;
                testoGenerato += `Resistenza base = ${mossaDifensiva.valore}\n`;
                testoGenerato += `Difesa = ${mossaDifensiva.valore} = ${difesa}\n`;
            }
            
            const dannoSubito = Math.max(0, forzaAttacco - difesa);
            const vitaDopoAttacco = Math.max(0, vitaResidua - dannoSubito);
            
            testoGenerato += `Danno subito = ${forzaAttacco} - ${difesa} = ${dannoSubito}\n`;
            testoGenerato += `Vita residua = ${vitaResidua} - ${dannoSubito} = ${vitaDopoAttacco} [/QUOTE]\n\n`;

            // Controllo sconfitta NPC
            if (isNPCSconfitto(npc, vitaDopoAttacco)) {
                if (!nomeGiocatore) {
                    alert('Inserisci il nome del giocatore per generare il messaggio di vittoria');
                    return;
                }
                const descrizioneSconfitta = getDescrizioneCasuale('sconfitta_npc');
                if (descrizioneSconfitta) {
                    testoGenerato += `${descrizioneSconfitta}\n\n`;
                }
                testoGenerato += ARBITRO_VITTORIA_GIOCATORE.replace('NOME_GIOCATORE', nomeGiocatore);
                testoGenerato += '\nINCONTRO CONCLUSO';
                document.getElementById('generatedText').textContent = testoGenerato;
                return;
            }

            // Gestione fase offensiva dopo schivata fallita
            const mossaOffensiva = npc.movesetOffensivo[attaccoNPC - 1];
            testoGenerato += mossaOffensiva.descrizione + '\n\n';
            testoGenerato += `[QUOTE]\n`;
            testoGenerato += `Fase offensiva\n`;
            let forzaBase = mossaOffensiva.valore + (tenaciaAttacco * 5);
            let attacco = forzaBase;

            if (ostinazioneAttacco) {
                attacco = Math.floor(forzaBase * 1.5);
                testoGenerato += `Forza base = ${mossaOffensiva.valore}\n`;
                testoGenerato += `Attacco = (${mossaOffensiva.valore} + (${tenaciaAttacco} * 5)) * 1.5 (Bonus ostinazione) = ${attacco}\n`;
                let velocitaFinale = npc.velocita * 3;
                testoGenerato += `Velocità = ${npc.velocita} * 3 (Bonus ostinazione) = ${velocitaFinale} [/QUOTE]`;
            } else {
                testoGenerato += `Forza base = ${mossaOffensiva.valore}\n`;
                testoGenerato += `Attacco = ${mossaOffensiva.valore} + (${tenaciaAttacco} * 5) = ${attacco}\n`;
                testoGenerato += `Velocità = ${npc.velocita} [/QUOTE]`;
            }
        }
    } else {
        // Gestione normale della difesa
        testoGenerato += mossaDifensiva.descrizione + '\n\n';
        testoGenerato += `[QUOTE]\n`;
        testoGenerato += `Fase difensiva\n`;
        
        let resistenzaBase = mossaDifensiva.valore + (tenaciaDifesa * 5);
        
        if (ostinazioneDifesa) {
            difesa = Math.floor(resistenzaBase * 0.5);
            testoGenerato += `Resistenza base = ${mossaDifensiva.valore}\n`;
            testoGenerato += `Difesa = (${mossaDifensiva.valore} + (${tenaciaDifesa} * 5)) * 0.5 (Malus ostinazione) = ${difesa}\n`;
        } else {
            difesa = resistenzaBase;
            testoGenerato += `Resistenza base = ${mossaDifensiva.valore}\n`;
            testoGenerato += `Difesa = ${mossaDifensiva.valore} + (${tenaciaDifesa} * 5) = ${difesa}\n`;
        }
        
        const dannoSubito = Math.max(0, forzaAttacco - difesa);
        const vitaDopoAttacco = Math.max(0, vitaResidua - dannoSubito);
        
        testoGenerato += `Danno subito = ${forzaAttacco} - ${difesa} = ${dannoSubito}\n`;
        testoGenerato += `Vita residua = ${vitaResidua} - ${dannoSubito} = ${vitaDopoAttacco} [/QUOTE]\n\n`;

        // Controllo sconfitta NPC
        if (isNPCSconfitto(npc, vitaDopoAttacco)) {
            if (!nomeGiocatore) {
                alert('Inserisci il nome del giocatore per generare il messaggio di vittoria');
                return;
            }
            const descrizioneSconfitta = getDescrizioneCasuale('sconfitta_npc');
            if (descrizioneSconfitta) {
                testoGenerato += `${descrizioneSconfitta}\n\n`;
            }
            testoGenerato += ARBITRO_VITTORIA_GIOCATORE.replace('NOME_GIOCATORE', nomeGiocatore);
            testoGenerato += '\nINCONTRO CONCLUSO';
            document.getElementById('generatedText').textContent = testoGenerato;
            return;
        }

        // Aggiungi la fase offensiva
        const mossaOffensiva = npc.movesetOffensivo[attaccoNPC - 1];
        testoGenerato += mossaOffensiva.descrizione + '\n\n';
        testoGenerato += `[QUOTE]\n`;
        testoGenerato += `Fase offensiva\n`;
        let forzaBase = mossaOffensiva.valore + (tenaciaAttacco * 5);
        let attacco = forzaBase;

        if (ostinazioneAttacco) {
            attacco = Math.floor(forzaBase * 1.5);
            testoGenerato += `Forza base = ${mossaOffensiva.valore}\n`;
            testoGenerato += `Attacco = (${mossaOffensiva.valore} + (${tenaciaAttacco} * 5)) * 1.5 (Bonus ostinazione) = ${attacco}\n`;
            let velocitaFinale = npc.velocita * 3;
            testoGenerato += `Velocità = ${npc.velocita} * 3 (Bonus ostinazione) = ${velocitaFinale} [/QUOTE]`;
        } else {
            testoGenerato += `Forza base = ${mossaOffensiva.valore}\n`;
            testoGenerato += `Attacco = ${mossaOffensiva.valore} + (${tenaciaAttacco} * 5) = ${attacco}\n`;
            testoGenerato += `Velocità = ${npc.velocita} [/QUOTE]`;
        }
    }

    // Mostra il testo generato
    document.getElementById('generatedText').textContent = testoGenerato;
}

// Funzioni per i modal
function mostraModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function nascondiModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Funzione per aggiornare tutte le tendine NPC
function aggiornaTutteLeTendine() {
    popolaSelectNPC('npc');
    popolaSelectNPC('incontro');
}

// Funzione per mostrare l'NPC selezionato
function mostraNPCSelezionato() {
    const npcDetailContainer = document.getElementById('npcDetailContainer');
    const deleteButtonContainer = document.getElementById('deleteButtonContainer');
    const selectedValue = document.getElementById('npcSelector').value;

    // Pulisce il container del pulsante di cancellazione
    deleteButtonContainer.innerHTML = '';

    if (selectedValue === '') {
        npcDetailContainer.innerHTML = '';
        return;
    }

    const npc = npcList.find(n => n.nome === selectedValue);
    if (!npc) return;
    
    // Aggiunge il pulsante di cancellazione
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = `Cancella ${npc.nome}`;
    deleteButton.onclick = () => confermaCancellazione(npc.nome);
    deleteButtonContainer.appendChild(deleteButton);

    const npcElement = document.createElement('div');
    npcElement.className = 'npc-card';
    
    // Crea la miniatura HTML
    const miniaturaHTML = `
        <div class="miniatura-npc">
            <div class="avatar" style="background-image: url('${npc.imageUrl}')"></div>
            <div class="nome-personaggio">${npc.nome}</div>
        </div>
    `;
    
    npcElement.innerHTML = `
        <div class="npc-header">
            ${miniaturaHTML}
            <div class="npc-info">
                <h3>${npc.pianoArenaCeleste}° ${npc.nome}</h3>
                <p><strong>Statistiche Base:</strong></p>
                <p>Vita Iniziale: ${npc.vitaIniziale}</p>
                <p>Destrezza: ${npc.destrezza}</p>
                <p>Velocità: ${npc.velocita}</p>
                <p>Riflessi: ${npc.riflessi}</p>
            </div>
        </div>
        <div class="npc-controls">
            <div class="control-group">
                <button onclick="toggleMoveset('${selectedValue}')">Moveset</button>
                <div id="moveset-${selectedValue}" class="moveset-content" style="display: none;">
                    <div class="moveset-section">
                        <h4>Moveset Difensivo</h4>
                        ${npc.movesetDifensivo.map((mossa, i) => `
                            <div class="mossa-item">
                                <strong>Mossa ${i + 1}</strong><br>
                                Descrizione: ${mossa.descrizione}<br>
                                ${i + 1 === 5 ? 
                                    `Se schivata possibile: Schiva l'attacco<br>
                                    Se schivata non possibile: Resistenza base ${mossa.valore} (senza bonus tenacia)` :
                                    `Formula: ${mossa.valore} + (Tenacia Difesa * 5)`
                                }<br>
                                Resistenza base: ${mossa.valore}
                            </div>
                        `).join('')}
                    </div>
                    <div class="moveset-section">
                        <h4>Moveset Offensivo</h4>
                        ${npc.movesetOffensivo.map((mossa, i) => `
                            <div class="mossa-item">
                                <strong>Mossa ${i + 1}</strong><br>
                                Descrizione: ${mossa.descrizione}<br>
                                Formula: ${mossa.valore} + (Tenacia Attacco * 5)<br>
                                Forza base: ${mossa.valore}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    npcDetailContainer.innerHTML = '';
    npcDetailContainer.appendChild(npcElement);
}

// Funzioni per mostrare/nascondere moveset
function toggleMoveset(index) {
    const movesetDiv = document.getElementById(`moveset-${index}`);
    movesetDiv.style.display = movesetDiv.style.display === 'none' ? 'block' : 'none';
}

function confermaCancellazione(nomeNPC) {
    // Prima conferma
    if (!confirm(`Sei sicuro di voler cancellare l'NPC "${nomeNPC}"?`)) {
        return;
    }

    // Seconda conferma
    if (!confirm(`ATTENZIONE: Questa azione è irreversibile!\nConfermi di voler cancellare definitivamente l'NPC "${nomeNPC}"?`)) {
        return;
    }

    // Procede con la cancellazione
    cancellaNPC(nomeNPC);
}

function cancellaNPC(nomeNPC) {
    const npcIndex = npcList.findIndex(npc => npc.nome === nomeNPC);
    if (npcIndex !== -1) {
        // Rimuove l'NPC dalla lista
        npcList.splice(npcIndex, 1);
        
        // Aggiorna il localStorage
        localStorage.setItem('npcList', JSON.stringify(npcList));
        
        // Aggiorna la visualizzazione nella pagina NPC
        popolaSelectNPC('npc');  // Aggiorna il selettore nella pagina NPC
        popolaSelectNPC('incontro');  // Aggiorna il selettore nella pagina incontro
        
        document.getElementById('npcSelector').value = '';
        document.getElementById('npcDetailContainer').innerHTML = '';
        document.getElementById('deleteButtonContainer').innerHTML = '';
        
        alert(`L'NPC "${nomeNPC}" è stato cancellato con successo.`);
    }
}

// Aggiungi questi stili CSS
const newStyles = `
.delete-button {
    background-color: #dc3545;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.delete-button:hover {
    background-color: #c82333;
}

.complementi-list {
    margin-top: 10px;
}

.complemento-item {
    background-color: #f8f9fa;
    padding: 8px 12px;
    margin-bottom: 8px;
    border-radius: 4px;
    border: 1px solid #ddd;
}
`;

// Aggiungi gli stili al documento
const styleSheet = document.createElement("style");
styleSheet.textContent = newStyles;
document.head.appendChild(styleSheet);

// Funzione per inizializzare il form del moveset
function inizializzaFormMoveset(tipo) {
    const container = document.getElementById(`moveset${tipo}`);
    if (!container) return;

    container.innerHTML = '';
    
    // Aggiungi 5 campi per le mosse
    for (let i = 1; i <= 5; i++) {
        const moveDiv = document.createElement('div');
        moveDiv.className = 'mossa-item';
        
        const label = document.createElement('label');
        label.textContent = `Mossa ${i}:`;
        
        const descInput = document.createElement('input');
        descInput.type = 'text';
        descInput.className = 'mossa-desc';
        descInput.required = true;
        descInput.placeholder = tipo === 'Difensivo' ? 'Resistenza' : 'Forza';
        
        const valInput = document.createElement('input');
        valInput.type = 'number';
        valInput.className = 'mossa-val';
        valInput.required = true;
        valInput.min = '0';
        valInput.placeholder = tipo === 'Difensivo' ? 'Resistenza' : 'Forza';
        
        moveDiv.appendChild(label);
        moveDiv.appendChild(descInput);
        moveDiv.appendChild(valInput);
        
        container.appendChild(moveDiv);
    }
}

// Funzione per aprire il modal di creazione NPC
function apriModalCreaNPC() {
    // Inizializza i form dei moveset
    inizializzaFormMoveset('Difensivo');
    inizializzaFormMoveset('Offensivo');
    
    // Mostra il modal
    document.getElementById('creaNPCModal').style.display = 'block';
    
    // Aggiungi event listener per la chiusura del modal
    const modal = document.getElementById('creaNPCModal');
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        };
    }
    
    // Chiudi il modal cliccando fuori
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

// Funzioni per la gestione della versione (desktop/mobile)
function initVersionManager() {
    // Controlla se c'è una preferenza salvata
    const isMobile = localStorage.getItem('isMobileVersion') === 'true';
    
    // Applica la versione corretta all'avvio
    setMobileVersion(isMobile);
    
    // Aggiungi event listeners ai pulsanti
    const switchToDesktop = document.getElementById('switchToDesktop');
    const switchToMobile = document.getElementById('switchToMobile');
    
    if (switchToDesktop) {
        switchToDesktop.addEventListener('click', () => {
            setMobileVersion(false);
        });
    }
    
    if (switchToMobile) {
        switchToMobile.addEventListener('click', () => {
            setMobileVersion(true);
        });
    }
}

// Funzione per impostare la versione mobile/desktop
function setMobileVersion(isMobile) {
    if (isMobile) {
        document.documentElement.classList.add('mobile-version');
        document.body.classList.add('mobile-version');
    } else {
        document.documentElement.classList.remove('mobile-version');
        document.body.classList.remove('mobile-version');
    }
    localStorage.setItem('isMobileVersion', isMobile);
    
    // Aggiorna la visualizzazione dei pulsanti
    const switchToDesktop = document.getElementById('switchToDesktop');
    const switchToMobile = document.getElementById('switchToMobile');
    
    if (switchToDesktop) switchToDesktop.style.display = isMobile ? 'block' : 'none';
    if (switchToMobile) switchToMobile.style.display = isMobile ? 'none' : 'block';
    
    // Forza il ridimensionamento della pagina per applicare correttamente i layout
    window.dispatchEvent(new Event('resize'));
}

// Modifica la funzione window.onload per includere l'inizializzazione del version manager
window.onload = async function() {
    inizializzaNPCList();
    inizializzaEsempiDescrizioni();
    initVersionManager();
    
    // Carica le descrizioni dal localStorage
    const descrizioniSalvate = localStorage.getItem('descrizioni');
    if (descrizioniSalvate) {
        descrizioni = JSON.parse(descrizioniSalvate);
    }
    
    const selectNPC = document.getElementById('selectNPC');
    const npcSelector = document.getElementById('npcSelector');
    
    if (selectNPC) {
        popolaSelectNPC('incontro');
    }
    if (npcSelector) {
        popolaSelectNPC('npc');
    }

    // Gestione del pulsante Crea NPC
    const btnCreaNPC = document.getElementById('btnCreaNPC');
    if (btnCreaNPC) {
        btnCreaNPC.addEventListener('click', apriModalCreaNPC);
    }

    // Gestione del form di creazione NPC
    const formCreaNPC = document.getElementById('formCreaNPC');
    if (formCreaNPC) {
        formCreaNPC.addEventListener('submit', function(event) {
            event.preventDefault();
            creaNuovoNPC(event);
        });
    }

    // Gestione del caricamento immagini
    const urlOption = document.getElementById('urlOption');
    const fileOption = document.getElementById('fileOption');
    const urlMiniatura = document.getElementById('urlMiniatura');
    const fileMiniatura = document.getElementById('fileMiniatura');
    const previewContainer = document.getElementById('preview-container');
    const miniaturaPreview = document.getElementById('miniatura-preview');

    if (urlOption && fileOption && urlMiniatura && fileMiniatura) {
        urlOption.addEventListener('change', function() {
            urlMiniatura.disabled = false;
            fileMiniatura.disabled = true;
        });

        fileOption.addEventListener('change', function() {
            urlMiniatura.disabled = true;
            fileMiniatura.disabled = false;
        });

        urlMiniatura.addEventListener('input', function() {
            if (this.value) {
                previewContainer.style.display = 'block';
                miniaturaPreview.src = this.value;
            } else {
                previewContainer.style.display = 'none';
            }
        });

        fileMiniatura.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewContainer.style.display = 'block';
                    miniaturaPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Aggiungi event listener per i pulsanti nella pagina role.html
    const btnNuovaDescrizione = document.getElementById('btnNuovaDescrizione');
    const btnDescrizioniPresenti = document.getElementById('btnDescrizioniPresenti');
    const formNuovaDescrizione = document.getElementById('formNuovaDescrizione');
    const descrizioniPresenti = document.getElementById('descrizioniPresenti');

    if (btnNuovaDescrizione && btnDescrizioniPresenti) {
        btnNuovaDescrizione.addEventListener('click', function() {
            formNuovaDescrizione.style.display = 'block';
            descrizioniPresenti.style.display = 'none';
        });

        btnDescrizioniPresenti.addEventListener('click', function() {
            formNuovaDescrizione.style.display = 'none';
            descrizioniPresenti.style.display = 'block';
            // Mostra le descrizioni per la situazione selezionata
            const situazioneSelezionata = document.getElementById('selectSituazioneEsistente').value;
            mostraDescrizioniPerSituazione(situazioneSelezionata);
        });

        // Aggiungi event listener per il cambio di situazione
        document.getElementById('selectSituazioneEsistente').addEventListener('change', function(e) {
            mostraDescrizioniPerSituazione(e.target.value);
        });

        // Aggiungi event listener per il pulsante salva
        document.getElementById('btnSalvaDescrizione').addEventListener('click', salvaDescrizione);
    }

    // Aggiungi event listener per il pulsante Carica NPC
    const btnCaricaNPC = document.getElementById('btnCaricaNPC');
    const inputFile = document.getElementById('caricaNPC');
    
    if (btnCaricaNPC && inputFile) {
        btnCaricaNPC.addEventListener('click', function() {
            inputFile.click();
        });
        
        inputFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                caricaNPCDaFile(file);
            }
        });
    }
};

// Funzione per validare URL immagine
async function validaURLImmagine(url) {
    return new Promise((resolve) => {
        // Verifica se l'URL è un'immagine base64
        if (url.startsWith('data:image/')) {
            resolve(true);
            return;
        }

        // Verifica se l'URL è un blob
        if (url.startsWith('blob:')) {
            resolve(true);
            return;
        }

        // Per gli URL esterni, prova a caricare l'immagine
        const img = new Image();
        img.onload = () => {
            resolve(true);
        };
        img.onerror = () => {
            console.error('Errore nel caricamento dell\'immagine:', url);
            resolve(false);
        };
        img.src = url;

        // Timeout di sicurezza dopo 5 secondi
        setTimeout(() => {
            resolve(false);
        }, 5000);
    });
}

// Funzione per comprimere l'immagine
function comprimiImmagine(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Ridimensiona se l'immagine è troppo grande
                const MAX_SIZE = 800;
                if (width > MAX_SIZE || height > MAX_SIZE) {
                    if (width > height) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    } else {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Comprimi come JPEG con qualità 0.8
                canvas.toBlob(resolve, 'image/jpeg', 0.8);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Funzione per validare un'immagine
async function validaImmagine(file) {
    return new Promise((resolve, reject) => {
        if (!IMAGE_CONSTRAINTS.allowedTypes.includes(file.type)) {
            reject(new Error('Tipo di file non supportato. Usa JPG, PNG o GIF.'));
            return;
        }

        if (file.size > IMAGE_CONSTRAINTS.maxSize) {
            reject(new Error('L\'immagine è troppo grande. Massimo 5MB.'));
            return;
        }

        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(img.src);
            if (img.width > IMAGE_CONSTRAINTS.maxWidth || img.height > IMAGE_CONSTRAINTS.maxHeight) {
                reject(new Error(`L'immagine è troppo grande. Dimensioni massime: ${IMAGE_CONSTRAINTS.maxWidth}x${IMAGE_CONSTRAINTS.maxHeight}px`));
                return;
            }
            resolve(true);
        };
        img.onerror = () => {
            URL.revokeObjectURL(img.src);
            reject(new Error('Immagine non valida o corrotta.'));
        };
        img.src = URL.createObjectURL(file);
    });
}

// Funzione per ottimizzare un'immagine
async function ottimizzaImmagine(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                // Ridimensiona se necessario
                if (width > IMAGE_CONSTRAINTS.maxWidth || height > IMAGE_CONSTRAINTS.maxHeight) {
                    const ratio = Math.min(
                        IMAGE_CONSTRAINTS.maxWidth / width,
                        IMAGE_CONSTRAINTS.maxHeight / height
                    );
                    width *= ratio;
                    height *= ratio;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Converti in Blob
                canvas.toBlob(
                    (blob) => resolve(blob),
                    'image/jpeg',
                    IMAGE_CONSTRAINTS.quality
                );
            };
            img.onerror = () => reject(new Error('Errore durante l\'ottimizzazione dell\'immagine'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Errore durante la lettura del file'));
        reader.readAsDataURL(file);
    });
}

// Funzione per gestire il caricamento di un'immagine
async function gestisciCaricamentoImmagine(file) {
    try {
        await validaImmagine(file);
        const imageBlobOttimizzata = await ottimizzaImmagine(file);
        return URL.createObjectURL(imageBlobOttimizzata);
    } catch (error) {
        throw new Error(`Errore durante il caricamento dell'immagine: ${error.message}`);
    }
}

// Modifica la funzione creaNuovoNPC
async function creaNuovoNPC(event) {
    event.preventDefault();
    
    try {
        const formData = new FormData(event.target);
        const npc = {
            nome: formData.get('nome'),
            pianoArenaCeleste: parseInt(formData.get('pianoArenaCeleste')),
            vitaIniziale: parseInt(formData.get('vitaIniziale')),
            destrezza: parseInt(formData.get('destrezza')),
            velocita: parseInt(formData.get('velocita')),
            riflessi: parseInt(formData.get('riflessi')),
            movesetOffensivo: [],
            movesetDifensivo: []
        };

        // Gestione delle mosse offensive
        for (let i = 1; i <= 5; i++) {
            const descrizione = formData.get(`mossaOffensiva${i}`);
            const valore = parseInt(formData.get(`valoreOffensivo${i}`));
            if (descrizione && valore) {
                npc.movesetOffensivo.push(new Mossa(descrizione, valore));
            }
        }

        // Gestione delle mosse difensive
        for (let i = 1; i <= 5; i++) {
            const descrizione = formData.get(`mossaDifensiva${i}`);
            const valore = parseInt(formData.get(`valoreDifensivo${i}`));
            if (descrizione && valore) {
                npc.movesetDifensivo.push(new Mossa(descrizione, valore));
            }
        }

        // Gestione dell'immagine
        const immagineInput = document.getElementById('immagineNPC');
        let immagineUrl = formData.get('immagineURL');

        if (immagineInput.files.length > 0) {
            const file = immagineInput.files[0];
            if (file.size > IMAGE_CONSTRAINTS.maxSize) {
                throw new Error('L\'immagine è troppo grande. Dimensione massima: 5MB');
            }
            if (!IMAGE_CONSTRAINTS.allowedTypes.includes(file.type)) {
                throw new Error('Formato immagine non supportato. Usa JPG, PNG o GIF');
            }
            immagineUrl = URL.createObjectURL(file);
        }

        // Valida l'immagine
        try {
            const isValid = await validaImmagineCaricata(immagineUrl);
            if (!isValid) {
                throw new Error('URL immagine non valido');
            }
        } catch (error) {
            console.error(`Errore nella validazione dell'immagine per l'NPC ${npc.nome}:`, error);
            alert('L\'URL dell\'immagine non è valido. Inserisci un URL valido che inizi con http:// o https://');
            return false;
        }

        // Crea la miniatura
        npc.miniatura = MINIATURA_BASE.replace('IMMAGINE_URL', immagineUrl).replace('NOME_NPC', npc.nome);
        npc.imageUrl = immagineUrl;
        
        // Salvataggio
        npcList.push(npc);
        localStorage.setItem('npcList', JSON.stringify(npcList));
        
        // Crea backup dopo la creazione
        creaBackupCompresso();
        
        // Esporta l'NPC in formato txt
        await esportaNPC(npc);
        
        // Reset form e UI update
        document.getElementById('formCreaNPC').reset();
        document.getElementById('preview-container').style.display = 'none';
        nascondiModal('creaNPCModal');
        popolaSelectNPC();
        
        alert('NPC creato e salvato con successo!');
        return true;
    } catch (error) {
        console.error('Errore durante la creazione dell\'NPC:', error);
        alert('Errore durante la creazione: ' + error.message);
        return false;
    }
}

// Funzione per validare un'immagine
async function validaImmagineCaricata(url) {
    return new Promise((resolve) => {
        // Se è un blob URL, considera l'immagine valida
        if (url.startsWith('blob:')) {
            resolve(true);
            return;
        }

        // Se è un'immagine base64, considera l'immagine valida
        if (url.startsWith('data:image/')) {
            resolve(true);
            return;
        }

        // Per gli URL esterni, verifica che sia un URL valido
        if (url.startsWith('http://') || url.startsWith('https://')) {
            resolve(true);
            return;
        }

        // Se non è un URL valido, considera l'immagine non valida
        resolve(false);
    });
}

// Funzione per caricare un NPC da file
async function caricaNPCDaFile(event) {
    const files = event.target.files;
    if (!files || files.length === 0) {
        console.log('Nessun file selezionato');
        return;
    }

    try {
        // Carica la lista NPC esistente
        let npcList = JSON.parse(localStorage.getItem('npcList') || '[]');
        
        // Processa tutti i file in parallelo
        const processPromises = Array.from(files).map(async (file) => {
            try {
                console.log('Elaborazione file:', file.name);
                const contenuto = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = (e) => reject(e);
                    reader.readAsText(file);
                });

                console.log('Contenuto file letto:', contenuto.substring(0, 100) + '...');

                const lines = contenuto.split('\n');
                let npc = {};
                let currentSection = null;

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) continue;

                    // Estrai le informazioni dal file
                    if (trimmedLine.startsWith('Nome:')) {
                        npc.nome = trimmedLine.replace('Nome:', '').trim();
                    } else if (trimmedLine.startsWith('Piano Arena Celeste:')) {
                        npc.pianoArenaCeleste = parseInt(trimmedLine.replace('Piano Arena Celeste:', '').trim());
                    } else if (trimmedLine.startsWith('Vita Iniziale:')) {
                        npc.vitaIniziale = parseInt(trimmedLine.replace('Vita Iniziale:', '').trim());
                    } else if (trimmedLine.startsWith('Destrezza:')) {
                        npc.destrezza = parseInt(trimmedLine.replace('Destrezza:', '').trim());
                    } else if (trimmedLine.startsWith('Velocità:')) {
                        npc.velocita = parseInt(trimmedLine.replace('Velocità:', '').trim());
                    } else if (trimmedLine.startsWith('Riflessi:')) {
                        npc.riflessi = parseInt(trimmedLine.replace('Riflessi:', '').trim());
                    } else if (trimmedLine.startsWith('Miniatura:')) {
                        const miniaturaUrl = trimmedLine.replace('Miniatura:', '').trim();
                        // Salva l'URL dell'immagine e crea la miniatura
                        npc.imageUrl = miniaturaUrl;
                        npc.miniatura = MINIATURA_BASE.replace('IMMAGINE_URL', miniaturaUrl).replace('NOME_NPC', npc.nome);
                        console.log('URL miniatura caricato:', miniaturaUrl);
                    } else if (trimmedLine === 'Mosse Offensive:') {
                        currentSection = 'offensive';
                        npc.movesetOffensivo = [];
                    } else if (trimmedLine === 'Mosse Difensive:') {
                        currentSection = 'difensive';
                        npc.movesetDifensivo = [];
                    } else if (trimmedLine.startsWith('-') && currentSection) {
                        const mossaMatch = trimmedLine.match(/- (.*?) \((\d+)\)/);
                        if (mossaMatch) {
                            const [_, descrizione, valore] = mossaMatch;
                            const mossa = new Mossa(descrizione.trim(), parseInt(valore));
                            if (currentSection === 'offensive') {
                                npc.movesetOffensivo.push(mossa);
                            } else {
                                npc.movesetDifensivo.push(mossa);
                            }
                        }
                    }
                }

                // Verifica che l'NPC sia valido
                if (!npc.nome || !npc.pianoArenaCeleste || !npc.vitaIniziale || 
                    !npc.destrezza || !npc.velocita || !npc.riflessi || 
                    !npc.miniatura || !npc.movesetOffensivo || !npc.movesetDifensivo) {
                    throw new Error(`File ${file.name} non contiene tutti i dati necessari per l'NPC`);
                }

                // Verifica se l'NPC esiste già
                const existingIndex = npcList.findIndex(n => n.nome === npc.nome);
                if (existingIndex !== -1) {
                    if (confirm(`Un NPC con il nome "${npc.nome}" esiste già. Vuoi sovrascriverlo?`)) {
                        npcList[existingIndex] = npc;
                        console.log('NPC sovrascritto:', npc.nome);
                    }
                } else {
                    npcList.push(npc);
                    console.log('Nuovo NPC aggiunto:', npc.nome);
                }
            } catch (error) {
                console.error(`Errore nel caricamento del file ${file.name}:`, error);
                alert(`Errore nel caricamento del file ${file.name}: ${error.message}`);
            }
        });

        // Attendi che tutti i file siano processati
        await Promise.all(processPromises);

        // Aggiorna la lista globale e il localStorage
        window.npcList = npcList;
        localStorage.setItem('npcList', JSON.stringify(npcList));

        // Aggiorna il selettore
        const npcSelector = document.getElementById('npcSelector');
        if (npcSelector) {
            npcSelector.innerHTML = '<option value="">Seleziona un NPC</option>';
            npcList.forEach(npc => {
                const option = document.createElement('option');
                option.value = npc.nome;
                option.textContent = npc.nome;
                npcSelector.appendChild(option);
            });

            // Se c'è almeno un NPC, seleziona il primo
            if (npcList.length > 0) {
                npcSelector.value = npcList[0].nome;
                mostraNPCSelezionato();
            }
        }

        alert('NPC caricati con successo!');
    } catch (error) {
        console.error('Errore nel caricamento degli NPC:', error);
        alert('Errore nel caricamento degli NPC: ' + error.message);
    }
}

// Funzione per creare un backup compresso
function creaBackupCompresso() {
    try {
        const data = {
            npcList: npcList,
            descrizioni: JSON.parse(localStorage.getItem('descrizioni')),
            timestamp: new Date().toISOString()
        };
        
        // Comprimi i dati
        const compressedData = JSON.stringify(data);
        
        // Salva il backup con timestamp
        const backupKey = `backup_${data.timestamp}`;
        localStorage.setItem(backupKey, compressedData);
        
        // Mantieni solo gli ultimi 5 backup
        const backupKeys = Object.keys(localStorage)
            .filter(key => key.startsWith('backup_'))
            .sort()
            .reverse();
            
        if (backupKeys.length > 5) {
            backupKeys.slice(5).forEach(key => localStorage.removeItem(key));
        }
        
        console.log('Backup creato con successo:', backupKey);
        return true;
    } catch (error) {
        console.error('Errore durante la creazione del backup:', error);
        return false;
    }
}