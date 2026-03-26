"use client";

import { CheckCircle2, File as FileIcon, FileSpreadsheet, Loader2, UploadCloud, X } from "lucide-react";
import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase/client";

type UploadedFileState = {
  path: string;
  name: string;
  publicUrl: string;
};

type FileUpload04Props = {
  mode?: "default" | "import";
  title?: string;
  label?: string;
  helperText?: string;
  bucket?: string;
  folder?: string;
  value?: UploadedFileState | null;
  acceptMimeTypes?: string[];
  maxSizeMb?: number;
  disabled?: boolean;
  selectionOnly?: boolean;
  selectedFile?: File | null;
  externalUploading?: boolean;
  externalProgress?: number;
  primaryActionLabel?: string;
  cancelActionLabel?: string;
  onFileSelected?: (file: File | null) => void;
  onPrimaryAction?: () => void;
  onCancelAction?: () => void;
  onChange?: (next: UploadedFileState | null) => void;
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
};

const defaultFeedbackMimeTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

const defaultImportMimeTypes = ["text/csv", "application/vnd.ms-excel"];

const formatBytes = (bytes: number) => {
  if (bytes <= 0) return "0 Bytes";
  const units = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

const sanitizeName = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-");

const mimeToExtensions = (mime: string) => {
  if (mime === "application/pdf") return ["pdf"];
  if (mime === "image/png") return ["png"];
  if (mime === "image/jpeg" || mime === "image/jpg") return ["jpg", "jpeg"];
  if (mime === "text/csv" || mime === "application/vnd.ms-excel") return ["csv"];
  return [];
};

const buildAcceptAttr = (mimeTypes: string[]) =>
  mimeTypes
    .flatMap((mime) => {
      const exts = mimeToExtensions(mime);
      return exts.length > 0 ? exts.map((ext) => `.${ext}`) : [mime];
    })
    .join(",");

const isAllowedByExtension = (name: string, mimeTypes: string[]) => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (!ext) return false;
  const allowed = new Set(mimeTypes.flatMap(mimeToExtensions));
  return allowed.has(ext);
};

