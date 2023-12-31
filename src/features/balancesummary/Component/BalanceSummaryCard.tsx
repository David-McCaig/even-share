import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../Components/ui/card";

interface BalanceSummaryProps {
  userName: string;
  userAmount: number;
}

function BalanceSummaryCard({ userName, userAmount }: BalanceSummaryProps) {
  return (
    <article>
      <Card
        className={
          userName?.split(" ")[0] === "You" || undefined
            ? "text-rose-600"
            : "text-primary-button-color"
        }
      >
        <CardHeader className="flex flex-row items-center  justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium ">{userName}</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${userAmount}</div>
        </CardContent>
      </Card>
    </article>
  );
}

export default BalanceSummaryCard;
