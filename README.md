# Spectra

> A polished, searchable directory for discovering useful AI tools.

Spectra is a responsive AI-tool discovery experience built for people who want to move from a broad idea to a practical shortlist quickly. It combines a focused search interface with category and pricing filters, featured ordering, favorites, theme switching, and detail views backed by Supabase.

The project is designed as a portfolio piece as well as a usable product foundation. Its visual language pairs a dark, high-contrast interface with a vivid spectral accent system, while the component structure keeps the core browsing experience easy to extend.

## Product overview

Spectra presents a curated catalog of AI tools in a single, low-friction workspace. Visitors can search by tool name, tagline, or category; narrow results by category and pricing model; sort by popularity, recency, or name; save favorites locally; and open a richer detail view without leaving the page. A responsive grid, loading skeletons, empty states, error handling, back-to-top navigation, and light/dark themes support the experience across screen sizes.

The directory is intentionally data-driven. The frontend reads from a Supabase `tools` table and normalizes common field-name variations, making the interface resilient when connected to an existing catalog with slightly different column conventions.

## Highlights

| Area            | Included                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------- |
| Discovery       | Instant search across names, taglines, and categories, with `/` and `⌘/Ctrl+K` focus shortcuts |
| Refinement      | Category, pricing, favorites-only, and sort controls                                          |
| Presentation    | Responsive tool-card grid, featured ordering, logos, and detail dialog                        |
| Personalization | Persistent local favorites and light/dark theme support                                       |
| Resilience      | Loading skeletons, empty results, root error boundary, and retry flow                         |
| Data layer      | Supabase integration with client-side row normalization                                       |
| UX polish       | Responsive layout, motion transitions, keyboard-friendly controls, and back-to-top navigation |

## Technology

| Technology                         | Role                                             |
| ---------------------------------- | ------------------------------------------------ |
| React 19                           | Component-driven UI                              |
| TypeScript                         | Static typing across application code            |
| TanStack Start and TanStack Router | File-based routing and application shell         |
| Vite                               | Development server and production build pipeline |
| Tailwind CSS                       | Utility-first styling and responsive layout      |
| Supabase                           | Hosted catalog data source                       |
| TanStack Query                     | Remote data fetching and cache management        |
| Framer Motion                      | Subtle interface transitions                     |
| Radix UI and Lucide                | Accessible primitives and interface icons        |
| Bun                                | Lockfile and dependency management               |

## Project structure

```text
src/
├── components/       Reusable product and UI components
├── hooks/            Data fetching, favorites, theme, debounce, and category logic
├── lib/              Supabase client and shared utilities
├── routes/           TanStack file-based routes
├── types/            Shared TypeScript domain types
├── assets/           Spectra brand marks and supporting imagery
├── router.tsx        Router configuration
├── server.ts         Server entry and runtime integration
└── styles.css        Design tokens, theme variables, and global styles
```

The main route lives in `src/routes/index.tsx`. It composes the search, filter, category, grid, detail, theme, and favorites experiences. The `useTools` hook owns the Supabase query and converts source rows into the stable `Tool` model used by the UI.

The principal components have focused responsibilities: `SearchBar` handles query input and keyboard focus shortcuts; `CategoryChips` provides category and favorites navigation; `FilterBar` controls category, pricing, and sorting; `ToolGrid` renders results and the empty state; `ToolCard` presents individual tool metadata and actions; `ToolDetailDialog` shows extended information; `ToolCardSkeleton` represents loading cards; and `BackToTop` provides scroll navigation.

## Getting started

### Prerequisites

You need Node.js 18 or newer and either npm, pnpm, Yarn, or Bun. The repository includes a `bun.lock` file, so Bun is the most direct package-manager choice.

### Installation

```bash
git clone https://github.com/Lz027/Spectra.git
cd Spectra
bun install
```

Start the development server:

```bash
bun run dev
```

The local application is normally available at `http://localhost:3000`.

## Data contract

Spectra queries the `tools` table and reads up to 500 rows. The normalizer accepts the canonical fields below as well as several common aliases, which makes it suitable for importing an existing directory without forcing an immediate database migration.

| Canonical field    | Purpose                                         |
| ------------------ | ----------------------------------------------- |
| `id`               | Stable identifier used by favorites and UI keys |
| `name`             | Tool name                                       |
| `tagline`          | Short description used in cards and search      |
| `long_description` | Extended detail content                         |
| `category`         | Discovery category                              |
| `pricing`          | Pricing label such as Free, Freemium, or Paid   |
| `website_url`      | External destination for the tool               |
| `logo_url`         | Optional tool logo or icon                      |
| `featured`         | Whether the tool receives featured ordering     |
| `created_at`       | Timestamp used by the Newest sort               |

## Available commands

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `bun run dev`       | Start the Vite development server    |
| `bun run build`     | Create a production build            |
| `bun run build:dev` | Create a development-mode build      |
| `bun run preview`   | Preview the production build locally |
| `bun run lint`      | Run ESLint across the project        |
| `bun run format`    | Format project files with Prettier   |

## Design and engineering notes

Spectra keeps product behavior close to the page that uses it while extracting repeated concerns into focused components and hooks. Search and filter state is derived into a memoized display list, favorites are kept client-side for a fast personal workflow, and the root route provides a consistent error and not-found experience. Loading skeletons avoid a jarring first render while the catalog request is in flight.

The repository also keeps generated routing output, dependency lockfiles, and build configuration under version control so that the project can be cloned and reproduced consistently.

## Portfolio context

This project demonstrates more than a styled landing page. It shows how to shape a real catalog experience around a remote data source, establish a reusable component system, handle imperfect input data, design for responsive browsing, and provide practical interaction states for loading, empty, error, and personalized views.

The current implementation is intentionally focused on public discovery. Future work could build on the existing `Tool` model and Supabase-backed architecture with authenticated contributor workflows, richer taxonomy, pagination, curated collections, or catalog administration, but none of those features are currently included.

## License

No license has been declared yet. Add a license file before distributing Spectra as an open-source project.
