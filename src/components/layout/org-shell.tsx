import { NavLink, Outlet, useParams } from "react-router-dom";
import "./org-shell.css";


export default function OrgShell() {

  const { orgUuid } = useParams();
  const basePath = orgUuid ? `/org/${orgUuid}` : "/org";

  return (
    <div className="org-shell">
      <aside className="org-sidebar">
        <div className="org-sidebar__brand">
          <div className="org-sidebar__eyebrow">Judah Global</div>
          <h2>Organization Portal</h2>
          <p>Private organization tools</p>
        </div>

        <nav className="org-sidebar__nav">
          <NavLink
            to={basePath}
            end
            className={({ isActive }) =>
              isActive ? "org-navlink active" : "org-navlink"
            }
          >
            Overview
          </NavLink>

          <NavLink
            to={`${basePath}/submit-event`}
            className={({ isActive }) =>
              isActive ? "org-navlink active" : "org-navlink"
            }
          >
            Submit Event
          </NavLink>

          <NavLink
            to={`${basePath}/promote-event`}
            className={({ isActive }) =>
              isActive ? "org-navlink active" : "org-navlink"
            }
          >
            Promote Event
          </NavLink>

          <NavLink
            to={`${basePath}/approved-events`}
            className={({ isActive }) =>
              isActive ? "org-navlink active" : "org-navlink"
            }
          >
            Approved Events
          </NavLink>

          <NavLink
            to={`${basePath}/build-presence`}
            className={({ isActive }) =>
              isActive ? "org-navlink active" : "org-navlink"
            }
          >
            Build Presence
          </NavLink>

          <NavLink
            to={`${basePath}/upload-media`}
            className={({ isActive }) =>
              isActive ? "org-navlink active" : "org-navlink"
            }
          >
            Upload Media
          </NavLink>
        </nav>
      </aside>

      <main className="org-main">
        <header className="org-topbar">
          <div>
            <div className="org-topbar__eyebrow">Organization Access</div>
            <h1 className="org-topbar__title">Judah Global</h1>
          </div>
        </header>

        <section className="org-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}