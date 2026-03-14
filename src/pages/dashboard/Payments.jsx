// src/pages/dashboard/Payments.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  DollarSign, CreditCard, Receipt, Download,
  CheckCircle, XCircle, Clock, AlertCircle,
  Loader2, FileText, ArrowRight, Calendar,
  Filter, Search, Eye
} from 'lucide-react';

function DashboardPayments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPaid: 0,
    pendingPayments: 0,
    upcomingPayments: 0
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          application:applications (
            id,
            property:properties (
              title,
              location
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPayments(data);
        
        // Calculate stats
        const total = data.reduce((sum, p) => sum + (p.amount || 0), 0);
        const pending = data.filter(p => p.status === 'pending').length;
        const upcoming = data.filter(p => p.status === 'scheduled').length;
        
        setStats({
          totalPaid: total,
          pendingPayments: pending,
          upcomingPayments: upcoming
        });
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      paid: { color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle, label: 'Paid' },
      pending: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: Clock, label: 'Pending' },
      failed: { color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle, label: 'Failed' },
      refunded: { color: 'text-purple-500', bg: 'bg-purple-500/10', icon: Receipt, label: 'Refunded' },
      scheduled: { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Calendar, label: 'Scheduled' }
    };
    return configs[status] || configs.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-light text-white">Payments</h1>
        <p className="text-[#A1A1AA] text-sm mt-1">Manage your transactions and invoices</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="text-2xl font-light text-white mb-1">${stats.totalPaid.toLocaleString()}</div>
          <div className="text-sm text-[#A1A1AA]">Total Paid</div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full">
              {stats.pendingPayments}
            </span>
          </div>
          <div className="text-2xl font-light text-white mb-1">{stats.pendingPayments}</div>
          <div className="text-sm text-[#A1A1AA]">Pending Payments</div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-xs text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full">
              {stats.upcomingPayments}
            </span>
          </div>
          <div className="text-2xl font-light text-white mb-1">{stats.upcomingPayments}</div>
          <div className="text-sm text-[#A1A1AA]">Upcoming Payments</div>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#27272A]">
          <h2 className="text-white font-light">Transaction History</h2>
        </div>

        {payments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#F97316]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-[#F97316]" />
            </div>
            <h3 className="text-white font-light mb-2">No transactions yet</h3>
            <p className="text-[#A1A1AA] text-sm">Your payment history will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#27272A]">
                  <th className="px-6 py-4 text-left text-xs text-[#A1A1AA] font-light uppercase tracking-wider">Transaction</th>
                  <th className="px-6 py-4 text-left text-xs text-[#A1A1AA] font-light uppercase tracking-wider">Property</th>
                  <th className="px-6 py-4 text-left text-xs text-[#A1A1AA] font-light uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs text-[#A1A1AA] font-light uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs text-[#A1A1AA] font-light uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs text-[#A1A1AA] font-light uppercase tracking-wider">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {payments.map((payment) => {
                  const status = getStatusConfig(payment.status);
                  const StatusIcon = status.icon;
                  
                  return (
                    <tr key={payment.id} className="hover:bg-[#0A0A0A] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${status.bg} rounded-lg flex items-center justify-center`}>
                            <StatusIcon className={`w-4 h-4 ${status.color}`} />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{payment.description || 'Payment'}</p>
                            <p className="text-[#A1A1AA] text-xs">ID: {payment.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white text-sm">{payment.application?.property?.title || '—'}</p>
                        <p className="text-[#A1A1AA] text-xs">{payment.application?.property?.location || ''}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white text-sm font-medium">${payment.amount?.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[#A1A1AA] text-sm">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${status.bg} ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1 text-[#A1A1AA] hover:text-white transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-[#A1A1AA] hover:text-white transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPayments;
