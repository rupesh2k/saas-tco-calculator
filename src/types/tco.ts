export type CostPeriod = "daily" | "monthly" | "annual";

export interface CostItem {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
  period: CostPeriod;
  monthlyCost: number; // derived: (quantity * unitCost) * (period === "daily" ? 30 : period === "annual" ? 1/12 : 1)
  notes: string;
}

export interface CostCategory {
  id: string;
  label: string;
  icon: string;
  items: CostItem[];
}

export interface AppAllocation {
  id: string;
  name: string;
  weight: number; // percentage weight 0-100
}

export interface GrowthProjection {
  year: number;
  growthRate: number; // percentage
  totalCost: number;
}

export const DEFAULT_CATEGORIES: CostCategory[] = [
  {
    id: "compute",
    label: "Compute",
    icon: "Server",
    items: [
      { id: "openstack-vm", name: "Virtual Machines", quantity: 1, unitCost: 0, period: "monthly" as const, monthlyCost: 0, notes: "" },
      { id: "aws-ec2", name: "Cloud Compute (EC2/ECS)", quantity: 1, unitCost: 0, period: "monthly" as const, monthlyCost: 0, notes: "" },
      { id: "kubernetes", name: "Container Orchestration", quantity: 1, unitCost: 0, period: "monthly" as const, monthlyCost: 0, notes: "" },
    ],
  },
  {
    id: "database",
    label: "Database",
    icon: "Database",
    items: [
      { id: "mysql-vm", name: "Database Instances", quantity: 1, unitCost: 0, period: "monthly" as const, monthlyCost: 0, notes: "" },
      { id: "rds", name: "Managed Database", quantity: 1, unitCost: 0, period: "monthly" as const, monthlyCost: 0, notes: "" },
      { id: "redis", name: "Cache Layer", quantity: 1, unitCost: 0, period: "monthly" as const, monthlyCost: 0, notes: "" },
    ],
  },
  {
    id: "storage",
    label: "Storage",
    icon: "HardDrive",
    items: [
      { id: "ceph", name: "Block / Object Storage", quantity: 1, unitCost: 0, period: "monthly" as const, monthlyCost: 0, notes: "" },
      { id: "s3", name: "Cloud Storage (S3/GCS)", quantity: 1, unitCost: 0, period: "monthly" as const, monthlyCost: 0, notes: "" },
      { id: "block-storage", name: "File Storage", quantity: 1, unitCost: 0, period: "monthly" as const, monthlyCost: 0, notes: "" },
    ],
  },
  {
    id: "network",
    label: "Network & CDN",
    icon: "Globe",
    items: [
      { id: "cloudflare", name: "Cloudflare", quantity: 1, unitCost: 0, period: "monthly" as const, monthlyCost: 0, notes: "" },
      { id: "load-balancer", name: "Load Balancer", quantity: 1, unitCost: 0, period: "monthly" as const, monthlyCost: 0, notes: "" },
      { id: "bandwidth", name: "Bandwidth / Data Transfer", quantity: 1, unitCost: 0, period: "monthly" as const, monthlyCost: 0, notes: "" },
    ],
  },
  {
    id: "licensing",
    label: "Licensing",
    icon: "FileKey",
    items: [
      { id: "os-license", name: "OS Licenses (RHEL, Windows)", quantity: 1, unitCost: 0, period: "monthly" as const, monthlyCost: 0, notes: "" },
      { id: "software-license", name: "Software Licenses", quantity: 1, unitCost: 0, period: "monthly" as const, monthlyCost: 0, notes: "" },
      { id: "monitoring", name: "Monitoring Tools", quantity: 1, unitCost: 0, period: "monthly" as const, monthlyCost: 0, notes: "" },
    ],
  },
  {
    id: "operations",
    label: "Operations & Support",
    icon: "Wrench",
    items: [
      { id: "staff", name: "Staff / FTE Cost", quantity: 1, unitCost: 0, period: "monthly" as const, monthlyCost: 0, notes: "" },
      { id: "backup", name: "Backup & DR", quantity: 1, unitCost: 0, period: "monthly" as const, monthlyCost: 0, notes: "" },
      { id: "security", name: "Security Tools", quantity: 1, unitCost: 0, period: "monthly" as const, monthlyCost: 0, notes: "" },
    ],
  },
  {
    id: "other",
    label: "Other Costs",
    icon: "MoreHorizontal",
    items: [
      { id: "misc-1", name: "Miscellaneous", quantity: 1, unitCost: 0, period: "monthly" as const, monthlyCost: 0, notes: "" },
    ],
  },
];
