import styled from "styled-components";
// import { saveSessionResult } from "../services/dataService";
import type { SessionResult } from "../types";
import { useNavigate } from "react-router-dom";

interface CompletionPageProps {
  sessionResult: SessionResult;
}

const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  color: #28a745;
  margin-bottom: 20px;
  font-size: 2rem;
`;

const Message = styled.p`
  color: #666;
  line-height: 1.6;
  font-size: 1.1rem;
  margin-bottom: 30px;
`;

const StatsContainer = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 14px 28px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin: 10px;

  &:hover {
    background: #0056b3;
  }
`;

const CompletionPage: React.FC<CompletionPageProps> = ({ sessionResult }) => {
  const navigate = useNavigate();

  const handleReset = () => {
    navigate("/");
  };

  const handleSave = async () => {
    // try {
    //   await saveSessionResult(sessionResult);
    //   alert("결과가 성공적으로 저장되었습니다!");
    // } catch (e) {
    //   console.error(e);
    //   alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    // }
    window.alert("Not implemented yet -- will send the result to the storage");
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(sessionResult, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `annotation-evaluation-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container>
      <Title>🎉 모든 작업이 완료되었습니다!</Title>

      <Message>
        annotation 평가 작업을 모두 마치셨습니다. 결과를 저장하거나 다운로드할
        수 있습니다.
      </Message>

      <StatsContainer>
        <h3>작업 요약</h3>
        <StatItem>
          <span>사용자:</span>
          <span>{sessionResult.user.name}</span>
        </StatItem>
        <StatItem>
          <span>데이터셋:</span>
          <span>{sessionResult.user.datasetNumber}</span>
        </StatItem>
        <StatItem>
          <span>완료 시간:</span>
          <span>{sessionResult.timestamp.toLocaleString()}</span>
        </StatItem>
        <StatItem>
          <span>평가된 데이터 포인트:</span>
          <span>{sessionResult.dataPointResults.length}개</span>
        </StatItem>
        <StatItem>
          <span>총 평가된 annotation:</span>
          <span>
            {sessionResult.dataPointResults.reduce(
              (total, result) => total + result.evaluations.length,
              0
            )}
            개
          </span>
        </StatItem>
        <StatItem>
          <span>추가 관련 문장:</span>
          <span>
            {sessionResult.dataPointResults.reduce(
              (total, result) => total + result.additionalSentences.length,
              0
            )}
            개
          </span>
        </StatItem>
      </StatsContainer>

      <div>
        <Button onClick={handleReset}>처음으로</Button>
        <Button onClick={handleSave}>결과 저장하기</Button>
        <Button onClick={handleDownload}>JSON 다운로드</Button>
      </div>
    </Container>
  );
};

export default CompletionPage;
