import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { loadDatasetFromPublic } from "../services/dataService";
import type {
  DataPoint,
  EvaluationResult,
  DataPointResult,
  SessionResult,
  AdditionalSentence,
  Behavior,
} from "../types";
import { TASK_META } from "../types/taskMetaInfo";

interface EvaluationPageProps {
  onComplete: (result: SessionResult) => void;
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #f5f5f5;
`;

const LeftPanel = styled.div`
  flex: 1;
  padding: 30px;
  background: white;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightPanel = styled.div`
  flex: 1;
  padding: 30px;
  background: #f8f9fa;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
`;

const Progress = styled.div`
  font-size: 1.1rem;
  color: #666;
`;

const TextContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  line-height: 1.8;
  font-size: 1.1rem;
  color: #333;
  position: relative;
`;

const CriteriaSection = styled.div`
  padding: 20px;
  background: #e3f2fd;
  border-radius: 8px;
  border-left: 4px solid #2196f3;
`;

const CriteriaTitle = styled.h3`
  color: #1976d2;
  margin-bottom: 10px;
  font-size: 1.1rem;
`;

const CriteriaText = styled.p`
  color: #424242;
  line-height: 1.6;
`;

const FormContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const QuestionContainer = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: #fafafa;
`;

const QuestionTitle = styled.h3`
  color: #333;
  margin-bottom: 15px;
  font-size: 1.1rem;
`;

const BehaviorText = styled.div`
  background: #fff3cd;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 15px;
  border-left: 4px solid #ffc107;
`;

const ReasoningText = styled.div`
  color: #666;
  font-style: italic;
  margin-bottom: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 15px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #555;
`;

const RadioInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #e9ecef;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const NextButton = styled(Button)`
  background: #28a745;
  color: white;

