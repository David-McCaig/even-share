interface TopBarProps {
  currentPage: string;
}

function TopBar({ currentPage }: TopBarProps) {
  return (
    <div className="page-topbar">
      <div className="page-breadcrumb"><span>Home</span><span aria-hidden="true">›</span><h1>{currentPage}</h1></div>
    </div>
  );
}

export default TopBar;
