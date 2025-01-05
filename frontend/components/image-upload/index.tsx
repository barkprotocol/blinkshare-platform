"use client";

import axios, { AxiosProgressEvent, CancelTokenSource } from "axios";
import { AudioWaveform, File, FileImage, FolderArchive, UploadCloud, Video, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileUploadProgress {
  progress: number;
  file: File;
  source: CancelTokenSource | null;
}

enum FileTypes {
  Image = "image",
  Pdf = "pdf",
  Audio = "audio",
  Video = "video",
  Other = "other",
}

const FileColors = {
  Image: { bgColor: "bg-[#dbcfc7]", fillColor: "fill-[#dbcfc7]" },
  Pdf: { bgColor: "bg-[#dbcfc7]", fillColor: "fill-[#dbcfc7]" },
  Audio: { bgColor: "bg-[#dbcfc7]", fillColor: "fill-[#dbcfc7]" },
  Video: { bgColor: "bg-[#dbcfc7]", fillColor: "fill-[#dbcfc7]" },
  Other: { bgColor: "bg-[#dbcfc7]", fillColor: "fill-[#dbcfc7]" },
};

export default function ImageUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>([]);

  const getFileIconAndColor = (file: File) => {
    if (file.type.includes(FileTypes.Image)) {
      return { icon: <FileImage size={40} className={FileColors.Image.fillColor} />, color: FileColors.Image.bgColor };
    }

    if (file.type.includes(FileTypes.Pdf)) {
      return { icon: <File size={40} className={FileColors.Pdf.fillColor} />, color: FileColors.Pdf.bgColor };
    }

    if (file.type.includes(FileTypes.Audio)) {
      return { icon: <AudioWaveform size={40} className={FileColors.Audio.fillColor} />, color: FileColors.Audio.bgColor };
    }

    if (file.type.includes(FileTypes.Video)) {
      return { icon: <Video size={40} className={FileColors.Video.fillColor} />, color: FileColors.Video.bgColor };
    }

    return { icon: <FolderArchive size={40} className={FileColors.Other.fillColor} />, color: FileColors.Other.bgColor };
  };

  const onUploadProgress = (progressEvent: AxiosProgressEvent, file: File, cancelSource: CancelTokenSource) => {
    const progress = Math.round((progressEvent.loaded / (progressEvent.total ?? 0)) * 100);

    if (progress === 100) {
      setUploadedFiles((prev) => [...prev, file]);
      setFilesToUpload((prev) => prev.filter((item) => item.file !== file));
    }

    setFilesToUpload((prev) =>
      prev.map((item) =>
        item.file.name === file.name ? { ...item, progress, source: cancelSource } : item
      )
    );
  };

  const uploadFileToCloudinary = async (file: File, cancelSource: CancelTokenSource) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET as string);

    try {
      await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => onUploadProgress(progressEvent, file, cancelSource),
          cancelToken: cancelSource.token,
        }
      );
    } catch (error) {
      console.error("Upload failed: ", error);
    }
  };

  const removeFile = (file: File) => {
    setFilesToUpload((prev) => prev.filter((item) => item.file !== file));
    setUploadedFiles((prev) => prev.filter((item) => item !== file));
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFilesToUpload((prev) => [
        ...prev,
        ...acceptedFiles.map((file) => {
          const cancelSource = axios.CancelToken.source();
          uploadFileToCloudinary(file, cancelSource);
  
          return { progress: 0, file, source: cancelSource };
        }),
      ]);
    },
    [uploadFileToCloudinary]
  );  

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <div>
        <label
          {...getRootProps()}
          className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200"
        >
          <div className="text-center">
            <div className="border p-2 rounded-md max-w-min mx-auto">
              <UploadCloud size={20} />
            </div>

            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Drag files</span>
            </p>
            <p className="text-xs text-gray-500">
              Click to upload files (files should be under 10 MB)
            </p>
          </div>
        </label>

        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept="image/png, image/jpeg, application/pdf, audio/*, video/*"
          type="file"
          className="hidden"
        />
      </div>

      {filesToUpload.length > 0 && (
        <div>
          <ScrollArea className="h-40">
            <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">Files to upload</p>
            <div className="space-y-2 pr-3">
              {filesToUpload.map((fileUploadProgress) => (
                <div
                  key={fileUploadProgress.file.lastModified}
                  className="flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:pr-0 pr-2"
                >
                  <div className="flex items-center flex-1 p-2">
                    <div className="text-white">{getFileIconAndColor(fileUploadProgress.file).icon}</div>
                    <div className="w-full ml-2 space-y-1">
                      <div className="text-sm flex justify-between">
                        <p className="text-muted-foreground">{fileUploadProgress.file.name.slice(0, 25)}</p>
                        <span className="text-xs">{fileUploadProgress.progress}%</span>
                      </div>
                      <Progress
                       value={fileUploadProgress.progress}
                       className={getFileIconAndColor(fileUploadProgress.file).color}
                      />
                    /&gt;
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      fileUploadProgress.source?.cancel("Upload cancelled");
                      removeFile(fileUploadProgress.file);
                    }}
                    className="bg-red-500 text-white transition-all items-center justify-center cursor-pointer px-2 hidden group-hover:flex"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div>
          <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">Uploaded Files</p>
          <div className="space-y-2 pr-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.lastModified}
                className="flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:pr-0 pr-2 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center flex-1 p-2">
                  <div className="text-white">{getFileIconAndColor(file).icon}</div>
                  <div className="w-full ml-2">
                    <p className="text-muted-foreground text-sm">{file.name.slice(0, 25)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
