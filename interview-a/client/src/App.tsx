import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import SurveyDropdown from "./components/SurveyDropdown";
import SurveyView from "./views/SurveyView"
import { Container } from "react-bootstrap";
import ResponseView from "./views/ResponsesView";

function App() {
  return (
    <Router>
      <Container className="main pad-t">
        <SurveyDropdown />
        <Switch>
          <Route path="/ranking">
            <ResponseView />
          </Route>
          <Route path="/survey/:id" render={props => <SurveyView surveyId={Number(props.match.params.id)} /> }>
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;