import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import UserInfoPage from "./pages/UserInfoPage";
import DatasetIntroPage from "./pages/DatasetIntroPage";
import EvaluationPage from "./pages/EvaluationPage";
import CompletionPage from "./pages/CompletionPage";
import type { User, SessionResult } from "./types";
import "./App.css";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [sessionResults, setSessionResults] = useState<SessionResult | null>(
    null
  );

  const handleUserSubmit = (userData: User) => {
    setUser(userData);
  };

  const handleComplete = (result: SessionResult) => {
    const finalResult: SessionResult = {
      ...result,
      user: user!,
      timestamp: new Date(),
    };
    console.log(finalResult);
    setSessionResults(finalResult);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<UserInfoPage onUserSubmit={handleUserSubmit} />}
          />
          <Route
            path="/dataset/:datasetNumber"
            element={<DatasetIntroPage onStart={() => {}} />}
          />
          <Route
            path="/evaluate/:datasetNumber/:dataPointIndex"
            element={<EvaluationPage onComplete={handleComplete} />}
          />
          <Route
            path="/complete"
            element={
              sessionResults ? (
                <CompletionPage sessionResult={sessionResults} />
              ) : (
                <div>완료 페이지를 찾을 수 없습니다.</div>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
