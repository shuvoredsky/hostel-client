"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/providers/AuthProvider";
import browserClient from "@/lib/browserClient";
import { toast } from "sonner";
import {
    Upload,
    Trash2,
    Image as ImageIcon,

    Eye,
    EyeOff,
    Loader2,
    Plus,
    Settings,
    Video,
    Film,
} from "lucide-react";


interface IBanner {
    id: string;
    title?: string;
    imageUrl: string;
    videoUrl?: string | null;
    mediaType?: "IMAGE" | "VIDEO";
    order: number;
    isActive: boolean;
    createdAt: string;
}

interface ISiteSettings {
    id: string;
    logoUrl?: string;
    createdAt: string;
}

const getErrorMessage = (err: unknown, fallback: string): string => {
    if (err && typeof err === "object" && "response" in err) {
        const e = err as { response?: { data?: { message?: string } } };
        return e.response?.data?.message || fallback;
    }
    return fallback;
};

export default function AdminSettingsPage() {
    const { isLoading: authLoading } = useAuth();
    const [settings, setSettings] = useState<ISiteSettings | null>(null);
    const [banners, setBanners] = useState<IBanner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setIsLoading(true);
                const [settingsRes, bannersRes] = await Promise.all([
                    browserClient.get("/settings"),
                    browserClient.get("/settings/admin/banners"),
                ]);
                const settingsData = settingsRes?.data?.data;
                const adminBanners = bannersRes?.data?.data || [];
                setSettings(settingsData?.settings || null);
                setBanners(adminBanners);
                setError(null);
            } catch (err: unknown) {
                toast.error(getErrorMessage(err, "Failed to load settings"));
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const refetch = async () => {
        try {
            const [settingsRes, bannersRes] = await Promise.all([
                browserClient.get("/settings"),
                browserClient.get("/settings/admin/banners"),
            ]);
            const settingsData = settingsRes?.data?.data;
            const adminBanners = bannersRes?.data?.data || [];
            setSettings(settingsData?.settings || null);
            setBanners(adminBanners);
        } catch { }
    };

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-slate-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Site Settings
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                        Manage your site logo and banners
                    </p>
                </div>
            </div>

            {/* Logo Section */}
            <LogoSection currentLogoUrl={settings?.logoUrl} onUpdate={refetch} />

            {/* Banner Section */}
            <BannerSection banners={banners} onUpdate={refetch} />
        </div>
    );
}

// ─── Logo Section ─────────────────────────────────────────────────────────────

function LogoSection({
    currentLogoUrl,
    onUpdate,
}: {
    currentLogoUrl?: string;
    onUpdate: () => void;
}) {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append("logo", file);
        try {
            setIsUploading(true);
            const response = await browserClient.patch("/settings/logo", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const updatedLogo = response?.data?.data?.logoUrl;
            if (updatedLogo && typeof window !== "undefined") {
                localStorage.setItem("dhakastay_logo_url", updatedLogo);
            }
            toast.success("Logo updated successfully");
            setFile(null);
            setPreview(null);
            onUpdate();
        } catch (err: unknown) {
            toast.error(getErrorMessage(err, "Failed to update logo"));
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancel = () => {
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                        Site Logo
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Upload a new logo for your site
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Current / Preview */}
                <div className="shrink-0">
                    <p className="text-xs text-slate-400 mb-2">
                        {preview ? "New logo preview" : "Current logo"}
                    </p>
                    <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Logo preview"
                                className="w-full h-full object-contain p-2"
                            />
                        ) : currentLogoUrl ? (
                            <img
                                src={currentLogoUrl}
                                alt="Current logo"
                                className="w-full h-full object-contain p-2"
                            />
                        ) : (
                            <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                        )}
                    </div>
                </div>

                {/* Upload Controls */}
                <div className="flex-1 space-y-3">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl py-6 flex flex-col items-center gap-2 text-slate-400 hover:border-emerald-400 hover:text-emerald-500 transition-colors"
                    >
                        <Upload className="w-5 h-5" />
                        <span className="text-sm font-medium">Click to select logo</span>
                        <span className="text-xs">PNG, JPG, SVG recommended</span>
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {file && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Upload Logo
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Banner Section ───────────────────────────────────────────────────────────

function BannerSection({
    banners,
    onUpdate,
}: {
    banners: IBanner[];
    onUpdate: () => void;
}) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                        Site Banners
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        {banners.length} banner{banners.length !== 1 ? "s" : ""} active
                    </p>
                </div>
            </div>

            {/* Add New Banner */}
            <AddBannerForm onAdd={onUpdate} />

            {/* Existing Banners */}
            {banners.length > 0 && (
                <div className="mt-6 space-y-3">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Existing Banners
                    </h4>
                    {banners.map((banner) => (
                        <BannerRow key={banner.id} banner={banner} onUpdate={onUpdate} />
                    ))}
                </div>
            )}

            {banners.length === 0 && (
                <div className="mt-6 py-10 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">No banners yet. Add your first banner above.</p>
                </div>
            )}
        </div>
    );
}

