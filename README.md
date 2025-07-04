# TutYo

A tool to summarize, generate quizzes, provide fun facts, and generate flashcards on uploaded lecture notes.

# Login or Register Page

The login page consists of a header and a form. The header will restrict access to two navigation links - 'Dashboard', 'Profile' - until the user has logged in.

The page houses both the login and register views without linking to separate pages. By clicking the 'Sign up' (Login Mode) or 'Sign in' (Register Mode) text, the login and register views will be toggled.

If a user who has been confirmed as registered enters an incorrect password five times, their account will be locked. Recovery is only possible through the Forgot Password option.

Error messages will be shown, in keeping with friendly UX/UI principles, to ensure users know when something has gone wrong and what exactly that something is.

Once the loginOrRegister page is loaded, a login token will be checked for, which is encrypted and stored on LocalStorage when a user clicks 'Remember me' on successful log in.

Finally, A user can login using OAuth2 for google, Microsoft, and apple. Any successful login will result in the user being redirected to their account Dashboard.

## 🔧 Setup Instructions

1. Rename `envDemo` to `.env`
2. Replace placeholder values:
   - `DB_USER` = your MongoDB Atlas username
   - `DB_PASS` = your MongoDB Atlas password
   - `JWT_SECRET` = a secure 10–13+ character random string
3. Run:
   ```bash
   npm install
   ```
4. Start the Project:
   ```bash
       npm run dev # for development with nodemon
       npm run start # for production
   ```