  &:hover:not(:disabled) {
    background: #218838;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin: 40px 0;
`;

const AdditionalSection = styled.div`
  margin-top: 30px;
  padding: 20px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
`;

const SectionTitle = styled.h3`
  color: #333;
  margin-bottom: 15px;
  font-size: 1.1rem;
`;

const SentenceInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 1rem;
`;

const AddButton = styled.button`
  padding: 8px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-right: 10px;

  &:hover {
    background: #218838;
  }
`;

const RemoveButton = styled.button`
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #c82333;
  }
`;

const SentenceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const EvaluationPage: React.FC<EvaluationPageProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const { datasetNumber, dataPointIndex } = useParams();
  const currentDataPointIndex = parseInt(dataPointIndex || "0");

  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluations, setEvaluations] = useState<
    Record<number, boolean | null>
  >({});
  const [allResults, setAllResults] = useState<DataPointResult[]>([]);
  const [additionalSentences, setAdditionalSentences] = useState<
    AdditionalSentence[]
  >([{ sentence: "" }]);
  const meta = TASK_META[datasetNumber ?? "1"];

  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await loadDatasetFromPublic(datasetNumber || "1");
        setDataPoints(data);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [datasetNumber]);

  useEffect(() => {
    if (dataPoints.length > 0 && currentDataPointIndex < dataPoints.length) {
      const dataPoint = dataPoints[currentDataPointIndex];
      const initialEvaluations: Record<number, boolean | null> = {};
      dataPoint.behaviors.forEach((_, index) => {
        initialEvaluations[index] = null;
      });
      setEvaluations(initialEvaluations);
      clearHighlight();
      if (responseRef.current !== null) {
        dataPoint.behaviors.forEach((bhr: Behavior) => {
          highlightText(responseRef.current!, bhr.behavior);
        });
      }
    }
  }, [dataPoints, currentDataPointIndex]);

  const handleEvaluationChange = (behaviorIndex: number, value: boolean) => {
    setEvaluations((prev) => ({
      ...prev,
      [behaviorIndex]: value,
    }));
  };

  const isAllEvaluated = () => {
    return Object.values(evaluations).every((value) => value !== null);
  };

  const handleAddSentence = () => {
    setAdditionalSentences((prev) => [...prev, { sentence: "" }]);
  };

  const handleRemoveSentence = (index: number) => {
    setAdditionalSentences((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSentenceChange = (index: number, value: string) => {
    setAdditionalSentences((prev) =>
      prev.map((item, i) => (i === index ? { ...item, sentence: value } : item))
    );
  };

  const handleNext = () => {
    const evaluationResults: EvaluationResult[] = Object.entries(
      evaluations
    ).map(([behaviorIndex, isRelevant]) => ({
      behaviorIndex: parseInt(behaviorIndex),
      isRelevant: isRelevant!,
    }));

    // 빈 문장 필터링
    const filteredSentences = additionalSentences.filter(
      (item) => item.sentence.trim() !== ""
    );

    const dataPointResult: DataPointResult = {
      dataPointIndex: currentDataPointIndex,
      evaluations: evaluationResults,
      additionalSentences: filteredSentences,
    };

    // 현재 결과를 저장
    setAllResults((prev) => [...prev, dataPointResult]);

    // 다음 데이터로 이동
    const nextIndex = currentDataPointIndex + 1;
    setAdditionalSentences([{ sentence: "" }]);
    if (nextIndex < dataPoints.length) {
      navigate(`/evaluate/${datasetNumber}/${nextIndex}`);
    } else {
      // 모든 데이터 완료
      const finalResults = [...allResults, dataPointResult];
      const sessionResult: SessionResult = {
        user: { name: "", datasetNumber: datasetNumber || "1" },
        datasetNumber: datasetNumber || "1",
        dataPointResults: finalResults,
        timestamp: new Date(),
      };
      onComplete(sessionResult);
      navigate("/complete");
    }
  };

  function highlightText(element: HTMLDivElement, targetText: string) {
    const innerHTML = element.innerHTML;
    // Create a dynamic regex that considers " and ' as the same
    const regexPattern = targetText
      .trim()
      .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
      .replace(/["'‘’“”]/g, `["'‘’“”]`);
    const highlightedHTML = innerHTML.replace(
      new RegExp(`(${regexPattern})`, "gi"),
      `<span style="background-color: yellow;"">$1</span>`
    );
    element.innerHTML = highlightedHTML;
  }

  function clearHighlight() {
    if (responseRef.current)
      responseRef.current.innerHTML = responseRef.current.innerHTML.replace(
        /<\/?span[^>]*>/gi,
        ""
      );
  }

  if (loading) {
    return (
      <Container>
        <LoadingText>데이터를 불러오는 중...</LoadingText>
      </Container>
    );
  }

  if (dataPoints.length === 0 || currentDataPointIndex >= dataPoints.length) {
    return (
      <Container>
        <LoadingText>데이터를 찾을 수 없습니다.</LoadingText>
      </Container>
    );
  }

  const dataPoint = dataPoints[currentDataPointIndex];

  return (
    <Container>
      <LeftPanel>
        <Header>
          <h2>데이터셋 {datasetNumber} 평가</h2>
          <Progress>
            데이터 {currentDataPointIndex + 1} / {dataPoints.length}
          </Progress>
        </Header>

        <TextContainer>Query: {dataPoint.query}</TextContainer>

        <TextContainer>
          <div style={{ whiteSpace: "pre-wrap" }} ref={responseRef}>
            {dataPoint.response}
          </div>
        </TextContainer>

        <CriteriaSection>
          <CriteriaTitle>평가 기준</CriteriaTitle>
          <CriteriaText>
            {meta.criteria.title}
            <ul>
              <li>{meta.criteria.desc}</li>
            </ul>
          </CriteriaText>
        </CriteriaSection>
      </LeftPanel>

      <RightPanel>
        <Header>
          <h2>Annotation 평가</h2>
        </Header>

        <FormContainer>
          {dataPoint.behaviors.map((behavior, index) => (
            <QuestionContainer key={index}>
              <QuestionTitle>
                질문 {index + 1}: 이 annotation이 관련성이 있나요?
              </QuestionTitle>

              <BehaviorText>
                <strong>선택된 텍스트:</strong> "{behavior.behavior}"
              </BehaviorText>

              <ReasoningText>
                <strong>선택 이유:</strong> {behavior.reasoning}
              </ReasoningText>

              <RadioGroup>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name={`evaluation-${index}`}
                    value="true"
                    checked={evaluations[index] === true}
                    onChange={() => handleEvaluationChange(index, true)}
                  />
                  Yes
                </RadioLabel>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name={`evaluation-${index}`}
                    value="false"
                    checked={evaluations[index] === false}
                    onChange={() => handleEvaluationChange(index, false)}
                  />
                  No
                </RadioLabel>
              </RadioGroup>
            </QuestionContainer>
          ))}

          <AdditionalSection>
            <SectionTitle>추가 관련 문장이 있나요?</SectionTitle>
            <p style={{ color: "#666", marginBottom: "15px" }}>
              Annotate되지 않았지만 관련이 있는 문장이 있다면 추가해주세요.
            </p>

            {additionalSentences.map((item, index) => (
              <SentenceRow key={index}>
                <SentenceInput
                  type="text"
                  value={item.sentence}
                  onChange={(e) => handleSentenceChange(index, e.target.value)}
                  placeholder="관련 문장을 입력하세요..."
                />
                {additionalSentences.length > 1 && (
                  <RemoveButton onClick={() => handleRemoveSentence(index)}>
                    삭제
                  </RemoveButton>
                )}
              </SentenceRow>
            ))}

            <AddButton onClick={handleAddSentence}>+ 문장 추가</AddButton>
          </AdditionalSection>

          <ButtonContainer>
            <div></div>
            <NextButton onClick={handleNext} disabled={!isAllEvaluated()}>
              {currentDataPointIndex < dataPoints.length - 1
                ? "다음 데이터"
                : "평가 완료"}
            </NextButton>
          </ButtonContainer>
        </FormContainer>
      </RightPanel>
    </Container>
  );
};

export default EvaluationPage;
