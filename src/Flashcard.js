import Flashcards from "./CardDisplay"

class Flashcard{
    constructor(term, definition){
        this.term = term
        this.definition = definition
    }

    get term(){
        return this.term
    }

    get definition(){
        return this.definition
    }
}

export default Flashcard;