// ─── Add Banner Form ──────────────────────────────────────────────────────────

function AddBannerForm({ onAdd }: { onAdd: () => void }) {
    const [mediaType, setMediaType] = useState<"IMAGE" | "VIDEO">("IMAGE");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setVideoFile(f);
        setVideoPreview(URL.createObjectURL(f));
    };

    const handleSubmit = async () => {
        if (mediaType === "IMAGE") {
            if (!file) {
                toast.error("Please select a banner image");
                return;
            }
            const formData = new FormData();
            formData.append("banner", file);
            if (title) formData.append("title", title);

            try {
                setIsUploading(true);
                await browserClient.post("/settings/banner", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Image banner added successfully");
                handleReset();
                onAdd();
            } catch (err: unknown) {
                toast.error(getErrorMessage(err, "Failed to add banner"));
            } finally {
                setIsUploading(false);
            }
        } else {
            if (!videoFile) {
                toast.error("Please select a video file (MP4, WebM)");
                return;
            }
            const formData = new FormData();
            formData.append("video", videoFile);
            if (file) formData.append("banner", file);
            if (title) formData.append("title", title);

            try {
                setIsUploading(true);
                await browserClient.post("/settings/banner/video", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Video banner added successfully");
                handleReset();
                onAdd();
            } catch (err: unknown) {
                toast.error(getErrorMessage(err, "Failed to add video banner"));
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleReset = () => {
        setFile(null);
        setPreview(null);
        setVideoFile(null);
        setVideoPreview(null);
        setTitle("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (videoInputRef.current) videoInputRef.current.value = "";
    };

    const canSubmit = mediaType === "IMAGE" ? !!file : !!videoFile;

    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-5 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-500" />
                    Add New Banner
                </p>

                {/* Media Type Toggle */}
                <div className="inline-flex rounded-lg bg-slate-200/80 dark:bg-slate-800 p-1">
                    <button
                        type="button"
                        onClick={() => { setMediaType("IMAGE"); handleReset(); }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                            mediaType === "IMAGE"
                                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                        <ImageIcon className="w-3.5 h-3.5" />
                        Image Banner
                    </button>
                    <button
                        type="button"
                        onClick={() => { setMediaType("VIDEO"); handleReset(); }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                            mediaType === "VIDEO"
                                ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm"
                                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                        <Video className="w-3.5 h-3.5" />
                        Video Banner
                    </button>
                </div>
            </div>

            {/* IMAGE BANNER FORM */}
            {mediaType === "IMAGE" && (
                <div>
                    {!preview ? (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl py-8 flex flex-col items-center gap-2 text-slate-400 hover:border-emerald-400 hover:text-emerald-500 transition-colors bg-white dark:bg-slate-800"
                        >
                            <Upload className="w-5 h-5" />
                            <span className="text-sm font-medium">Click to select banner image</span>
                            <span className="text-xs text-slate-400">Recommended: 1920×600px (JPG, PNG, WebP)</span>
                        </button>
                    ) : (
                        <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                            <img
                                src={preview}
                                alt="Banner preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={handleReset}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            )}

            {/* VIDEO BANNER FORM */}
            {mediaType === "VIDEO" && (
                <div className="space-y-4">
                    {/* Live Video Preview if uploaded */}
                    {videoPreview && (
                        <div className="relative rounded-xl overflow-hidden border border-purple-200 dark:border-purple-900 bg-black">
                            <video
                                src={videoPreview}
                                poster={preview || undefined}
                                controls
                                muted
                                playsInline
                                className="w-full h-48 object-cover"
                            />
                            <button
                                onClick={handleReset}
                                className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5">
                                <Film className="w-3 h-3 text-purple-400" />
                                <span>Live Video Preview</span>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* 1. Video File Input */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                                <Video className="w-3.5 h-3.5 text-purple-500" />
                                1. Video File (MP4, WebM max 30MB)
                            </label>
                            {!videoPreview ? (
                                <button
                                    type="button"
                                    onClick={() => videoInputRef.current?.click()}
                                    className="w-full border-2 border-dashed border-purple-200 dark:border-purple-900/60 rounded-xl py-6 flex flex-col items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:border-purple-500 hover:text-purple-600 transition-colors bg-purple-50/30 dark:bg-purple-950/20"
                                >
                                    <Upload className="w-4 h-4 text-purple-500" />
                                    <span className="text-xs font-medium">Select Video File</span>
                                    <span className="text-[10px] text-slate-400">MP4, WebM up to 30MB</span>
                                </button>
                            ) : (
                                <div className="flex items-center justify-between p-3 rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/30">
                                    <span className="text-xs text-purple-700 dark:text-purple-300 truncate max-w-[180px] font-medium">
                                        ✓ {videoFile?.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => videoInputRef.current?.click()}
                                        className="text-xs text-purple-600 hover:underline font-medium"
                                    >
                                        Change
                                    </button>
                                </div>
                            )}
                            <input
                                ref={videoInputRef}
                                type="file"
                                accept="video/mp4,video/webm,video/*"
                                onChange={handleVideoChange}
                                className="hidden"
                            />
                        </div>

                        {/* 2. Poster Image Input */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                                2. Fallback / Poster Frame (Optional)
                            </label>
                            {!preview ? (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full border-2 border-dashed border-emerald-200 dark:border-emerald-900/60 rounded-xl py-6 flex flex-col items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:border-emerald-500 hover:text-emerald-600 transition-colors bg-emerald-50/30 dark:bg-emerald-950/20"
                                >
                                    <Upload className="w-4 h-4 text-emerald-500" />
                                    <span className="text-xs font-medium">Select Poster Image</span>
                                    <span className="text-[10px] text-slate-400">Auto-generated from video if omitted</span>
                                </button>
                            ) : (
                                <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/30">
                                    <span className="text-xs text-emerald-700 dark:text-emerald-300 truncate max-w-[180px] font-medium">
                                        ✓ {file?.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-xs text-emerald-600 hover:underline font-medium"
                                    >
                                        Change
                                    </button>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Title Input */}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Banner title / headline (optional)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />

            {/* Submit Controls — always visible with active/disabled state */}
            <div className="flex items-center gap-2 pt-2">
                <button
                    onClick={handleSubmit}
                    disabled={!canSubmit || isUploading}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-xl transition-colors shadow-sm"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading {mediaType === "VIDEO" ? "Video Banner" : "Image Banner"}...
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4" />
                            Add {mediaType === "VIDEO" ? "Video Banner" : "Image Banner"}
                        </>
                    )}
                </button>
                {(file || videoFile || title) && (
                    <button
                        onClick={handleReset}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── Banner Row ───────────────────────────────────────────────────────────────

function BannerRow({
    banner,
    onUpdate,
}: {
    banner: IBanner;
    onUpdate: () => void;
}) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(banner.title || "");
    const [isSavingTitle, setIsSavingTitle] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Delete this banner?")) return;
        try {
            setIsDeleting(true);
            await browserClient.delete(`/settings/banner/${banner.id}`);
            toast.success("Banner deleted");
            onUpdate();
        } catch (err: unknown) {
            toast.error(getErrorMessage(err, "Failed to delete banner"));
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggleActive = async () => {
        try {
            setIsToggling(true);
            await browserClient.patch(`/settings/banner/${banner.id}`, {
                isActive: !banner.isActive,
            });
            toast.success(banner.isActive ? "Banner hidden" : "Banner shown");
            onUpdate();
        } catch (err: unknown) {
            toast.error(getErrorMessage(err, "Failed to toggle banner status"));
        } finally {
            setIsToggling(false);
        }
    };

    const handleSaveTitle = async () => {
        try {
            setIsSavingTitle(true);
            await browserClient.patch(`/settings/banner/${banner.id}`, { title });
            toast.success("Title updated");
            setIsEditingTitle(false);
            onUpdate();
        } catch (err: unknown) {
            toast.error(getErrorMessage(err, "Failed to update title"));
        } finally {
            setIsSavingTitle(false);
        }
    };

    return (
        <div
            className={`rounded-xl border overflow-hidden transition-opacity ${banner.isActive
                ? "border-slate-200 dark:border-slate-700"
                : "border-slate-100 dark:border-slate-800 opacity-60"
                }`}
        >
            <div className="flex flex-col sm:flex-row gap-4 p-4">
                {/* Image / Video Thumbnail */}
                <div className="relative w-full sm:w-40 h-24 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-700">
                    <img
                        src={banner.imageUrl}
                        alt={banner.title || "Banner"}
                        className="w-full h-full object-cover"
                    />
                    {banner.mediaType === "VIDEO" && (
                        <div className="absolute top-1.5 left-1.5 bg-purple-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow backdrop-blur-sm">
                            <Video className="w-3 h-3" />
                            Video
                        </div>
                    )}
                    {!banner.isActive && (
                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                            <span className="text-xs text-white font-medium bg-slate-800/80 px-2 py-0.5 rounded-full">
                                Hidden
                            </span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    {/* Title */}
                    {isEditingTitle ? (
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                autoFocus
                            />
                            <button
                                onClick={handleSaveTitle}
                                disabled={isSavingTitle}
                                className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {isSavingTitle ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditingTitle(false);
                                    setTitle(banner.title || "");
                                }}
                                className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditingTitle(true)}
                            className="text-sm font-medium text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left mb-1"
                        >
                            {banner.title || (
                                <span className="text-slate-400 italic">No title — click to add</span>
                            )}
                        </button>
                    )}

                    <p className="text-xs text-slate-400">Order: {banner.order}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                        {/* Toggle Active */}
                        <button
                            onClick={handleToggleActive}
                            disabled={isToggling}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${banner.isActive
                                ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                                : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100"
                                }`}
                        >
                            {isToggling ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : banner.isActive ? (
                                <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                                <Eye className="w-3.5 h-3.5" />
                            )}
                            {banner.isActive ? "Hide" : "Show"}
                        </button>

                        {/* Delete */}
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        >
                            {isDeleting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                            )}
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}