<?php
// Configurazione del logging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'npc_errors.log');

// Imposta gli header CORS e di sicurezza
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");
header("Content-Security-Policy: default-src 'self'");

// Funzione per sanitizzare input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Funzione per il logging degli errori
function logError($message, $context = []) {
    $logMessage = date('[Y-m-d H:i:s] ') . $message . ': ' . json_encode($context) . "\n";
    error_log($logMessage, 3, 'npc_errors.log');
}

// Funzione per rispondere con errori in formato JSON
function rispondiErrore($messaggio, $codice = 400) {
    http_response_code($codice);
    logError('Errore API', ['messaggio' => $messaggio, 'codice' => $codice]);
    echo json_encode(['status' => 'error', 'message' => $messaggio]);
    exit;
}

// Verifica il metodo della richiesta
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    rispondiErrore('Metodo non consentito', 405);
}

// Verifica Content-Type
if (!isset($_SERVER["CONTENT_TYPE"]) || strpos($_SERVER["CONTENT_TYPE"], "application/x-www-form-urlencoded") !== 0) {
    rispondiErrore('Content-Type non valido', 415);
}

// Verifica che i dati necessari siano presenti
if (!isset($_POST['npcCode']) || !isset($_POST['npcName'])) {
    rispondiErrore('Dati mancanti', 400);
}

// Sanitizza e valida i dati in input
$npcName = sanitizeInput($_POST['npcName']);
$npcCode = $_POST['npcCode'];

// Validazione del nome NPC
if (!preg_match('/^[a-zA-Z0-9][a-zA-Z0-9_\s-]{2,30}$/', $npcName)) {
    rispondiErrore('Nome NPC non valido. Usa solo lettere, numeri, spazi, trattini e underscore (3-30 caratteri).', 400);
}

// Validazione della lunghezza del codice NPC
if (strlen($npcCode) > 50000) {
    rispondiErrore('Il codice NPC è troppo lungo', 400);
}

// Validazione del JSON
$decodedNPC = json_decode($npcCode);
if (json_last_error() !== JSON_ERROR_NONE) {
    rispondiErrore('Il codice NPC non è in formato JSON valido: ' . json_last_error_msg(), 400);
}

try {
    // Directory per i file NPC
    $npcDirectory = 'npc_files/';
    
    // Verifica e crea la directory se non esiste
    if (!file_exists($npcDirectory)) {
        if (!mkdir($npcDirectory, 0755, true)) {
            throw new Exception('Impossibile creare la directory per gli NPC');
        }
    }

    // Verifica i permessi della directory
    if (!is_writable($npcDirectory)) {
        throw new Exception('Directory NPC non scrivibile');
    }

    // Sanitizza il nome del file
    $fileName = $npcDirectory . preg_replace('/[^a-zA-Z0-9_-]/', '_', $npcName) . '.txt';
    
    // Verifica se il file esiste già
    if (file_exists($fileName)) {
        if (!is_writable($fileName)) {
            throw new Exception('File esistente non modificabile');
        }
    }

    // Salva il file con controllo errori
    if (file_put_contents($fileName, $npcCode) === false) {
        throw new Exception('Errore durante il salvataggio del file');
    }

    // Imposta i permessi corretti
    chmod($fileName, 0644);

    // Risposta di successo
    echo json_encode([
        'status' => 'success',
        'message' => 'NPC salvato con successo',
        'fileName' => basename($fileName)
    ]);

} catch (Exception $e) {
    logError('Errore durante il salvataggio', ['error' => $e->getMessage()]);
    rispondiErrore('Errore durante il salvataggio: ' . $e->getMessage(), 500);
}
?> 