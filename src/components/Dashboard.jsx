import React from 'react';
import { Activity, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  // التنسيقات مدمجة بأسلوب الكائنات (Inline Styles) لمحاكاة ملف CSS الخاص بك
  const styles = {
    body: {
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Almarai', sans-serif",
      direction: 'rtl'
    },
    container: {
      width: '100%',
      maxWidth: '500px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    statusCard: {
      background: '#ffffff',
      padding: '16px',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderRight: '5px solid #f97316',
    },
    statusHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#f97316',
      marginBottom: '4px',
    },
    statusValue: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#1f2937',
      margin: 0,
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
    },
    statBoxBlue: {
      padding: '16px',
      borderRadius: '16px',
      color: 'white',
      backgroundColor: '#2563eb',
    },
    statBoxIndigo: {
      padding: '16px',
      borderRadius: '16px',
      color: 'white',
      backgroundColor: '#4f46e5',
    },
    statLabel: {
      fontSize: '12px',
      opacity: 0.9,
      marginBottom: '4px',
    },
    statNumber: {
      fontSize: '20px',
      fontWeight: '700',
      margin: 0,
    },
    alertsContainer: {
      background: '#ffffff',
      padding: '16px',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #f1f5f9',
    },
    alertsTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#374151',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px',
    },
    alertItem: {
      fontSize: '14px',
      color: '#ef4444',
      backgroundColor: '#fef2f2',
      padding: '10px',
      borderRadius: '8px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        
        {/* حالة النظام */}
        <div style={styles.statusCard}>
          <div style={styles.statusHeader}>
            <Activity size={18} />
            <span style={{fontWeight: 700, fontSize: '14px'}}>حالة النظام</span>
          </div>
          <p style={styles.statusValue}>مستقر</p>
        </div>

        {/* الإحصائيات */}
        <div style={styles.statsGrid}>
          <div style={styles.statBoxBlue}>
            <div style={styles.statLabel}>إجمالي الوحدات</div>
            <p style={styles.statNumber}>1,250</p>
          </div>
          <div style={styles.statBoxIndigo}>
            <div style={styles.statLabel}>عمليات اليوم</div>
            <p style={styles.statNumber}>42</p>
          </div>
        </div>

        {/* تنبيهات النقص */}
        <div style={styles.alertsContainer}>
          <h3 style={styles.alertsTitle}>
            <AlertTriangle size={18} color="#ef4444" />
            تنبيهات النقص
          </h3>
          
          <div>
            <div style={styles.alertItem}>
              <span>الرصيد منخفض جداً في <strong>قسم الإلكترونيات</strong></span>
            </div>
            <div style={styles.alertItem}>
              <span>الرصيد منخفض جداً في <strong>المشروبات</strong></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
