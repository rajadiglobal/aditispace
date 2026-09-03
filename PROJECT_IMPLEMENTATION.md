# PROJECT IMPLEMENTATION

This document provides a detailed overview of the current state of the Avyron Studio project, including its architecture, database, API structure, and feature implementation status as of September 3, 2026.

---

## 1. PROJECT OVERVIEW

**Purpose:** Avyron Studio is an interior design platform offering a public-facing product catalog, lead capture/consultation capabilities, and an administrative dashboard to manage products, CRM, and site content.

**Current Architecture:**
```text
Frontend (Next.js)
        ↓ (HTTP/REST)
Backend API (FastAPI)
        ↓
SQLAlchemy ORM
        ↓
MySQL Database
        ↓
Alembic Migrations
```

---

## 2. TECHNOLOGY STACK

### Frontend
* **Framework:** Next.js (16.3.0)
* **Language:** TypeScript
* **Styling:** TailwindCSS v4
* **State/Data Fetching:** React Query, Axios
* **Form Handling:** React Hook Form with Zod validation
* **Icons:** Lucide React
* **Authentication UI:** NextAuth.js (beta)
* **Animation:** Motion, tw-animate-css

### Backend
* **Framework:** FastAPI
* **Language:** Python
* **API Architecture:** RESTful (`/api/v1/`)
* **ORM:** SQLAlchemy
* **Authentication:** JWT & Google OAuth Verification
* **Image Processing:** Pillow

### Database
* **Engine:** MySQL (via PyMySQL)
* **Migrations:** Alembic
* **Major Entities:** Products, Categories, Brands, Collections, Leads, Projects, Requirements, Quotations, Users.

---

## 3. FRONTEND STRUCTURE

The frontend is built with Next.js App Router.

```text
frontend/src/
├── app/
│   ├── (public)/         # Public facing routes (catalog, contact, portfolio)
│   ├── admin/            # Admin dashboard routes
│   ├── api/              # Next.js API routes (NextAuth, proxies)
│   └── auth/             # Authentication pages
├── components/           # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities (e.g., api client configuration)
├── schemas/              # Zod validation schemas
├── services/             # API communication layer (fetch/axios calls)
└── types/                # TypeScript interface definitions
```

---

## 4. BACKEND STRUCTURE

The backend follows a modular FastAPI structure.

```text
backend/
├── alembic/              # Database migration versions
├── app/
│   ├── models/           # SQLAlchemy DB models
│   ├── routers/          # FastAPI endpoint handlers
│   ├── schemas/          # Pydantic models for validation
│   ├── utils/            # Helper functions (JWT, Google Auth)
│   ├── config.py         # Environment configurations
│   ├── database.py       # Database connection setup
│   ├── dependencies.py   # FastAPI dependencies (auth/admin checks)
│   └── main.py           # Application entry point
├── uploads/              # Local storage for uploaded files
└── run.py                # Server execution script
```

---

## 5. DATABASE ARCHITECTURE

### Major Entities

| Entity     | Table             | Purpose            | Important Relationships |
| ---------- | ----------------- | ------------------ | ----------------------- |
| Product    | `products`        | Product catalog    | Category, Brand, Collection |
| Category   | `categories`      | Product category   | Self-referencing (parent) |
| Brand      | `brands`          | Product brand      | Products |
| Collection | `collections`     | Product collection | Products |
| Lead       | `leads`           | CRM Leads          | Requirement, Project, Quotation |
| Project    | `projects`        | Active Projects    | Lead, Workers, Products |
| Requirement| `requirements`    | Client needs       | Lead, Products |

---

## 6. PRODUCT CATALOG SYSTEM

| Entity     | Create | Read | Update | Delete | Admin UI | Public UI |
| ---------- | ------ | ---- | ------ | ------ | -------- | --------- |
| Product    | ✅      | ✅    | ✅      | ✅      | ✅        | ✅        |
| Category   | ✅      | ✅    | ✅      | ✅      | ✅        | ✅        |
| Brand      | ✅      | ✅    | ✅      | ✅      | ✅        | ✅        |
| Collection | ✅      | ✅    | ✅      | ✅      | ✅        | ✅        |

---

## 7. PRODUCT MODEL

The current implemented fields for `Product` (`products` table):

* **id**: UUID (Primary Key)
* **name**: String
* **sku**: String (Unique, Indexed)
* **category_id**: UUID (Foreign Key to `categories`)
* **collection_id**: UUID (Foreign Key to `collections`)
* **brand_id**: UUID (Foreign Key to `brands`)
* **description**: Text
* **short_description**: String
* **price**: Float
* **sale_price**: Float (Nullable)
* **unit**: String (Default: "Piece")
* **availability**: Boolean
* **status**: Enum ("DRAFT", "ACTIVE", "INACTIVE", "OUT_OF_STOCK", "ARCHIVED")
* **is_featured**: Boolean (Default: False, used for frontend filtering/display)
* **created_at**: DateTime
* **updated_at**: DateTime

