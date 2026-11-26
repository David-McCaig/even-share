import type { ReactNode } from "react";
import { Plane, Home, Users } from "lucide-react";

function GroupContributionsCard({ contributions, groupName, subtitle, personalBalance, compact = false }: { contributions: { name: string; amount: number }[]; groupName: string; subtitle?: string; personalBalance?: ReactNode; compact?: boolean }) {
  const amounts = contributions.map(contribution => contribution.amount);
  const total = amounts.reduce((sum, amount) => sum + amount, 0);
  const colors = ["#008578", "#b65f40", "#8295b6", "#059669", "#b69c61"];
  const GroupIcon = /travel|trip|holiday|vacation/i.test(groupName) ? Plane : /home|house|living|rent/i.test(groupName) ? Home : Users;
  return (
    <figure className={`contribution-card${compact ? " contribution-card-compact" : ""}`}>
      <div className="contribution-heading"><h3>{groupName}</h3><span aria-hidden="true">{compact ? <GroupIcon size={18} strokeWidth={1.75} /> : "↗"}</span></div>
      {subtitle && <p className="group-member-count">{subtitle}</p>}
      {!compact && <div className="contribution-total"><span>Unsettled spend</span><strong>${total.toFixed(2)}</strong></div>}
      <div className="contribution-bar" aria-hidden="true">
        {amounts.map((amount, index) => <span key={index} style={{ width: `${total > 0 ? amount / total * 100 : 0}%`, backgroundColor: colors[index % colors.length] }} />)}
      </div>
      <figcaption className="contribution-legend">
        {contributions.map(({ name, amount }, index) => <span key={`${name}-${index}`}><i style={{ backgroundColor: colors[index % colors.length] }} />{compact ? <span className="contribution-member"><span>{name}</span><span>${amount.toFixed(2)}</span></span> : `${name} $${amount.toFixed(2)}`}</span>)}
      </figcaption>
      {personalBalance}
      {!compact && <span className="group-card-footer">View group <span aria-hidden="true">→</span></span>}
    </figure>
  );
}
export default GroupContributionsCard;
