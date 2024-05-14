### CIAO LORE e SIMO(se visioni ancora i nostri progetti) vi fornisco un riepilogo delle funzionalità, e della logica delle funzioni, delle 3 pagine che ho fatto
così ci perdete meno tempo
---------------------------------------------------------------------BACKOFFICE-(ha il suo css[STYLEBACKOFFICE.CSS] e il suo script[SCIPT_BACKOFFICE.JS])-------------------------------------------------------------------------------------------------
1.  **Visualizzare i Prodotti**:
    -   La pagina può visualizzare una lista di tutti i prodotti presenti nel database.
    -   Questa lista è mostrata nella sezione della dashboard e in altre sezioni per modifiche o eliminazioni.
2.  **Ricercare i Prodotti**
3.  /**Aggiungere un Nuovo Prodotto**/**Modificare un Prodotto Esistente**/**Eliminare un Prodotto**(direttamente nel server che ospita l'endpoint della API come da consegna)
4.  **Gestire le Sezioni della Pagina**:
    -   La pagina ha diverse sezioni (come creare, eliminare, e dashboard). Gli utenti possono navigare tra queste sezioni cliccando sui pulsanti appropriati senza ricaricare la pagina.
    -   Ogni sezione mostra i controlli e le informazioni pertinenti alla funzionalità selezionata e i dati si aggiornano in tempo reale.
    -   Collegamento tramite logo alla pag vetrina
    -   la sezione modifica si attiva solo con la rotellina e ricicla il form dell'aggiungi prodotto
    -   la get la faccio solo all'inizio poi utilizzo un array di oggetti e lo aggiorno quando serve(se aggiungo un prodotto rifà la fetch perchè senno' mancava l'id)
### Spiegazione delle Funzioni

-   **showModal() e hideModal()**: Mostrano e nascondono un modale di conferma per operazioni riuscite(queste le ho trovate sulla doc di Bootstrap e mi sono fatto aiutare da chatGpt per inplementarle).
    
-   **renderDashboard(data)**: Popola la dashboard con i prodotti. Ogni prodotto è visualizzato con i suoi dettagli,tipo come ID, nome, marca, prezzo, descrizione e un'immagine.
    
-   **requestFetchGet(URL_FETCH, KEY_FETCH)**: Effettua una richiesta GET all'API per ottenere la lista dei prodotti. I prodotti vengono salvati nell'array globale `arrayProducts`
    e la dashboard e la sezione di modifica/eliminazione vengono aggiornate in tempo reale senza ricaricare la pag.
    
-   **renderingDOM(dataBase)**: Popola la sezione di modifica/eliminazione con i prodotti. Aggiunge i gestori di eventi per i pulsanti di eliminazione e modifica subito dopo la creazione, per ogni creazione.
    
-   **inputOfFilter(punct)**: Ritorna il valore dell'elemento di input passato come parametro.
    
-   **resetSearchBarAndDOM(dom_dash)**: Pulisce la barra di ricerca e aggiorna il DOM con tutti i prodotti.
    
-   **returnArrayNew(key, array, researchInputUser)**: Filtra l'array dei prodotti in base alla chiave e al valore di ricerca dell'utente, restituendo un nuovo array di risultati.
    
-   **submitProduct()**: Estrae i dati dal form di creazione e li restituisce come oggetto.
    
-   **requestFetchPost(URL_FETCH, KEY_FETCH, objectX)**: Effettua una richiesta POST all'API per creare un nuovo prodotto e aggiorna il DOM con il nuovo prodotto.
    
-   **esxtractMyProduct(ID, flag)**: Cerca un prodotto per ID nell'array globale e restituisce l'oggetto o l'indice dell'oggetto nell'array.
    
-   **toggleCreate_Modify()**: Alterna la visibilità degli elementi per cambiare l'aspetto del form tra modalità creazione e modifica.
    
-   **inputFieldClean()**: Pulisce semplicemente i campi del form.
    
-   **functionModify(row)**: Passa alla sezione form, popola il form di modifica con i dati del prodotto selezionato e imposta il listener per il bottone di aggiornamento.
    
-   **requestFetchPut(URL_FETCH, KEY_FETCH, objectID, objectX)**: Effettua una richiesta PUT all'API per aggiornare un prodotto esistente e aggiorna il DOM con il prodotto modificato.
    
-   **requestFetchDelete(URL_FETCH, KEY_FETCH, objectID)**: Effettua una richiesta DELETE all'API per eliminare un prodotto e aggiorna il DOM per riflettere l'eliminazione.
    
-   **functionDelete(id)**: Elimina un prodotto dall'API e aggiorna l'array globale e il DOM.
    
-   **checkSectionCorrect(classSectionResearch)**: Mostra la sezione corretta in base alla scelta dell'utente e nasconde le altre sezioni.
    

### Event Listeners

-   **DOMContentLoaded**: Inizializza la pagina quando il documento è completamente caricato, effettua una richiesta GET per ottenere i prodotti e imposta i listener per i filtri e le barre di ricerca.
    
-   **select_one.change e select_two.change**: Ascoltano i cambiamenti nella selezione dei filtri e aggiornano la barra di ricerca e il DOM.
    
-   **barSearch.input e barSearchTwo.input**: Ascoltano gli input nelle barre di ricerca e filtrano i prodotti in base ai criteri di ricerca.
    
-   **buttonAddForm.click**: Ascolta il click del bottone di aggiunta e invia i dati del nuovo prodotto all'API.
    
-   **buttonUpdateForm.click**: Ascolta il click del bottone di aggiornamento e invia i dati del prodotto modificato all'API.
---------------------------------------------------------------------VETRINA-(ha il suo css[STYLE.CSS] e il suo script[SCRIPT.JS])-------------------------------------------------------------------------------------------------
HO RICICLATO E ADATTATO LA STRUTTURA DEL PROGETTO DEI LIBRI(M4W3D1) (con molte modifiche)
queste le ho messe in ordine alfabetico
### Funzionalità della Pagina

1.  **Visualizzare i Prodotti**:  
    -   La pagina mostra una lista di tutti i prodotti disponibili nel database. Questa lista è visualizzata nella sezione principale della vetrina, con ogni prodotto presentato in una carta che include l'immagine,
        il nome, la descrizione e il prezzo del prodotto.
2.  **Ricercare i Prodotti**:
    -   Gli utenti possono cercare i prodotti per nome utilizzando una barra di ricerca. Man mano che l'utente digita nella barra, l'elenco dei prodotti viene aggiornato dinamicamente per mostrare solo quelli che
        corrispondono ai criteri di ricerca.
3.  **Aggiungere ai Preferiti**:
    -   Gli utenti possono aggiungere i prodotti ai preferiti cliccando sull'icona del cuore presente su ogni carta del prodotto. I prodotti preferiti vengono aggiunti a un menu a tendina dei preferiti e il contatore
       dei preferiti viene aggiornato per riflettere il numero di articoli aggiunti.
4.  **Aggiungere al Carrello**:
    -   Gli utenti possono aggiungere i prodotti al carrello cliccando sul pulsante "Aggiungi al carrello". I prodotti aggiunti vengono visualizzati in un menu a tendina del carrello, con il contatore del carrello che
        mostra il numero totale di articoli e il totale dei prezzi aggiornato dinamicamente.
5.  **Pulizia della Vetrina**:
    -   Gli utenti possono pulire la vetrina resettando i carrelli e i preferiti. Questa operazione rimuove tutti gli articoli dai menu a tendina dei preferiti e del carrello, resetta i contatori e ricarica l'elenco
       cdei prodotti nella vetrina.
6.  **Navbar Fissa**:
    -   La navbar diventa fissa quando l'utente scorre la pagina oltre un certo punto. Questo mantiene la barra di navigazione visibile in cima alla pagina ma rinpicciolendola, facilitando l'accesso ai menu e alle funzioni della pagina.

### Spiegazione delle Funzioni (In Ordine Alfabetico)

1.  **addFavour**:
    -   Aggiunge un prodotto ai preferiti e aggiorna il contatore e il menu a tendina.
2.  **addToDropdownFavour**:
    -   Aggiunge un prodotto ai preferiti nel menu a tendina. Genera un elemento di lista con i dettagli del prodotto e lo aggiunge al menu a tendina dei preferiti.
3.  **addToDropdownTrolley**:
    -   Aggiunge un prodotto al carrello nel menu a tendina. Genera un elemento di lista con il nome del prodotto e il suo prezzo, e lo aggiunge al menu a tendina del carrello. Aggiorna anche il totale dei prezzi nel carrello.
4.  **addToTrolley**:
    -   Aggiunge un prodottal carrello. Estrae il prezzo del prodotto, lo aggiunge all'array dei prezzi del carrello, aggiorna il contatore degli articoli nel carrello e calcola il totale dei prezzi, visualizzandoli nel menu a tendina del carrello.
5.  **deleteItem**:
    -   Elimina un prodotto dai preferiti o dal carrello. Rimuove l'elemento visivo dal DOM, aggiorna gli array dei preferiti o del carrello, e aggiorna i contatori.
6.  **estrainumbersDaStringa**:
    -   Estrae numeri da una stringa, convertendo i numeri trovati in un array di numeri. È utile per estrarre e manipolare prezzi o altre informazioni numeriche dai testi.
7.  **handleScroll**:
    -   Mantiene la navbar fissa quando l'utente scorre la pagina. Aggiunge o rimuove classi CSS alla navbar per gestire il suo stile e la sua posizione.
8.  **pulisci**:
    -   Resetta i carrelli e i preferiti, pulisce il DOM e ricarica i prodotti nella vetrina. Resetta i contatori degli articoli nel carrello e nei preferiti, e pulisce i menu a tendina.
9.  **renderingDom**:
    -   Genera e visualizza le carte dei prodotti nel DOM.
10.  **requestFetchGet**:
    -   Recupera i dati dei prodotti dall'API.
11.  **search**:
    -   Filtra i prodotti in base alla stringa di ricerca e aggiorna la vetrina.
12.  **startHover e stopHover**:
    -   Gestiscono gli effetti di hover sulle carte dei prodotti.
### Event Listeners
1.  **DOMContentLoaded**:
    
    -   Inizializza la pagina quando il documento è completamente caricato. Effettua una richiesta GET per ottenere i prodotti, popola la vetrina con i prodotti ricevuti e imposta i listener per i pulsanti dei prodotti
        (aggiungi al carrello, aggiungi ai preferiti), la barra di ricerca e il pulsante di pulizia.
2.  **navbarHeight e handleScroll**:
    -   Mantiene la navbar fissa in cima alla pagina quando l'utente scorre oltre l'altezza della navbar. Aggiunge o rimuove classi CSS alla navbar per gestire il suo stile e la sua posizione.
3.  **Barra di ricerca e pulsante di pulizia**:
    -   Ascoltano gli input nella barra di ricerca e filtrano i prodotti visualizzati in base ai criteri di ricerca. Il pulsante di pulizia resetta la vetrina, i preferiti e il carrello, riportando tutto allo stato iniziale.

---------------------------------------------------------------------LA PAGINA DETTAGLI -------------------------------------------------------------------------------------------------
NIENTE DI CHè VISUALIZZA LA CARTA E BON
