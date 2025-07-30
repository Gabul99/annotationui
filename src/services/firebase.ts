import type { SessionResult } from "../types";

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

// 서버 API를 사용하는 경우의 함수
export const saveToServer = async (sessionResult: SessionResult) => {
  try {
    const response = await fetch("/api/evaluations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionResult),
    });

    if (!response.ok) {
      throw new Error("서버 응답 오류");
    }

    const result = await response.json();
    console.log("결과가 성공적으로 저장되었습니다:", result);
    return result;
  } catch (error) {
    console.error("서버 저장 중 오류 발생:", error);
    // 서버 저장 실패 시 로컬에 저장
    return await saveSessionResult(sessionResult);
  }
};

// 저장된 결과 조회 함수
export const getSavedResults = () => {
  try {
    const results = localStorage.getItem("annotation-evaluations");
    return results ? JSON.parse(results) : [];
  } catch (error) {
    console.error("저장된 결과 조회 중 오류 발생:", error);
    return [];
  }
};
