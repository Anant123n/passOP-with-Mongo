import React from 'react';
import Navbar from './Components/Navbar';

import Main from './Components/Main';
import Footer from './Components/Footer';

function App() {
  


  return (
    < >
  <div className="flex flex-col min-h-screen [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
  <Navbar />
  <main className="flex-grow">
    <Main />
  </main>
  <Footer />
</div>

      
      
    </>
  );
}

export default App;
