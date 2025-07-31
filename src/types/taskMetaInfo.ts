export interface TaskMeta {
  intro: string; // 작업 설명 (Section "작업 설명")
  criteria: { title: string; desc: string }; // 평가 기준 (Section "평가 기준")
}

export const TASK_META: Record<string, TaskMeta> = {
  "1": {
    intro:
      "이 데이터셋은 광고 텍스트에서 감정적 표현과 행동 패턴을 분석하는 annotation을 평가합니다. 각 텍스트에서 하이라이트된 부분들이 적절하게 annotation되었는지 판단해주세요.",
    criteria: {
      title: "테스트 제목",
      desc: "테스트 설명",
    },
  },
  "4": {
    intro:
      "In this dataset, the model generates easy explanation of science concepts for 5~6 years old children. We evaluate them by the criteria 'Use of Metaphor and Example', and we annotate some fragments that seem relevant to the criterion. What you are going to do is determining whether the selected fragment is **related to criterion or not**. Regardless of whether the criteria are positive or negative, you can determine whether or not the sentence is appropriate to evaluate based on this criterion.",
    criteria: {
      title: "Use of Metaphor and Example",
      desc: "This criterion evaluates how effectively metaphors are used to help young children understand scientific concepts by linking them to familiar or imaginative ideas. It checks the appropriateness of when a metaphor or example is used, and does not judge when a metaphor or example is not used. Should be rated positively when: - Metaphors make abstract or invisible phenomena easier to grasp by comparing them to familiar, concrete objects. - The metaphor fits the child’s worldview and invites imagination. Should be rated negatively when: - The metaphor is confusing or mismatched, making the concept harder to understand. - The metaphor introduces scientific inaccuracies or misleading ideas.",
    },
  },
  "3": {
    intro:
      "In this dataset, the model generates product advertisement posts for social media. We evaluate them by the criteria '신뢰성', and we annotate some fragments that seem relevant to the criterion. What you are going to do is determining whether the selected fragment is **related to criterion or not**. Regardless of whether the criteria are positive or negative, you can determine whether or not the sentence is appropriate to evaluate based on this criterion.",
    criteria: {
      title: "신뢰성",
      desc: "이 기준은 광고가 시청자들에게 명확하고 정확한 정보를 제공함으로써 신뢰를 효과적으로 이끌어내는지 평가합니다. 제품·서비스 정보가 담긴 문장(예: 사양, 수치, 사용법 등)을 제공하고 있는지 중점적으로 살펴야 합니다. 명확한 설명 없이 기능을 과장을 하거나, 기능의 효과에 대해 애매하고 부정확한 표현으로 표현해선 안됩니다.",
    },
  },
  "5": {
    intro:
      "In this dataset, the model generates product horror stories based on the provided keywords in queries. We evaluate them by the criteria '키워드 활용', and we annotate some fragments that seem relevant to the criterion. What you are going to do is determining whether the selected fragment is **related to criterion or not**. Regardless of whether the criteria are positive or negative, you can determine whether or not the sentence is appropriate to evaluate based on this criterion.",
    criteria: {
      title: "키워드 활용",
      desc: "이 기준은 주어진 키워드가 이야기의 전개에 자연스럽고 창의적으로 결합되었는지를 평가합니다. Positive로 평가되어야 하는 경우: - 주어진 키워드가 이야기의 공포 분위기와 필연적으로 연결되어 독자가 부자연스러움을 느끼지 않습니다. - 키워드가 공포 요소를 만들어내는 핵심 역할을 하거나, 암시적으로 긴장감을 증폭시키는 요소로 작용합니다. - 키워드를 통해 독자가 이야기의 숨겨진 의미를 발견하거나 이야기의 반전을 이해하는 중요한 단서로 기능합니다. Negative로 평가되어야 하는 경우: - 키워드가 이야기의 흐름과 무관하게 부자연스럽게 삽입된 것으로 느껴집니다. - 키워드가 이야기의 공포나 전개에 기여하지 않고, 단순히 형식적으로만 사용되었습니다. - 키워드를 제거해도 이야기의 공포나 긴장감 형성에 별다른 영향이 없습니다",
    },
  },
  // 필요할 때 계속 추가…
};

export const DEFAULT_TASK_META: TaskMeta = TASK_META["1"];
