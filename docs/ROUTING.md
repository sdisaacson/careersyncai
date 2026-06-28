# Routing

Complete route reference for CareerSync AI.

---

## Route Overview

All routes are defined in `src/App.tsx` using React Router v7.

```tsx
<BrowserRouter>
  <TRPCProvider>
    <App />
  </TRPCProvider>
</BrowserRouter>
```

---

## Public Routes

Accessible without authentication.

| Route              | Page                    | Description                                                         |
| ------------------ | ----------------------- | ------------------------------------------------------------------- |
| `/`                | `Home.tsx`              | Landing page with hero, features, process, stats, testimonials, CTA |
| `/demo`            | `DemoPage.tsx`          | Demo journey landing (Barbara's story)                              |
| `/demo/upload`     | `DemoUploadPage.tsx`    | Demo resume upload                                                  |
| `/demo/interview`  | `DemoInterviewPage.tsx` | Demo AI interview                                                   |
| `/demo/research`   | `DemoResearchPage.tsx`  | Demo research agents                                                |
| `/demo/results`    | `DemoResultsPage.tsx`   | Demo results dashboard                                              |
| `/demo/resumes`    | `DemoResumesPage.tsx`   | Demo tailored resumes                                               |
| `/login`           | `Login.tsx`             | Sign in page                                                        |
| `/signup`          | `SignupPage.tsx`        | Pricing plans & subscription selection                              |
| `/register`        | `RegisterPage.tsx`      | Account registration                                                |
| `/verify-email`    | `VerifyEmail.tsx`       | Email verification handler                                          |
| `/forgot-password` | `ForgotPassword.tsx`    | Password reset request                                              |
| `/reset-password`  | `ResetPassword.tsx`     | Password reset confirmation                                         |

---

## Authenticated Routes

Require valid login session. The `useAuth` hook handles redirect to `/login` if unauthenticated.

| Route        | Page                | Description                            |
| ------------ | ------------------- | -------------------------------------- |
| `/upload`    | `UploadPage.tsx`    | Resume upload (Step 1)                 |
| `/interview` | `InterviewPage.tsx` | AI interview (Step 2)                  |
| `/research`  | `ResearchPage.tsx`  | Research agents (Step 3)               |
| `/dashboard` | `DashboardPage.tsx` | Job results (Step 4)                   |
| `/resumes`   | `ResumesPage.tsx`   | Tailored resumes (Step 5)              |
| `/datasheet` | `DatasheetPage.tsx` | Complete data table                    |
| `/account`   | `AccountPage.tsx`   | User profile & subscription management |

---

## Admin Routes

Require `admin` role. Protected by `AdminLayout` which checks `user.role === "admin"`.

| Route                  | Page                         | Description              |
| ---------------------- | ---------------------------- | ------------------------ |
| `/admin`               | `AdminDashboardPage.tsx`     | Admin dashboard overview |
| `/admin/users`         | `AdminUsersPage.tsx`         | User management table    |
| `/admin/subscriptions` | `AdminSubscriptionsPage.tsx` | Subscription records     |
| `/admin/settings`      | `AdminSettingsPage.tsx`      | App configuration        |

---

## Route Guards

### Auth Guard Pattern

```tsx
// useAuth hook handles redirect
const { user, isLoading } = useAuth({
  redirectOnUnauthenticated: true,
  redirectPath: "/login",
});
```

### Admin Guard Pattern

```tsx
// AdminLayout checks role
if (!isAuthenticated || user?.role !== "admin") {
  return <AccessDenied />;
}
```

---

## 5-Step Pipeline Flow

```
/upload     → /interview   → /research    → /dashboard   → /resumes
Step 1      → Step 2      → Step 3      → Step 4      → Step 5
Resume      → Interview   → Research    → Results     → Tailored
Upload      → Questions   → Agents      → Dashboard   → Resumes
```

Each step shows a progress indicator with the current step highlighted.

---

## Navigation Structure

### Navbar Links (Desktop)

```
Home → Demo → Upload → Interview → Research → Dashboard → Resumes → Datasheet
```

### Auth Links

**Logged Out:**

- Login → Sign Up

**Logged In:**

- Account → Log Out
- Admin (if role === "admin")

### Footer Links

- Product: Features, How It Works, Pricing, API Access
- Resources: Blog, Career Guide, Resume Tips, FAQ
- Company: About, Careers, Contact, Press
- Legal: Privacy Policy, Terms of Service, Cookie Policy

---

## URL Parameters & Query Strings

### Query Parameters

| Route             | Parameter        | Description                            |
| ----------------- | ---------------- | -------------------------------------- |
| `/resumes`        | `?jobId={id}`    | Pre-select a job for resume generation |
| `/verify-email`   | `?token={token}` | Email verification token               |
| `/reset-password` | `?token={token}` | Password reset token                   |

---

## Not Found

| Route | Page           | Description                     |
| ----- | -------------- | ------------------------------- |
| `*`   | `NotFound.tsx` | 404 page with link back to home |

---

## Route Implementation

```tsx
// src/App.tsx
export default function App() {
  return (
    <Layout>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/demo/upload" element={<DemoUploadPage />} />
        <Route path="/demo/interview" element={<DemoInterviewPage />} />
        <Route path="/demo/research" element={<DemoResearchPage />} />
        <Route path="/demo/results" element={<DemoResultsPage />} />
        <Route path="/demo/resumes" element={<DemoResumesPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Authenticated */}
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/resumes" element={<ResumesPage />} />
        <Route path="/datasheet" element={<DatasheetPage />} />
        <Route path="/account" element={<AccountPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
```