---

## 8. PRODUCT IMAGE SYSTEM

**IMPLEMENTED**
Images are handled via local storage on the backend server.

```text
Admin Upload (Frontend)
     ↓
Backend Upload API (/api/v1/upload/image)
     ↓
Validation (Type & Max Size: 5MB)
     ↓
Pillow Processing (Resize max 1920x1080)
     ↓
WEBP Conversion (Quality 85)
     ↓
Saved to local: backend/uploads/products/
     ↓
Database Record in `product_images`
     ↓
Served publicly via static route (/static/uploads/...)
```

**Notes:** No AWS S3 integration is currently active. Images are strictly local.

---

## 9. ADMIN DASHBOARD

**IMPLEMENTED**
Admin UI routes currently existing:
```text
/admin
/admin/products
/admin/categories
/admin/brands
/admin/collections
/admin/consultations
/admin/contact
/admin/leads
/admin/newsletter
/admin/requirements
```

---

## 10. ADMIN CRUD SYSTEM

**Create:** Available via `/admin/*` pages. API validates input using Pydantic. Saves to MySQL.
**Read:** Admin listing pages with lists and basic details.
**Update:** APIs implemented (PUT/PATCH).
**Delete:** Hard delete is implemented with safety blocks on related entities.

---

## 11. PRODUCT CRUD + CRM SAFETY

**IMPLEMENTED**
Product deletion includes safety checks. If a product is linked to CRM models, hard deletion is blocked by the backend API:

```text
Admin Deletes Product
        ↓
API checks `project_products`, `requirement_products`, `quotation_items`
        ↓
If Linked -> 400 Bad Request (Action Blocked: "Cannot delete: Product is linked... Please Archive it instead")
        ↓
If Unlinked -> Hard Delete executed
```

---

## 12. PUBLIC PRODUCT CATALOG

**IMPLEMENTED**
* **Routes:** `/products`, `/products/[id]`
* **Features:** 
    * Product listing grid
    * Product details page with image gallery
    * Filtering by Category, Brand, Collection
    * "Featured" filtering
    * Search by name/SKU
    * Loading & empty states

**Data Flow:**
```text
MySQL Database
 ↓
FastAPI (/api/v1/products)
 ↓
Next.js Client Components (fetch via React Query/Axios)
 ↓
/products Page Rendering
```

---

## 13. DYNAMIC DATA FLOW

**Database-Driven (Dynamic):**
* Product listings and details
* Sidebar filters (Categories, Brands, Collections are fetched from the API dynamically)
* Product Images

**Hardcoded:**
* Main navigation structure (though some links may be dynamic)
* Specific static UI text/descriptions on non-catalog pages

---

## 14. CRM INTEGRATION

**PARTIALLY IMPLEMENTED**
Models exist connecting CRM with Products:
* **RequirementProduct:** Links a client `Requirement` to a `Product`.
* **ProjectProduct:** Links an active `Project` to a `Product` (with status tracking e.g., pending, ordered, installed).
* **QuotationItem:** Snapshots product pricing for historical accuracy on a `Quotation`.

The backend APIs support these models, but frontend integration into deep CRM workflows (like generating the quotation PDF) may be pending or partially complete.

---

## 15. PUBLIC FORMS / LEAD CAPTURE

**IMPLEMENTED Models & Backend APIs:**
* Free Consultation (`consultation.py`)
* Newsletter (`newsletter.py`)
* Contact (`contact.py`)
* Start Your Journey / Planner (`requirement.py`)

Data is stored in the database and visible in the Admin UI under respective routes (`/admin/consultations`, etc.).

---

## 16. AUTHENTICATION & AUTHORIZATION

**IMPLEMENTED**
* **Public User:** Can access catalog and submit forms.
* **Admin:** Protected routes (`/admin/*`) and API endpoints (`/api/v1/admin/*`).
* **System:** NextAuth.js integrates with Google OAuth on the frontend, which sends a token to FastAPI (`/api/v1/auth/google`). FastAPI verifies the token and issues a custom JWT. Admin is verified by matching the configured `ADMIN_EMAIL` in the backend `.env`.

---

## 17. API DOCUMENTATION (Sample Inventory)

| Method | Endpoint                      | Access | Purpose                 | Status |
| ------ | ----------------------------- | ------ | ----------------------- | ------ |
| GET    | `/api/v1/products`            | Public | List products           | ✅      |
| GET    | `/api/v1/products/{id}`       | Public | Product details         | ✅      |
| POST   | `/api/v1/admin/products`      | Admin  | Create product          | ✅      |
| PUT    | `/api/v1/admin/products/{id}` | Admin  | Update product          | ✅      |
| DELETE | `/api/v1/admin/products/{id}` | Admin  | Delete product          | ✅      |
| POST   | `/api/v1/upload/image`        | Admin  | Upload optimized image  | ✅      |

---

## 18. DATABASE MIGRATIONS

