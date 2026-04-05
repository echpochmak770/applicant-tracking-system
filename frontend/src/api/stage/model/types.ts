export type StageType = {
  id: string;
  name: string;
  order: number;
  isFinal: boolean;
};

export type UpdateStagePayload = {
  targetStageId: string;
  comment: string;
};

export type RejectPayload = {
  comment: string;
};
