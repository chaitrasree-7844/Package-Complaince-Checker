import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ScanUploadPanel from "@/components/upload/ScanUploadPanel";
import { createPackage } from "@/services/mockPackageApi";
import { writeStorage } from "@/services/mockStorage";

const supportedExtensions = ["jpg", "jpeg", "png", "pdf"];

export default function UploadPackage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [dragging, setDragging] = useState(false);
  const [productName, setProductName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFile = (nextFile: File | undefined) => {
    if (!nextFile) return;
    const extension = nextFile.name.split(".").pop()?.toLowerCase() ?? "";
    if (!supportedExtensions.includes(extension)) { toast.error("Unsupported file", { description: "Please upload JPG, JPEG, PNG or PDF." }); return; }
    setFile(nextFile);
    if (nextFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(typeof reader.result === "string" ? reader.result : "");
      reader.readAsDataURL(nextFile);
    } else setPreview("");
    toast.success("File uploaded", { description: "Add optional product details before analysis." });
  };

  const removeFile = () => { setFile(null); setPreview(""); if (inputRef.current) inputRef.current.value = ""; toast.success("File removed"); };

  const submit = async () => {
    if (!file) { toast.error("Choose a package first", { description: "Add a JPG, JPEG, PNG or PDF to continue." }); return; }
    setUploading(true);
    try {
      const packageRecord = await createPackage({ productName, manufacturer, category, imageUrl: preview, fileName: file.name, fileType: file.type || "application/octet-stream", fileSize: file.size });
      writeStorage("pending-package-id", packageRecord.id);
      toast.success("Package ready", { description: "Starting the analysis workflow." });
      navigate("/analysis");
    } catch { toast.error("Unable to upload the file", { description: "Please try again." }); } finally { setUploading(false); }
  };

  return <ScanUploadPanel inputRef={inputRef} file={file} preview={preview} dragging={dragging} uploading={uploading} productName={productName} manufacturer={manufacturer} category={category} onFile={handleFile} onDraggingChange={setDragging} onRemove={removeFile} onProductNameChange={setProductName} onManufacturerChange={setManufacturer} onCategoryChange={setCategory} onAnalyze={submit} onCancel={() => navigate("/dashboard")} />;
}