**IMPLEMENTED**
Managed by Alembic. Key migrations found:
* `initial_mysql`
* `add_crm_models`
* `add_product_catalog`
* `add_phase_1_crm_models`
* `add_is_featured_to_products`

---

## 19. FILE UPLOAD SYSTEM

**IMPLEMENTED**
* **Images:** `/api/v1/upload/image` saves locally to `uploads/products/`. Validates size, converts to WEBP.
* **Documents:** Folder `uploads/documents/` exists, suggesting local document storage handling is planned or implemented alongside CRM quoting.

---

## 20. UI / DESIGN SYSTEM

**IMPLEMENTED**
* **Theme:** Tailwind CSS v4, supporting light/dark mode variants.
* **Components:** Custom components utilizing Lucide React for iconography.
* **Animations:** Integrated using `motion` and `tw-animate-css`.
* **State Management:** React Query for server state.

---

## 21. ROUTE STRUCTURE

**IMPLEMENTED**
```text
PUBLIC
/
├── /products
├── /products/[id]
├── /services
├── /portfolio
├── /testimonials
└── /workers

ADMIN
/admin
├── /products
├── /categories
├── /brands
├── /collections
├── /leads
├── /requirements
├── /consultations
├── /contact
└── /newsletter
```

---

## 22. SECURITY

* **Admin Authorization:** Enforced via `Depends(require_admin)` on backend routes.
* **File Validation:** Size limits (5MB) and type checking (`image/jpeg`, `image/png`, `image/webp`) on uploads.
* **SQL Injection:** Protected inherently via SQLAlchemy ORM.
* **Passwords/Tokens:** Handled via external OAuth (Google) and secure JWTs.

---

## 23. ERROR HANDLING

* **Backend:** FastAPI `HTTPException` used to return structured 400, 401, 404, and 500 status codes.
* **Safety Blocks:** Deletion API returns a 400 status code with specific messaging if CRM constraints are violated.

---

## 24. TESTING

* Backend includes basic initial test setup (e.g., `test_products.py`).
* Real end-to-end integration needs manual verification.

---

## 25. IMPLEMENTED VS PLANNED

### IMPLEMENTED
* Complete Product Catalog CRUD (Products, Categories, Brands, Collections).
* Image Upload and Processing pipeline.
* CRM Models (Leads, Projects, Requirements, Quotations).
* Public Catalog UI with dynamic filtering and product details.
* Authentication flow via Google OAuth -> JWT.
* Public Lead Capture forms.

### PARTIALLY IMPLEMENTED
* Full CRM workflow management (moving leads through stages visually in the UI).
* Advanced Project management (worker assignment).

### NOT IMPLEMENTED / FUTURE
* E-commerce Checkout, Cart, Payment Gateway (this is currently an interior design catalog/CRM, not a direct D2C purchasing platform).
* Direct Public Google Login for purchasing.

---

## 26. KNOWN ISSUES / TECHNICAL DEBT

* **S3 Legacy:** There is a migration renaming `s3_key` to `file_path`, indicating a move away from S3 to local storage, but local storage doesn't scale natively on serverless platforms.
* **Pagination:** Frontend catalog pagination relies heavily on offset/limit; large datasets may require optimized pagination UI.
* **Hardcoded UI elements:** Some marketing text on public pages may be hardcoded rather than CMS-driven.

---

## 27. CURRENT END-TO-END FLOWS

**Product Image Upload Flow**
```text
Admin
 ↓
Select Image
 ↓
POST /api/v1/upload/image
 ↓
Pillow (Resize & WEBP Convert)
 ↓
Save to /uploads/products/
 ↓
Return URL
 ↓
Admin Submits Product Form
 ↓
DB saves `product_images` row
```

**Product Deletion Flow**
```text
Admin triggers Delete
 ↓
DELETE /api/v1/admin/products/{id}
 ↓
Backend checks ProjectProduct, RequirementProduct, QuotationItem
 ↓
If found: Block with 400 Error ("Cannot delete... Please Archive")
If clear: Delete row from DB
```

---

## 28. FILE / CODE REFERENCES

* **Models:** 
  * `backend/app/models/product.py`
  * `backend/app/models/project.py`
  * `backend/app/models/requirement.py`
* **API Routers:**
  * `backend/app/routers/products.py`
  * `backend/app/routers/uploads.py`
  * `backend/app/routers/auth.py`
* **Frontend Catalog:**
  * `frontend/src/app/(public)/products/page.tsx`
  * `frontend/src/app/(public)/products/[id]/page.tsx`

---

## 29. CURRENT PROJECT STATUS

**Current Implementation Status**
* The foundational Product Catalog and its relationship with the CRM are firmly established.
* The frontend seamlessly communicates with the backend, with functional dynamic filtering on the catalog.
* Admin capabilities cover all major data entities.
* The application runs locally with MySQL as the primary datastore.

**Documentation generated on:** September 3, 2026
