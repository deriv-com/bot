# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Deriv Bot** is a Progressive Web Application (PWA) for building, testing, and running automated trading strategies on the Deriv platform. Users create trading bots using a visual block-based programming interface powered by Blockly, without needing to write code.

-   **Repository**: https://github.com/deriv-com/bot
-   **License**: MIT License (Copyright 2024 deriv.com)
-   **Node.js Version**: 20.x (required)

## Technology Stack

-   **React 18.2.0** with **TypeScript 5.5.3**
-   **MobX 6.12.3** for state management (with mobx-react-lite)
-   **Rsbuild 1.0.1-beta.1** for builds (replacing webpack, though webpack config still exists)
-   **Blockly 10.4.3** for visual programming blocks
-   **@deriv/deriv-api 1.0.15** for trading API (WebSocket-based)
-   **@deriv/js-interpreter 3.0.0** for safe bot code execution
-   **@deriv/deriv-charts 2.9.1** for trading charts (SmartCharts)
-   **@deriv-com/auth-client 1.5.1** for OIDC authentication
-   **@tanstack/react-query 5.29.2** for server state management

## Common Commands

### Development

```bash
npm run start          # Start dev server on https://localhost:8443 (auto-opens browser)
npm run build          # Production build to dist/
npm run watch          # Build in watch mode
npm run serve          # Serve production build locally
npm run build:analyze  # Build with bundle analyzer
```

### Testing

```bash
npm test               # Run Jest tests
npm run coverage       # Run tests with coverage report
npm run test:lint      # Run ESLint and Prettier checks
npm run test:fix       # Auto-fix linting issues with ESLint and Prettier
```

### Legacy (Webpack - being phased out)

```bash
npm run start:webpack  # Start webpack dev server
npm run build:webpack  # Build with webpack
```

## Code Architecture

### State Management with MobX

The application uses a centralized **RootStore pattern** that orchestrates 22 domain-specific stores:

```typescript
// Core stores
- RootStore (src/stores/root-store.ts) - Main orchestrator
- AppStore - Application-level state
- ClientStore - User/account state
- UiStore - UI state
- CommonStore - Shared state

// Feature stores
- BlocklyStore - Blockly workspace state
- RunPanelStore - Bot execution controls
- QuickStrategyStore - Quick strategy builder
- JournalStore - Trading journal/logs
- TransactionsStore - Transaction history
- ChartStore - Trading chart state
- DashboardStore - Dashboard/bot list
- LoadModalStore, SaveModalStore - Bot file operations
- GoogleDriveStore - Google Drive integration
- ToolbarStore, ToolboxStore, FlyoutStore, FlyoutHelpStore - Blockly UI
- SummaryCardStore - Trade summary
- SelfExclusionStore - Self-exclusion limits
- DataCollectionStore - Analytics data
```

**Key patterns**:

-   Stores are dependency-injected via React Context (use `useStore()` hook)
-   Components observe stores via `observer()` from mobx-react-lite
-   RootStore receives `dbot` instance (the bot engine) at construction
-   Stores receive both `root_store` and `core` (shortcut to ui/client/common)

### Bot Engine Architecture

Located in `src/external/bot-skeleton/`, this is the core trading bot engine:

**DBot Class** (`scratch/dbot.js`):

-   Main bot controller that initializes and manages the Blockly workspace
-   Holds reference to `interpreter` (JS-Interpreter instance)
-   Manages bot execution state (`is_bot_running`)
-   Handles workspace initialization, XML loading, and bot lifecycle

**Blockly Integration** (`scratch/`):

-   Custom block definitions in `scratch/blocks/` (Binary, Logic, Math, Text, Advanced, etc.)
-   Block XML templates in `scratch/xml/`
-   Workspace utilities in `scratch/utils/`
-   Blockly hooks in `scratch/hooks/`
-   Custom `loadBlockly()` function initializes Blockly with custom blocks

**Trade Engine** (`services/tradeEngine/`):

-   Separate execution engine that runs bot strategies
-   Handles contract proposals, purchases, and trade execution
-   Integrates with Deriv API via WebSocket
-   Manages tick subscriptions and real-time market data

**API Services** (`services/api/`):

-   `api-base.js` - Core API service management
-   `ApiHelpers` - Helper methods for API operations
-   Observer pattern for API event handling
-   Tick service for real-time data streaming

**Strategy Templates**:

-   Pre-built strategies (Martingale, D'Alembert, Oscar's Grind)
-   Quick strategy builder in `src/pages/bot-builder/quick-strategy/`
-   XML-based strategy definitions in `src/xml/`

### Component Architecture

**Lazy Loading**:

-   Pages and heavy components use `React.lazy()` for code-splitting
-   Suspense boundaries with custom `ChunkLoader` for loading states
-   Global `ErrorBoundary` component for error handling

**Key Pages** (`src/pages/`):

-   `main/` - Main page
-   `dashboard/` - Bot list and management
-   `bot-builder/` - Visual bot builder (Blockly workspace)
    -   `quick-strategy/` - Quick strategy builder
    -   `toolbar/` - Workspace toolbar
    -   `toolbox/` - Block toolbox
-   `chart/` - Trading charts (SmartCharts integration)
-   `tutorials/` - Tutorial pages
-   `endpoint/` - Endpoint configuration
-   `callback/` - OAuth callback handler

