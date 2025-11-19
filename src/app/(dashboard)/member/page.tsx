// src/app/(dashboard)/member/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, LogOut, History } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { X, Camera, RefreshCcw } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

function isWithinTimeRange(start: string, end: string) {
  const now = new Date();
  const current = now.getHours() + now.getMinutes() / 60;

  const [sH, sM] = start.split(":").map(Number);
  const [eH, eM] = end.split(":").map(Number);

  const startTime = sH + sM / 60;
  const endTime = eH + eM / 60;

  // handles ranges like 19:00 -> 00:00
  if (endTime < startTime) {
    return current >= startTime || current <= endTime;
  }

  return current >= startTime && current <= endTime;
}

type MemberAttendanceRecord = {
  id: string;
  date: string | null;
  status: "pending" | "approved" | "rejected";
  time_in: string | null;
  time_out: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return "--";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "--";
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value?: string | null) {
  if (!value) return "--";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "--";
  return parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}



export default function MemberPage() {
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [hasTimedIn, setHasTimedIn] = useState(false);
  const canTimeIn = isWithinTimeRange("09:00", "18:00"); //Duration Hours for Time In

  const [showTimeOutCamera, setShowTimeOutCamera] = useState(false);
  const [timeOutStream, setTimeOutStream] = useState<MediaStream | null>(null);
  const [capturedTimeOutPhoto, setCapturedTimeOutPhoto] = useState<string | null>(null);
  const [timeOutError, setTimeOutError] = useState("");
  const timeOutVideoRef = useRef<HTMLVideoElement | null>(null);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const canTimeOut = isWithinTimeRange("19:00", "00:00"); //Duration Hours for Time Out

  const [totalRequiredHours, setTotalRequiredHours] = useState<number>(0);
  const [hoursRendered, setHoursRendered] = useState<number>(0);
  const [hoursRemaining, setHoursRemaining] = useState<number>(0);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);

  const [recentAttendance, setRecentAttendance] = useState<MemberAttendanceRecord[]>([]);
  const [recentAttendanceLoading, setRecentAttendanceLoading] = useState(false);
  const statusStyles: Record<MemberAttendanceRecord["status"], string> = {
    approved: "text-brand-green-dark bg-brand-green-dark/10",
    pending: "text-yellow-600 bg-yellow-100",
    rejected: "text-red-600 bg-red-100",
  };
  const statusLabels: Record<MemberAttendanceRecord["status"], string> = {
    approved: "Approved",
    pending: "Pending",
    rejected: "Rejected",
  };


  


  const [notification, setNotification] = useState<{
  type: "success" | "error";
  message: string;
} | null>(null);

  const showNotification = (type: "success" | "error", message: string, duration = 3000) => {
  setNotification({ type, message });
  setTimeout(() => setNotification(null), duration); // hide after 3s
};

  const fetchRecentAttendance = async (memberRecordId: string) => {
    setRecentAttendanceLoading(true);
    try {
      const { data, error } = await supabase
        .from("attendance_logs")
        .select("id, date, status, time_in, time_out")
        .eq("member_id", memberRecordId)
        .order("date", { ascending: false })
        .limit(4);

      if (error) throw error;

      setRecentAttendance((data as MemberAttendanceRecord[]) ?? []);
    } catch (err) {
      console.error("Error fetching recent attendance:", err);
      setRecentAttendance([]);
    } finally {
      setRecentAttendanceLoading(false);
    }
  };

  const fetchMemberStats = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: memberStats, error } = await supabase
      .from("member_summary")
      .select(
        "total_required_hours, hours_rendered, hours_remaining, completion_percentage"
      )
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching member stats", error);
      return;
    }

    setTotalRequiredHours(memberStats?.total_required_hours || 0);
    setHoursRendered(memberStats?.hours_rendered || 0);
    setHoursRemaining(memberStats?.hours_remaining || 0);
    setCompletionPercentage(memberStats?.completion_percentage || 0);
  };

  // --- Start Camera ---q
  const startCamera = async () => {
    try {
      setError("");
      setCapturedPhoto(null);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      setStream(mediaStream);
      setShowCamera(true);

      // wait a tiny bit for videoRef to exist
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      }, 100); // 100ms delay
    } catch (err) {
      console.error(err);
      setError("Unable to access camera. Please allow permissions.");
    }
  };

  // --- Start Time Out Camera ---
