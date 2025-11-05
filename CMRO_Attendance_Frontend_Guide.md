# INTERNSHIP ATTENDANCE MONITORING SYSTEM

## Beginner's Guide to Next.js Frontend Development

---

## 📚 TABLE OF CONTENTS

1. [Project Introduction](#1-project-introduction)
2. [Getting Started](#2-getting-started)
3. [Understanding the Project Structure](#3-understanding-the-project-structure)
4. [Next.js App Router Explained](#4-nextjs-app-router-explained)
5. [Components Deep Dive](#5-components-deep-dive)
6. [Server vs Client Components](#6-server-vs-client-components)
7. [Authentication Flow](#7-authentication-flow)
8. [Working with Forms](#8-working-with-forms)
9. [Styling with Tailwind CSS](#9-styling-with-tailwind-css)
10. [Common Tasks & How-To's](#10-common-tasks--how-tos)
11. [Debugging Tips](#11-debugging-tips)

---

## 1. PROJECT INTRODUCTION

### What is this project?

This is an **Internship Attendance Monitoring System** that allows interns to:

- Clock in/out with timestamp verification
- View their attendance history
- Track hours rendered vs. required hours
- Submit documentation

### Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Backend**: Next.js Server Actions with Supabase (PostgreSQL database + Authentication)
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Vercel

---

## 2. GETTING STARTED

### Prerequisites

Before you begin, make sure you have installed:

- Node.js (v20 or higher) - [Download here](https://nodejs.org/)
- Git - [Download here](https://git-scm.com/)
- VS Code (recommended) - [Download here](https://code.visualstudio.com/)

### Initial Setup

1. **Clone the repository**

```bash
git clone https://github.com/zzelif/cmro-attendance.git
cd cmro-attendance
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the development server**

```bash
npm run dev
```

4. **Open your browser**
   Navigate to: http://localhost:3000

### Useful Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Check for code errors
```

---

## 3. UNDERSTANDING THE PROJECT STRUCTURE

### Root Level Files

```
cmro-attendance/
├── src/                    # All source code lives here
├── package.json            # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── next.config.ts         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS settings (implied)
├── components.json        # shadcn/ui configuration
└── .gitignore             # Files to ignore in Git
```

### Inside `src/` Folder

```
src/
├── app/                   # ROUTING & PAGES (App Router)
│   ├── layout.tsx         # Root layout (wraps all pages)
│   ├── page.tsx           # Home page (/)
│   ├── globals.css        # Global styles
│   ├── (auth)/            # Authentication routes
│   │   └── login/
│   │       ├── page.tsx       # Login page (/login)
│   │       └── LoginForm.tsx  # Login form component
│   └── (dashboard)/       # Dashboard routes (protected)
│       ├── layout.tsx     # Dashboard layout
│       └── member/
│           └── page.tsx   # Member dashboard (/member)
│
├── components/            # REUSABLE UI COMPONENTS
│   ├── Providers.tsx      # App-wide providers (Toast, etc.)
│   ├── dashboard/
│   │   └── navbar.tsx     # Dashboard navigation bar
│   └── ui/                # shadcn/ui components
│       ├── button.tsx     # Button component
│       ├── card.tsx       # Card component
│       └── spinner.tsx    # Loading spinner
│
├── lib/                   # UTILITY FUNCTIONS & HELPERS
│   ├── utils.ts           # General utilities (cn function)
│   ├── helpers.ts         # Business logic helpers
│   ├── schemas/
│   │   └── LoginSchema.ts # Form validation schemas
│   └── supabase/          # Supabase client configs
│       ├── client.ts      # Browser client
│       ├── server.ts      # Server client
│       ├── middleware.ts  # Auth middleware
│       └── admin.ts       # Admin client
│
├── actions/               # SERVER ACTIONS (Backend logic)
│   ├── authActions.ts     # Login, logout, get user
│   └── memberActions.ts   # Member-specific actions
│
├── types/                 # TYPESCRIPT TYPE DEFINITIONS
│   └── index.d.ts         # Global types
│
├── proxy.ts               # MIDDLEWARE (Auth protection)
└── routes.ts              # Route configuration
```

### Key Concepts

#### 📁 Folder Groups: `(auth)` and `(dashboard)`

- Folders with parentheses `()` are **route groups**
- They organize routes without affecting the URL
- Example: `app/(auth)/login/page.tsx` → URL is `/login` (not `/auth/login`)

#### 📄 Special Files

- `layout.tsx` - Wraps pages with shared UI (navbar, footer)
- `page.tsx` - The actual page content
- `loading.tsx` - Loading state (optional)
- `error.tsx` - Error boundary (optional)

---

## 4. NEXT.JS APP ROUTER EXPLAINED

### How Routing Works

In Next.js App Router, the folder structure inside `app/` determines your URLs.

```
app/
├── page.tsx              → /
├── (auth)/
│   └── login/
│       └── page.tsx      → /login
└── (dashboard)/
    └── member/
        └── page.tsx      → /member
```

### Example: Creating a New Page

**Task**: Create an "About" page at `/about`

1. Create folder structure:

```bash
src/app/about/page.tsx
```

2. Add content:

```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">About Us</h1>
      <p>This is the attendance monitoring system.</p>
    </div>
  );
}
```

3. Navigate to: http://localhost:3000/about

### Layouts: Shared UI Across Pages

**Root Layout** (`app/layout.tsx`)

- Wraps ALL pages
- Contains HTML structure, fonts, providers

```tsx
// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children} {/* This is where page content renders */}
        </Providers>
      </body>
    </html>
  );
}
```

**Dashboard Layout** (`app/(dashboard)/layout.tsx`)

- Only wraps dashboard pages (`/member`, `/admin`, etc.)
- Adds navbar and authentication check

```tsx
// src/app/(dashboard)/layout.tsx
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const member = await getMember(); // Check if user is logged in

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar fullName={member.full_name} role={member.role} />
      <main>{children}</main>
    </div>
  );
}
```

---

## 5. COMPONENTS DEEP DIVE

### What is a Component?

A component is a **reusable piece of UI**. Think of it like a building block.

**Example**: Button Component

```tsx
// components/ui/button.tsx (simplified)
export function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {children}
    </button>
  );
}
```

**Usage**:

```tsx
import { Button } from "@/components/ui/button";

<Button onClick={() => alert("Clicked!")}>Click Me</Button>;
```

### Component Categories in This Project

#### 1. UI Components (`components/ui/`)

These are **basic building blocks** from shadcn/ui.

**Button** (`button.tsx`)

```tsx
import { Button } from '@/components/ui/button';

<Button variant="default">Default Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="destructive">Delete</Button>
<Button size="lg">Large Button</Button>
```

**Card** (`card.tsx`)

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Total Hours</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-bold">120 hrs</p>
  </CardContent>
</Card>;
```

**Spinner** (`spinner.tsx`)

```tsx
import { Spinner } from "@/components/ui/spinner";

<Spinner className="text-blue-500" />;
```

#### 2. Feature Components (`components/dashboard/`)

**Navbar** (`navbar.tsx`)

- Displays user info and logout button
- Used in dashboard layout

```tsx
// components/dashboard/navbar.tsx
export function Navbar({ fullName, role }: { fullName: string; role: string }) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="px-6 py-4 flex justify-between">
        <div>
          <h1 className="text-xl font-bold">Welcome, {fullName}</h1>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </nav>
  );
}
```

#### 3. Page Components (`app/**/page.tsx`)

**Member Dashboard** (`app/(dashboard)/member/page.tsx`)

```tsx
export default function MemberPage() {
  return (
    <div className="flex gap-4 flex-col">
      {/* Time In/Out Section */}
      <div className="bg-white rounded-lg p-5">
        <h1>Current Time</h1>
        <Button>Time In</Button>
        <Button variant="outline">Time Out</Button>
      </div>

      {/* Stats Section */}
      <div className="flex gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Required</CardTitle>
          </CardHeader>
          <CardContent>500 hrs</CardContent>
        </Card>
        {/* More cards... */}
      </div>
    </div>
  );
}
```

### Component Props

Props are **inputs** to components (like function parameters).

```tsx
// Define a component with props
interface GreetingProps {
  name: string;
  age?: number;  // Optional prop (?)
}

function Greeting({ name, age }: GreetingProps) {
  return (
    <div>
      <p>Hello, {name}!</p>
      {age && <p>You are {age} years old.</p>}
    </div>
  );
}

// Use the component
<Greeting name="John" age={25} />
<Greeting name="Jane" />
```

---

## 6. SERVER VS CLIENT COMPONENTS

This is a **key concept** in Next.js 13+.

### Server Components (Default)

- Run on the **server** only
- Cannot use browser APIs (useState, useEffect, onClick)
- Can fetch data directly (no API needed)
- Better performance (less JavaScript sent to browser)

```tsx
// This is a Server Component (no 'use client')
import { getMember } from "@/actions/authActions";

export default async function MemberPage() {
  const member = await getMember(); // Server-side data fetching

  return (
    <div>
      <h1>Welcome, {member.full_name}</h1>
    </div>
  );
}
```

### Client Components

- Run in the **browser**
- Can use React hooks (useState, useEffect)
- Can handle user interactions (onClick, onChange)
- Must add `"use client"` at the top

```tsx
// This is a Client Component
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### When to Use Which?

| Feature                     | Server Component | Client Component           |
| --------------------------- | ---------------- | -------------------------- |
| Fetch data from database    | ✅ Yes           | ❌ No (use Server Actions) |
| Use `useState`, `useEffect` | ❌ No            | ✅ Yes                     |
| Handle button clicks        | ❌ No            | ✅ Yes                     |
| Access cookies/headers      | ✅ Yes           | ❌ No                      |
| SEO-friendly                | ✅ Yes           | ⚠️ Partial                 |

### Example: Login Form (Client Component)

```tsx
// app/(auth)/login/LoginForm.tsx
"use client"; // MUST ADD THIS

import { useForm } from "react-hook-form";
import { signInUser } from "@/actions/authActions";

export default function LoginForm() {
  const { register, handleSubmit } = useForm();

  async function onSubmit(data) {
    const result = await signInUser(data);
    // Handle login...
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" />
      <input {...register("password")} type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## 7. AUTHENTICATION FLOW

### How Login Works

1. **User enters credentials** → LoginForm.tsx (client)
2. **Form submits** → Calls `signInUser()` server action
3. **Server validates** → Checks Supabase database
4. **Session created** → Cookie stored in browser
5. **Redirect** → User goes to dashboard based on role

### Files Involved

#### 1. Login Page (`app/(auth)/login/page.tsx`)

```tsx
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
```

#### 2. Login Form (`app/(auth)/login/LoginForm.tsx`)

```tsx
"use client";

import { signInUser } from "@/actions/authActions";

export default function LoginForm() {
  async function handleLogin(data) {
    const result = await signInUser(data);

    if (result.status === "success") {
      router.push(`/${result.data}`); // /member, /admin, /super
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleLogin)}>{/* Form fields... */}</form>
  );
}
```

#### 3. Auth Actions (`actions/authActions.ts`)

```tsx
"use server";

export async function signInUser(credentials) {
  const supabase = await createClient();

  // Sign in with Supabase
  const { error, data } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) return { status: "error", error: "Invalid credentials" };

  // Get member profile
  const { data: member } = await supabase
    .from("members")
    .select("role, is_active")
    .eq("user_id", data.user.id)
    .single();

  return { status: "success", data: member.role };
}
```

#### 4. Middleware (`proxy.ts`)

Protects routes from unauthorized access.

```tsx
export async function proxy(request: NextRequest) {
  const { user } = await updateSession(request);

  // If trying to access /member but not logged in
  if (isProtected && !user) {
    return NextResponse.redirect("/login");
  }

  // If logged in and trying to access /login
  if (isAuth && user) {
    return NextResponse.redirect(`/${getUserRole(user)}`);
  }

  return response;
}
```

### Protected Routes

Defined in `routes.ts`:

```tsx
export const protectedRoutes = ["/member", "/admin", "/super"];
export const authRoutes = ["/login"];
export const publicRoutes = ["/"];
```

---

## 8. WORKING WITH FORMS

### Form Libraries Used

1. **React Hook Form** - Form state management
2. **Zod** - Validation schemas
3. **@hookform/resolvers** - Connects Zod to React Hook Form

### Example: Login Form Breakdown

#### Step 1: Define Validation Schema

```tsx
// lib/schemas/LoginSchema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
```

#### Step 2: Create Form Component

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "@/lib/schemas/LoginSchema";

export default function LoginForm() {
  const {
    register, // Connect inputs to form
    handleSubmit, // Form submit handler
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // Validate on every change
  });

  async function onSubmit(data: LoginSchema) {
    // data = { email: '...', password: '...' }
    const result = await signInUser(data);
    // Handle result...
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Email field */}
      <div>
        <input
          {...register("email")} // Connects input to form
          type="email"
          placeholder="Email"
        />
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
      </div>

      {/* Password field */}
      <div>
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Submit button */}
      <Button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
```

### How `register()` Works

```tsx
<input {...register('email')} />

// Is equivalent to:
<input
  name="email"
  ref={/* form reference */}
  onChange={/* update form state */}
  onBlur={/* validate field */}
/>
```

### Common Form Patterns

#### Get form values

```tsx
const { watch } = useForm();
const emailValue = watch("email"); // Real-time value
```

#### Reset form

```tsx
const { reset } = useForm();
reset(); // Clear all fields
```

#### Set field value programmatically

```tsx
const { setValue } = useForm();
setValue("email", "test@example.com");
```

---

## 9. STYLING WITH TAILWIND CSS

### What is Tailwind?

Tailwind CSS is a **utility-first CSS framework**. Instead of writing CSS classes, you use pre-built utility classes.

**Traditional CSS**:

```css
.button {
  padding: 0.5rem 1rem;
  background-color: blue;
  color: white;
  border-radius: 0.25rem;
}
```

**Tailwind CSS**:

```tsx
<button className="px-4 py-2 bg-blue-500 text-white rounded">Click me</button>
```

### Common Tailwind Classes

#### Layout

```tsx
<div className="flex">          {/* Flexbox */}
<div className="flex-col">      {/* Vertical flex */}
<div className="grid">          {/* CSS Grid */}
<div className="gap-4">         {/* 1rem gap */}
<div className="justify-center"> {/* Center horizontally */}
<div className="items-center">  {/* Center vertically */}
```

#### Spacing

```tsx
<div className="p-4">     {/* Padding: 1rem (all sides) */}
<div className="px-6">    {/* Padding: 1.5rem (left & right) */}
<div className="py-2">    {/* Padding: 0.5rem (top & bottom) */}
<div className="m-4">     {/* Margin: 1rem */}
<div className="mt-6">    {/* Margin-top: 1.5rem */}
```

**Spacing Scale**:

- `1` = 0.25rem (4px)
- `2` = 0.5rem (8px)
- `4` = 1rem (16px)
- `6` = 1.5rem (24px)
- `8` = 2rem (32px)

#### Colors

```tsx
<div className="bg-blue-500">       {/* Background */}
<div className="text-red-600">      {/* Text color */}
<div className="border-gray-200">   {/* Border color */}
```

**Color Scale**: 50 (lightest) to 950 (darkest)

#### Typography

```tsx
<h1 className="text-2xl font-bold">Heading</h1>
<p className="text-sm text-gray-600">Small gray text</p>
<span className="font-semibold">Semi-bold</span>
```

#### Borders & Rounded Corners

```tsx
<div className="border">             {/* 1px border */}
<div className="border-2">           {/* 2px border */}
<div className="rounded">            {/* 4px border-radius */}
<div className="rounded-lg">         {/* 8px border-radius */}
<div className="rounded-full">       {/* Fully rounded */}
```

#### Width & Height

```tsx
<div className="w-full">             {/* Width: 100% */}
<div className="w-1/2">              {/* Width: 50% */}
<div className="h-screen">           {/* Height: 100vh */}
<div className="min-h-screen">       {/* Min-height: 100vh */}
```

#### Hover & Active States

```tsx
<button className="bg-blue-500 hover:bg-blue-600">
  Hover me
</button>

<button className="border border-gray-300 focus:ring-2 focus:ring-blue-500">
  Focus me
</button>
```

### Responsive Design

Tailwind uses breakpoints:

- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

```tsx
<div className="text-sm md:text-base lg:text-lg">
  {/* Small text on mobile, medium on tablets, large on desktop */}
</div>

<div className="flex-col md:flex-row">
  {/* Vertical layout on mobile, horizontal on desktop */}
</div>
```

### The `cn()` Utility Function

Located in `lib/utils.ts`, this function **merges Tailwind classes** safely.

```tsx
import { cn } from '@/lib/utils';

// Without cn() - later classes might not override
<div className="text-red-500 text-blue-500">  {/* Which color wins? */}

// With cn() - properly merges
<div className={cn("text-red-500", "text-blue-500")}>  {/* Blue wins */}

// Conditional classes
<div className={cn(
  "px-4 py-2 rounded",
  isActive ? "bg-blue-500" : "bg-gray-300"
)}>
```

---

## 10. COMMON TASKS & HOW-TO'S

### Task 1: Add a New Page

**Goal**: Create a "Profile" page at `/profile`

1. Create file: `src/app/(dashboard)/profile/page.tsx`

```tsx
export default function ProfilePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <p>This is your profile page.</p>
    </div>
  );
}
```

2. Navigate to: http://localhost:3000/profile

### Task 2: Create a Reusable Component

**Goal**: Create a `StatCard` component

1. Create file: `src/components/dashboard/StatCard.tsx`

```tsx
interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm text-gray-600">{title}</h3>
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
```

2. Use it:

```tsx
import { StatCard } from "@/components/dashboard/StatCard";
import { Clock } from "lucide-react";

<StatCard
  title="Hours Rendered"
  value="120 hrs"
  icon={<Clock className="w-5 h-5" />}
/>;
```

### Task 3: Add a Button with Loading State

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function TimeInButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleTimeIn() {
    setIsLoading(true);
    try {
      // Call server action
      await timeInAction();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button onClick={handleTimeIn} disabled={isLoading}>
      {isLoading ? (
        <>
          <Spinner className="mr-2" />
          Processing...
        </>
      ) : (
        "Time In"
      )}
    </Button>
  );
}
```

### Task 4: Fetch and Display Data

```tsx
// Server Component (no 'use client')
import { getMemberStats } from "@/actions/memberActions";

export default async function StatsPage() {
  // Fetch data on server
  const stats = await getMemberStats();

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard title="Total Hours" value={stats.totalHours} />
      <StatCard title="Rendered" value={stats.renderedHours} />
      <StatCard title="Remaining" value={stats.remainingHours} />
    </div>
  );
}
```

### Task 5: Show Toast Notifications

Already set up with `react-toastify`.

```tsx
"use client";

import { toast } from "react-toastify";

function MyComponent() {
  function handleSuccess() {
    toast.success("Operation successful!");
  }

  function handleError() {
    toast.error("Something went wrong!");
  }

  return (
    <>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
    </>
  );
}
```

---

## 11. DEBUGGING TIPS

### Common Errors & Solutions

#### Error: "You're importing a component that needs useState..."

**Cause**: Using React hooks in a Server Component

**Solution**: Add `"use client"` at the top of the file

```tsx
"use client"; // ← ADD THIS

import { useState } from "react";
// ...
```

#### Error: "Cannot read property 'map' of undefined"

**Cause**: Data not loaded yet

**Solution**: Add optional chaining or loading state

```tsx
// Option 1: Optional chaining
{members?.map((member) => ...)}

// Option 2: Loading state
if (!members) return <Spinner />;
```

#### Error: "Hydration failed"

**Cause**: Server-rendered HTML doesn't match client HTML

**Common causes**:

- Using `Date.now()` or `Math.random()` directly in render
- Browser-only APIs (localStorage, window)

**Solution**:

```tsx
"use client";

import { useEffect, useState } from "react";

function MyComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Now safe to use browser APIs
  return <div>{window.innerWidth}</div>;
}
```

### Debugging Tools

#### 1. Console Logging

```tsx
console.log("Debug:", { user, role, timestamp });
```

#### 2. React DevTools

Install: [React Developer Tools](https://react.dev/learn/react-developer-tools)

- Inspect component tree
- View props and state

#### 3. Network Tab

- Open browser DevTools (F12)
- Go to "Network" tab
- See all API requests and responses

#### 4. TypeScript Errors

Hover over red squiggly lines in VS Code to see error messages.

---

## 📚 ADDITIONAL RESOURCES

### Official Documentation

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Supabase**: https://supabase.com/docs

### Video Tutorials

- [Next.js 13 Crash Course](https://www.youtube.com/watch?v=NgayZAuTgwM) - Traversy Media
- [Tailwind CSS Crash Course](https://www.youtube.com/watch?v=UBOj6rqRUME) - Traversy Media
- [TypeScript for Beginners](https://www.youtube.com/watch?v=BwuLxPH8IDs) - Net Ninja

### Useful VS Code Extensions

1. **ES7+ React/Redux/React-Native snippets** - Code shortcuts
2. **Tailwind CSS IntelliSense** - Autocomplete for Tailwind
3. **Prettier** - Code formatter
4. **Error Lens** - Inline error messages

---

## 🎯 NEXT STEPS

1. **Read through this guide** fully
2. **Run the project** locally (`npm run dev`)
3. **Explore the codebase** - Open files and see how they connect
4. **Make small changes** - Try editing text, colors, layouts
5. **Create a test page** - Practice routing
6. **Ask questions** - Don't hesitate to reach out!

---

## 💡 TIPS FOR SUCCESS

- **Start small** - Don't try to understand everything at once
- **Read error messages** - They often tell you exactly what's wrong
- **Use console.log()** - Print values to see what's happening
- **Google your errors** - Someone has probably solved it before
- **Break down tasks** - Work on one feature at a time
- **Commit often** - Save your progress with Git
- **Ask for help** - Your team is here to support you!

---

## 📞 NEED HELP?

If you get stuck:

1. Check the **Google Doc** (link in README.md)
2. Review this guide's relevant section
3. Search the error message on Google/Stack Overflow
4. Ask your team members
5. Check the official documentation

---

**Good luck! You've got this! 🚀**
