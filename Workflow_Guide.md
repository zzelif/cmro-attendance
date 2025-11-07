### Paano mag-clone sa PC mo locally

### Prerequisites

- Node.js (v20 or later)
- npm (v6 or later)
- Git

---

### Steps:

1. **Clone the repository:**

```bash
   git clone https://github.com/zzelif/cmro-attendance.git
```

2. **Navigate into the project directory:**

```bash
   cd cmro-attendance
```

3. **Gumawa ng sarili mong local branch for safe experimentation:**

```bash
   git switch -c pangalan-ng-feature-o-functionality-na-gagawin-mo
```

4. **I-check kung nasa tamang branch ka:**

```bash
   git status
```

5. **Install all dependencies:**

```bash
   npm install
```

6. **Siguraduhing naka-ignore ang `node_modules` folder sa `.gitignore`:**

   - Kung wala pa, gumawa ng `.gitignore` file sa root ng project at isulat ito:

```bash
     node_modules
```

---

### Paano mag-start ng Development Server (para makita ang itsura ng website sa local PC)

1. **I-type sa terminal sa loob ng project folder:**

```bash
   npm run dev
```

2. **Pindutin `Ctrl + C` para i-stop kapag tapos ka na.**

---

### Paano mag-push ng changes at gumawa ng Pull Request (PR)

1. **Gumawa o baguhin ang mga files na kailangan para sa feature/fix mo.**

2. **I-check ang status ng mga changes:**

```bash
   git status
```

3. **I-add ang mga binago mong files:**

```bash
   git add .
```

4. **Gumawa ng commit na may malinaw na message:**

```bash
   git commit -m "Descriptive message tungkol sa feature o fix"
```

5. **I-push ang branch mo sa remote repository:**

```bash
   git push origin pangalan-ng-branch-mo
```

6. **Pumunta sa GitHub repo ([https://github.com/zzelif/cmro-attendance](https://github.com/zzelif/cmro-attendance))**

7. **Makikita mo doon ang prompt na gumawa ng Pull Request. I-click ito.**

8. **Sa PR description, ilagay kung ano ang ginawa mong changes.**

9. **I-submit ang Pull Request. Hintayin ang review at approval.**

---

### Paano kung hindi nakapagcreate ng feature branch before magwork sa isang function (nasa main ka gumawa locally)

# 1. Check kung talagang nasa main ka at may changes

```bash
git status
```

# 2. Gumawa ng bagong branch (yung changes mo dadalhin dito)

```bash
git switch -c feature-branch-name
```

# 3. I-commit yung work mo sa bagong branch

```bash
git add .
git commit -m "Moved work from main to feature branch"
```

# 4. Bumalik sa main branch

```bash
git switch main
```

# 5. I-pull ang latest updates

```bash
git pull origin main
```

# 6. Bumalik sa feature branch at i-merge ang updates

```bash
git switch feature-branch-name
git merge main
```

# 7. Resolve conflicts kung meron, then push

```bash
git push origin feature-branch-name
```

### Pinaka-SAFE na approach﻿ (kung takot ka ma-lose ang work):

# 1. BACKUP MUNA - gumawa ng temporary branch

```bash
git branch backup-just-in-case
```

# 2. Check kung ano yung commits mo na wala sa remote

```bash
git log origin/main..main
```

# 3. Gumawa ng feature branch

```bash
git switch -c feature-my-work
```

# 4. Bumalik sa main at i-sync sa remote

```bash
git switch main
git reset --hard origin/main
git pull origin main
```

# 5. Merge main into feature branch

```bash
git switch feature-my-work
git merge main
```

# 6. Resolve conflicts, test, then push

```bash
git push origin feature-my-work
```

# Pag-alis ng backup﻿ (after confirm na safe lahat﻿):

```bash
git branch -D backup-just-in-case
```

### Paano mag-pull ng bagong updates mula sa `main` branch o ibang branches

1. **Siguraduhing nasa tamang local branch ka kung saan mo gustong i-merge ang updates:**

   Halimbawa, kung nasa feature branch ka:

```bash
   git switch pangalan-ng-feature-branch-mo
```

2. **I-pull ang latest updates mula sa `main` branch papunta sa current branch mo:**

```bash
   git pull origin main
```

> Ginagamit ito kapag gusto mong isama ang mga latest updates ng `main` sa feature branch mo.

3. **Kung gusto mong i-pull ang updates mula sa ibang branch (halimbawa `dev`):**

```bash
   git pull origin dev
```

4. **Ayusin ang merge conflicts kung meron. Sundin ang instructions ni Git sa terminal.**

5. **I-commit ang resolved conflicts kung kinakailangan:**

```bash
   git add .
   git commit -m "Resolved merge conflicts from main"
```

6. **Optional: I-push ang updated branch mo sa remote kung gusto mong i-sync ang merged state:**

```bash
   git push
```

---

### Paano mag-resolve ng Merge Conflicts

# Ano ang Merge Conflict?

Nangyayari ito kung dalawa kayong nag-edit ng same part ng same file﻿.

# Halimbawa ng Conflict:

Si Git magsasabi ng ganito:

```text
CONFLICT (content): Merge conflict in src/components/Header.jsx
Automatic merge failed; fix conflicts and then commit the result.
```

# Steps:

1. Buksan yung file na may conflict (src/components/Header.jsx):

```javascript
import React from 'react';

function Header() {
  <<<<<<< HEAD
  // Yung code mo
  const title = "My Feature Title";
  =======
  // Yung code sa main branch
  const title = "Updated Main Title";
  >>>>>>> main

  return <h1>{title}</h1>;
}
```

2. Markers na makikita mo:
   -- <<<<<<< HEAD - simula ng your changes
   -- ======= - separator
   -- >>>>>>> main - dulo ng incoming changes

3. Piliin kung alin ang ikeep:

# Option A - Piliin yung sa iyo:

```jsx
const title = "My Feature Title";
```

# Option B - Piliin yung sa main:

```jsx
const title = "Updated Main Title";
```

# Option C - Pagsamahin o baguhin:

```jsx
const title = "My Feature - Updated Main Title";
```

4. Tanggalin lahat ng conflict markers (<<<<<<<, =======, >>>>>>>)

5. I-save ang file

6. I-add at i-commit ang resolved file:

```bash
git add src/components/Header.jsx
git commit -m "Resolved merge conflict in Header component"
```

7. I-push ang resolved changes:

```bash
git push origin feature-branch-name
```

# Kung sobrang daming conflicts at gusto mong i-abort:

```bash
git merge --abort     # Kung nag-merge ka
git rebase --abort    # Kung nag-rebase ka
```

# Babalik sa state bago ka nag-merge/rebase. Start over.

### Summary:

- `git pull origin main` → ginagamit kapag gusto mong kunin ang latest updates ng `main`.
- Make sure nasa tamang branch ka bago mag-pull.
- Resolve conflicts kung meron, tapos i-commit at i-push kung kinakailangan.
