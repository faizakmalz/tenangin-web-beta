# tenangin-web-beta
Tenangin Admin Dashboard, uses to control all active users, reply on active user chat threads. 

## Quick Start

1. **Supabase Setup**
  Supabase needs to be adjust in exact tables, relations, and policies.
    - Create an account at [https://supabase.com](https://supabase.com).
    - Create a new project.
    - Copy the project URL and anon/public API key.
    - Set your Auth, Database, and Storage rules as needed.
    - (Optional) Run/init your SQL schema in Supabase > SQL Editor.
    - In the web repo, update your `.env` with:
      ```
      VITE_SUPABASE_URL=your-project-url
      VITE_SUPABASE_ANON_KEY=your-anon-key
      # ...other Supabase settings as needed
      ```

2. **Clone**
    ```bash
    git clone https://github.com/faizakmalz/tenangin-web-beta.git
    cd tenangin-web-beta
    ```

3. **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

4. **Setup Environment**
    ```bash
    cp .env.example .env
    # Edit .env with your Supabase info if needed
    ```

5. **Run (Development)**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

6. **Build + Run (Production)**
    ```bash
    npm run build
    npm start
    # or
    yarn build
    yarn start
    ```

---
