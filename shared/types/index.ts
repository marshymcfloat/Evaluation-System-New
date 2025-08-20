export type SubjectForEvaluation = {
  subject: {
    id: string;
    name: string;
    subjectCode: string;
    iconName: string | null;
  };
  instructor: {
    id: string;
    name: string;
  };
  hasEvaluated: boolean;
};
