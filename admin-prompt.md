# AI Builder Prompt — SmartSender Super Admin Dashboard

Build a **premium, production-ready Super Admin Dashboard** for **SmartSender**, extending the existing staff portal with full administrative control. This dashboard is designed for **University Administrators** who manage staff accounts, monitor file sharing activity, and oversee institutional usage.

---

## **Existing Context**

SmartSender already has a **Staff Portal** with:
- Staff login and authentication (localStorage-based)
- Secure file sharing and receiving
- Profile viewing
- Premium black & white design system

The Admin Dashboard **must visually and architecturally align** with the existing Staff Portal while extending functionality for administrative users.

---

## **Tech Stack (Same as Staff Portal)**

* React (Vite)
* TypeScript (strict mode)
* Tailwind CSS (semantic tokens from existing design system)
* Framer Motion (animations)
* React Router
* Recharts (for analytics and charts)
* Shadcn/UI components (already installed)

---

## **Design System (Maintain Consistency)**

### **Color Palette**
```css
--background: 0 0% 4%;           /* #0A0A0A - Deep black */
--foreground: 0 0% 98%;          /* #FAFAFA - Pure white */
--muted: 0 0% 10%;               /* #1A1A1A - Subtle dark */
--muted-foreground: 0 0% 60%;    /* #999999 - Muted text */
--border: 0 0% 15%;              /* #262626 - Subtle borders */
--accent: 0 0% 20%;              /* #333333 - Hover states */
```

### **Typography**
- Font Family: **Inter** (all weights)
- Headings: Bold, clean, generous spacing
- Body: Regular weight, excellent readability

### **Design Philosophy**
- **Premium minimalism** — No unnecessary elements
- **Institutional authority** — Serious, official, trustworthy
- **Fintech-inspired** — Clean data visualization, subtle animations
- **Dark mode first** — Deep blacks, high contrast whites
- **No bright colors, gradients, or playful elements**

---

## **Core Admin Features**

### **1. Admin Authentication**
- Separate admin login flow (same UI, different validation)
- Role-based access control (admin vs staff)
- Admin session management
- Secure logout with session cleanup

### **2. Dashboard Overview**
- **Key Metrics Cards** with animated counters:
  - Total Staff Members
  - Active Users (last 7 days)
  - Total Files Shared
  - Storage Used / Quota
  - Pending Approvals (if applicable)

- **Analytics Charts** (Recharts):
  - File uploads over time (line/area chart)
  - Storage usage by department (bar chart)
  - Active users trend (line chart)
  - File type distribution (pie/donut chart)

- **Recent Activity Feed**:
  - Latest file uploads
  - New staff registrations
  - Login activity
  - System events

### **3. Staff Management (Full CRUD)**

#### **Staff List View**
- Paginated table with:
  - Avatar
  - Full Name
  - Email
  - Department
  - Role (Staff/Admin)
  - Status (Active/Inactive)
  - Last Login
  - Actions (Edit, Delete, Toggle Status)
- Search by name or email
- Filter by department, role, status
- Sort by any column
- Bulk actions (activate, deactivate, delete)

#### **Create Staff**
- Modal or dedicated page
- Form fields:
  - First Name, Last Name
  - Email (unique validation)
  - Department (dropdown)
  - Role (Staff/Admin)
  - Temporary Password (auto-generate option)
- Success toast notification
- Email invitation simulation

#### **Edit Staff**
- Pre-populated form
- Change department, role, status
- Reset password option
- Activity history preview

#### **Delete Staff**
- Confirmation dialog
- Soft delete option
- Transfer files option (reassign to another staff)

### **4. File Management**

#### **All Files View**
- Global file browser (all staff files)
- Columns:
  - File Name & Type Icon
  - Uploader (sender)
  - Recipients
  - Size
  - Upload Date
  - Download Count
  - Actions (Preview, Download, Delete)
- Advanced filters:
  - Date range
  - File type
  - Uploader
  - Size range
- Search functionality

#### **Storage Analytics**
- Total storage used
- Storage by department
- Storage by file type
- Largest files list
- Storage quota management

### **5. Department Management**

#### **Department List**
- View all departments
- Staff count per department
- Storage used per department

#### **CRUD Operations**
- Create new departments
- Edit department details
- Delete (with staff reassignment)
- Merge departments

### **6. Activity Logs & Audit Trail**
- Comprehensive activity log
- Filter by:
  - Action type (login, upload, download, delete)
  - User
  - Date range
- Export logs (CSV simulation)
- Real-time activity indicators

### **7. System Settings**
- Institution profile
- Storage quota settings
- File type restrictions
- Session timeout configuration
- Notification preferences

