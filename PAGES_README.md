# MailFlow Pages Documentation

This document describes the new pages that have been created for the MailFlow application based on the navigation menu.

## Pages Created

### 1. About Page (`/about`)
- **Purpose**: Company information, mission, values, and team details
- **Features**:
  - Hero section with company introduction
  - Mission statement
  - Core values (Performance, Security, User-Centric)
  - Team section featuring key team members
  - Call-to-action section

### 2. Features Page (`/features`)
- **Purpose**: Showcase MailFlow's key features and capabilities
- **Features**:
  - Hero section highlighting key features
  - Feature grid with 6 main features:
    - AI-Powered Email Analysis
    - Intelligent Automation
    - Advanced Security
    - Smart Insights
    - Seamless Integration
    - Mobile-First Design
  - Advanced capabilities section
  - Performance metrics
  - Call-to-action section

### 3. Pricing Page (`/pricing`)
- **Purpose**: Display pricing plans and options
- **Features**:
  - Hero section with pricing introduction
  - Monthly/Annual toggle (UI only for now)
  - Three pricing tiers:
    - **Starter**: Free plan with basic features
    - **Professional**: $19/month with advanced features
    - **Enterprise**: $49/month with custom solutions
  - FAQ section
  - Enterprise CTA section
  - Call-to-action section

### 4. Documentation Page (`/docs`)
- **Purpose**: Provide comprehensive documentation and help resources
- **Features**:
  - Hero section with search functionality
  - Documentation categories:
    - Getting Started
    - Core Features
    - Integrations
    - Advanced Usage
    - API Reference
    - Troubleshooting
  - Popular articles section
  - Quick start guide
  - Support section
  - Call-to-action section

## Navigation

All pages include a consistent navigation bar with:
- **Logo**: Clickable logo that links to `/`
- **Menu Items**: Products, Features, Pricing, Docs
- **Auth Buttons**: Sign in and Sign up (placeholder for Clerk integration)

## Technical Implementation

### Components
- **Navigation**: Shared navigation component used across all pages
- **Routing**: React Router for client-side navigation
- **Styling**: Consistent Tailwind CSS design system

### File Structure
```
src/
├── components/
│   ├── Navigation.jsx          # Shared navigation component
│   └── index.js               # Component exports
├── pages/
│   ├── AboutPage.jsx          # About page
│   ├── FeaturesPage.jsx       # Features page
│   ├── PricingPage.jsx        # Pricing page
│   ├── DocsPage.jsx           # Documentation page
│   └── index.js               # Page exports
├── AppWithRouting.jsx         # Main app with routing
└── main.jsx                   # Entry point
```

### Routing Configuration
- `/` → Products page (main landing page)
- `/about` → About page (alternative route)
- `/features` → Features page
- `/pricing` → Pricing page
- `/docs` → Documentation page
- `/email-ai` → Email AI feature (if enabled)

## Design System

### Color Scheme
- **Primary Background**: Dark slate with purple/blue gradients
- **Cards**: Storm to indigo gradients
- **Accents**: Purple to blue gradients
- **Text**: White with various opacity levels

### Typography
- **Headings**: Large, bold text with gradient accents
- **Body**: Clean, readable text with proper hierarchy
- **Font**: Funnel Display (imported from Google Fonts)

### Interactive Elements
- **Buttons**: Gradient backgrounds with hover effects
- **Cards**: Hover animations with subtle transforms
- **Links**: Smooth color transitions

## Future Enhancements

### Authentication (Clerk Integration)
- Sign in and Sign up functionality
- User profile management
- Protected routes

### Content Management
- Dynamic content loading
- CMS integration for easy updates
- Localization support

### Performance
- Lazy loading for page components
- Image optimization
- SEO improvements

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Access Pages**:
   - Navigate to `http://localhost:5173/`
   - Use the navigation menu to explore different pages
   - All pages are fully responsive and accessible

## Notes

- The Sign in/Sign up buttons are currently placeholders
- All pages maintain consistent design language
- Navigation highlights the current active page
- Responsive design works on all device sizes
- Background effects and animations are consistent across pages 