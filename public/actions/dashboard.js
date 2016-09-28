export const UPDATE_DASHBOARD = 'UPDATE_DASHBOARD';
export const RESET_DASHBOARD_DOC = 'RESET_DASHBOARD_DOC ';
export const PANEL_TO_EDIT = 'PANEL_TO_EDIT';
export const TOGGLE_PANEL_MODAL = 'TOGGLE_PANEL_MODAL';

export function updateDashboard(doc) {
  return {
    type: UPDATE_DASHBOARD,
    doc
  };
};

export function resetDashboardDoc() {
  return { type: RESET_DASHBOARD_DOC };
};

export function panelToEdit(panel) {
  return { type: PANEL_TO_EDIT, panel };
}

export function showPanelModal() {
  return { type: TOGGLE_PANEL_MODAL, value: true };
}
export function hidePanelModal() {
  return { type: TOGGLE_PANEL_MODAL, value: false };
}
