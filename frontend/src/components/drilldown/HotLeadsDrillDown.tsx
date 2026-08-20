import React, { useState } from 'react';
import { Flame, Clock, UserCheck, Search, Check, PhoneCall, Sparkles } from 'lucide-react';
import { HotLeadDto } from '../../types';

interface HotLeadsDrillDownProps {
  leads: HotLeadDto[];
  onReassignAll: () => void;
  isReassigning: boolean;
}

export const HotLeadsDrillDown: React.FC<HotLeadsDrillDownProps> = ({
  leads,
  onReassignAll,
  isReassigning
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [contactedIds, setContactedIds] = useState<Set<string>>(new Set());
  const [leadAssignments, setLeadAssignments] = useState<{ [key: string]: string }>({});

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('uz-UZ').format(val) + ' so\'m';
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.productName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'unanswered') return matchesSearch && lead.status === 'Unanswered';
    if (filterStatus === 'reassigned') return matchesSearch && lead.status === 'Reassigned';
    return matchesSearch;
  });

  const unansweredCount = leads.filter(l => l.status === 'Unanswered').length;
  const totalValue = leads.reduce((acc, l) => acc + l.estimatedValue, 0);

  const toggleContacted = (id: string) => {
    setContactedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const assignIndividual = (leadId: string, agentName: string) => {
    setLeadAssignments(prev => ({ ...prev, [leadId]: agentName }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Top Banner with Quick 1-Click Reassign */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(19, 27, 46, 0.9) 100%)',
        border: '1px solid rgba(244, 63, 94, 0.35)',
        borderRadius: 16,
        padding: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(244, 63, 94, 0.2)',
            color: '#f43f5e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(244, 63, 94, 0.3)'
          }}>
            <Flame style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#ffffff' }}>
                37 ta Hot Lead Javobsiz Qolgan
              </h3>
              <span className="badge badge-danger">24+ soat kutmoqda</span>
            </div>
            <p style={{ fontSize: 13, color: '#cbd5e1', marginTop: 3 }}>
              Xaridga 100% tayyor mijozlar. Yo'qotilayotgan summa: <strong style={{ color: '#fda4af', fontFamily: 'var(--font-mono)' }}>{formatCurrency(totalValue)}</strong>
            </p>
          </div>
        </div>

        {/* 1-Click Reassign Button */}
        {unansweredCount > 0 ? (
          <button
            onClick={onReassignAll}
            disabled={isReassigning}
            className="btn btn-danger"
            style={{ padding: '12px 20px', fontSize: 13 }}
          >
            {isReassigning ? (
              <span>Taqsimlanmoqda...</span>
            ) : (
              <>
                <Sparkles style={{ width: 16, height: 16 }} />
                <span>🔥 1 Bosishda Top Sotuvchilarga Taqsimlash</span>
              </>
            )}
          </button>
        ) : (
          <div className="btn btn-done" style={{ padding: '10px 18px' }}>
            <Check style={{ width: 16, height: 16 }} />
            <span>Barcha 37 lead top sotuvchilarga biriktirildi!</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ position: 'relative', minWidth: 280, flex: 1 }}>
          <Search style={{ width: 16, height: 16, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Mijoz ismi, telefon raqami yoki mahsulot..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: 10,
              background: '#090d16',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: 13,
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setFilterStatus('all')}
            className={`btn ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 14px', fontSize: 12 }}
          >
            Barchasi ({leads.length})
          </button>
          <button
            onClick={() => setFilterStatus('unanswered')}
            className={`btn ${filterStatus === 'unanswered' ? 'btn-danger' : 'btn-outline'}`}
            style={{ padding: '8px 14px', fontSize: 12 }}
          >
            Kutayotganlar ({unansweredCount})
          </button>
          <button
            onClick={() => setFilterStatus('reassigned')}
            className={`btn ${filterStatus === 'reassigned' ? 'btn-success' : 'btn-outline'}`}
            style={{ padding: '8px 14px', fontSize: 12 }}
          >
            Taqsimlanganlar ({leads.length - unansweredCount})
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div style={{
        background: '#090d16',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 14,
        overflow: 'hidden'
      }}>
        <div style={{ maxHeight: 420, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{
                background: '#0c1220',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94a3b8',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <th style={{ padding: '12px 16px' }}>Mijoz / Kanal</th>
                <th style={{ padding: '12px 16px' }}>So'ralgan Mahsulot</th>
                <th style={{ padding: '12px 16px' }}>Kutilgan Qiymat</th>
                <th style={{ padding: '12px 16px' }}>Kutish Vaqti</th>
                <th style={{ padding: '12px 16px' }}>Holat / Biriktirish</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Tezkor Amal</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => {
                const isContacted = contactedIds.has(lead.id);
                const assignedOverride = leadAssignments[lead.id];
                const isReassigned = lead.status === 'Reassigned' || !!assignedOverride;
                const assignedName = assignedOverride || lead.assignedAgentName;

                return (
                  <tr
                    key={lead.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.1s ease'
                    }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>{lead.customerName}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, display: 'flex', gap: 10 }}>
                        <span style={{ fontFamily: 'var(--font-mono)' }}>{lead.phone}</span>
                        <span style={{ color: '#38bdf8' }}>{lead.instagramHandle}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic', marginTop: 3 }}>
                        "{lead.customerInquiry}"
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{lead.productName}</div>
                      <span style={{
                        display: 'inline-block',
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: '#94a3b8',
                        marginTop: 4
                      }}>
                        {lead.channel}
                      </span>
                    </td>

                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fcd34d' }}>
                      {formatCurrency(lead.estimatedValue)}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f43f5e', fontWeight: 600 }}>
                        <Clock style={{ width: 14, height: 14 }} />
                        <span>{lead.unansweredHours} soat oldin</span>
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      {isReassigned ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6ee7b7' }}>
                          <UserCheck style={{ width: 14, height: 14 }} />
                          <div>
                            <div style={{ fontWeight: 700 }}>{assignedName}</div>
                            <div style={{ fontSize: 10, color: '#10b981' }}>Telegram xabari yuborildi</div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="badge badge-danger" style={{ fontSize: 11 }}>Javobsiz</span>
                          <select
                            onChange={(e) => assignIndividual(lead.id, e.target.value)}
                            defaultValue=""
                            style={{
                              background: '#1e293b',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              borderRadius: 8,
                              color: '#cbd5e1',
                              fontSize: 11,
                              padding: '3px 6px',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="" disabled>Biriktirish...</option>
                            <option value="Otabek Rustamov (Top)">Otabek (Top Closer)</option>
                            <option value="Javohir Yo'ldoshev (Top)">Javohir (Top Closer)</option>
                            <option value="Zilola Umarova">Zilola Umarova</option>
                          </select>
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => toggleContacted(lead.id)}
                        className={`btn ${isContacted ? 'btn-done' : 'btn-outline'}`}
                        style={{ padding: '6px 12px', fontSize: 12 }}
                      >
                        {isContacted ? (
                          <>
                            <Check style={{ width: 13, height: 13, color: '#10b981' }} />
                            <span>Bog'lanildi</span>
                          </>
                        ) : (
                          <>
                            <PhoneCall style={{ width: 13, height: 13, color: '#38bdf8' }} />
                            <span>Qo'ng'iroq</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