**Major Component Groups** (`src/components/`):

-   `layout/` - Header, footer, body layout components
-   `journal/` - Trading journal and logs
-   `transactions/` - Transaction history UI
-   `run-panel/` - Bot run controls
-   `load-modal/` - Load bot modal
-   `trade-animation/` - Trade execution animations
-   `shared/` and `shared_ui/` - Reusable components

### Authentication Flow

-   **OIDC/OAuth2** via `@deriv-com/auth-client`
-   Token stored in LocalStorage
-   `AuthWrapper` component handles authentication state
-   `useInvalidTokenHandler` hook auto-re-authenticates on expiry
-   Multi-account support with currency validation
-   TMB (Trading Management Backend) integration for feature flags

### PWA Architecture

-   Service worker: `public/sw.js`
-   Browser-specific behavior (Chrome vs Firefox/Safari)
-   Offline detection via `useOfflineDetection` hook
-   Cache-first for assets, network-first for API
-   Manifest: `public/manifest.json` with full installability support
-   PWA utilities in `src/utils/pwa-utils.ts`

### Routing (React Router v6)

-   Modern routing with `createBrowserRouter`
-   Nested routes with `Layout` component and `Outlet`
-   Protected routes with authentication checks
-   Currency validation and account checks

### Path Aliases

```typescript
@/external → src/external
@/components → src/components
@/hooks → src/hooks
@/utils → src/utils
@/constants → src/constants
@/stores → src/stores
@/pages → src/pages
```

## Development Notes

### Build System

-   **Primary**: Rsbuild (modern, faster)
-   **Legacy**: Webpack (still available, being phased out)
-   Entry point: `src/main.tsx`
-   Output: `dist/`
-   Dev server: Port 8443 with HTTPS enabled
-   Asset copying: SmartCharts assets, fonts, shaders, public files

### Environment Variables

Configure via `.env` or CI/CD (15+ variables for feature flags and API keys):

-   `TRANSLATIONS_CDN_URL`, `R2_PROJECT_NAME`, `CROWDIN_BRANCH_NAME` - Translations
-   `TRACKJS_TOKEN`, `APP_ENV`, `REF_NAME` - Environment/tracking
-   `REMOTE_CONFIG_URL` - Remote config
-   `GD_CLIENT_ID`, `GD_APP_ID`, `GD_API_KEY` - Google Drive
-   `DATADOG_*` - Datadog RUM configuration
-   `RUDDERSTACK_KEY` - Analytics
-   `GROWTHBOOK_CLIENT_KEY`, `GROWTHBOOK_DECRYPTION_KEY` - Feature flags

### Git Workflow

-   **Commit convention**: Conventional Commits enforced by commitlint
-   **Allowed types**: feat, fix, chore, docs, test, refactor, perf, ci, build, hotfix, revert, style, redeploy, translations
-   **Git hooks** (via Husky):
    -   `commit-msg` - Validates commit messages
    -   `post-merge` - Post-merge actions
-   **Lint-staged**: Auto-formats files on commit

### Code Quality

-   **TypeScript**: Strict mode enabled
-   **ESLint**: React, React Hooks, TypeScript rules
-   **Prettier**: 120 char width, single quotes, 4-space indent
-   **Stylelint**: BEM pattern, browser compatibility checks

### Testing

-   **Jest 29.7.0** with ts-jest
-   **@testing-library/react** for component testing
-   **jsdom** environment for browser-like tests
-   Coverage collected automatically
-   Path aliases configured in `jest.config.ts`
-   Transform patterns for TypeScript, JavaScript, and XML files

### Translations

-   CDN-based via Crowdin (`@deriv-com/translations`)
-   Branch-specific translations per environment
-   Loaded dynamically at runtime
-   Sync workflow via GitHub Actions

### Deployment

-   **Primary hosting**: Cloudflare Pages
-   **Disaster Recovery**: Vercel
-   **Environments**: production, staging, test
-   **Production trigger**: Tags matching `production_v*`
-   **Staging/Test trigger**: Branch pushes

## Key Design Decisions

1. **Blockly for Visual Programming**: Enables no-code bot creation for non-technical traders
2. **MobX over Redux**: Simpler, more flexible for complex trading logic and real-time updates
3. **Rsbuild over Webpack**: Modern, faster build tool (migration in progress)
4. **PWA-first**: Offline support critical for trading application reliability
5. **Separate Bot Engine**: `bot-skeleton` as independent trading engine with own architecture
6. **WebSocket Real-time**: Live market data and trade execution require persistent connections
7. **Multi-environment**: Strict separation with feature flags and environment-specific configs
8. **OIDC Authentication**: Standards-based auth with multi-account support

## Important Caveats

-   The codebase is in transition from Webpack to Rsbuild (both configs exist)
-   Some stores and utilities are JavaScript (`.js`) not TypeScript yet
-   `__webpack_public_path__` global assignment exists for dynamic loading
-   Service worker behavior differs between Chrome and Firefox/Safari
-   XML files for blocks are loaded via `raw-loader` custom transform
-   SmartCharts assets require special copy configuration
-   Development requires HTTPS (self-signed cert via `@rsbuild/plugin-basic-ssl`)
