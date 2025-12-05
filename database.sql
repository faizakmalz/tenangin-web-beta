
CREATE TABLE public.profiles (
  anon_name text,
  avatar text,
  bio text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_active timestamp without time zone,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),  
  role text DEFAULT 'anon-user'::text,
  user_id uuid,
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

CREATE TABLE public.consultation_sessions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL DEFAULT uuid_generate_v4(),  
  deskripsi character varying,
  started_at timestamp without time zone,
  ended_at timestamp without time zone,
  status text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone,
  thread_id uuid,
  CONSTRAINT consultation_sessions_pkey PRIMARY KEY (id)
);

CREATE TABLE public.chat_threads (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  session_id bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  status text,
  last_message text,
  last_message_at timestamp without time zone,
  CONSTRAINT chat_threads_pkey PRIMARY KEY (id)
);

CREATE TABLE public.chat_messages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  thread_id uuid,
  sender_type text,
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  sender_id uuid,
  CONSTRAINT chat_messages_pkey PRIMARY KEY (id)
);

CREATE TABLE public.announcements (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  title text,
  content text,
  category text,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone,
  CONSTRAINT announcements_pkey PRIMARY KEY (id)
);

CREATE TABLE public.payments (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid,
  consultation_session_id bigint,
  amount bigint,
  status text,
  method text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id)
);

ALTER TABLE public.chat_threads
  ADD CONSTRAINT chat_threads_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.consultation_sessions(id),
  ADD CONSTRAINT chat_threads_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);

ALTER TABLE public.chat_messages
  ADD CONSTRAINT chat_messages_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES public.chat_threads(id),
  ADD CONSTRAINT chat_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id);

ALTER TABLE public.consultation_sessions
  ADD CONSTRAINT consultation_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  ADD CONSTRAINT consultation_sessions_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES public.chat_threads(id);

ALTER TABLE public.payments
  ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  ADD CONSTRAINT payments_consultation_session_id_fkey FOREIGN KEY (consultation_session_id) REFERENCES public.consultation_sessions(id);
