'use client';

import React from 'react';
import { useGetAdminAnalyticsQuery } from '@/redux/api/resumeApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  FileText,
  CreditCard,
  TrendingUp,
  Activity,
  Award,
  ArrowUpRight,
  Loader2,
  BarChart2,
  UserCheck,
  DollarSign,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';

// ─── Helpers ────────────────────────────────────────────────────────────────

const ACTION_LABELS: Record<string, string> = {
  RESUME_UPLOADED: 'Resume Uploaded',
  RESUME_ANALYZED: 'Resume Analyzed',
  COVER_LETTER_GENERATED: 'Cover Letter Generated',
  USER_UPGRADED: 'User Upgraded',
  PAYMENT_PROCESSED: 'Payment Processed',
  ACCOUNT_CREATED: 'Account Created',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  PROFILE_UPDATED: 'Profile Updated',
  SCORE_RECEIVED: 'Score Received',
  EXPORT_REPORT: 'Export Report',
  COVER_LETTER_COPIED: 'Cover Letter Copied',
  USER_DOWNGRADED: 'User Downgraded',
};

const ACTION_COLORS: Record<string, string> = {
  RESUME_UPLOADED: 'bg-blue-100 text-blue-700',
  RESUME_ANALYZED: 'bg-purple-100 text-purple-700',
  COVER_LETTER_GENERATED: 'bg-emerald-100 text-emerald-700',
  USER_UPGRADED: 'bg-amber-100 text-amber-700',
  PAYMENT_PROCESSED: 'bg-green-100 text-green-700',
  ACCOUNT_CREATED: 'bg-sky-100 text-sky-700',
  LOGIN: 'bg-gray-100 text-gray-600',
  DEFAULT: 'bg-slate-100 text-slate-600',
};

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const CHART_COLORS = ['#6B5FD3', '#8B7FF3', '#A59CF5', '#BFB9F7', '#D9D6FA',
  '#4F46E5', '#7C3AED', '#A855F7', '#C084FC', '#E879F9'];

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 text-sm">
        <p className="font-semibold text-gray-700 mb-1">{ACTION_LABELS[label] || label}</p>
        <p className="text-[#6B5FD3] font-bold text-lg">{payload[0].value} events</p>
      </div>
    );
  }
  return null;
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminAnalyticsPage() {
  const { data, isLoading, error } = useGetAdminAnalyticsQuery({});

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#6B5FD3]" />
        <p className="text-sm text-gray-500 font-medium">Loading analytics…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
          <Activity className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-500">You need admin privileges to view this page.</p>
      </div>
    );
  }

  const stats = data?.data;

  const summaryCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers?.toLocaleString() ?? '0',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      sub: `${stats?.newUsersThisMonth ?? 0} new this month`,
    },
    {
      title: 'Total Analyses',
      value: stats?.totalAnalyses?.toLocaleString() ?? '0',
      icon: FileText,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      sub: `${stats?.analysesThisMonth ?? 0} this month`,
    },
    {
      title: 'Pro Subscribers',
      value: stats?.totalPaidUsers?.toLocaleString() ?? '0',
      icon: UserCheck,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-100',
      sub: `${stats?.activeSubscriptions ?? 0} active subscriptions`,
    },
    {
      title: 'Conversion Rate',
      value: `${stats?.conversionRate ?? 0}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      sub: 'Free → Pro',
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats?.monthlyRecurringRevenue ?? 0}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      sub: '$5 × active subs',
    },
    {
      title: 'Avg ATS Score',
      value: `${stats?.averageAtsScore ?? 0}`,
      icon: Award,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      sub: 'Across all analyses',
    },
    {
      title: 'Cover Letters',
      value: stats?.totalCoverLetters?.toLocaleString() ?? '0',
      icon: Zap,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
      border: 'border-pink-100',
      sub: 'Generated total',
    },
    {
      title: 'Activity Events',
      value: stats?.topActions?.reduce((a: number, b: any) => a + b.count, 0)?.toLocaleString() ?? '0',
      icon: BarChart2,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      sub: 'Across all actions',
    },
  ];

  const planData = [
    {
      name: 'Free',
      value: Math.max(0, (stats?.totalUsers ?? 0) - (stats?.totalPaidUsers ?? 0)),
    },
    { name: 'Pro', value: stats?.totalPaidUsers ?? 0 },
  ];

  const chartActions = (stats?.topActions ?? []).map((a: any) => ({
    ...a,
    label: ACTION_LABELS[a.action] || a.action,
  }));

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Platform Analytics
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Real-time business metrics &amp; user activity overview
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Live data
        </div>
      </div>

      {/* ── Summary Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
        {summaryCards.map((card, index) => (
          <Card
            key={index}
            className={`border ${card.border} shadow-sm hover:shadow-md transition-all rounded-2xl col-span-2 md:col-span-2 xl:col-span-2`}
          >
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-black text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Top Actions Bar Chart — spans 3 cols */}
        <Card className="lg:col-span-3 border-none shadow-sm rounded-3xl">
          <CardHeader className="px-6 pt-6 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-800">
              <Activity className="w-5 h-5 text-[#6B5FD3]" />
              Top User Actions
            </CardTitle>
            <p className="text-xs text-gray-400 mt-0.5">Sorted by frequency across all time</p>
          </CardHeader>
          <CardContent className="px-6 pb-6 h-[340px]">
            {chartActions.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No activity data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartActions} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="label"
                    type="category"
                    tick={{ fontSize: 11, fontWeight: 500, fill: '#6b7280' }}
                    width={160}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8f8ff' }} />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                    {chartActions.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Plan Distribution Pie — spans 2 cols */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl">
          <CardHeader className="px-6 pt-6 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-800">
              <Users className="w-5 h-5 text-[#6B5FD3]" />
              Plan Distribution
            </CardTitle>
            <p className="text-xs text-gray-400 mt-0.5">Free vs Pro users</p>
          </CardHeader>
          <CardContent className="px-2 pb-6 h-[340px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planData}
                  innerRadius={72}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#e5e7eb" />
                  <Cell fill="#6B5FD3" />
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-xs text-gray-600">{value}</span>
                  )}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 30px -5px rgba(0,0,0,0.12)',
                    fontSize: 13,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Centre label */}
            <div className="absolute flex flex-col items-center pointer-events-none">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total</span>
              <span className="text-3xl font-black text-gray-900">{stats?.totalUsers ?? 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity Feed */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl">
          <CardHeader className="px-6 pt-6 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-800">
              <Zap className="w-5 h-5 text-[#6B5FD3]" />
              Recent Activity
            </CardTitle>
            <p className="text-xs text-gray-400 mt-0.5">Last 20 events across the platform</p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {(stats?.recentActivity ?? []).length === 0 ? (
                <p className="text-sm text-gray-400 py-8 text-center">No activity yet</p>
              ) : (
                (stats?.recentActivity ?? []).map((log: any) => {
                  const badgeClass =
                    ACTION_COLORS[log.action] || ACTION_COLORS.DEFAULT;
                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <span
                        className={`mt-0.5 shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}
                      >
                        {ACTION_LABELS[log.action] || log.action}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 font-medium truncate">
                          {log.userName}
                        </p>
                        {log.description && (
                          <p className="text-xs text-gray-400 truncate">{log.description}</p>
                        )}
                      </div>
                      <span className="shrink-0 text-xs text-gray-400 whitespace-nowrap">
                        {formatTimeAgo(log.createdAt)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* KPI Highlights */}
        <div className="flex flex-col gap-6">
          {/* New Users Highlight */}
          <Card className="border-none shadow-sm rounded-3xl bg-gradient-to-br from-[#6B5FD3] to-[#8B7FF3] text-white flex-1">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                New This Month
              </p>
              <p className="text-5xl font-black">{stats?.newUsersThisMonth ?? 0}</p>
              <p className="text-white/60 text-sm">
                registrations since {new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </p>
            </CardContent>
          </Card>

          {/* MRR Highlight */}
          <Card className="border border-emerald-100 shadow-sm rounded-3xl flex-1">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                MRR
              </p>
              <p className="text-5xl font-black text-emerald-600">
                ${stats?.monthlyRecurringRevenue ?? 0}
              </p>
              <p className="text-gray-400 text-sm">
                {stats?.activeSubscriptions ?? 0} active × $5/mo
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