---

## **UX Improvements Required**

### **1. Skeleton Loaders**
Implement skeleton loading states for:
- Dashboard metric cards
- Data tables (rows shimmer)
- Charts (placeholder shimmer)
- User avatars
- File cards
- Activity feeds

Example pattern:
```tsx
// Skeleton for table rows
<TableRowSkeleton columns={6} rows={5} />

// Skeleton for stat cards
<StatCardSkeleton />

// Skeleton for charts
<ChartSkeleton type="bar" />
```

### **2. Empty States**
Contextual empty states with:
- Relevant illustration or icon
- Clear message
- Action button (when applicable)

Examples:
- "No staff members found" → "Add your first staff member"
- "No files uploaded yet" → "Files will appear here"
- "No activity to show" → "Activity will be logged here"

### **3. Loading & Progress Indicators**
- Page transition loading
- Button loading states
- Progress bars for uploads
- Inline spinners for async actions

### **4. Toast Notifications**
- Success: Staff created, file deleted, etc.
- Error: Validation failed, network error
- Info: Session expiring, updates available
- Consistent positioning (top-right)

### **5. Confirmation Dialogs**
- Delete confirmations with impact preview
- Bulk action confirmations
- Dangerous action warnings (red accent)

### **6. Form Validation**
- Real-time field validation
- Clear error messages
- Success indicators
- Disabled submit until valid

### **7. Responsive Data Tables**
- Horizontal scroll on mobile
- Column visibility toggles
- Compact mode option
- Row expansion for details

---

## **Directory Structure Extension**

```
src/
├── features/
│   ├── admin/
│   │   ├── components/
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminHeader.tsx
│   │   │   ├── StaffTable.tsx
│   │   │   ├── StaffForm.tsx
│   │   │   ├── FileTable.tsx
│   │   │   ├── DepartmentList.tsx
│   │   │   ├── ActivityFeed.tsx
│   │   │   ├── AnalyticsChart.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useStaffManagement.ts
│   │   │   ├── useFileManagement.ts
│   │   │   ├── useAnalytics.ts
│   │   │   └── useActivityLog.ts
│   │   └── index.ts
│   │
│   └── ... (existing features)
│
├── components/
│   ├── skeletons/
│   │   ├── TableSkeleton.tsx
│   │   ├── CardSkeleton.tsx
│   │   ├── ChartSkeleton.tsx
│   │   ├── AvatarSkeleton.tsx
│   │   └── index.ts
│   │
│   └── ... (existing components)
│
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminStaffPage.tsx
│   │   ├── AdminFilesPage.tsx
│   │   ├── AdminDepartmentsPage.tsx
│   │   ├── AdminActivityPage.tsx
│   │   ├── AdminSettingsPage.tsx
│   │   └── index.ts
│   │
│   └── ... (existing pages)
│
├── api/
│   ├── admin.api.ts          # Admin-specific endpoints
│   ├── analytics.api.ts      # Charts and metrics
│   └── ... (existing APIs)
│
├── mockdata/
│   ├── analytics.ts          # Mock chart data
│   ├── activities.ts         # Mock activity logs
│   └── ... (existing mocks)
│
└── types/
    └── index.ts              # Extended with admin types
```

---

## **New Type Definitions**

```typescript
// Admin-specific types
export interface AdminStats {
  totalStaff: number;
  activeUsers: number;
  totalFiles: number;
  storageUsed: number;
  storageQuota: number;
  pendingApprovals: number;
}

export interface ActivityLog {
  id: string;
  action: 'login' | 'logout' | 'upload' | 'download' | 'delete' | 'create' | 'update';
  entityType: 'staff' | 'file' | 'department' | 'system';
  entityId: string;
  entityName: string;
  performedBy: string;
  performedByName: string;
  performedAt: string;
  metadata?: Record<string, unknown>;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
}

export interface AnalyticsData {
  uploadsOverTime: ChartDataPoint[];
  storageByDepartment: ChartDataPoint[];
  activeUsersTrend: ChartDataPoint[];
  fileTypeDistribution: ChartDataPoint[];
}

export interface StaffFilters {
  search: string;
  department: string | null;
  role: 'all' | 'staff' | 'admin';
  status: 'all' | 'active' | 'inactive';
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}
```

---

## **API Abstraction (Admin Endpoints)**