export default function FileUpload04({
  mode = "default",
  title = "File Upload",
  label = "Attachment",
  helperText,
  bucket,
  folder = "feedback",
  value = null,
  acceptMimeTypes,
  maxSizeMb = 5,
  disabled = false,
  selectionOnly = false,
  selectedFile = null,
  externalUploading = false,
  externalProgress,
  primaryActionLabel = "Upload",
  cancelActionLabel = "Cancel",
  onFileSelected,
  onPrimaryAction,
  onCancelAction,
  onChange,
  onError,
  onSuccess,
}: FileUpload04Props) {
  const resolvedMimeTypes = useMemo(
    () =>
      acceptMimeTypes ??
      (mode === "import" ? defaultImportMimeTypes : defaultFeedbackMimeTypes),
    [acceptMimeTypes, mode],
  );

  const resolvedHelperText =
    helperText ??
    (mode === "import"
      ? "Accepted file types: CSV, XLSX or XLS files."
      : "Upload supporting session document (PDF or image).");

  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptAttr = useMemo(
    () => buildAcceptAttr(resolvedMimeTypes),
    [resolvedMimeTypes],
  );

  const busy = externalUploading || isUploading;
  const shownProgress =
    mode === "import" && selectionOnly && !externalUploading
      ? 0
      : externalUploading
        ? (externalProgress ?? progress)
        : progress;

  const emitError = (message: string) => {
    setLocalError(message);
    onError?.(message);
  };

  const validateFile = (file: File) => {
    const mimeAllowed = resolvedMimeTypes.includes(file.type);
    const extAllowed = isAllowedByExtension(file.name, resolvedMimeTypes);
    if (!mimeAllowed && !extAllowed) {
      emitError("Unsupported file type for this upload.");
      return false;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      emitError(`File is too large. Maximum allowed size is ${maxSizeMb} MB.`);
      return false;
    }
    return true;
  };

  const clearFile = async () => {
    setLocalError(null);
    setPendingFile(null);
    setProgress(0);

    if (selectionOnly) {
      onFileSelected?.(null);
      onCancelAction?.();
      return;
    }

    if (value?.path && bucket) {
      await supabase?.storage.from(bucket).remove([value.path]).catch(() => null);
    }
    onChange?.(null);
    onCancelAction?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    if (selectionOnly) {
      setLocalError(null);
      setPendingFile(file);
      setProgress(0);
      onFileSelected?.(file);
      onSuccess?.("File selected.");
      return;
    }

    if (!supabase || !bucket) {
      emitError("Upload service is not available right now.");
      return;
    }

    setLocalError(null);
    setPendingFile(file);
    setIsUploading(true);
    setProgress(8);

    if (value?.path) {
      await supabase.storage.from(bucket).remove([value.path]).catch(() => null);
    }

    const tick = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) {
          return prev;
        }
        return prev + 8;
      });
    }, 180);

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    const baseName = sanitizeName(file.name.replace(/\.[^.]+$/, ""));
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${baseName}`;
    const filePath = `${folder}/${fileName}.${extension}`;

    const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
      upsert: false,
      contentType: file.type,
      cacheControl: "3600",
    });

    window.clearInterval(tick);

    if (error) {
      setIsUploading(false);
      setProgress(0);
      emitError(error.message || "Upload failed. Please try again.");
      return;
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    onChange?.({
      path: filePath,
      name: file.name,
      publicUrl: publicUrlData.publicUrl,
    });

    setProgress(100);
    setIsUploading(false);
    onSuccess?.("File uploaded successfully.");
  };

  const handleFilePick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    void uploadFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    if (disabled || busy) return;
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    void uploadFile(file);
  };

  const activeFile = selectionOnly
    ? selectedFile
    : pendingFile ?? (value ? new File([], value.name) : null);
  const selectedName = selectionOnly
    ? (selectedFile?.name ?? "")
    : (value?.name ?? pendingFile?.name ?? "");
  const selectedSize = activeFile ? formatBytes(activeFile.size) : null;
  const selectedExt = selectedName.split(".").pop()?.toLowerCase() ?? "";
  const fileIcon = ["csv", "xlsx", "xls"].includes(selectedExt) ? (
    <FileSpreadsheet className="h-5 w-5" />
  ) : (
    <FileIcon className="h-5 w-5" />
  );
  const hasFile = selectionOnly ? Boolean(selectedFile) : Boolean(value || pendingFile);

  if (mode === "import") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold k-text-strong">{title}</h3>

        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            if (!disabled && !busy) fileInputRef.current?.click();
          }}
          onKeyDown={(event) => {
            if ((event.key === "Enter" || event.key === " ") && !disabled && !busy) {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!disabled && !busy) setIsDragOver(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragOver(false);
          }}
          onDrop={handleDrop}
          className={`rounded-xl border border-dashed px-6 py-12 text-center transition-colors ${
            isDragOver
              ? "border-[var(--k-color-brand)] bg-[var(--k-color-brand-soft-tint)]"
              : "border-[var(--k-color-border-soft)] bg-[var(--k-color-surface)]"
          } ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            accept={acceptAttr}
            disabled={disabled || busy}
            onChange={handleFilePick}
          />
          <FileIcon className="mx-auto h-12 w-12 k-text-subtle" />
          <p className="mt-4 text-sm k-text-body">
            Drag and drop or <span className="font-semibold text-[var(--k-color-text-strong)]">choose file</span> to upload
          </p>
        </div>

        <div className="flex items-center justify-between text-xs k-text-subtle">
          <span>{resolvedHelperText}</span>
          <span>Max. size: {maxSizeMb}MB</span>
        </div>

        {hasFile ? (
          <div className="rounded-2xl border border-[var(--k-color-border-soft)] bg-[var(--k-color-surface-muted)] p-4">
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[var(--k-color-border-soft)] bg-[var(--k-color-surface)] k-text-body">
                {fileIcon}
              </span>

              <div className="min-w-0 flex-1">
                <p className="break-words text-sm font-semibold leading-snug k-text-strong">
                  {selectedName}
                </p>
                <p className="mt-0.5 text-xs k-text-subtle">{selectedSize ?? "—"}</p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0"
                onClick={() => {
                  void clearFile();
                }}
                aria-label="Remove selected file"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <Progress value={shownProgress} className="h-1.5 w-full" />
              <span className="w-10 shrink-0 text-right text-xs k-text-subtle">{shownProgress}%</span>
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => void clearFile()}>
            {cancelActionLabel}
          </Button>
          <Button
            type="button"
            disabled={!hasFile || busy}
            onClick={() => onPrimaryAction?.()}
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            {primaryActionLabel}
          </Button>
        </div>

        {localError ? <p className="text-sm text-destructive">{localError}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wide k-text-subtle">
        {label}
      </label>

      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (!disabled && !busy) fileInputRef.current?.click();
        }}
        onKeyDown={(event) => {
          if ((event.key === "Enter" || event.key === " ") && !disabled && !busy) {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled && !busy) setIsDragOver(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={handleDrop}
        className={`rounded-xl border border-dashed p-3 transition-colors ${
          isDragOver
            ? "border-[var(--k-color-brand)] bg-[var(--k-color-brand-soft-tint)]"
            : "border-[var(--k-color-border-soft)] bg-[var(--k-color-surface-muted)] hover:bg-[var(--k-color-row-hover)]"
        } ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          accept={acceptAttr}
          disabled={disabled || busy}
          onChange={handleFilePick}
        />

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold k-text-strong">Drag and drop file here</p>
            <p className="mt-1 text-xs k-text-body">or click to browse from your device</p>
            <p className="mt-1 text-xs k-text-subtle">
              {resolvedHelperText} · Max: {maxSizeMb} MB
            </p>
          </div>

          <Button
            type="button"
            size="xs"
            variant="outline"
            disabled={disabled || busy}
            onClick={(event) => {
              event.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <UploadCloud className="size-3.5" />
            Browse
          </Button>
        </div>

        {busy ? (
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs k-text-body">
              <Loader2 className="size-3.5 animate-spin" />
              Uploading...
            </div>
            <div className="flex items-center gap-2">
              <Progress value={shownProgress} className="h-1.5 w-full" />
              <span className="text-xs k-text-subtle tabular-nums">{shownProgress}%</span>
            </div>
          </div>
        ) : null}

        {!busy && hasFile ? (
          <div className="mt-3 rounded-lg border border-[var(--k-color-border-soft)] bg-[var(--k-color-surface)] px-2.5 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex items-center gap-2 text-xs">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--k-color-border-soft)] bg-[var(--k-color-surface-muted)] k-text-body">
                  {fileIcon}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold k-text-strong">{selectedName}</p>
                  {selectedSize ? <p className="k-text-subtle">{selectedSize}</p> : null}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--k-color-border-soft)] bg-[var(--k-color-surface-muted)] px-2 py-0.5 text-[10px] font-semibold k-text-body">
                  <CheckCircle2 className="size-3" />
                  {selectionOnly ? "Selected" : "Uploaded"}
                </span>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  onClick={(event) => {
                    event.stopPropagation();
                    void clearFile();
                  }}
                  aria-label="Remove selected file"
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {localError ? <p className="text-xs text-destructive">{localError}</p> : null}
    </div>
  );
}
