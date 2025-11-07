// src\lib\mappings.ts

export const DEPARTMENT_CONFIG = {
  IT: { type: "IT Intern", role: "member" },
  HR: { type: "HR Intern", role: "admin" },
  Marketing: { type: "Marketing Intern", role: "member" },
  Design: { type: "Graphic Design Intern", role: "member" },
  Content: { type: "Content Creation Intern", role: "member" },
  Video: { type: "Video Editor Intern", role: "member" },
  Esports: { type: "E-Sports Intern", role: "member" },
} as const;
