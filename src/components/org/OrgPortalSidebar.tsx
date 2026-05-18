import { NavLink } from 'react-router-dom';
import './OrgPortalSidebar.css';

type OrgPortalSidebarProps = {
  orgId: string;
  orgName?: string;
  isAdminPreview?: boolean;
};

const OrgPortalSidebar = ({
  orgId,
  orgName,
  isAdminPreview = false,
}: OrgPortalSidebarProps) => {
  const basePath = `/org/${orgId}`;

  const navItems = [
    { to: basePath, label: 'Overview', end: true },
    { to: `${basePath}/submit-event`, label: 'Submit Event' },
    { to: `${basePath}/promote-event`, label: 'Promote Event' },
    { to: `${basePath}/approved-events`, label: 'Approved Events' },
    { to: `${basePath}/build-presence`, label: 'Build Presence' },
    { to: `${basePath}/upload-media`, label: 'Upload Media' },
  ];

  return (
    <aside className="org-portal-sidebar">
      <div className="org-portal-sidebar__brand">
        <div className="org-portal-sidebar__eyebrow">Judah Global</div>
        <h2 className="org-portal-sidebar__title">
          {orgName || 'Organization Portal'}
        </h2>
        {isAdminPreview && (
          <div className="org-portal-sidebar__badge">Admin Preview</div>
        )}
      </div>

      <nav className="org-portal-sidebar__nav" aria-label="Organization Portal Navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive
                ? 'org-portal-sidebar__link org-portal-sidebar__link--active'
                : 'org-portal-sidebar__link'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default OrgPortalSidebar;