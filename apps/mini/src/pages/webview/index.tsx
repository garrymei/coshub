import { useEffect, useState } from "react";
import { WebView } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";

export default function WebviewPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");

  useEffect(() => {
    const u = router.params?.url;
    if (u) {
      try {
        setUrl(decodeURIComponent(u));
      } catch {
        setUrl(String(u));
      }
    }
  }, []);

  if (!url) return null;
  return <WebView src={url} />;
}
