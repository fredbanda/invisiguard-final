"use client";

const DownloadPDF = ({ fingerprintId }: { fingerprintId: string }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/download-pdf?id=${fingerprintId}`);
      if (!response.ok) throw new Error("Failed to download PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fingerprint_${fingerprintId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return <button type="button" onClick={handleDownload}>Download PDF</button>;
};

export default DownloadPDF;
