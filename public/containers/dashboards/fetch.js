import { fetchVisData } from '../../actions/vis_data';
export default function fetch(dispatch, getState) {
  const { dashboard } = getState();
  const options = { includeDashboard: true };
  if (dashboard.panelToEdit) {
    options.panels = [dashboard.panelToEdit];
  }
  dispatch(fetchVisData(options));
}

