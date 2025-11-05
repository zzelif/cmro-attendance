// src\app\(dashboard)\member\page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, LogOut } from "lucide-react";

export default function MemberPage() {
  return (
    <div className="flex gap-4 flex-col">
      {/* Date and Action Buttons */}
      <div className="bg-white rounded-lg flex p-5 gap-4 flex-col">
        <div className="text-center w-full gap-2">
          <h1>Time</h1>
          <h3>Date</h3>
        </div>
        <div className="w-full flex gap-2">
          <Button type="submit" variant="default" size="lg" className="flex-1">
            <div className="flex justify-center items-center flex-col">
              <Clock size={32} />
              Time In
            </div>
          </Button>
          <Button type="submit" variant="outline" size="lg" className="flex-1">
            <div className="flex flex-col justify-center items-center">
              <LogOut size={32} />
              Time Out
            </div>
          </Button>
        </div>
        <div className="w-full gap-2 flex flex-col bg-gray-200 p-3.5 rounded-md">
          <div className="justify-between flex">
            <p>Today&apos;s Time In:</p>
            <p>Time</p>
          </div>
          <div className="justify-between flex">
            <p>Time Out:</p>
            <p>Time</p>
          </div>
        </div>
      </div>

      {/* Member Stats */}
      <div className="bg-white rounded-lg flex p-5 gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              Total Required
            </CardTitle>
            <CardContent className="px-0 pt-6 text-xl">Halow hrs</CardContent>
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              Hours Rendered
            </CardTitle>
            <CardContent className="px-0 pt-6 text-xl">halowww hrs</CardContent>
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              Hours Remaining
            </CardTitle>
            <CardContent className="px-0 pt-6 text-xl">heyyyy hrs</CardContent>
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Completion</CardTitle>
            <CardContent className="px-0 pt-6 text-xl">hay%</CardContent>
          </CardHeader>
        </Card>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg flex p-5 flex-col gap-4">
        <div>
          <p className="font-bold">Internship Progress</p>
          <p className="text-muted-foreground">Hours of hours completed</p>
        </div>
        <div>hi</div>
      </div>

      {/* Recent Attendance and History */}
      <div className="bg-white rounded-lg flex p-5 flex-col gap-4">
        <div>
          <p className="font-bold">Recent Attendance</p>
          <p className="text-muted-foreground">Your attendance history</p>
        </div>
        <div>hi</div>
      </div>
    </div>
  );
}
