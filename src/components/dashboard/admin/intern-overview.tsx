// src/components/dashboard/admin/intern-overview.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { InternOverviewItem } from "@/types";

interface InternOverviewProps {
  data: InternOverviewItem[];
  loading: boolean;
}

export function InternOverview({ data, loading }: InternOverviewProps) {
  if (loading) {
    return (
      <Card className="border-gray-300">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Intern Overview
          </CardTitle>
          <p className="text-sm text-gray-600">
            Quick summary of intern progress
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-300">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Intern Overview
        </CardTitle>
        <p className="text-sm text-gray-600">
          Quick summary of intern progress
        </p>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No interns found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.map((intern) => (
              <Card key={intern.id} className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarFallback className="bg-gray-300 text-white">
                        {intern.fullName
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{intern.fullName}</p>
                      <p className="text-xs text-gray-600">
                        {intern.department}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">{intern.progress}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Hours</span>
                      <span className="font-semibold">{intern.hours}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
