"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Camera, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import AlertModal from "@/components/AlertModal";
import VerificationCodeModal from "@/components/VerificationCodeModal";
import { useAuth } from "@/context/AuthContext";
import {
  formatApiErrorMessage,
  getProfile,
  requestProfileOtp,
  updateProfile,
  updateProfilePicture,
  type AssociationProfile,
} from "@/lib/api-client";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<AssociationProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [isOtpVerificationModalOpen, setIsOtpVerificationModalOpen] = useState(false);
  const [isRequestingResetOtp, setIsRequestingResetOtp] = useState(false);

  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifiedResetOtp, setVerifiedResetOtp] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success" | "warning" | "info";
  } | null>(null);

  const hydrateProfile = (data: AssociationProfile) => {
    setProfile(data);
    setOrganizationName(data.name || "");
    setEmail(data.email || "");
  };

  const fetchLatestProfile = async () => {
    try {
      const result = await getProfile();
      if (result.status === "success") {
        hydrateProfile(result.data);
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
      setAlert({ message: "Could not load profile details right now.", type: "error" });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (user) {
      hydrateProfile(user);
    }
    fetchLatestProfile();
  }, [user?.uid]);

  const hasNameChange =
    !!profile && organizationName.trim().length > 0 && organizationName.trim() !== profile.name;
  const hasPasswordChange =
    isResettingPassword && (newPassword.trim().length > 0 || confirmPassword.trim().length > 0);

  const profileImage = useMemo(() => {
    if (profile?.profile_picture) return profile.profile_picture;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      profile?.name || "VoterixAdmin"
    )}`;
  }, [profile]);

  const handleStartPasswordReset = async () => {
    setIsRequestingResetOtp(true);
    try {
      const result = await requestProfileOtp();
      if ((result as { status?: string }).status === "success") {
        setIsOtpVerificationModalOpen(true);
      } else {
        const res = result as { message?: unknown; errors?: Record<string, string[]> };
        setAlert({
          message: formatApiErrorMessage(
            { message: res.message, errors: res.errors },
            "Failed to request OTP"
          ),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Request reset OTP error:", error);
      setAlert({ message: "Could not request OTP right now.", type: "error" });
    } finally {
      setIsRequestingResetOtp(false);
    }
  };

  const handleVerifyResetOtp = async (code: string) => {
    const verificationName = (profile?.name || organizationName).trim();
    if (!verificationName) {
      throw new Error("Unable to verify OTP right now.");
    }

    const result = await updateProfile({ otp: code, name: verificationName });
    if ((result as { status?: string }).status !== "success") {
      const res = result as { message?: unknown; errors?: Record<string, string[]> };
      throw new Error(
        formatApiErrorMessage(
          { message: res.message, errors: res.errors },
          "OTP verification failed"
        )
      );
    }

    setVerifiedResetOtp(code);
    setIsResettingPassword(true);
  };

  const handleProfileUpdate = async () => {
    if (!hasNameChange && !hasPasswordChange) {
      setAlert({ message: "No changes to update yet.", type: "info" });
      return;
    }

    if (hasPasswordChange && newPassword !== confirmPassword) {
      setAlert({ message: "New password and confirm password do not match.", type: "warning" });
      return;
    }

    if (hasPasswordChange && !verifiedResetOtp) {
      setAlert({ message: "Reset password must be OTP-verified first.", type: "warning" });
      return;
    }

    setIsUpdating(true);
    try {
      let otpCode = verifiedResetOtp;

      if (!hasPasswordChange) {
        const otpResult = await requestProfileOtp();
        if ((otpResult as { status?: string }).status !== "success") {
          const res = otpResult as { message?: unknown; errors?: Record<string, string[]> };
          setAlert({
            message: formatApiErrorMessage(
              { message: res.message, errors: res.errors },
              "Failed to request OTP"
            ),
            type: "error",
          });
          return;
        }

        otpCode = window.prompt("Enter the OTP from your email to confirm this update.");
        if (!otpCode?.trim()) {
          setAlert({ message: "OTP is required to complete this update.", type: "warning" });
          return;
        }
      }

      if (!otpCode?.trim()) {
        setAlert({ message: "OTP verification is required.", type: "warning" });
        return;
      }

      const payload: {
        otp: string;
        name?: string;
        new_password?: string;
        confirm_password?: string;
      } = { otp: otpCode.trim() };

      if (hasNameChange) payload.name = organizationName.trim();
      if (hasPasswordChange) {
        payload.new_password = newPassword;
        payload.confirm_password = confirmPassword;
      }

      const result = await updateProfile(payload);

      if ((result as { status?: string }).status === "success") {
        setAlert({ message: "Profile updated successfully.", type: "success" });
        setNewPassword("");
        setConfirmPassword("");
        setVerifiedResetOtp(null);
        setIsResettingPassword(false);
        await Promise.all([fetchLatestProfile(), refreshUser()]);
      } else {
        const res = result as { message?: unknown; errors?: Record<string, string[]> };
        setAlert({
          message: formatApiErrorMessage(
            { message: res.message, errors: res.errors },
            "Profile update failed"
          ),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Update profile error:", error);
      setAlert({ message: "Could not update profile right now.", type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingPicture(true);
    try {
      const result = await updateProfilePicture(file);
      if ((result as { status?: string }).status === "success") {
        setAlert({ message: "Profile picture updated successfully.", type: "success" });
        await Promise.all([fetchLatestProfile(), refreshUser()]);
      } else {
        const res = result as { message?: unknown; errors?: Record<string, string[]> };
        setAlert({
          message: formatApiErrorMessage(
            { message: res.message, errors: res.errors },
            "Failed to update profile picture"
          ),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Profile picture update error:", error);
      setAlert({ message: "Could not upload profile picture.", type: "error" });
    } finally {
      setIsUploadingPicture(false);
      event.target.value = "";
    }
  };

  return (
    <div className="w-full flex flex-col min-h-[800px] pb-12 animate-in fade-in duration-300">
      {/* Banner Background */}
      <div className="relative w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] -ml-4 md:-ml-6 -mt-4 md:-mt-6 h-[240px] md:h-[280px] bg-[#243160] overflow-hidden mb-6">
        <Image
          src="/cover.svg"
          alt="Profile Cover Background"
          fill
          className="object-fill md:object-cover mix-blend-screen"
          priority
        />

        <div className="absolute top-8 md:top-12 left-4 md:left-8 z-10">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Profile</h1>
        </div>
      </div>

      {/* Main Content (Cards) */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 w-full relative z-20 -mt-32 md:-mt-48">
        {/* Left Side: Profile Info Card */}
        <div className="w-full lg:w-[320px] bg-white border border-gray-100 shadow-sm flex flex-col items-center flex-shrink-0 relative h-fit">
          <div className="w-full p-8 flex flex-col items-center relative text-center">
            <div 
              className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 mb-5 cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image src={profileImage} alt="Profile" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Camera size={24} className="text-white drop-shadow-md" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPicture}
              className="absolute top-[148px] ml-28 w-9 h-9 bg-[#243160] text-white rounded-full flex items-center justify-center border-[3px] border-white shadow-sm hover:bg-[#3a4d87] transition-colors disabled:opacity-70"
              title="Change profile picture"
            >
              {isUploadingPicture ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePictureUpload}
            />

            <h2 className="text-lg md:text-xl font-bold text-gray-900 uppercase tracking-wide">
              {profile?.name || "Organization"}
            </h2>
          </div>

          <div className="w-full flex border-t border-gray-100 justify-between items-center px-6 py-5">
            <span className="text-sm font-semibold text-gray-900">Uploaded Election</span>
            <span className="text-sm font-bold text-gray-500">{profile?.uploaded_elections || "0"}</span>
          </div>
          <div className="w-full flex border-t border-gray-100 justify-between items-center px-6 py-5">
            <span className="text-sm font-semibold text-gray-900">Completed Election</span>
            <span className="text-sm font-bold text-[#b42e2e]">{profile?.completed_elections || "0"}</span>
          </div>
        </div>

        {/* Right Side: Account Settings Form Card */}
        <div className="flex-1 bg-white border border-gray-100 shadow-sm p-6 md:p-8 h-fit">
          <div className="border-b border-gray-200 mb-8 md:mb-10">
            <div className="inline-block border-b-2 border-gray-900 pb-3">
              <h3 className="text-base font-bold text-gray-900 tracking-wide">Account Settings</h3>
            </div>
          </div>

          {isLoadingProfile ? (
            <div className="py-10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#405189]" />
            </div>
          ) : (
            <form className="space-y-6 md:space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Name of Organization</label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#405189]/20 focus:border-[#405189] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Email</label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium focus:outline-none"
                  />
                </div>
              </div>

              {!isResettingPassword ? (
                <div className="space-y-2 max-w-[50%] pr-4 sm:max-w-none sm:pr-0">
                  <label className="text-sm font-semibold text-gray-900">Password</label>
                  <div className="w-full md:w-1/2 xs:w-full space-y-3">
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value="*********"
                        readOnly
                        className="w-full h-12 px-4 pr-11 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-medium focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                      Forgot password?{" "}
                      <button
                        type="button"
                        onClick={handleStartPasswordReset}
                        disabled={isRequestingResetOtp}
                        className="text-gray-900 font-bold hover:underline transition-all disabled:opacity-60"
                      >
                        {isRequestingResetOtp ? "Sending..." : "Reset"}
                      </button>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900">New password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="*********"
                        className="w-full h-12 px-4 pr-11 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#405189]/20 focus:border-[#405189] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="*********"
                        className={`w-full h-12 px-4 rounded-lg border bg-white text-gray-900 text-sm font-medium focus:outline-none transition-all ${
                          confirmPassword && newPassword !== confirmPassword
                            ? "border-[#F04438] focus:ring-2 focus:ring-[#F04438]/20 pr-20"
                            : "border-gray-300 focus:ring-2 focus:ring-[#405189]/20 focus:border-[#405189] pr-11"
                        }`}
                      />
                      {confirmPassword && newPassword !== confirmPassword && (
                        <div className="absolute inset-y-0 right-10 pr-1 flex items-center pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-[#F04438]" aria-hidden="true" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  disabled={isUpdating}
                  className="py-2.5 px-8 rounded-lg font-semibold text-sm transition-all shadow-sm bg-[#243160] text-white hover:opacity-90 disabled:opacity-60"
                  onClick={handleProfileUpdate}
                >
                  {isUpdating ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <VerificationCodeModal
        isOpen={isOtpVerificationModalOpen}
        onClose={() => setIsOtpVerificationModalOpen(false)}
        email={email}
        purpose="login"
        onCodeVerify={handleVerifyResetOtp}
        onVerify={() => {
          setIsOtpVerificationModalOpen(false);
          setAlert({ message: "OTP verified. You can now set a new password.", type: "success" });
        }}
      />

      <AlertModal
        isOpen={!!alert}
        onClose={() => setAlert(null)}
        message={alert?.message || ""}
        type={alert?.type}
      />
    </div>
  );
}
