export type Todo = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;
};

export type TodoInDB = {
  id: string;
  title: string;
  description: string;
  isCompleted: number;
  createdAt: string;
};
