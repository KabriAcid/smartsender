import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';
import { getInitials, formatDate, formatDateTime } from '@/utils/formatters';
import { 
  User, 
  Mail, 
  Building, 
  GraduationCap, 
  Calendar, 
  Clock,
  Shield
} from 'lucide-react';

export default function ProfilePage() {
  const { staff } = useAuth();

  if (!staff) {
    return null;
  }

  const profileFields = [
    {
      icon: Mail,
      label: 'Email Address',
      value: staff.email,
    },
    {
      icon: Building,
      label: 'Department',
      value: staff.department,
    },
    {
      icon: GraduationCap,
      label: 'Institution',
      value: staff.institution,
    },
    {
      icon: Shield,
      label: 'Role',
      value: staff.role.charAt(0).toUpperCase() + staff.role.slice(1),
    },
    {
      icon: Calendar,
      label: 'Account Created',
      value: formatDate(staff.createdAt),
    },
    {
      icon: Clock,
      label: 'Last Login',
      value: staff.lastLogin ? formatDateTime(staff.lastLogin) : 'N/A',
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">
          View your account information
        </p>
      </motion.div>

      <div className="max-w-2xl">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-8 mb-6"
        >
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
              <span className="text-3xl font-semibold text-foreground">
                {getInitials(staff.firstName, staff.lastName)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {staff.firstName} {staff.lastName}
              </h2>
              <p className="text-muted-foreground">{staff.department}</p>
              <p className="text-sm text-muted-foreground mt-1">{staff.institution}</p>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="space-y-6">
            {profileFields.map((field, index) => {
              const Icon = field.icon;
              return (
                <motion.div
                  key={field.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{field.label}</p>
                    <p className="font-medium text-foreground">{field.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Info Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-muted rounded-lg p-4"
        >
          <p className="text-sm text-muted-foreground">
            <User className="w-4 h-4 inline-block mr-2" />
            Profile information is managed by your institution's administrator. 
            Contact your IT department to update your details.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
