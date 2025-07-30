import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import type { User } from "../types";

interface UserInfoPageProps {
  onUserSubmit: (user: User) => void;
}

const Layout = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Container = styled.div`
  max-width: 500px;
  width: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #555;
  font-size: 1rem;
`;

const Input = styled.input`
  padding: 14px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const UserInfoPage: React.FC<UserInfoPageProps> = ({ onUserSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    datasetNumber: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.datasetNumber) {
      onUserSubmit(formData);
      navigate(`/dataset/${formData.datasetNumber}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Layout>
      <Container>
        <Title>Annotation 평가 시스템</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">이름</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="datasetNumber">데이터셋 번호</Label>
            <Input
              type="number"
              id="datasetNumber"
              name="datasetNumber"
              value={formData.datasetNumber}
              onChange={handleChange}
              placeholder="예: 1, 2, 3..."
              min="1"
              required
            />
          </FormGroup>

          <Button
            type="submit"
            disabled={!formData.name || !formData.datasetNumber}
          >
            시작하기
          </Button>
        </Form>
      </Container>
    </Layout>
  );
};

export default UserInfoPage;
