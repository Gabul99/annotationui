import type { DataPoint, SessionResult } from "../types";

export const loadDataset = async (
  datasetNumber: string
): Promise<DataPoint[]> => {
  try {
    const response = await fetch(`/src/data/${datasetNumber}.json`);
    if (!response.ok) {
      throw new Error(`데이터셋 ${datasetNumber}을 찾을 수 없습니다.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("데이터 로드 중 오류:", error);
    throw error;
  }
};

// 개발 환경에서 정적 파일 접근을 위한 대안
export const loadDatasetFromPublic = async (
  datasetNumber: string
): Promise<DataPoint[]> => {
  try {
    const response = await fetch(`/data/${datasetNumber}.json`);
    if (!response.ok) {
      throw new Error(`데이터셋 ${datasetNumber}을 찾을 수 없습니다.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("데이터 로드 중 오류:", error);
    throw error;
  }
};

// 로컬 저장소를 사용한 결과 저장 함수
export const saveSessionResult = async (sessionResult: SessionResult) => {
  try {
    // 로컬 스토리지에 저장
    const existingResults = localStorage.getItem("annotation-evaluations");
    const results = existingResults ? JSON.parse(existingResults) : [];

    const newResult = {
      ...sessionResult,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    results.push(newResult);
    localStorage.setItem("annotation-evaluations", JSON.stringify(results));

    console.log("결과가 로컬에 성공적으로 저장되었습니다:", newResult);
    return newResult.id;
  } catch (error) {
    console.error("결과 저장 중 오류 발생:", error);
    throw error;
  }
};
