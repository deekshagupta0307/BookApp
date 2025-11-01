# Page Routing URL Information

This document contains all the routing URLs for the BookApp application. The app uses Expo Router (file-based routing) with nested route groups.

## Table of Contents
- [Authentication Routes](#authentication-routes)
- [Tab Navigation Routes](#tab-navigation-routes)
- [Book Routes](#book-routes)
- [Profile Routes](#profile-routes)
- [My Pals Routes](#my-pals-routes)
- [My Shelf Routes](#my-shelf-routes)
- [Component Routes](#component-routes)
- [Other Routes](#other-routes)

---

## Authentication Routes

Routes within the `(auth)` route group (does not require authentication).

| Route Path | File Path | Description |
|------------|-----------|-------------|
| `/(auth)/signup` | `app/(auth)/signup.tsx` | User signup page with social login options (Google, Apple) |
| `/(auth)/signin` | `app/(auth)/signin.tsx` | User signin page with email/password and social login |

**Navigation Examples:**
```typescript
router.replace("/(auth)/signup");
router.push("/(auth)/signin");
router.replace("/(auth)/signin");
```

---

## Tab Navigation Routes

Main tab navigation routes. These are accessible via the bottom tab bar when authenticated.

| Route Path | File Path | Tab Bar Label | Description |
|------------|-----------|---------------|-------------|
| `/(tabs)/home` | `app/(tabs)/home.tsx` | Home | Main home page with reading progress and book cards |
| `/(tabs)/explore` | `app/(tabs)/explore.tsx` | Explore | Book discovery and exploration page |
| `/(tabs)/profile` | `app/(tabs)/profile/my-profile.tsx` | Profile | User profile page (default profile route) |
| `/(tabs)/currently-reading` | `app/(tabs)/currently-reading.tsx` | - | Currently reading books page (not in tab bar) |

**Alternative Access Paths:**
- `/home` - Redirects to `/(tabs)/home`
- `/currently-reading` - Alternative path to currently reading page

**Navigation Examples:**
```typescript
router.replace("/(tabs)/home");
router.push("/currently-reading");
```

---

## Book Routes

Routes related to book addition and reading plan setup.

| Route Path | File Path | Description |
|------------|-----------|-------------|
| `/(tabs)/Book/page1` | `app/(tabs)/Book/page1.tsx` | Book addition flow - Step 1 |
| `/(tabs)/Book/page2` | `app/(tabs)/Book/page2.tsx` | Book addition flow - Step 2 |
| `/(tabs)/Book/page3` | `app/(tabs)/Book/page3.tsx` | Book addition flow - Step 3 |
| `/(tabs)/Book/page4` | `app/(tabs)/Book/page4.tsx` | Book addition flow - Step 4 (reading plan selection) |
| `/(tabs)/Book/book-added` | `app/(tabs)/Book/book-added.tsx` | Book successfully added confirmation page |

**Navigation Flow:**
```
page1 → page2 → page3 → page4 → book-added → reading-now
```

**Navigation Examples:**
```typescript
router.push("/(tabs)/Book/page1");
router.push("/(tabs)/Book/page2");
router.push("/(tabs)/Book/page3");
router.push("/(tabs)/Book/page4");
router.push("/(tabs)/Book/book-added");
```

---

## Profile Routes

Routes for user profile management and settings.

| Route Path | File Path | Description |
|------------|-----------|-------------|
| `/(tabs)/profile/my-profile` | `app/(tabs)/profile/my-profile.tsx` | Main profile page with menu options |
| `/(tabs)/profile/achievements` | `app/(tabs)/profile/achievements.tsx` | User achievements page |
| `/(tabs)/profile/favourites` | `app/(tabs)/profile/favourites.tsx` | User's favorite books page |
| `/(tabs)/profile/settings` | `app/(tabs)/profile/settings.tsx` | App settings page |
| `/(tabs)/profile/privacy-policy` | `app/(tabs)/profile/privacy-policy.tsx` | Privacy policy page |

**Alternative Access Paths:**
- `/profile/my-profile` - Alternative path to my-profile
- `/profile/achievements` - Alternative path to achievements
- `/profile/favourites` - Alternative path to favourites
- `/profile/settings` - Alternative path to settings
- `/profile/privacy-policy` - Alternative path to privacy-policy

**Navigation Examples:**
```typescript
router.push("/profile/my-profile");
router.push("/profile/achievements");
router.push("/profile/favourites");
router.push("/profile/settings");
router.push("/profile/privacy-policy");
```

---

## My Pals Routes

Routes for managing reading pals and contacts.

| Route Path | File Path | Description |
|------------|-----------|-------------|
| `/(tabs)/my-pals/pals-page` | `app/(tabs)/my-pals/pals-page.tsx` | Main pals page listing all reading pals |
| `/(tabs)/my-pals/add-pal` | `app/(tabs)/my-pals/add-pal.tsx` | Add a new reading pal page |
| `/(tabs)/my-pals/add-contacts` | `app/(tabs)/my-pals/add-contacts.tsx` | Add contacts from device contacts list |
| `/(tabs)/my-pals/pal-profile` | `app/(tabs)/my-pals/pal-profile.tsx` | Individual pal's profile page |

**Alternative Access Paths:**
- `/my-pals/pals-page` - Alternative path to pals-page
- `/my-pals/add-pal` - Alternative path to add-pal
- `/my-pals/add-contacts` - Alternative path to add-contacts
- `/my-pals/pal-profile` - Alternative path to pal-profile

**Navigation Examples:**
```typescript
router.push("/my-pals/pals-page");
router.push("/my-pals/add-pal");
router.push("/my-pals/add-contacts");
router.push("/my-pals/pal-profile");
```

---

## My Shelf Routes

Routes for managing user's reading shelf.

| Route Path | File Path | Description |
|------------|-----------|-------------|
| `/(tabs)/my-shelf/reading-now` | `app/(tabs)/my-shelf/reading-now.tsx` | Currently reading books in user's shelf |

**Alternative Access Paths:**
- `/my-shelf/reading-now` - Alternative path to reading-now

**Navigation Examples:**
```typescript
router.push("/my-shelf/reading-now");
router.replace("/my-shelf/reading-now");
```

---

## Component Routes

Routes for signup flow components and onboarding.

| Route Path | File Path | Description |
|------------|-----------|-------------|
| `/components/hello-page` | `app/components/hello-page.tsx` | Welcome/hello page (onboarding) - "Hello {firstName}! Welcome to PagePal" |
| `/components/buddy-page` | `app/components/buddy-page.tsx` | Buddy selection page (onboarding) - "I'm your reading buddy" |
| `/components/1` | `app/components/1.tsx` | **Question 1:** "Which book are you reading?" - Text input for book name (Step 1/4) |
| `/components/2` | `app/components/2.tsx` | **Question 2:** "Who is the author of the book?" - Text input for author name (Step 2/4) |
| `/components/3` | `app/components/3.tsx` | **Question 3:** "How many pages does this book have?" - Numeric input for total pages (Step 3/4) |
| `/components/4` | `app/components/4.tsx` | **Question 4:** "Create a Reading Plan for yourself" - Selection between Everyday Plan or Custom Weekly Plan (Step 4/4) |
| `/components/everyday-pages` | `app/components/everyday-pages.tsx` | Daily reading pages setup (selected from question 4) |
| `/components/weekly-pages` | `app/components/weekly-pages.tsx` | Weekly reading pages setup (selected from question 4) |
| `/components/success-signup` | `app/components/success-signup.tsx` | Signup success confirmation page |

**Onboarding Flow:**
```
signup → hello-page → buddy-page → 1 → 2 → 3 → 4 → (everyday-pages OR weekly-pages) → success-signup → home
```

**Question Pages Details:**
- **Page 1 (`/components/1`)**: Asks for book name - "Which book are you reading?" with progress indicator (1/4)
- **Page 2 (`/components/2`)**: Asks for author name - "Who is the author of the book?" with progress indicator (2/4)
- **Page 3 (`/components/3`)**: Asks for total pages - "How many pages does this book have?" with progress indicator (3/4)
- **Page 4 (`/components/4`)**: Reading plan selection - "Create a Reading Plan for yourself" with options for Everyday Plan or Custom Weekly Plan (4/4)

*Note: These question pages are named `1.tsx`, `2.tsx`, `3.tsx`, and `4.tsx` in the `app/components/` folder. They use relative navigation (`./1`, `./2`, etc.) when navigating from within the components folder, or absolute paths (`/components/1`, `/components/2`, etc.) when navigating from other routes.*

**Navigation Examples:**
```typescript
router.push("/components/hello-page");
router.push("/components/buddy-page");
router.push("./1"); // Relative navigation
router.push("./2");
router.push("./3");
router.push("./4");
router.push("/components/everyday-pages");
router.push("/components/weekly-pages");
router.push("/components/success-signup");
```

---

## Other Routes

Additional routes outside the main navigation groups.

| Route Path | File Path | Description |
|------------|-----------|-------------|
| `/reset-password` | `app/reset-password.tsx` | Password reset page |

**Navigation Examples:**
```typescript
// Usually accessed via link or navigation from signin page
```

---

## Route Patterns & Conventions

### Absolute vs Relative Paths

**Absolute Paths:**
- Start with `/` or `/(group)/`
- Example: `router.push("/(tabs)/home")`
- Example: `router.push("/profile/my-profile")`

**Relative Paths:**
- Start with `./` or `../`
- Example: `router.push("./1")` (relative to current route)
- Example: `router.push("../home")` (parent directory)

### Route Groups

Route groups are denoted by parentheses `(group)`:
- `(auth)` - Authentication routes group
- `(tabs)` - Tab navigation routes group

Groups don't appear in the URL but help organize routes.

### Navigation Methods

1. **`router.push(path)`** - Navigate to a new route (adds to navigation stack)
2. **`router.replace(path)`** - Replace current route (doesn't add to stack)
3. **`router.back()`** - Go back to previous route

### Common Navigation Patterns

```typescript
// Authentication flow
signup → signin → (after login) → home

// Book addition flow
home → page1 → page2 → page3 → page4 → book-added → reading-now

// Onboarding flow (new users)
signup → hello-page → buddy-page → 1 → 2 → 3 → 4 → (everyday-pages OR weekly-pages) → success-signup → home

// Profile navigation
profile → my-profile → (achievements | favourites | settings | privacy-policy)

// Pals navigation
pals-page → (add-pal | add-contacts | pal-profile)
```

---

## Layout Files

The app uses Expo Router's layout system to organize navigation:

### `app/_layout.tsx` (Root Layout)
- **Purpose**: Main entry point layout for the entire app
- **Responsibilities**: 
  - Manages authentication state
  - Handles initial routing (redirects to signup if not logged in)
  - Defines overall app structure with Stack navigator
  - References route groups: `(auth)`, `(tabs)`, and other routes

### `app/(auth)/_layout.tsx` (Auth Layout)
- **Purpose**: Layout for authentication routes
- **Responsibilities**:
  - Wraps all auth-related screens (signin, signup)
  - Uses Stack navigator for navigation between auth screens
  - Provides slide animation between auth screens
- **Routes Managed**: 
  - `/(auth)/signup`
  - `/(auth)/signin`

### `app/(tabs)/_layout.tsx` (Tabs Layout)
- **Purpose**: Layout for main app tab navigation
- **Responsibilities**:
  - Defines bottom tab bar with icons
  - Manages tab navigation for home, explore, profile
  - Hides non-tab routes from tab bar (Book/*, my-pals/*, etc.) while keeping them accessible via navigation
- **Tab Routes**:
  - `home` - Home tab
  - `explore` - Explore tab
  - `profile` - Profile tab
- **Hidden Routes** (accessible via navigation, not tab bar):
  - `currently-reading`
  - `Book/*`
  - `my-pals/*`
  - `my-shelf/*`

### Why Layout Files Are Important

1. **Organization**: Each route group has its own navigation structure
2. **Separation of Concerns**: Auth flows and main app flows are separated
3. **Better Navigation Control**: Each group can have different navigation types (Stack vs Tabs)
4. **Maintainability**: Easier to modify navigation for specific route groups without affecting others

---

## Notes

- All routes are case-sensitive
- Tab routes are accessible via the bottom tab bar when authenticated
- Some routes have alternative paths (with/without `(tabs)` prefix)
- The app uses Expo Router's file-based routing system
- Route groups `(auth)` and `(tabs)` are organizational and don't appear in URLs
- Authentication is required for most routes except auth routes
- Layout files (`_layout.tsx`) define the navigation structure for each route group

