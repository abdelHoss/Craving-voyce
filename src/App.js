import React from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Footer from "./components/Footer.jsx";
import About from "./components/About.jsx";
import Page404 from "./components/404Page.jsx";
import ListingPage from "./components/ListingPage.jsx";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  React.useEffect(() => {
    const viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute(
      "content",
      viewport.content + ", height=" + window.innerHeight
    );
  });

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/restaurant/listing">
            <ListingPage />
          </Route>
          <Route path="/about/us">
            <About />
          </Route>
          <Route path="*">
            <Page404 />
          </Route>
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