const startTimeOutCamera = async () => {
  try {
    setTimeOutError("");
    setCapturedTimeOutPhoto(null);

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });

    setTimeOutStream(mediaStream);
    setShowTimeOutCamera(true);

    setShowCamera(true);

    setTimeout(() => {
      if (timeOutVideoRef.current) timeOutVideoRef.current.srcObject = mediaStream;
    }, 100);
  } catch (err) {
    console.error(err);
    setTimeOutError("Unable to access camera. Please allow permissions.");
  }
};

// --- Stop Time Out Camera ---
const stopTimeOutCamera = () => {
  if (timeOutStream) timeOutStream.getTracks().forEach(track => track.stop());
  setTimeOutStream(null);
  setShowTimeOutCamera(false);
  setCapturedTimeOutPhoto(null);
  setTimeOutError("");
};

// --- Capture Time Out Photo ---
const captureTimeOutPhoto = () => {
  if (!timeOutVideoRef.current) return;
  const canvas = document.createElement("canvas");
  canvas.width = timeOutVideoRef.current.videoWidth;
  canvas.height = timeOutVideoRef.current.videoHeight;
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.drawImage(timeOutVideoRef.current, 0, 0);
  setCapturedTimeOutPhoto(canvas.toDataURL("image/jpeg"));

  if (timeOutStream) timeOutStream.getTracks().forEach(track => track.stop());
  setTimeOutStream(null);
};

