
type Session = {
  id: any;
  profiles: {
    anon_name: string;
  };
  status: string;
  started_at: string;
  ended_at: string;
};

type AnonUser = {
  id: string;         
  anon_name: string;    
  avatar?: string;      
  bio?: string;               
  last_active: string | null;
  created_at?: string;
};

export type { Session, AnonUser };