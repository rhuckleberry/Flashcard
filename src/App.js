import React from "react"
import './App.css';

import Background from "./Background"
import Header from "./Header"
import CardDisplay from "./CardDisplay";
import Footer from "./Footer"


function App(){
  return (
    <div className="App">

      <Background />

      <header>
        <Header />
      </header>

      <main>
        <CardDisplay />  
      </main>      

      <footer>
        <Footer />
      </footer>

    </div>
  )
}

export default App;
