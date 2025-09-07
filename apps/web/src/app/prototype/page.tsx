export const metadata = {
  title: "Coshub 原型演示",
};

export default function PrototypePage() {
  return (
    <div style={{ height: "100vh", width: "100%", background: "#fef2f2" }}>
      <iframe
        src="/prototype.html"
        style={{ border: "none", width: "100%", height: "100%" }}
        title="Coshub Prototype"
      />
    </div>
  );
}
