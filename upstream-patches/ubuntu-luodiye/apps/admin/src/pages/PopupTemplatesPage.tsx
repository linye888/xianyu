import { useEffect, useMemo, useState } from "react";
import { getApiBase, getToken, api } from "../lib/api";

interface PopupTemplateOption {
  id: string;
  name: string;
  description: string;
  locale: string;
  brand: string;
  category: string;
  previewHint: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  payment: "支付",
  verification: "验证",
  other: "其他",
};

export default function PopupTemplatesPage() {
  const [templates, setTemplates] = useState<PopupTemplateOption[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api<PopupTemplateOption[]>("/api/admin/popup-templates")
      .then((items) => {
        setTemplates(items);
        if (items[0]) setSelectedId(items[0].id);
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, []);

  const selected = useMemo(
    () => templates.find((item) => item.id === selectedId) ?? null,
    [templates, selectedId],
  );

  const previewSrc = useMemo(() => {
    if (!selectedId) return "";
    const token = getToken();
    const qs = token ? `?token=${encodeURIComponent(token)}` : "";
    return `${getApiBase()}/api/admin/popup-templates/${selectedId}/preview${qs}`;
  }, [selectedId]);

  async function copyPreviewLink() {
    if (!previewSrc) return;
    try {
      await navigator.clipboard.writeText(previewSrc);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("复制失败，请手动复制预览地址");
    }
  }

  if (loading) return <div className="panel">加载中...</div>;

  return (
    <div className="popup-templates-page">
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="popup-templates-header">
          <div>
            <h2 style={{ margin: 0 }}>弹窗模板管理</h2>
            <p className="muted" style={{ margin: "8px 0 0" }}>
              管理支付 / 验证类弹窗页面模板。可在右侧手机框中实时预览。
            </p>
          </div>
        </div>
        {error ? <div className="error" style={{ marginTop: 12 }}>{error}</div> : null}
      </div>

      <div className="popup-templates-layout">
        <div className="panel popup-templates-list">
          <h3 style={{ marginTop: 0 }}>模板列表</h3>
          {templates.length === 0 ? (
            <p className="muted">暂无弹窗模板</p>
          ) : (
            <div className="popup-template-cards">
              {templates.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`popup-template-card${item.id === selectedId ? " active" : ""}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <div className="popup-template-card-top">
                    <strong>{item.name}</strong>
                    <span className="badge active">{CATEGORY_LABEL[item.category] ?? item.category}</span>
                  </div>
                  <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>{item.description}</div>
                  <div className="popup-template-meta">
                    <span>{item.brand}</span>
                    <span>{item.locale}</span>
                  </div>
                  <div className="popup-template-hint">{item.previewHint}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="panel popup-templates-preview">
          <div className="popup-preview-toolbar">
            <div>
              <strong>{selected?.name ?? "预览"}</strong>
              {selected ? (
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                  ID: <code>{selected.id}</code>
                </div>
              ) : null}
            </div>
            <div className="actions">
              <button type="button" className="btn btn-secondary" onClick={copyPreviewLink} disabled={!previewSrc}>
                {copied ? "已复制" : "复制预览链接"}
              </button>
              {previewSrc ? (
                <a className="btn btn-primary" href={previewSrc} target="_blank" rel="noreferrer">
                  新窗口打开
                </a>
              ) : null}
            </div>
          </div>

          <div className="phone-frame">
            <div className="phone-frame-notch" />
            {previewSrc ? (
              <iframe title="弹窗模板预览" src={previewSrc} className="phone-frame-screen" />
            ) : (
              <div className="phone-frame-empty muted">请选择左侧模板</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
