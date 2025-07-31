import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { loadDatasetFromPublic } from "../services/dataService";
import type { DataPoint } from "../types";
import { TASK_META } from "../types/taskMetaInfo";

interface DatasetIntroPageProps {
  onStart: () => void;
}

const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
  font-size: 2rem;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  color: #555;
  margin-bottom: 15px;
  font-size: 1.3rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 8px;
`;

const Content = styled.div`
  color: #666;
  line-height: 1.6;
  font-size: 1rem;
`;

const CriteriaBox = styled.div`
  background: #f8f9fa;
  border-left: 4px solid #667eea;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

const Button = styled.button`
  padding: 16px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const LoadingText = styled.div`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin: 40px 0;
`;

const DatasetIntroPage: React.FC<DatasetIntroPageProps> = ({ onStart }) => {
  const navigate = useNavigate();
  const { datasetNumber } = useParams();
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const meta = TASK_META[datasetNumber ?? "1"];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await loadDatasetFromPublic(datasetNumber || "1");
        setDataPoints(data);
      } catch (err) {
        setError("데이터를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [datasetNumber]);

  const handleStart = () => {
    onStart();
    navigate(`/evaluate/${datasetNumber}/0`);
  };

  if (loading) {
    return (
      <Container>
        <LoadingText>데이터를 불러오는 중...</LoadingText>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>오류</Title>
        <Content>{error}</Content>
        <ButtonContainer>
          <Button onClick={() => navigate("/")}>돌아가기</Button>
        </ButtonContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Title>데이터셋 {datasetNumber} 평가</Title>

      <Section>
        <SectionTitle>작업 설명</SectionTitle>
        <Content>{meta.intro}</Content>
      </Section>

      <Section>
        <SectionTitle>평가 기준</SectionTitle>
        <CriteriaBox>
          <Content>
            {meta.criteria.title}
            <ul>
              <li>{meta.criteria.desc}</li>
            </ul>
          </Content>
        </CriteriaBox>
      </Section>

      <Section>
        <SectionTitle>진행 방법</SectionTitle>
        <Content>
          <ul>
            <li>
              왼쪽에 표시되는 텍스트에서 하이라이트된 annotation들을 확인하세요
            </li>
            <li>
              오른쪽의 각 annotation에 대해 "관련성이 있나요?" 질문에 Yes/No로
              답하세요
            </li>
            <li>모든 질문에 답한 후 다음 데이터로 넘어갈 수 있습니다</li>
            <li>총 {dataPoints.length}개의 데이터를 평가하게 됩니다</li>
          </ul>
        </Content>
      </Section>

      <ButtonContainer>
        <Button onClick={handleStart}>평가 시작하기</Button>
      </ButtonContainer>
    </Container>
  );
};

export default DatasetIntroPage;