// --- Save Time Out ---
const saveTimeOutPhoto = async () => {
  if (!capturedTimeOutPhoto || !memberId) return;

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw userError || new Error("User not found");

    const fileName = `time_out_${Date.now()}.jpg`;
    const filePath = `${user.id}/${fileName}`;
    const blob = await (await fetch(capturedTimeOutPhoto)).blob();

    // Upload
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("attendance-photos")
      .upload(filePath, blob, { contentType: "image/jpeg", upsert: true });
    if (uploadError) throw uploadError;

    // Signed URL (24h)
    const { data: signedData, error: signedError } = await supabase.storage
      .from("attendance-photos")
      .createSignedUrl(filePath, 86400);
    if (signedError || !signedData) throw signedError;

    const photoURL = signedData.signedUrl;

    // Update today's attendance
    const { data: attendanceData, error: attendanceError } = await supabase
      .from("attendance_logs")
      .update({
        time_out: new Date().toISOString(),
        time_out_photo_url: photoURL,
        status: 'approved', // <- add this
      })
      .eq("member_id", memberId)
      .eq("date", new Date().toISOString().split("T")[0]);
    if (attendanceError) throw attendanceError;

    showNotification("success", "⏱️ Time Out recorded successfully!");
    setHasTimedOut(true);
    stopTimeOutCamera();
    await fetchMemberStats(); // refresh stats after saving
    await fetchRecentAttendance(memberId);
  } catch (err) {
    console.error("Error saving Time Out:", err);
    showNotification("error", "Failed to save Time In. See console for details.");
  }
};

  useEffect(() => {
    fetchMemberStats();
  }, []);




  const restartCamera = async () => {
    setCapturedPhoto(null); // clear captured photo
    try {
      setError("");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      console.error(err);
      setError("Unable to access camera. Please allow permissions.");
    }
  };


  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    setStream(null);
    setShowCamera(false);
    setCapturedPhoto(null);
    setError("");
  };


  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.drawImage(videoRef.current, 0, 0);
    setCapturedPhoto(canvas.toDataURL("image/jpeg"));

    // stop the stream after capturing
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };


  const savePhoto = async () => {
    if (!capturedPhoto) return;

    try {
      // 1. Get user info
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw userError || new Error("User not found");

      // 2. Get memberId from members table
      const { data: membersData, error: memberError } = await supabase
        .from("members")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (memberError || !membersData) throw memberError || new Error("Member not found");
      const memberRecordId = membersData.id;
      // ✅ Use state setter instead of local variable
      setMemberId(memberRecordId);

      // 3. Upload photo
      const fileName = `time_in_${Date.now()}.jpg`;
      const filePath = `${user.id}/${fileName}`;
      const blob = await (await fetch(capturedPhoto)).blob();

      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from("attendance-photos")
        .upload(filePath, blob, { contentType: "image/jpeg", upsert: true });
      if (uploadError) throw uploadError;

      // 4. Create signed URL (valid 24 hours)
      const { data: signedData, error: signedError } = await supabase
        .storage
        .from("attendance-photos")
        .createSignedUrl(filePath, 86400);
      if (signedError || !signedData) throw signedError;

      const photoURL = signedData.signedUrl;

      // 5. Insert attendance log
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance_logs")
        .insert({
          member_id: memberRecordId,
          time_in: new Date().toISOString(),
          time_in_photo_url: photoURL,
          status: 'approved', // <- add this
        });
      if (attendanceError) throw attendanceError;

      showNotification("success", "⏱️ Time In recorded successfully!");
      setHasTimedIn(true);
      stopCamera();
      await fetchMemberStats(); // refresh stats after saving
      await fetchRecentAttendance(memberRecordId);
    } catch (err) {
      console.error("Error saving Time In:", err);
      showNotification("error", "Failed to save Time In. See console for details.");
    }
  };

  
    useEffect(() => {
    const loadStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await fetchMemberStats();
    };

    loadStats();
  }, []);



  useEffect(() => {
    const fetchMemberId = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return console.error("No user logged in", userError);

      // Fetch the member record
      const { data: memberData, error: memberError } = await supabase
        .from("members")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (memberError || !memberData)
        return console.error("Member not found", memberError);

      setMemberId(memberData.id);

      // Check if already timed in today
      const { data: attendanceData } = await supabase
        .from("attendance_logs")
        .select("time_out")
        .eq("member_id", memberData.id)
        .eq("date", new Date().toISOString().split("T")[0])
        .maybeSingle();

      if (attendanceData) setHasTimedIn(true);
      if (attendanceData?.time_out) setHasTimedOut(true);
    };

    fetchMemberId();
  }, []);

  useEffect(() => {
    if (memberId) fetchMemberStats();
  }, [memberId]);

  useEffect(() => {
    if (memberId) {
      fetchRecentAttendance(memberId);
    }
  }, [memberId]);




  // useEffect(() => {
  //   const checkTimedIn = async () => {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();

  //     const { data: attendanceData, error } = await supabase
  //       .from("attendance_logs")
  //       .select("*")
  //       .eq("member_id", memberId)  // Make sure memberId is fetched from your members table
  //       .eq("date", new Date().toISOString().split("T")[0])
  //       .single(); // expecting only one row per day

  //     if (attendanceData) {
  //       setHasTimedIn(true);  // disables Time In button
  //     }
  //   };

  //   checkTimedIn();
  // }, []);


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
              type="button"
              onClick={startCamera}
              disabled={hasTimedIn || !canTimeIn} // <-- ADD THIS
              className={`w-1/2 flex-1 h-20 sm:h-24 font-semibold shadow-md ${
                hasTimedIn || !canTimeIn
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-black hover:bg-[#FFD700] text-muted"
              }`}
              size="default"
            >
              <div className="flex justify-center items-center flex-col h-full gap-2">
                <Clock className="size-5 sm:size-6" />
                <span className="text-sm sm:text-base">
                  {hasTimedIn
                    ? "Already Timed In"
                    : !canTimeIn
                      ? "Not Allowed"
                      : "Time In"}
                </span>
              </div>
            </Button>


            <Button
              type="button"
              onClick={startTimeOutCamera}
              disabled={!hasTimedIn || hasTimedOut || !canTimeOut} // <-- ADDED !canTimeOut
              className={`w-1/2 flex-1 h-20 sm:h-24 font-semibold shadow-md ${
                !hasTimedIn || hasTimedOut || !canTimeOut
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-black hover:bg-[#FFD700] text-muted"
              }`}
              size="default"
            >
              <div className="flex justify-center items-center flex-col h-full gap-2">
                <LogOut className="size-5 sm:size-6" />
                <span className="text-sm sm:text-base">
                  {hasTimedOut
                    ? "Already Timed Out"
                    : !canTimeOut
                      ? "Not Allowed"
                      : "Time Out"}
                </span>
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
              {totalRequiredHours ?? 0} hrs
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
              {hoursRendered ?? 0} hrs
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
              {hoursRemaining ?? 0} hrs
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
              {completionPercentage ?? 0}%
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
        <CardContent>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-base sm:text-lg text-gray-900">
                Recent Attendance
              </h3>
              <p className="text-sm text-gray-600">Latest entries from Supabase</p>
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

          {recentAttendanceLoading ? (
            <div className="py-8 text-center text-gray-500 text-sm">
              Loading recent attendance...
            </div>
          ) : recentAttendance.length === 0 ? (
            <div className="py-8 text-center text-gray-500 text-sm">
              No attendance records yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentAttendance.map((record) => (
                <div
                  key={record.id}
                  className="p-4 border border-gray-300 rounded-lg bg-white hover:shadow-md transition-shadow"
                >
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(record.date ?? record.time_in ?? record.time_out)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Time In: {formatTime(record.time_in)}
                  </p>
                  <p className="text-xs text-gray-600">
                    Time Out: {formatTime(record.time_out)}
                  </p>
                  <span
                    className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded ${statusStyles[record.status]}`}
                  >
                    {statusLabels[record.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>


      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 p-4 rounded shadow-lg text-white ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}


      {/* Camera Modal */}
      {showCamera && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
    <div className="relative w-full max-w-2xl px-4">

      {/* Close button top-right */}
      <button
        onClick={stopCamera}
        className="absolute -top-10 right-0 text-white p-2 rounded-full hover:bg-white/20"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Title */}
      <h2 className="text-center text-white text-2xl font-bold mb-4">
        {showTimeOutCamera ? "Time Out - Camera" : "Time In - Camera"}
      </h2>

      {/* Camera or Captured Image */}
      <div className="w-full bg-black rounded-xl overflow-hidden">
        {showTimeOutCamera ? (
          !capturedTimeOutPhoto ? (
            <video
              ref={timeOutVideoRef}
              autoPlay
              playsInline
              className="w-full h-[450px] object-cover"
            />
          ) : (
            <img
              src={capturedTimeOutPhoto!}
              alt="Captured"
              className="w-full h-[450px] object-cover"
            />
          )
        ) : (
          !capturedPhoto ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-[450px] object-cover"
            />
          ) : (
            <img
              src={capturedPhoto!}
              alt="Captured"
              className="w-full h-[450px] object-cover"
            />
          )
        )}
      </div>


      <div className="flex justify-center gap-4 mt-6">
      
      {/* Capture Button */}
      {!showTimeOutCamera ? (
        !capturedPhoto && (
          <Button onClick={capturePhoto} className="bg-[#FFC107] ...">
            <Camera /> Capture
          </Button>
        )
      ) : (
        !capturedTimeOutPhoto && (
          <Button onClick={captureTimeOutPhoto} className="bg-[#FFC107] ...">
            <Camera /> Capture
          </Button>
        )
      )}

      {/* Retake Button */}
      {!showTimeOutCamera ? (
        capturedPhoto && (
          <Button onClick={restartCamera} className="bg-gray-200 ...">
            <RefreshCcw /> Retake
          </Button>
        )
      ) : (
        capturedTimeOutPhoto && (
          <Button
            onClick={startTimeOutCamera} // restart time out camera
            className="bg-gray-200 ..."
          >
            <RefreshCcw /> Retake
          </Button>
        )
      )}

      {/* Save Button */}
      <Button
        onClick={showTimeOutCamera ? saveTimeOutPhoto : savePhoto}
        className="bg-green-500 ..."
      >
        <Camera /> Save
      </Button>

      {/* Cancel Button */}
      <Button
        onClick={showTimeOutCamera ? stopTimeOutCamera : stopCamera}
        variant="outline"
        className="px-6 py-3 bg-white text-black hover:bg-gray-200"
      >
        Cancel
      </Button>
    </div>

    </div>
  </div>
)}



    </div>
  );
}
