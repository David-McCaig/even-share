import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { expect, test, vi } from 'vitest';
import App from './App';

const session = vi.hoisted(() => ({ initializing: true, user: null as null | { email: string } }));
vi.mock('./features/authentication/hooks/useSignedinDispatchUserInfo', () => ({ useSignedinDispatchUserInfo: () => session.initializing }));
vi.mock('./hooks/reduxTypeScriptHooks', () => ({ useAppSelector: () => session.user }));
vi.mock('./features/Navigation/Components/AppHeader', () => ({ default: () => null }));
vi.mock('./features/Navigation/Components/AppNavigation', () => ({ default: () => null }));
vi.mock('./features/balancesummary/index', () => ({ default: () => null }));
vi.mock('./features/balancesummary/Component/BalanceSummaryColumn', () => ({ default: () => null }));
vi.mock('./Pages/LandingPage', () => ({ default: () => null }));
vi.mock('./Pages/LoginPage', () => ({ default: () => 'Login page' }));
vi.mock('./Pages/SignUpPage', () => ({ default: () => null }));
vi.mock('./Pages/GroupsPage', () => ({ default: () => null }));
vi.mock('./Pages/DashboardPage', () => ({ default: () => 'Dashboard page' }));
vi.mock('./Pages/GroupExpensePage', () => ({ default: () => 'Requested group page' }));
vi.mock('./Pages/RecentActivityPage', () => ({ default: () => 'Requested activity page' }));
vi.mock('./Pages/ProfilePage', () => ({ default: () => null }));

for (const [path, content] of [['/group/travel', 'Requested group page'], ['/recentactivity', 'Requested activity page']]) {
  test(`waits for authentication at ${path}, then renders the requested page`, () => {
    session.initializing = true;
    session.user = null;
    const render = () => renderToStaticMarkup(createElement(StaticRouter, { location: path }, createElement(App)));
    expect(render()).toContain('Loading your session');
    session.user = { email: 'steve@example.com' };
    session.initializing = false;
    const result = render();
    expect(result).toContain(content);
    expect(result).not.toContain('Dashboard page');
    expect(result).not.toContain('Login page');
  });
}
