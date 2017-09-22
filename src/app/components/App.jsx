import React, { PropTypes } from 'react';

import Header from './base/Header';
import Footer from './base/Footer';

function App({ children }) {
  return (
    <div className="container">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

App.propTypes = { children: PropTypes.object };

export default App;
