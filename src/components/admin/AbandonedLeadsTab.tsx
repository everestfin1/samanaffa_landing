'use client';

import { useCallback, useEffect, useState } from 'react';
import { Archive, Edit, Mail, Phone, X } from 'lucide-react';
import AdminMetricStrip from '@/components/admin/layout/AdminMetricStrip';
import AdminPanel from '@/components/admin/layout/AdminPanel';
import AdminEmptyState from '@/components/admin/layout/AdminEmptyState';

interface AbandonedLead {
  id: string;
  anonymousId: string;
  formType: string;
  email?: string | null;
  phone?: string | null;
  stepReached?: string | null;
  fieldsCompleted?: number | null;
  totalFields?: number | null;
  score: number;
  status: string;
  adminNotes?: string | null;
  lastActivityAt: string;
  firstSeenAt: string;
}

interface AbandonedLeadStats {
  total: number;
  abandoned: number;
  contacted: number;
  converted: number;
  dismissed: number;
}

export default function AbandonedLeadsTab() {
  const [leads, setLeads] = useState<AbandonedLead[]>([]);
  const [stats, setStats] = useState<AbandonedLeadStats>({
    total: 0,
    abandoned: 0,
    contacted: 0,
    converted: 0,
    dismissed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<AbandonedLead | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/abandoned-leads', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setLeads(data.drafts);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching abandoned leads:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleUpdate = async (status: string) => {
    if (!selectedLead) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/abandoned-leads', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedLead.id,
          status,
          adminNotes: notes,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((lead) =>
            lead.id === selectedLead.id
              ? { ...lead, status, adminNotes: notes }
              : lead,
          ),
        );

        const newStats = { ...stats };
        const prevStatus = selectedLead.status;
        if (prevStatus === 'ABANDONED') newStats.abandoned--;
        if (prevStatus === 'CONTACTED') newStats.contacted--;
        if (prevStatus === 'CONVERTED') newStats.converted--;
        if (prevStatus === 'DISMISSED') newStats.dismissed--;
        if (status === 'ABANDONED') newStats.abandoned++;
        if (status === 'CONTACTED') newStats.contacted++;
        if (status === 'CONVERTED') newStats.converted++;
        if (status === 'DISMISSED') newStats.dismissed++;
        setStats(newStats);

        setShowModal(false);
        setSelectedLead(null);
        setNotes('');
      } else {
        alert(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error updating abandoned lead:', error);
      alert('Erreur lors de la mise à jour du lead abandonné');
    } finally {
      setUpdating(false);
    }
  };

  const openModal = (lead: AbandonedLead) => {
    setSelectedLead(lead);
    setNotes(lead.adminNotes || '');
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="admin-empty-state">
        <p className="admin-empty-text">Chargement des leads abandonnés…</p>
      </div>
    );
  }

  return (
    <>
      <div className="admin-page">
        <AdminMetricStrip
          metrics={[
            { id: 'total', label: 'Total', value: stats.total, tone: 'info' },
            {
              id: 'abandoned',
              label: 'Abandonnés',
              value: stats.abandoned,
              tone: 'warning',
            },
            {
              id: 'contacted',
              label: 'Contactés',
              value: stats.contacted,
              tone: 'muted',
            },
            {
              id: 'converted',
              label: 'Convertis',
              value: stats.converted,
              tone: 'success',
            },
            {
              id: 'dismissed',
              label: 'Écartés',
              value: stats.dismissed,
              tone: 'danger',
            },
          ]}
        />

        <AdminPanel
          title="Brouillons de formulaires"
          description="Parcours non terminés à relancer."
          flush
        >
          {leads.length > 0 ? (
            <div className="admin-table-scroll">
              <table className="admin-table-v2">
                  <thead>
                    <tr>
                      <th>Contact</th>
                      <th>Formulaire</th>
                      <th>Progression</th>
                      <th>Score</th>
                      <th>Statut</th>
                      <th>Dernière activité</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => {
                      const completionRate = lead.totalFields
                        ? Math.round(
                            ((lead.fieldsCompleted || 0) / lead.totalFields) * 100,
                          )
                        : 0;
                      return (
                        <tr key={lead.id}>
                          <td>
                            <div className="text-sm">
                              {lead.email && (
                                <div className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {lead.email}
                                </div>
                              )}
                              {lead.phone && (
                                <div className="flex items-center gap-1 text-[var(--admin-text-muted)]">
                                  <Phone className="w-3 h-3" />
                                  {lead.phone}
                                </div>
                              )}
                              {!lead.email && !lead.phone && (
                                <span className="text-[var(--admin-text-muted)]">
                                  Anonyme
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="admin-badge admin-badge-neutral">
                              {lead.formType}
                            </span>
                            {lead.stepReached && (
                              <div className="text-xs text-[var(--admin-text-muted)] mt-1">
                                Étape: {lead.stepReached}
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="text-sm">
                              {lead.fieldsCompleted ?? 0}/{lead.totalFields ?? 0}
                              <div className="text-xs text-[var(--admin-text-muted)]">
                                {completionRate}%
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="font-semibold">{lead.score}</span>
                          </td>
                          <td>
                            <span
                              className={`admin-badge ${
                                lead.status === 'ABANDONED'
                                  ? 'admin-badge-warning'
                                  : lead.status === 'CONTACTED'
                                    ? 'admin-badge-info'
                                    : lead.status === 'CONVERTED'
                                      ? 'admin-badge-success'
                                      : lead.status === 'DISMISSED'
                                        ? 'admin-badge-danger'
                                        : 'admin-badge-neutral'
                              }`}
                            >
                              {lead.status === 'ABANDONED'
                                ? 'Abandonné'
                                : lead.status === 'CONTACTED'
                                  ? 'Contacté'
                                  : lead.status === 'CONVERTED'
                                    ? 'Converti'
                                    : lead.status === 'DISMISSED'
                                      ? 'Écarté'
                                      : lead.status}
                            </span>
                          </td>
                          <td>
                            <div className="text-sm text-[var(--admin-text-muted)]">
                              {new Date(lead.lastActivityAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                          </td>
                          <td className="text-right">
                            <button
                              type="button"
                              onClick={() => openModal(lead)}
                              className="admin-btn admin-btn-sm admin-btn-secondary"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Gérer
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
            </div>
          ) : (
            <AdminEmptyState
              icon={Archive}
              title="Aucun lead abandonné"
              description="Les brouillons apparaîtront ici lorsque la télémétrie formulaire est active."
            />
          )}
        </AdminPanel>
      </div>

      {showModal && selectedLead && (
        <div
          className="admin-modal-overlay"
          onClick={() => setShowModal(false)}
          role="presentation"
        >
          <div
            className="admin-modal"
            style={{ maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="abandoned-lead-modal-title"
          >
            <div className="admin-modal-header">
              <h3 id="abandoned-lead-modal-title" className="admin-modal-title">
                Gérer le lead abandonné
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="admin-modal-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-info-grid mb-6">
                <div>
                  <p className="admin-info-label">Formulaire</p>
                  <p className="admin-info-value">{selectedLead.formType}</p>
                </div>
                <div>
                  <p className="admin-info-label">Score</p>
                  <p className="admin-info-value">{selectedLead.score}</p>
                </div>
                <div>
                  <p className="admin-info-label">Progression</p>
                  <p className="admin-info-value">
                    {selectedLead.fieldsCompleted ?? 0}/{selectedLead.totalFields ?? 0}
                  </p>
                </div>
                <div>
                  <p className="admin-info-label">Dernière activité</p>
                  <p className="admin-info-value">
                    {new Date(selectedLead.lastActivityAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="admin-label">Contact</label>
                <div className="space-y-1 text-sm">
                  {selectedLead.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {selectedLead.email}
                    </div>
                  )}
                  {selectedLead.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /> {selectedLead.phone}
                    </div>
                  )}
                  {!selectedLead.email && !selectedLead.phone && (
                    <div className="text-[var(--admin-text-muted)]">
                      Aucune info de contact
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="admin-label" htmlFor="abandoned-lead-notes">
                  Notes internes
                </label>
                <textarea
                  id="abandoned-lead-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ajouter un commentaire interne"
                  className="admin-textarea"
                  rows={4}
                />
              </div>
            </div>

            <div className="admin-modal-footer flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="admin-btn admin-btn-secondary"
                disabled={updating}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleUpdate('CONTACTED')}
                className="admin-btn admin-btn-secondary"
                disabled={updating}
              >
                {updating ? '...' : 'Marquer contacté'}
              </button>
              <button
                type="button"
                onClick={() => handleUpdate('CONVERTED')}
                className="admin-btn admin-btn-primary"
                disabled={updating}
              >
                Converti
              </button>
              <button
                type="button"
                onClick={() => handleUpdate('DISMISSED')}
                className="admin-btn admin-btn-ghost text-rose-600"
                disabled={updating}
              >
                Écarter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