```typescript
// api/admin.api.ts

// Staff Management
createStaff(data: CreateStaffDTO): Promise<ApiResponse<Staff>>
updateStaff(id: string, data: UpdateStaffDTO): Promise<ApiResponse<Staff>>
deleteStaff(id: string): Promise<ApiResponse<void>>
toggleStaffStatus(id: string): Promise<ApiResponse<Staff>>
bulkDeleteStaff(ids: string[]): Promise<ApiResponse<void>>
bulkToggleStatus(ids: string[], status: boolean): Promise<ApiResponse<void>>

// File Management (Admin)
getAllFiles(filters: FileFilters): Promise<ApiResponse<PaginatedResponse<SharedFile>>>
deleteFile(id: string): Promise<ApiResponse<void>>
bulkDeleteFiles(ids: string[]): Promise<ApiResponse<void>>

// Department Management
createDepartment(data: CreateDepartmentDTO): Promise<ApiResponse<Department>>
updateDepartment(id: string, data: UpdateDepartmentDTO): Promise<ApiResponse<Department>>
deleteDepartment(id: string, reassignTo?: string): Promise<ApiResponse<void>>

// Activity Logs
getActivityLogs(filters: ActivityFilters): Promise<ApiResponse<PaginatedResponse<ActivityLog>>>
exportActivityLogs(filters: ActivityFilters): Promise<ApiResponse<string>> // CSV URL

// Analytics
getDashboardStats(): Promise<ApiResponse<AdminStats>>
getAnalyticsData(dateRange: DateRange): Promise<ApiResponse<AnalyticsData>>
```

---

## **Animation Guidelines**

### **Page Transitions**
```tsx
// Consistent with staff portal
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.2 }}
>
```

### **Table Row Animations**
```tsx
// Staggered row entrance
<motion.tr
  initial={{ opacity: 0, x: -10 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.05 }}
>
```

### **Chart Animations**
- Smooth data transitions
- Enter animations on mount
- Hover state animations

### **Skeleton Shimmer**
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    hsl(var(--muted)) 25%,
    hsl(var(--muted-foreground) / 0.1) 50%,
    hsl(var(--muted)) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

---

## **Component Patterns**

### **Data Table with Loading**
```tsx
<DataTable
  columns={columns}
  data={data}
  isLoading={isLoading}
  skeleton={<TableSkeleton rows={10} columns={6} />}
  emptyState={<EmptyState title="No staff found" action={...} />}
  pagination={pagination}
  onPageChange={handlePageChange}
/>
```

### **Stat Card with Animation**
```tsx
<StatCard
  title="Total Staff"
  value={stats.totalStaff}
  icon={Users}
  trend={{ value: 12, direction: 'up' }}
  isLoading={isLoading}
/>
```

### **Confirmation Dialog**
```tsx
<ConfirmDialog
  open={isDeleteOpen}
  title="Delete Staff Member"
  description="This action cannot be undone. All files will be reassigned."
  confirmText="Delete"
  variant="destructive"
  onConfirm={handleDelete}
  onCancel={() => setIsDeleteOpen(false)}
/>
```

---

## **Routing Structure**

```tsx
// Admin routes (protected by admin role check)
/admin                    → AdminDashboard
/admin/staff              → AdminStaffPage
/admin/staff/new          → Create Staff
/admin/staff/:id          → Edit Staff
/admin/files              → AdminFilesPage
/admin/departments        → AdminDepartmentsPage
/admin/activity           → AdminActivityPage
/admin/settings           → AdminSettingsPage
```

---

## **Security Considerations (Frontend)**

- Role-based route guards (`RequireAdmin` component)
- Hide admin navigation from staff users
- Confirm destructive actions
- Session timeout handling
- Audit trail for all admin actions

---

## **Quality Requirements**

- TypeScript strict mode — no `any`
- All components fully typed
- Skeleton states for every async operation
- Empty states for every list/table
- Error boundaries for graceful failures
- Accessible (ARIA labels, keyboard navigation)
- Responsive design (mobile-friendly tables)

---

## **End Goal**

Deliver a **complete Super Admin Dashboard** that:
1. **Matches the Staff Portal** visually and architecturally
2. Provides **full CRUD** for staff, files, and departments
3. Includes **rich analytics** with beautiful charts
4. Features **premium UX** with skeletons, animations, and feedback
5. Is **production-ready** and **Laravel-backend ready**

---

## **Demo Credentials**

```
Admin Login:
Email: admin@smartsender.ng
Password: admin1234
```

---

## **Next Steps After Admin Dashboard**

1. **Laravel Backend Integration**
   - API contracts and authentication
   - Database schema design
   - Role-based access control

2. **Multi-University SaaS**
   - Institution management
   - White-label theming
   - Usage billing

3. **Advanced Features**
   - File approval workflows
   - Bulk import/export
   - Email notifications
   - Two-factor authentication
