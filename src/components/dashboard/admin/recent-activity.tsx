// src\components\dashboard\admin\recent-activity.tsx

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function RecentActivity() {
  return (
    <Card className="border-gray-300">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
          No recent activity
        </div>
      </CardContent>
    </Card>
  );
}
