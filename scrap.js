document.getElementById("download").addEventListener("click", () => {
    const text = sorted
      .map(([name, data]) => `${data.count} ${name}`)
      .join("\n");
  
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "card-counts.txt";
    a.click();
  
    URL.revokeObjectURL(url);
});