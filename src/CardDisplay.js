import React from "react"
import raw from "./terms.txt"
import Flashcard from "./Flashcard"

class Flashcards extends React.Component {
    constructor() {
        super();
        this.state = {
            termIndex: 0,
            definition: "",
            onTerm: true,
            allTerms: [],
            dictionary: {}
        }
    }

    componentDidMount() {
        //import terms txt file + shuffle
        fetch(raw)
            .then(response => response.text())
            .then(text => {
                const terms = text.split("\n");

                //trim and remove empty strings
                let trimTerms = [] 
                for (let i=0; i<terms.length; i++){
                    const trimTerm = terms[i].trim()
                    if(trimTerm !== ""){
                        trimTerms.push(trimTerm)
                    }
                }

                this.setState({ allTerms: trimTerms })
            })
            .then(() => { this.shuffleTerms() })

        //build dictionary
        .then(() => {
            const allTerms = this.state.allTerms
            for (let i = 0; i < allTerms.length; i++) {
                const term = allTerms[i]
                this.fetchDefinition(term)
            }

        })

        //make flashcard class

    }

    //try catch words like empty space - update text file?
    //fetch definitions before flip
    //reorder files
    //add + delete words


    fetchDefinition = (term) => {
        const key = "cb25488e-3745-487a-8e94-4f5892774491"
        const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${term}?key=${key}`

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json()
            })
            // .then(data => {
            //     const termDefinition = this.parseData(data)
            //     this.setState({ definition: termDefinition })
            // })
            .then(data => {
                const termDefinition = this.parseData(data)
                this.setState(prevState => {
                    let newState = Object.assign({}, prevState)
                    let newDict = Object.assign({}, prevState.dictionary)
                    newDict[term] = termDefinition
                    newState.dictionary = newDict
                    return (newState)
                })
            })

            .catch(err => {
                this.setState(prevState => {
                    const errorDefinition = "[Error] Not a valid english word!"
                    
                    let newState = Object.assign({}, prevState)
                    let newDict = Object.assign({}, prevState.dictionary)
                    newDict[term] = errorDefinition
                    newState.dictionary = newDict
                    return (newState)
                })
            })
    }

    parseData = (data) => {
        let definitionText = ``
        let totalCounter = 1

        for (let i = 0; i < data.length; i++) {
            const shortDefArray = data[i].shortdef

            for (let j = 0; j < shortDefArray.length; j++) {
                definitionText += `${String(totalCounter)}. ${shortDefArray[j]}\n`
                totalCounter++;
            }
        }

        return definitionText
    }



    //******make definition the terms definition


    shuffleTerms = () => {
        const shuffledTerms = this.state.allTerms
        const totalTerms = shuffledTerms.length

        //shuffe algorithm
        for (let i = 0; i < totalTerms; i++) {
            const random = i + Math.floor(Math.random() * (totalTerms - i));
            const indexTerm = shuffledTerms[i];
            shuffledTerms[i] = shuffledTerms[random];
            shuffledTerms[random] = indexTerm;
        }

        this.setState({
            termIndex: 0,
            allTerms: shuffledTerms,
            onTerm: true,
            definition: ""
        })
    }


    flipFlashCard = () => {
        const onTermSide = this.state.onTerm

        //fetch definition
        if (onTermSide) {
            const term = this.state.allTerms[this.state.termIndex]
            // this.fetchDefinition(term)
            const termDefinition = this.state.dictionary[term]
            this.setState({definition: termDefinition})
        }

        //flip flashcard
        this.setState({ onTerm: !onTermSide })
    }

    lastTerm = () => {
        if (this.state.termIndex > 0) {
            this.setState({
                termIndex: this.state.termIndex - 1,
                onTerm: true,
                definition: ""
            })
        }
    }

    nextTerm = () => {
        if (this.state.termIndex < this.state.allTerms.length - 1) {
            this.setState({
                termIndex: this.state.termIndex + 1,
                onTerm: true,
                definition: ""
            })
        }
    }


    render() {
        const {termIndex, definition, onTerm, allTerms} = this.state

        const indexText = `${termIndex+1} / ${allTerms.length}`
        const flashcardText = onTerm ? allTerms[termIndex] : definition
        const flashcardStyle = onTerm ? "Flashcard TermText"  : "Flashcard DefinitionText" 

        const backButtonStyle = termIndex>0 ? "Button" : "ButtonInactive"
        const nextButtonStyle = termIndex<allTerms.length-1 ? "Button" : "ButtonInactive"

        return (
            <div className="Main">
                <label>
                    <label className="IndexText">{indexText}</label>

                    <label>
                        <textarea
                            className={flashcardStyle}
                            value={flashcardText}
                            onClick={this.flipFlashCard}
                        />
                        {/* <button 
                            className="Flashcard" 
                            onClick={this.flipFlashCard}
                        >{flashcardText}</button> */}
                    </label>
                </label> 
                
                <br/>

                <div>
                    <label>
                        <button
                            name="Last Button"
                            className={backButtonStyle}
                            onClick={this.lastTerm}
                        >Back</button>
                    </label>

                    <label>
                        <button
                            name="Next Button"
                            className={nextButtonStyle}
                            onClick={this.nextTerm}
                        >Next</button>
                    </label>
                </div>

                <br />

                <div>
                    <label>
                    <button
                            name="Shuffle Button"
                            className="Button"
                            onClick={this.shuffleTerms}
                        >Shuffle</button>
                    </label>
                </div>

            </div>
        )
    }
}

export default Flashcards;