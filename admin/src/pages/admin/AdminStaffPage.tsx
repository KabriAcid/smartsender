import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserX,
  UserCheck,
  Mail,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { TableSkeleton } from '@/components/skeletons';
import { EmptyState } from '@/components/EmptyState';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { mockStaff, mockDepartments } from '@/data/mockData';
import { Staff, StaffFilters, CreateStaffDTO } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 10;

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

export default function AdminStaffPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filters, setFilters] = useState<StaffFilters>({
    search: '',
    department: null,
    role: 'all',
    status: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<CreateStaffDTO>({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    role: 'staff',
  });

  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setStaff(mockStaff);
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchesSearch = filters.search
        ? `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(filters.search.toLowerCase())
        : true;
      const matchesDepartment = filters.department
        ? s.department === filters.department
        : true;
      const matchesRole = filters.role === 'all' || s.role === filters.role;
      const matchesStatus = filters.status === 'all' || s.status === filters.status;
      
      return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
    });
  }, [staff, filters]);

  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredStaff.slice(start, start + PAGE_SIZE);
  }, [filteredStaff, currentPage]);

  const totalPages = Math.ceil(filteredStaff.length / PAGE_SIZE);

  const handleCreateStaff = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.department) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));

    const newStaff: Staff = {
      id: `staff-${Date.now()}`,
      ...formData,
      status: 'active',
      createdAt: new Date().toISOString(),
      filesShared: 0,
      storageUsed: 0,
    };

    setStaff((prev) => [newStaff, ...prev]);
    setIsCreateOpen(false);
    setFormData({ firstName: '', lastName: '', email: '', department: '', role: 'staff' });
    setIsSubmitting(false);

    toast({
      title: 'Staff Created',
      description: `${newStaff.firstName} ${newStaff.lastName} has been added.`,
    });
  };

  const handleDeleteStaff = async () => {
    if (!selectedStaff) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    setStaff((prev) => prev.filter((s) => s.id !== selectedStaff.id));
    setIsDeleteOpen(false);
    setSelectedStaff(null);
    setIsSubmitting(false);

    toast({
      title: 'Staff Deleted',
      description: 'The staff member has been removed.',
    });
  };

  const handleToggleStatus = async (staffMember: Staff) => {
    const newStatus = staffMember.status === 'active' ? 'inactive' : 'active';
    
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffMember.id ? { ...s, status: newStatus } : s
      )
    );

    toast({
      title: 'Status Updated',
      description: `${staffMember.firstName} is now ${newStatus}.`,
    });
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Staff Management"
        description="Manage all staff accounts and permissions"
      >
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Staff</span>
        </Button>
      </AdminHeader>

      <div className="p-4 lg:p-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="pl-9 bg-secondary border-border"
            />
          </div>

          <Select
            value={filters.department || 'all'}
            onValueChange={(v) => setFilters((f) => ({ ...f, department: v === 'all' ? null : v }))}
          >
            <SelectTrigger className="w-[180px] bg-secondary border-border">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Departments</SelectItem>
              {mockDepartments.map((d) => (
                <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.role}
            onValueChange={(v) => setFilters((f) => ({ ...f, role: v as StaffFilters['role'] }))}
          >
            <SelectTrigger className="w-[140px] bg-secondary border-border">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(v) => setFilters((f) => ({ ...f, status: v as StaffFilters['status'] }))}
          >
            <SelectTrigger className="w-[140px] bg-secondary border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg overflow-hidden"
        >
          {isLoading ? (
            <div className="p-4">
              <TableSkeleton columns={6} rows={8} />
            </div>
          ) : filteredStaff.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No staff members found"
              description={filters.search ? 'Try adjusting your search or filters.' : 'Add your first staff member to get started.'}
              actionLabel={!filters.search ? 'Add Staff' : undefined}
              onAction={!filters.search ? () => setIsCreateOpen(true) : undefined}
            />
          ) : (
            <>
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-muted/50 border-b border-border text-sm font-medium text-muted-foreground">
                <div className="col-span-3">Name</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Department</div>
                <div className="col-span-1">Role</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Last Login</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border">
                <AnimatePresence mode="popLayout">
                  {paginatedStaff.map((staffMember, index) => (
                    <motion.div
                      key={staffMember.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 table-row-hover"
                    >
                      {/* Name & Avatar */}
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {getInitials(staffMember.firstName, staffMember.lastName)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {staffMember.firstName} {staffMember.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground md:hidden truncate">
                            {staffMember.email}
                          </p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="hidden md:flex col-span-3 items-center text-sm text-muted-foreground truncate">
                        {staffMember.email}
                      </div>

                      {/* Department */}
                      <div className="hidden md:flex col-span-2 items-center text-sm text-foreground">
                        {staffMember.department}
                      </div>

                      {/* Role */}
                      <div className="hidden md:flex col-span-1 items-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            staffMember.role === 'admin' && "border-primary text-primary"
                          )}
                        >
                          {staffMember.role}
                        </Badge>
                      </div>

                      {/* Status */}
                      <div className="hidden md:flex col-span-1 items-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            staffMember.status === 'active'
                              ? "badge-success"
                              : "badge-warning"
                          )}
                        >
                          {staffMember.status}
                        </Badge>
                      </div>

                      {/* Last Login */}
                      <div className="hidden md:flex col-span-1 items-center text-sm text-muted-foreground">
                        {staffMember.lastLogin ? formatDate(staffMember.lastLogin) : '—'}
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border">
                            <DropdownMenuItem className="gap-2">
                              <Edit className="w-4 h-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Mail className="w-4 h-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() => handleToggleStatus(staffMember)}
                            >
                              {staffMember.status === 'active' ? (
                                <>
                                  <UserX className="w-4 h-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem
                              className="gap-2 text-destructive focus:text-destructive"
                              onClick={() => {
                                setSelectedStaff(staffMember);
                                setIsDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1} to{' '}
                    {Math.min(currentPage * PAGE_SIZE, filteredStaff.length)} of{' '}
                    {filteredStaff.length} staff
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => p - 1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground px-2">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Create Staff Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-card border-border sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add New Staff</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Create a new staff account. They will receive an email invitation.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData((f) => ({ ...f, firstName: e.target.value }))}
                  className="bg-secondary border-border"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData((f) => ({ ...f, lastName: e.target.value }))}
                  className="bg-secondary border-border"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                className="bg-secondary border-border"
                placeholder="john.doe@university.edu"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(v) => setFormData((f) => ({ ...f, department: v }))}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {mockDepartments.map((d) => (
                    <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(v) => setFormData((f) => ({ ...f, role: v as 'staff' | 'admin' }))}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              className="border-border"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateStaff} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Staff'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Staff Member"
        description={`Are you sure you want to delete ${selectedStaff?.firstName} ${selectedStaff?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDeleteStaff}
        isLoading={isSubmitting}
      />
    </div>
  );
}
