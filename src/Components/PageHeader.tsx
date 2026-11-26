interface PageHeaderProps {
  currentPage: string;
}

function PageHeader({ currentPage }: PageHeaderProps) {
  return (
    <div className="page-topbar">
      <h1>{currentPage}</h1>
    </div>
  );
}

export default PageHeader;
