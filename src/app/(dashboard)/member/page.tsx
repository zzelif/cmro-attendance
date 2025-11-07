// src/app/(dashboard)/member/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, LogOut, History } from "lucide-react";

export default function MemberPage() {
  return (
    <div className="flex gap-5 sm:gap-6 flex-col p-2 sm:p-4 mx-auto">
      {/* Welcome Header */}
      <div className="mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Welcome, Test
        </h1>
        <p className="text-sm sm:text-base text-gray-600">Role Information</p>
      </div>

      {/* Date and Action Buttons - Golden Yellow Card */}
      <Card className="border-[#FFC107] shadow-lg">
        <CardContent className="px-4 sm:px-6 mx-15">
          <div className="text-center w-full mb-4">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Today&apos;s Time
            </h1>
            <h3 className="text-sm sm:text-base text-gray-600">
              Today&apos;s Date
            </h3>
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-10 justify-between">
            <Button
              type="submit"
              className="w-1/2 flex-1 h-20 sm:h-24 bg-black hover:bg-[#FFD700] text-muted font-semibold shadow-md"
              size="default"
            >
              <div className="flex justify-center items-center flex-col h-full gap-2">
                <Clock className="size-5 sm:size-6" />
                <span className="text-sm sm:text-base">Time In</span>
              </div>
            </Button>

            <Button
              type="submit"
              variant="outline"
              className="w-1/2 flex-1 h-20 sm:h-24 text-black hover:bg-[#FFC107]/10 font-semibold"
              size="default"
            >
              <div className="flex justify-center items-center flex-col h-full gap-2">
                <LogOut className="size-5 sm:size-6" />
                <span className="text-sm sm:text-base">Time Out</span>
              </div>
            </Button>
          </div>

          <div className="w-full mt-4 bg-[#f0f0f0] p-4 rounded-lg border border-gray-300">
            <div className="flex justify-between text-sm sm:text-base mb-2">
              <span className="text-gray-700">Today&apos;s Time In:</span>
              <span className="font-semibold text-gray-900">Time</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-700">Time Out:</span>
              <span className="font-semibold text-gray-900">Time</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Member Stats - Clean White Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-300 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
              Total Required
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              Halow hrs
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-300 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
              Hours Rendered
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-brand-green-dark">
              halowww hrs
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-300 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
              Hours Remaining
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-orange-600">
              heyyyy hrs
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-300 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
              Completion
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-[#FFC107]">
              hay%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="border-gray-300 shadow-sm">
        <CardContent className="">
          <div className="mb-4">
            <h3 className="font-bold text-base sm:text-lg text-gray-900">
              Internship Progress
            </h3>
            <p className="text-sm text-gray-600">Hours of hours completed</p>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
            <div className="bg-[#FFC107] h-full w-1/2 transition-all duration-500 shadow-sm" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Attendance */}
      <Card className="border-gray-300 shadow-sm">
        <CardContent className="">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-base sm:text-lg text-gray-900">
                Recent Attendance
              </h3>
              <p className="text-sm text-gray-600">Your Attendance History</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-brand-header hover:bg-[#FFC107]/10"
            >
              <History />
              View Attendance History
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-300 rounded-lg bg-white hover:shadow-md transition-shadow">
              <p className="text-sm font-semibold text-gray-900">halowwww</p>
              <p className="text-xs text-gray-600 mt-1">heyyy</p>
              <span className="inline-block mt-2 text-xs font-medium text-brand-green-dark bg-brand-green-dark/10 px-2 py-1 rounded">
                Approved
              </span>
            </div>

            <div className="p-4 border border-gray-300 rounded-lg bg-white hover:shadow-md transition-shadow">
              <p className="text-sm font-semibold text-gray-900">halowwww</p>
              <p className="text-xs text-gray-600 mt-1">heyyy</p>
              <span className="inline-block mt-2 text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                Pending
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
