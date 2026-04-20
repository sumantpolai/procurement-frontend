# Procurement Management System - Frontend

A modern, professional procurement management system built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

### Purchase Request (PR) Module
- Create and manage purchase requisitions
- Track approval workflow (Draft → Submitted → Approved → Rejected)
- Search PRs by PR number
- Filter by status
- View detailed PR information
- Add multiple items per PR

### Purchase Order (PO) Module
- Create purchase orders from approved PRs or standalone
- Manage vendor details and pricing
- GST-compliant with CGST, SGST, IGST calculations
- Multiple PO types (Standard, Blanket, Contract, Planned)
- Matching types (Two-way, Three-way, Four-way)
- Track PO lifecycle (Draft → Pending → Approved → Received → Closed)
- Real-time total calculations in Indian Rupees (₹)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (manually configured)
- **Icons**: Lucide React
- **Currency**: Indian Rupee (INR) formatting

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- Backend API running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env.local` file with:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
procurement-frontend/
├── app/
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── pr/
│   │   ├── page.tsx        # PR list page
│   │   ├── create/         # Create PR page
│   │   └── [id]/           # PR detail page
│   └── po/
│       ├── page.tsx        # PO list page
│       ├── create/         # Create PO page
│       └── [id]/           # PO detail page
├── components/
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── api.ts             # API client
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
└── public/
```

## API Integration

The frontend connects to the FastAPI backend with the following endpoints:

### PR Endpoints
- `GET /api/pr` - List all PRs (with pagination and filters)
- `GET /api/pr/{id}` - Get PR by ID
- `GET /api/pr/search/{pr_number}` - Search PR by number
- `POST /api/pr` - Create new PR
- `PATCH /api/pr/{id}/status` - Update PR status

### PO Endpoints
- `GET /api/po` - List all POs (with pagination and filters)
- `GET /api/po/{id}` - Get PO by ID
- `GET /api/po/search/{po_number}` - Search PO by number
- `POST /api/po` - Create new PO
- `PATCH /api/po/{id}/status` - Update PO status

## Features Highlights

### Indian Compliance
- Currency displayed in Indian Rupees (₹)
- GST calculations (CGST, SGST, IGST)
- HSN code support
- Date format: DD/MM/YYYY

### User Experience
- Clean, modern interface
- Responsive design for mobile and desktop
- Real-time calculations
- Status badges with color coding
- Pagination for large datasets
- Search functionality
- Filter by status

### Workflow Management
- PR: Draft → Submitted → Approved/Rejected
- PO: Draft → Pending → Approved → Partially Received → Received → Closed
- Status-based action buttons
- Linked PR to PO workflow

## Build for Production

```bash
npm run build
npm start
```

## Development

```bash
npm run dev
```

## License

This project is part of a procurement management system for Indian businesses.
