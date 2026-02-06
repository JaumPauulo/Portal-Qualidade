
export enum ProjectStatus {
  COMPLETED = 'Concluído',
  ONGOING = 'Em Andamento'
}

export interface Project {
  id: string;
  title: string;
  tag: string;
  description: string;
  status: ProjectStatus;
  sectors?: string[];
  before?: string;
  after?: string;
  result?: string;
  forecast?: string;
  focus?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  level: number;
  image: string;
  category: string;
  email: string;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
}
